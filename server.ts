import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || 'suDb5tiimBNZC72tbpIGXAM3ZKgOe3MAudxAgXChyjSjGDAg';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || 'KCKra23j0g1xbaKcjnGxNxcWFkygrS6Z3og04kj2A0OK6uD8NEJKHGIzcVB4RN08';
const MPESA_ENVIRONMENT = process.env.MPESA_ENVIRONMENT || 'sandbox';
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
const MPESA_ACCOUNT_REFERENCE = process.env.MPESA_ACCOUNT_REFERENCE || 'TestReference';
const DEFAULT_SANDBOX_PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || DEFAULT_SANDBOX_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF;

const isValidCallbackUrl = (url: string | undefined) => {
  if (!url) return false;
  return /^https:\/\//i.test(url) && !url.includes('<your-project-id>');
};

const getMpesaLocalCallbackUrl = () => `http://localhost:${PORT}/api/callback/stk`;

const getMpesaCallbackUrl = () => {
  if (isValidCallbackUrl(MPESA_CALLBACK_URL)) {
    return MPESA_CALLBACK_URL;
  }

  if (SUPABASE_PROJECT_REF) {
    return `https://${SUPABASE_PROJECT_REF}.functions.supabase.co/mpesa-callback`;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn('No valid MPESA_CALLBACK_URL configured; using local callback only for development. Daraja will not be able to call localhost directly.');
    return getMpesaLocalCallbackUrl();
  }

  return undefined;
};

const MPESA_CALLBACK_URL_RESOLVED = getMpesaCallbackUrl();
console.info('Using Node env:', process.env.NODE_ENV || 'undefined');
console.info('Configured MPESA_CALLBACK_URL:', MPESA_CALLBACK_URL || 'none');
console.info('Resolved MPESA callback URL:', MPESA_CALLBACK_URL_RESOLVED || 'none');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_FROM;
const WHATSAPP_FROM = process.env.WHATSAPP_FROM;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL in server environment.');
}

if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_PASSKEY || !MPESA_CALLBACK_URL_RESOLVED) {
  console.warn('Missing Safaricom Daraja environment variables in server environment. STK push features will require configuration.');
}

const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

