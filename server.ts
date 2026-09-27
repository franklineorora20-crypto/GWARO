import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_ENVIRONMENT =
  process.env.MPESA_ENVIRONMENT ||
  (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox');
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_ACCOUNT_REFERENCE = process.env.MPESA_ACCOUNT_REFERENCE || 'GoldtribeLaundry';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF;

const assertMpesaCredentials = () => {
  if (!process.env.MPESA_CONSUMER_KEY) throw Error("Missing key");
  if (!process.env.MPESA_CONSUMER_SECRET) throw Error("Missing MPESA_CONSUMER_SECRET");
  if (!process.env.MPESA_SHORTCODE) throw Error("Missing MPESA_SHORTCODE");
  if (!process.env.MPESA_PASSKEY) throw Error("Missing MPESA_PASSKEY");
};

const isValidCallbackUrl = (url: string | undefined) => {
  if (!url) return false;
  return /^https:\/\//i.test(url) && !url.includes('<your-project-id>');
};

const getMpesaDefaultCallbackUrl = () => 'https://goldtribe.co.ke/api/callback/stk';

const getMpesaCallbackUrl = () => {
  if (isValidCallbackUrl(MPESA_CALLBACK_URL)) {
    return MPESA_CALLBACK_URL!;
  }

  if (SUPABASE_PROJECT_REF) {
    return `https://${SUPABASE_PROJECT_REF}.functions.supabase.co/mpesa-callback`;
  }

  return getMpesaDefaultCallbackUrl();
};

const MPESA_CALLBACK_URL_RESOLVED = getMpesaCallbackUrl();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_FROM;
const WHATSAPP_FROM = process.env.WHATSAPP_FROM;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL in server environment.');
}

const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json({ limit: '100kb' }));

app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Rate limiter: max 5 requests per 10 minutes on booking & payment routes
const bookingRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      'Too many booking or payment attempts from this IP. Please wait 10 minutes. / Maombi mengi sana, tafadhali subiri dakika 10.',
  },
});

// Official Safaricom Daraja IP allowlist
const SAFARICOM_ALLOWED_IPS = new Set([
  '196.201.214.200',
  '196.201.214.206',
  '196.201.213.114',
  '196.201.214.207',
  '196.201.214.208',
  '196.201.213.44',
  '196.201.212.127',
  '196.201.212.138',
  '196.201.212.129',
  '196.201.212.136',
  '196.201.212.74',
  '196.201.212.69',
  ...(process.env.MPESA_ALLOWED_IPS
    ? process.env.MPESA_ALLOWED_IPS.split(',').map((ip) => ip.trim()).filter(Boolean)
    : []),
]);

const getClientIp = (req: express.Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded)
    ? forwarded[0]
    : typeof forwarded === 'string'
    ? forwarded.split(',')[0]
    : req.socket.remoteAddress || '';
  return raw.trim().replace(/^::ffff:/, '');
};

const getDarajaBaseUrl = () => {
  return MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
};

const getTimestamp = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());
  return `${year}${month}${day}${hour}${minute}${second}`;
};

const normalizeMpesaPhone = (phone: string) => {
  let digits = String(phone).trim().replace(/[^0-9]/g, '');
  if (digits.startsWith('247') && digits.length === 11) {
    digits = `2547${digits.slice(3)}`;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }
  if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) {
    return `254${digits}`;
  }
  if (digits.startsWith('254') && digits.length === 12) {
    return digits;
  }
  if (digits.startsWith('255') && digits.length === 12) {
    return digits;
  }
  return digits;
};

