import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {

    console.log("STKPUSH FUNCTION HIT");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

  const orderData = req.body;

const trackingId = orderData.tracking_id || 
`GL-${Math.floor(1000 + Math.random() * 9000)}`;

orderData.tracking_id = trackingId;

console.log("TRACKING ID:", orderData.tracking_id);


    // 1. Get M-Pesa Access Token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");


    const tokenResponse = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );


    const tokenData = await tokenResponse.json();

    const accessToken = tokenData.access_token;


    // 2. Generate password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0,14);


    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

const phone = orderData.phone
  .replace(/\s+/g, '')
  .replace('+', '')
  .replace(/^0/, '254');

console.log("FORMATTED PHONE:", phone);

console.log("STK PAYLOAD:", {
  BusinessShortCode: process.env.MPESA_SHORTCODE,
  Amount: Number(orderData.totalPrice),
  PartyA: phone,
  PartyB: process.env.MPESA_SHORTCODE,
  PhoneNumber: phone,
  CallBackURL: process.env.MPESA_CALLBACK_URL,
  AccountReference: orderData.tracking_id,
  TransactionType: "CustomerPayBillOnline"
});

    // 3. Send STK Push
    const stkResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          BusinessShortCode:
            process.env.MPESA_SHORTCODE,

          Password: password,

          Timestamp: timestamp,

          TransactionType:
            "CustomerPayBillOnline",

          Amount:
            Number(orderData.totalPrice),

          PartyA: phone,

          PartyB:
            process.env.MPESA_SHORTCODE,

          PhoneNumber: phone,

          CallBackURL:
            process.env.MPESA_CALLBACK_URL,

          AccountReference:
            orderData.tracking_id,

          TransactionDesc:
            "GoldTribe Laundry Payment",

        }),
      }
    );


    const stkData = await stkResponse.json();
    console.log("STK RESPONSE:", stkData);


  if (!stkData.CheckoutRequestID) {

  return res.status(400).json({
    error: stkData.CustomerMessage || "STK Push failed",
    raw: stkData
  });

}

    // 4. Save order in Supabase

   const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

    orderData.checkout_request_id = stkData.CheckoutRequestID;

orderData.merchant_request_id = stkData.MerchantRequestID;

orderData.paymentStatus = "Payment Pending";

orderData.status = "Order Received";

    const { data: order, error } =
      await supabase
      .from("Orders")
      .insert(orderData)
      .select()
      .single();

      console.log("ORDER CREATED:", order);
console.log("ORDER ERROR:", error);

    if(error){
      throw error;
    }


    // 5. Return order to frontend

    res.status(200).json({
      order,
      checkoutRequestID:
        stkData.CheckoutRequestID
    });


  } catch(error){

    console.error(error);

    res.status(500).json({
      error:error.message
    });

  }

}