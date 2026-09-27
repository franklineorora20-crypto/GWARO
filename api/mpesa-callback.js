import { createClient } from "@supabase/supabase-js";

const SAFARICOM_ALLOWED_IPS = new Set([
  "196.201.214.200",
  "196.201.214.206",
  "196.201.213.114",
  "196.201.214.207",
  "196.201.214.208",
  "196.201.213.44",
  "196.201.212.127",
  "196.201.212.138",
  "196.201.212.129",
  "196.201.212.136",
  "196.201.212.74",
  "196.201.212.69",
  ...(process.env.MPESA_ALLOWED_IPS
    ? process.env.MPESA_ALLOWED_IPS.split(",").map((ip) => ip.trim()).filter(Boolean)
    : []),
]);

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded)
    ? forwarded[0]
    : typeof forwarded === "string"
    ? forwarded.split(",")[0]
    : req.socket?.remoteAddress || "";
  return String(raw).trim().replace(/^::ffff:/, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ResultCode: 1, ResultDesc: "Method Not Allowed" });
  }

  const clientIp = getClientIp(req);
  if (!SAFARICOM_ALLOWED_IPS.has(clientIp)) {
    console.warn("Rejected callback from unauthorized IP:", clientIp);
    return res.status(403).json({
      ResultCode: 1,
      ResultDesc: "Forbidden: Untrusted callback source IP",
    });
  }

  try {
    const callbackData = req.body;
    const stkCallback = callbackData?.Body?.stkCallback;

    if (!stkCallback || !stkCallback.CheckoutRequestID) {
      return res.status(400).json({
        ResultCode: 1,
        ResultDesc: "Invalid callback structure",
      });
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = Number(stkCallback.ResultCode);
    const resultDescription = stkCallback.ResultDesc;

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify CheckoutRequestID against pending orders in DB
    const { data: pendingOrder, error: lookupError } = await supabase
      .from("Orders")
      .select("*")
      .eq("checkout_request_id", checkoutRequestId)
      .maybeSingle();

    if (lookupError) {
      console.error("Callback DB lookup error:", lookupError);
      return res.status(500).json({ ResultCode: 1, ResultDesc: "Database lookup error" });
    }

    const isPending =
      pendingOrder &&
      String(pendingOrder.paymentStatus || "")
        .toLowerCase()
        .includes("pending");

    if (resultCode === 0 && !isPending) {
      console.warn(
        `Rejected callback: ResultCode 0 but CheckoutRequestID ${checkoutRequestId} not found in pending orders.`
      );
      return res.status(404).json({
        ResultCode: 1,
        ResultDesc: "CheckoutRequestID not found in pending orders",
      });
    }

    if (resultCode === 0) {
      const metadata = stkCallback.CallbackMetadata?.Item || [];
      const receipt =
        metadata.find((item) => item.Name === "MpesaReceiptNumber")?.Value || null;
      const amount =
        metadata.find((item) => item.Name === "Amount")?.Value || null;
      const phone =
        metadata.find((item) => item.Name === "PhoneNumber")?.Value || null;

      const updateData = {
        paymentStatus: "Paid via M-Pesa",
        mpesaRef: receipt,
        mpesa_receipt_number: receipt,
        mpesa_amount: amount,
        mpesa_phone: phone,
        payment_status_reason: null,
      };

      const { error } = await supabase
        .from("Orders")
        .update(updateData)
        .eq("checkout_request_id", checkoutRequestId)
        .select();

      if (error) {
        console.error("Supabase update failed:", error);
      }
    } else if (pendingOrder) {
      await supabase
        .from("Orders")
        .update({
          paymentStatus: "Failed M-Pesa",
          payment_status_reason: resultDescription,
        })
        .eq("checkout_request_id", checkoutRequestId);
    }

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.error("Callback error:", error);
    return res.status(500).json({
      ResultCode: 1,
      ResultDesc: "Internal Server Error",
    });
  }
}