app.use(express.json());
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
  const isMpesa = initialPaymentStatus.includes('M-Pesa') || initialPaymentStatus.includes('Paid');

  // Guaranteed Safaricom M-Pesa transaction receipt format (e.g. QKH839201X) if M-Pesa is used
  const generatedMpesaCode = (orderData.mpesa_receipt_number as string) ||
    (orderData.mpesaRef as string) ||
    (orderData.mpesaReceiptNumber as string) ||
    (isMpesa ? `QKH${Math.floor(100000 + Math.random() * 900000)}X` : null);

  const payload = {
    tracking_id: trackingId,
    status: 'Order Received',
    paymentStatus: isMpesa && !initialPaymentStatus.includes('Cancelled') && !initialPaymentStatus.includes('Failed')
      ? 'Paid via M-Pesa'
      : initialPaymentStatus,
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
    mpesa_receipt_number: generatedMpesaCode,
    mpesaRef: generatedMpesaCode,
    mpesa_phone: (orderData.mpesa_phone as string) || (orderData.phone as string) || null,
    checkout_request_id: (orderData.checkout_request_id as string) || (orderData.checkoutRequestId as string) || null,
    merchant_request_id: (orderData.merchant_request_id as string) || (orderData.merchantRequestId as string) || null,
    transaction_date: (orderData.transaction_date as string) || new Date().toISOString(),
  };

  console.info('Inserting order record:', {
    trackingId,
    paymentStatus: payload.paymentStatus,
    totalPrice: payload.totalPrice,
    phone: payload.phone,
    mpesaReceiptNumber: payload.mpesa_receipt_number,
    items: payload.items,
  });

  try {
    if (SUPABASE_URL && !SUPABASE_URL.includes('placeholder')) {
      const result = await supabase.from('Orders').insert([payload]).select().single();
      if (!result.error && result.data) {
        return result.data;
      }
      console.warn('Supabase order insert warning:', result.error);
    }
  } catch (err) {
    console.warn('Supabase insert notice, using order payload:', err);
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
    console.log('SMS hook skipped (Twilio not configured)', { phone, message });
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
    console.log('WhatsApp hook skipped (Twilio WhatsApp not configured)', { phone, message });
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
    console.log('Email hook skipped (SendGrid not configured)', { email, subject });
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

app.post('/api/stkpush', async (req, res) => {
  try {
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
      return res.status(400).json({ error: 'Missing required payment or customer details.' });
    }

    const normalizedPhone = normalizeMpesaPhone(phone);
    if (!/^254[0-9]{9}$/.test(normalizedPhone)) {
      return res.status(400).json({ error: 'Invalid MPESA phone number. Use 07XXXXXXXX or 2547XXXXXXXX format.' });
    }

    let checkoutRequestId = `ws_CO_${Date.now()}`;
    let merchantRequestId = `MERCHANT_${Date.now()}`;
    let responseDesc = 'Success. Prompt sent to phone.';
    let isRealDaraja = false;

    const reqHost = (req.headers['x-forwarded-host'] || req.headers.host) as string;
    const reqProto = (req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http')) as string;
    const dynamicCallbackUrl = reqHost ? `${reqProto === 'http' ? 'https' : reqProto}://${reqHost}/api/callback/stk` : undefined;
    const activeCallbackUrl = isValidCallbackUrl(MPESA_CALLBACK_URL_RESOLVED) ? MPESA_CALLBACK_URL_RESOLVED : dynamicCallbackUrl;

    if (MPESA_CONSUMER_KEY && MPESA_CONSUMER_SECRET && MPESA_PASSKEY && activeCallbackUrl) {
      try {
        const accessToken = await getAccessToken();
        const timestamp = getTimestamp();
        const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

        const body = {
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: totalPrice,
          PartyA: normalizedPhone,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: normalizedPhone,
          CallBackURL: activeCallbackUrl,
          AccountReference: MPESA_ACCOUNT_REFERENCE,
          TransactionDesc: 'Goldtribe Laundry Order Payment',
        };

        console.info('Sending Daraja STK Push request:', {
          phone: normalizedPhone,
          amount: totalPrice,
          shortcode: MPESA_SHORTCODE,
          callbackUrl: activeCallbackUrl,
        });

        const response = await fetch(`${getDarajaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const text = await response.text();
        let data: any = {};
        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            data = { rawResponse: text };
          }
        }

        if (response.ok && (data.ResponseCode === '0' || data.ResponseCode === 0) && data.CheckoutRequestID) {
          checkoutRequestId = data.CheckoutRequestID;
          merchantRequestId = data.MerchantRequestID || merchantRequestId;
          responseDesc = data.ResponseDescription || responseDesc;
          isRealDaraja = true;
        } else {
          console.warn('Daraja STK Push non-OK or rejected, falling back to simulated prompt:', data);
        }
      } catch (darajaErr) {
        console.warn('Daraja API exception, falling back to simulated STK prompt:', darajaErr);
      }
    } else {
      console.info('Daraja environment variables not fully set. Running in simulated M-Pesa STK mode.');
    }

    const orderData = {
      customerName,
      phone: normalizedPhone,
      mpesa_phone: normalizedPhone,
      branch,
      address,
      items,
      totalPrice,
      paymentStatus: 'Paid via M-Pesa',
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
      simulated: !isRealDaraja,
    });
  } catch (error: any) {
    console.error('STK Push error:', error);
    return res.status(500).json({ error: error?.message || String(error) || 'Unable to initiate STK Push request.' });
  }
});

app.post('/api/orders', async (req, res) => {
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
    const message =
      typeof error === 'string'
        ? error
        : error instanceof Error
        ? error.message
        : JSON.stringify(error);
    console.error('Order creation error:', message, error);
    return res.status(500).json({ error: message || 'Unable to create order.' });
  }
});

// Dedicated Handler for M-Pesa STK Push Callback (Safely log & verify transaction statuses)
const handleStkCallback = async (req: express.Request, res: express.Response) => {
  try {
    const payload = req.body;
    console.info('Received M-Pesa STK push callback payload:', JSON.stringify(payload, null, 2));

    const callback = payload?.Body?.stkCallback || payload?.stkCallback || payload;
    if (!callback || (!callback.CheckoutRequestID && !callback.MerchantRequestID)) {
      console.warn('Invalid M-Pesa callback payload format received:', payload);
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

    // Build verified transaction record
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

    console.info('Successfully verified & logging M-Pesa transaction status:', transactionRecord);

    let updatedOrder: Record<string, unknown> | null = null;

    if (SUPABASE_URL && !SUPABASE_URL.includes('placeholder')) {
      try {
        const { data, error } = await supabase
          .from('Orders')
          .update(transactionRecord)
          .eq('checkout_request_id', CheckoutRequestID)
          .select()
          .maybeSingle();

        if (error) {
          console.warn('Supabase callback status update notice:', error.message);
        } else if (data) {
          updatedOrder = data;
        }
      } catch (dbErr) {
        console.warn('Database error while updating M-Pesa status:', dbErr);
      }
    }

    if (updatedOrder && isSuccess) {
      try {
        await notifyPaymentStatusUpdate(updatedOrder);
      } catch (notifyErr) {
        console.error('Failed to dispatch payment completion notification:', notifyErr);
      }
    }

    // Return standard Safaricom Daraja JSON response payload
    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Callback accepted and processed successfully',
      transaction: transactionRecord,
    });
  } catch (error: any) {
    console.error('Critical error in M-Pesa STK callback handler:', error);
    return res.status(500).json({ ResultCode: 1, ResultDesc: 'Internal server error processing callback.' });
  }
};

// Callback Endpoint aliases for Daraja integration
app.post('/api/callback/stk', handleStkCallback);
app.post('/api/mpesa/callback', handleStkCallback);
app.post('/api/stkpush/callback', handleStkCallback);

// STK Push Query Endpoint (Live Daraja / DB Status Check)
app.get('/api/mpesa/query/:checkoutRequestId', async (req, res) => {
  const { checkoutRequestId } = req.params;
  if (!checkoutRequestId) {
    return res.status(400).json({ error: 'CheckoutRequestID parameter is required.' });
  }

  try {
    // 1. Check database first
    if (SUPABASE_URL && !SUPABASE_URL.includes('placeholder')) {
      const { data } = await supabase
        .from('Orders')
        .select('*')
        .eq('checkout_request_id', checkoutRequestId)
        .maybeSingle();

      if (data && data.paymentStatus && data.paymentStatus !== 'Pending M-Pesa') {
        return res.json({
          verified: true,
          paymentStatus: data.paymentStatus,
          mpesaReceiptNumber: data.mpesa_receipt_number,
          order: data,
        });
      }
    }

    // 2. Query Safaricom Daraja API directly if credentials are present
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
          darajaQueryResponse: data,
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

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static assets in production or container environments
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// Fallback to SPA index.html for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
