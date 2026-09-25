import type { Order } from "../types";
import { supabase, isSupabaseConfigured } from "./supabase";
import { isFirebaseConfigured, getFirebaseOrders, getFirebaseOrderByTrackingId } from "./firebaseOrders";
import { toIsoStringSafe } from "./dateUtils";

export function mapDbOrderToOrder(
  row: Record<string, unknown>
): Order {

  const trackingId =
    row.tracking_id as string | null | undefined;

  const numericId =
    row.id as number | string | undefined;

  return {

    //----------------------------------
    // BASIC DETAILS
    //----------------------------------

    id:
      trackingId ?? (numericId ? `GL-${numericId}` : `GL-${Math.floor(1000 + Math.random() * 9000)}`),

    customerName:
      (row.customerName as string) ?? "",

    phone:
      (row.phone as string) ?? "",

    email:
      (row.email as string) ?? undefined,

    branch:
      (row.branch as Order["branch"]) ??
      "Rongai Branch",

    address:
      (row.address as string) ?? "",

    items:
      (row.items as Order["items"]) ?? [],

    totalPrice:
      Number(row.totalPrice ?? 0),

    status:
      (row.status as Order["status"]) ??
      "Order Received",

    createdAt:
      toIsoStringSafe(row.createdAt ?? row.created_at),

    estimatedDelivery:
      (row.estimatedDelivery as string) ??
      "Within 24 Hours",

    paymentStatus:
      (row.paymentStatus as Order["paymentStatus"]) ??
      "Pay on Delivery",

    deliveryType:
      (row.deliveryType as Order["deliveryType"]) ??
      "Delivery to Door",

    specialNotes:
      (row.specialNotes as string) ?? "",

    trackingNotes:
      (row.trackingNotes as Order["trackingNotes"]) ?? [],

    pickupDate:
      (row.pickupDate as string) ?? (row.pickup_date as string) ?? undefined,

    timeSlot:
      (row.timeSlot as string) ?? (row.time_slot as string) ?? undefined,

    //----------------------------------
    // M-PESA
    //----------------------------------

    mpesaRef:
      (row.mpesa_receipt_number as string) ??
      (row.mpesaRef as string) ??
      (row.mpesa_ref as string) ??
      (row.mpesaReceiptNumber as string) ??
      undefined,

    mpesaPhone:
      (row.mpesa_phone as string) ?? (row.mpesaPhone as string) ?? undefined,

    mpesaAmount:
      row.mpesa_amount != null
        ? Number(row.mpesa_amount)
        : row.mpesaAmount != null
        ? Number(row.mpesaAmount)
        : undefined,

    checkoutRequestId:
      (row.checkout_request_id as string) ??
      (row.checkoutRequestId as string) ??
      undefined,

    merchantRequestId:
      (row.merchant_request_id as string) ??
      (row.merchantRequestId as string) ??
      undefined,

    mpesaReceiptNumber:
      (row.mpesa_receipt_number as string) ??
      (row.mpesaRef as string) ??
      (row.mpesa_ref as string) ??
      (row.mpesaReceiptNumber as string) ??
      undefined,

    transactionDate:
      (row.transaction_date as string) ??
      (row.transactionDate as string) ??
      undefined,

    paymentStatusReason:
      (row.payment_status_reason as string) ??
      (row.paymentStatusReason as string) ??
      undefined,
  };
}

export async function getOrders(): Promise<Record<string, unknown>[] | null> {
  // 1. Try Firebase Firestore
  if (isFirebaseConfigured) {
    try {
      const fbOrders = await getFirebaseOrders();
      if (fbOrders && fbOrders.length > 0) {
        return fbOrders as unknown as Record<string, unknown>[];
      }
    } catch (err) {
      console.warn("Firebase getOrders notice:", err);
    }
  }

  // 2. Fallback to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const { data, error } =
        await supabase
          .from("Orders")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn("Supabase getOrders exception:", err);
    }
  }

  return null;
}

export async function getOrderByTrackingId(
  trackingId: string
): Promise<Record<string, unknown> | null> {
  const clean = trackingId.trim().replace(/^#/, '');
  if (!clean) return null;

  // 1. Try Firebase Firestore
  if (isFirebaseConfigured) {
    try {
      const fbOrder = await getFirebaseOrderByTrackingId(clean);
      if (fbOrder) {
        return fbOrder as unknown as Record<string, unknown>;
      }
    } catch (err) {
      console.warn("Firebase getOrderByTrackingId notice:", err);
    }
  }

  // 2. Fallback to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const { data: trackData, error: trackErr } = await supabase
        .from("Orders")
        .select("*")
        .eq("tracking_id", clean)
        .maybeSingle();

      if (!trackErr && trackData) {
        return trackData;
      }

      const upperClean = clean.toUpperCase();
      if (upperClean !== clean) {
        const { data: upperData, error: upperErr } = await supabase
          .from("Orders")
          .select("*")
          .eq("tracking_id", upperClean)
          .maybeSingle();

        if (!upperErr && upperData) {
          return upperData;
        }
      }

      const { data: phoneData, error: phoneErr } = await supabase
        .from("Orders")
        .select("*")
        .eq("phone", clean)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!phoneErr && phoneData && phoneData.length > 0) {
        return phoneData[0];
      }

      if (/^\d+$/.test(clean)) {
        const { data: idData, error: idErr } = await supabase
          .from("Orders")
          .select("*")
          .eq("id", Number(clean))
          .maybeSingle();

        if (!idErr && idData) {
          return idData;
        }
      }
    } catch (err) {
      console.warn("Supabase getOrderByTrackingId exception:", err);
    }
  }

  return null;
}
