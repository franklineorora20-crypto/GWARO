import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    if (!process.env.MPESA_CONSUMER_KEY) throw Error("Missing key");
    if (!process.env.MPESA_CONSUMER_SECRET) throw Error("Missing MPESA_CONSUMER_SECRET");
    if (!process.env.MPESA_SHORTCODE) throw Error("Missing MPESA_SHORTCODE");
    if (!process.env.MPESA_PASSKEY) throw Error("Missing MPESA_PASSKEY");

    const base =
      process.env.MPESA_ENVIRONMENT === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

    const orderData = req.body;
    const trackingId =
      orderData.tracking_id || `GL-${Math.floor(100000 + Math.random() * 900000)}`;
    orderData.tracking_id = trackingId;

    // 1. Get M-Pesa Access Token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenResponse = await fetch(
      `${base}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!tokenResponse.ok) {
      return res.status(502).json({
        error: "Unable to authenticate with Safaricom M-Pesa gateway.",
        paymentStatus: "Failed",
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Generate password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const phone = String(orderData.phone || "")
      .replace(/\s+/g, "")
      .replace("+", "")
      .replace(/^0/, "254");

    const callbackUrl =
      process.env.MPESA_CALLBACK_URL || "https://goldtribe.co.ke/api/callback/stk";

    // 3. Send STK Push
    const stkResponse = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(Number(orderData.totalPrice)),
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: orderData.tracking_id,
        TransactionDesc: "GoldTribe Laundry Payment",
      }),
    });

    const stkData = await stkResponse.json();

    if (!stkResponse.ok || !stkData.CheckoutRequestID) {
      return res.status(502).json({
        error:
          stkData.CustomerMessage ||
          "M-Pesa STK Push failed. Please check your phone number and try again.",
        paymentStatus: "Failed",
      });
    }

    // 4. Save pending order in Supabase only after live Daraja confirmation
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    orderData.checkout_request_id = stkData.CheckoutRequestID;
    orderData.merchant_request_id = stkData.MerchantRequestID;
    orderData.paymentStatus = "Pending M-Pesa";
    orderData.status = "Order Received";

    const { data: order, error } = await supabase
      .from("Orders")
      .insert(orderData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      order,
      checkoutRequestID: stkData.CheckoutRequestID,
    });
  } catch (error) {
    console.error("STK push error:", error);
    return res.status(502).json({
      error: "Unable to process M-Pesa payment request. Please try again.",
      paymentStatus: "Failed",
    });
  }
}