const getAccessToken = async () => {
  assertMpesaCredentials();
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const url = `${getDarajaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Daraja auth failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.access_token as string;
};

const normalizeOrderItems = (items: unknown) => {
  if (Array.isArray(items)) return items;
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [items];
    }
  }
  if (items == null) return [];
  return [items];
};

const insertOrderRecord = async (orderData: Record<string, unknown>) => {
  const trackingId = `GL-${Math.floor(100000 + Math.random() * 900000)}`;
  const items = normalizeOrderItems(orderData.items);

  const initialPaymentStatus = String(orderData.paymentStatus || 'Pay on Delivery');
  const verifiedReceiptCode =
    (orderData.mpesa_receipt_number as string) ||
    (orderData.mpesaRef as string) ||
    (orderData.mpesaReceiptNumber as string) ||
    null;

  const payload = {
    tracking_id: trackingId,
    status: 'Order Received',
    paymentStatus: initialPaymentStatus,
    created_at: new Date().toISOString(),
    customerName: orderData.customerName || null,
    phone: orderData.phone || null,
    email: orderData.email || null,
    branch: orderData.branch || null,
    address: orderData.address || null,
    items,
    totalPrice: Number(orderData.totalPrice || 0),
    pickupDate: orderData.pickupDate || null,
    timeSlot: orderData.timeSlot || null,
    specialNotes: orderData.specialNotes || null,
    deliveryType: orderData.deliveryType || null,
    mpesa_receipt_number: verifiedReceiptCode,
    mpesaRef: verifiedReceiptCode,
    mpesa_phone: (orderData.mpesa_phone as string) || (orderData.phone as string) || null,
    checkout_request_id: (orderData.checkout_request_id as string) || (orderData.checkoutRequestId as string) || null,
    merchant_request_id: (orderData.merchant_request_id as string) || (orderData.merchantRequestId as string) || null,
    transaction_date: (orderData.transaction_date as string) || new Date().toISOString(),
  };

  if (SUPABASE_URL && !SUPABASE_URL.includes('placeholder')) {
    const result = await supabase.from('Orders').insert([payload]).select().single();
    if (!result.error && result.data) {
      return result.data;
    }
    console.warn('Supabase order insert warning:', result.error);
  }

  return payload;
};

const notifyPaymentStatusUpdate = async (order: Record<string, unknown>) => {
  const phone = order.phone as string | undefined;
  const email = order.email as string | undefined;
  const id = order.tracking_id as string | undefined;
  const status = order.paymentStatus as string | undefined;
  const receipt = order.mpesa_receipt_number as string | undefined;
  const updatedMessage = `Goldtribe order ${id} payment status updated to ${status}. Receipt: ${receipt || 'N/A'}.`;
  const updatedEmailContent = `Hello ${order.customerName},\n\nYour Goldtribe order ${id} payment status has been updated to ${status}.\nReceipt: ${receipt || 'Pending'}.\n\nThank you for choosing Goldtribe.`;

  if (phone) {
    await sendSms(phone, updatedMessage);
    await sendWhatsapp(phone, updatedMessage);
  }
  if (email) {
    await sendEmail(email, 'Goldtribe Payment Update', updatedEmailContent);
  }
};

const sendSms = async (phone: string, message: string) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
    return;
  }

  const body = new URLSearchParams({
    To: phone,
    From: TWILIO_FROM,
    Body: message,
  });

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Twilio SMS failed', errorText);
  }
};

const sendWhatsapp = async (phone: string, message: string) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !WHATSAPP_FROM) {
    return;
  }

  const body = new URLSearchParams({
    To: `whatsapp:${phone}`,
    From: WHATSAPP_FROM,
    Body: message,
  });

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Twilio WhatsApp failed', errorText);
  }
};

const sendEmail = async (email: string, subject: string, content: string) => {
  if (!SENDGRID_API_KEY || !EMAIL_FROM) {
    return;
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: EMAIL_FROM },
      subject,
      content: [{ type: 'text/plain', value: content }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('SendGrid email failed', errorText);
  }
};

const notifyOrderCreated = async (order: Record<string, unknown>) => {
  const phone = order.phone as string | undefined;
  const email = order.email as string | undefined;
  const id = order.tracking_id as string | undefined;
  const totalPrice = order.totalPrice as number | string | undefined;
  const status = order.paymentStatus as string | undefined;

  const message = `Goldtribe order ${id} confirmed. Amount: Ksh ${totalPrice}. Status: ${status}.`;
  const emailContent = `Hello ${order.customerName},\n\nYour Goldtribe order ${id} has been created successfully.\nAmount: Ksh ${totalPrice}.\nStatus: ${status}.\n\nThank you for choosing Goldtribe.`;

  if (phone) {
    await sendSms(phone, message);
    await sendWhatsapp(phone, message);
  }
  if (email) {
    await sendEmail(email, 'Goldtribe Order Confirmation', emailContent);
  }
};

const parseCallbackMetadata = (items: any[] = []) => {
  const result: {
    Amount?: number;
    MpesaReceiptNumber?: string;
    TransactionDate?: string;
    PhoneNumber?: string;
  } = {};

  for (const item of items) {
    if (item.Name === 'Amount') result.Amount = Number(item.Value);
    if (item.Name === 'MpesaReceiptNumber') result.MpesaReceiptNumber = String(item.Value);
    if (item.Name === 'TransactionDate') result.TransactionDate = String(item.Value);
    if (item.Name === 'PhoneNumber') result.PhoneNumber = String(item.Value);
  }

  return result;
};

const formatDarajaTimestamp = (timestamp?: string) => {
  if (!timestamp) return undefined;
  const padded = String(timestamp).padStart(14, '0');
  const year = padded.slice(0, 4);
  const month = padded.slice(4, 6);
  const day = padded.slice(6, 8);
  const hour = padded.slice(8, 10);
  const minute = padded.slice(10, 12);
  const second = padded.slice(12, 14);
  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
};

// POST /api/stkpush — Strictly requires live Daraja response; returns 502 on error and DOES NOT insert order
app.post('/api/stkpush', bookingRateLimiter, async (req, res) => {
  try {
    assertMpesaCredentials();

    const {
      customerName,
      phone,
      branch,
      address,
      items,
      totalPrice,
      pickupDate,
      timeSlot,
      specialNotes,
      deliveryType,
    } = req.body;

    if (!phone || !totalPrice || !customerName) {
      return res.status(400).json({
        error: 'Missing required payment or customer details. / Tafadhali jaza taarifa zote zinazohitajika.',
        paymentStatus: 'Failed',
      });
    }

    const normalizedPhone = normalizeMpesaPhone(phone);
    if (!/^254[0-9]{9}$/.test(normalizedPhone)) {
      return res.status(400).json({
        error: 'Invalid M-Pesa phone number. Use 07XXXXXXXX or 2547XXXXXXXX format.',
        paymentStatus: 'Failed',
      });
    }

    const activeCallbackUrl = MPESA_CALLBACK_URL_RESOLVED;

    let accessToken: string;
    let data: any = {};

    try {
      accessToken = await getAccessToken();
      const timestamp = getTimestamp();
      const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

      const body = {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(Number(totalPrice)),
        PartyA: normalizedPhone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: normalizedPhone,
        CallBackURL: activeCallbackUrl,
        AccountReference: MPESA_ACCOUNT_REFERENCE,
        TransactionDesc: 'Goldtribe Laundry Order Payment',
      };

      const response = await fetch(`${getDarajaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }

      if (
        !response.ok ||
        (data.ResponseCode !== '0' && data.ResponseCode !== 0) ||
        !data.CheckoutRequestID
      ) {
        return res.status(502).json({
          error:
            data.CustomerMessage ||
            data.errorMessage ||
            'M-Pesa Daraja gateway rejected the STK push request. / Ombi la M-Pesa halikufanikiwa, tafadhali jaribu tena.',
          paymentStatus: 'Failed',
        });
      }
    } catch (darajaErr: any) {
      console.error('Daraja STK Push error:', darajaErr);
      return res.status(502).json({
        error:
          'Unable to reach Safaricom M-Pesa gateway. Please try again shortly. / Mtandao wa M-Pesa haujakamilika, jaribu tena.',
        paymentStatus: 'Failed',
      });
    }

    const checkoutRequestId = data.CheckoutRequestID;
    const merchantRequestId = data.MerchantRequestID || `MERCHANT_${Date.now()}`;
    const responseDesc = data.ResponseDescription || 'Success. Prompt sent to phone.';

    const orderData = {
      customerName,
      phone: normalizedPhone,
      mpesa_phone: normalizedPhone,
      branch,
      address,
      items,
      totalPrice,
      paymentStatus: 'Pending M-Pesa',
      checkout_request_id: checkoutRequestId,
      merchant_request_id: merchantRequestId,
      pickupDate,
      timeSlot,
      specialNotes,
      deliveryType,
    };

    const createdOrder = await insertOrderRecord(orderData);
    await notifyOrderCreated(createdOrder);

    return res.status(200).json({
      order: createdOrder,
      checkoutRequestId,
      merchantRequestId,
      responseDescription: responseDesc,
      simulated: false,
    });
  } catch (error: any) {
    console.error('STK Push error:', error);
    return res.status(502).json({
      error: 'Payment gateway unavailable. Order was not created. / Malipo hayakufanikiwa.',
      paymentStatus: 'Failed',
    });
  }
});

// POST /api/verify-manual — Verifies manual M-Pesa transaction code via Daraja Transaction Status API & DB
app.post('/api/verify-manual', bookingRateLimiter, async (req, res) => {
  try {
    const { mpesaCode, amount, phone } = req.body;
    const cleanCode = String(mpesaCode || '').trim().toUpperCase();

    if (!/^[A-Z0-9]{10}$/.test(cleanCode)) {
      return res.status(400).json({
        verified: false,
        paymentStatus: 'Failed',
        error: 'Invalid M-Pesa code format. Must be a 10-character alphanumeric receipt code.',
      });
    }

    // 1. Check if this receipt code was already confirmed by Safaricom callback in DB
    if (SUPABASE_URL && !SUPABASE_URL.includes('placeholder')) {
      const { data: existingOrder } = await supabase
        .from('Orders')
        .select('*')
        .eq('mpesa_receipt_number', cleanCode)
        .maybeSingle();

      if (
        existingOrder &&
        (existingOrder.paymentStatus === 'Paid' || existingOrder.paymentStatus === 'Paid via M-Pesa')
      ) {
        if (amount && existingOrder.mpesa_amount && Number(existingOrder.mpesa_amount) < Number(amount)) {
          return res.status(400).json({
            verified: false,
            paymentStatus: 'Failed',
            error: 'Verified M-Pesa amount is less than the order total.',
          });
        }
        return res.status(200).json({
          verified: true,
          paymentStatus: 'Paid via M-Pesa',
          mpesaCode: cleanCode,
        });
      }
    }

    // 2. Verify with Safaricom Daraja Transaction Status API
    assertMpesaCredentials();
    const accessToken = await getAccessToken();

    const statusPayload = {
      Initiator: process.env.MPESA_INITIATOR_NAME || 'apiop',
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL || '',
      CommandID: 'TransactionStatusQuery',
      TransactionID: cleanCode,
      PartyA: MPESA_SHORTCODE,
      IdentifierType: '4',
      ResultURL: MPESA_CALLBACK_URL_RESOLVED,
      QueueTimeOutURL: MPESA_CALLBACK_URL_RESOLVED,
      Remarks: 'Manual M-Pesa Code Verification',
      Occasion: 'GoldtribeOrderVerification',
    };

    const darajaRes = await fetch(`${getDarajaBaseUrl()}/mpesa/transactionstatus/v1/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusPayload),
    });

    const darajaData: any = await darajaRes.json().catch(() => ({}));

    if (
      darajaRes.ok &&
      (darajaData.ResponseCode === '0' || darajaData.ResponseCode === 0) &&
      darajaData.ConversationID
    ) {
      return res.status(200).json({
        verified: true,
        paymentStatus: 'Paid via M-Pesa',
        mpesaCode: cleanCode,
        conversationId: darajaData.ConversationID,
        phone: phone || null,
      });
    }

    return res.status(502).json({
      verified: false,
      paymentStatus: 'Failed',
      error:
        'Could not verify M-Pesa receipt code with Safaricom Daraja. Please confirm the code from your SMS or choose Pay on Delivery.',
    });
  } catch (err: any) {
    console.error('Manual M-Pesa verification failed:', err);
    return res.status(502).json({
      verified: false,
      paymentStatus: 'Failed',
      error:
        'Live M-Pesa verification service could not confirm this code. Please verify your SMS receipt or select Pay on Delivery.',
    });
  }
});

app.post('/api/orders', bookingRateLimiter, async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      branch,
      address,
      items,
      totalPrice,
      pickupDate,
      timeSlot,
      specialNotes,
      deliveryType,
      paymentMethod,
    } = req.body;

    if (!customerName || !phone || !totalPrice) {
      return res.status(400).json({ error: 'Missing required order details.' });
    }

    const paymentStatus = paymentMethod === 'mpesa' ? 'Pending M-Pesa' : 'Pay on Delivery';

    const orderData = {
      customerName,
      phone,
      email,
      branch,
      address,
      items,
      totalPrice,
      paymentStatus,
      pickupDate,
      timeSlot,
      specialNotes,
      deliveryType,
    };

    const result = await insertOrderRecord(orderData);

    res.status(201).json({ order: result });

    try {
      await notifyOrderCreated(result);
    } catch (notificationError) {
      console.error('Order created but notification failed:', notificationError);
    }

    return;
  } catch (error: any) {
    console.error('Order creation error:', error);
    return res.status(500).json({ error: 'Unable to create order at this time. Please try again.' });
  }
});

// Dedicated Handler for M-Pesa STK Push Callback (IP allowlist + Pending CheckoutRequestID verification)
const handleStkCallback = async (req: express.Request, res: express.Response) => {
  try {
    const clientIp = getClientIp(req);
    if (!SAFARICOM_ALLOWED_IPS.has(clientIp)) {
      console.warn(`Rejected unauthorized M-Pesa callback from untrusted IP: ${clientIp}`);
      return res.status(403).json({ ResultCode: 1, ResultDesc: 'Forbidden: Untrusted callback source IP.' });
    }

    const payload = req.body;
    const callback = payload?.Body?.stkCallback || payload?.stkCallback || payload;
    if (!callback || !callback.CheckoutRequestID) {
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid M-Pesa callback structure.' });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callback;

    const isSuccess = Number(ResultCode) === 0;

    // Verify CheckoutRequestID exists in pending orders in DB
    let existingOrder: Record<string, any> | null = null;
    if (SUPABASE_URL && !SUPABASE_URL.includes('placeholder')) {
      const { data: foundOrder, error: lookupError } = await supabase
        .from('Orders')
        .select('*')
        .eq('checkout_request_id', CheckoutRequestID)
        .maybeSingle();

      if (lookupError) {
        console.error('Database lookup error during callback verification:', lookupError.message);
      } else {
        existingOrder = foundOrder;
      }
    }

    const isPendingOrder =
      existingOrder &&
      String(existingOrder.paymentStatus || '')
        .toLowerCase()
        .includes('pending');

    if (isSuccess && !isPendingOrder) {
      console.warn(
        `Rejected callback with ResultCode 0: CheckoutRequestID ${CheckoutRequestID} not found in pending orders.`
      );
      return res.status(404).json({
        ResultCode: 1,
        ResultDesc: 'Rejected: CheckoutRequestID not found in pending orders.',
      });
    }

    const parsed = parseCallbackMetadata(CallbackMetadata?.Item || []);
    const resultDescStr = String(ResultDesc || '').toLowerCase();

    let paymentStatus: string = 'Pending M-Pesa';
    if (isSuccess) {
      paymentStatus = 'Paid via M-Pesa';
    } else if (resultDescStr.includes('cancel') || resultDescStr.includes('cancelled') || Number(ResultCode) === 1032) {
      paymentStatus = 'Cancelled M-Pesa';
    } else {
      paymentStatus = 'Failed M-Pesa';
    }

    const transactionDate = formatDarajaTimestamp(parsed.TransactionDate);

    const transactionRecord = {
      paymentStatus,
      merchant_request_id: MerchantRequestID,
      checkout_request_id: CheckoutRequestID,
      mpesa_receipt_number: parsed.MpesaReceiptNumber || null,
      transaction_date: transactionDate || new Date().toISOString(),
      mpesa_phone: parsed.PhoneNumber || null,
      mpesa_amount: parsed.Amount || null,
      payment_status_reason: ResultDesc || (isSuccess ? 'Transaction Completed Successfully' : 'Transaction Failed'),
      verified_at: new Date().toISOString(),
    };

    let updatedOrder: Record<string, unknown> | null = null;

    if (SUPABASE_URL && !SUPABASE_URL.includes('placeholder') && existingOrder) {
      const { data, error } = await supabase
        .from('Orders')
        .update(transactionRecord)
        .eq('checkout_request_id', CheckoutRequestID)
        .select()
        .maybeSingle();

      if (!error && data) {
        updatedOrder = data;
      }
    }

    if (updatedOrder && isSuccess) {
      try {
        await notifyPaymentStatusUpdate(updatedOrder);
      } catch (notifyErr) {
        console.error('Failed to dispatch payment completion notification:', notifyErr);
      }
    }

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Callback accepted and processed successfully',
    });
  } catch (error: any) {
    console.error('Critical error in M-Pesa STK callback handler:', error);
    return res.status(500).json({ ResultCode: 1, ResultDesc: 'Internal server error processing callback.' });
  }
};

app.post('/api/callback/stk', handleStkCallback);
app.post('/api/mpesa/callback', handleStkCallback);
app.post('/api/stkpush/callback', handleStkCallback);

app.get('/api/mpesa/query/:checkoutRequestId', async (req, res) => {
  const { checkoutRequestId } = req.params;
  if (!checkoutRequestId) {
    return res.status(400).json({ error: 'CheckoutRequestID parameter is required.' });
  }

  try {
    if (SUPABASE_URL && !SUPABASE_URL.includes('placeholder')) {
      const { data } = await supabase
        .from('Orders')
        .select('*')
        .eq('checkout_request_id', checkoutRequestId)
        .maybeSingle();

      if (data && data.paymentStatus && data.paymentStatus !== 'Pending M-Pesa') {
        return res.json({
          verified: data.paymentStatus === 'Paid via M-Pesa' || data.paymentStatus === 'Paid',
          paymentStatus: data.paymentStatus,
          mpesaReceiptNumber: data.mpesa_receipt_number,
          order: data,
        });
      }
    }

    if (MPESA_CONSUMER_KEY && MPESA_CONSUMER_SECRET && MPESA_PASSKEY) {
      try {
        const accessToken = await getAccessToken();
        const timestamp = getTimestamp();
        const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

        const queryBody = {
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        };

        const response = await fetch(`${getDarajaBaseUrl()}/mpesa/stkpushquery/v1/query`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryBody),
        });

        const data: any = await response.json();
        return res.json({
          verified: data.ResultCode === '0' || data.ResultCode === 0,
          resultDesc: data.ResultDesc,
        });
      } catch (darajaErr: any) {
        console.warn('Daraja STK push query error:', darajaErr);
      }
    }

    return res.json({
      verified: false,
      paymentStatus: 'Pending M-Pesa',
      checkoutRequestId,
    });
  } catch (err: any) {
    console.error('Error in STK push query endpoint:', err);
    return res.status(500).json({ error: 'Failed to query M-Pesa status.' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
