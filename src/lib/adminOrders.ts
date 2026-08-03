import type { Order, OrderStatus, PaymentStatus } from "../types";
import { mapDbOrderToOrder } from "./orders";
import { supabase, isSupabaseConfigured } from "./supabase";
import { 
  isFirebaseConfigured, 
  getFirebaseOrders, 
  updateFirebaseOrderStatus, 
  updateFirebasePaymentStatus, 
  deleteFirebaseOrder 
} from "./firebaseOrders";
import { SAMPLE_ORDERS } from "../data/initialData";

export interface AdminOrder extends Order {
  dbId: number;
  trackingId: string | null;
  rawCreatedAt: string;

  pickupDate?: string;
  timeSlot?: string;

  mpesaReceiptNumber?: string;
  mpesaAmount?: number;
  mpesaPhone?: string;

  checkoutRequestId?: string;
  merchantRequestId?: string;

  paymentStatusReason?: string;
}

export function mapRowToAdminOrder(
  row: Record<string, unknown>
): AdminOrder {

  const base = mapDbOrderToOrder(row);

  return {

    ...base,

    dbId:
      typeof row.id === "number" ? row.id : (row.dbId as number) || 1,

    trackingId:
      (row.tracking_id as string | null) ?? (row.trackingId as string | null) ?? base.id,

    rawCreatedAt:
      (row.createdAt as string) ?? (row.created_at as string) ?? new Date().toISOString(),

    pickupDate:
      (row.pickupDate as string) ?? (row.pickup_date as string) ?? undefined,

    timeSlot:
      (row.timeSlot as string) ?? (row.time_slot as string) ?? undefined,

    //----------------------------------
    // MPESA
    //----------------------------------

    mpesaReceiptNumber:
      (row.mpesa_receipt_number as string) ??
      (row.mpesaRef as string) ??
      (row.mpesa_ref as string) ??
      (row.mpesaReceiptNumber as string) ??
      undefined,

    mpesaAmount:
      row.mpesa_amount != null
        ? Number(row.mpesa_amount)
        : row.mpesaAmount != null
        ? Number(row.mpesaAmount)
        : undefined,

    mpesaPhone:
      (row.mpesa_phone as string) ?? (row.mpesaPhone as string) ?? undefined,

    checkoutRequestId:
      (row.checkout_request_id as string) ?? (row.checkoutRequestId as string) ?? undefined,

    merchantRequestId:
      (row.merchant_request_id as string) ?? (row.merchantRequestId as string) ?? undefined,

    paymentStatusReason:
      (row.payment_status_reason as string) ?? (row.paymentStatusReason as string) ?? undefined,
  };
}

export async function updateOrderDetails(
  dbId: number,
  updates: Partial<AdminOrder>,
  orderId?: string
) {
  if (isSupabaseConfigured) {
    try {
      const payload: Record<string, unknown> = {};
      if (updates.pickupDate !== undefined) payload.pickupDate = updates.pickupDate;
      if (updates.timeSlot !== undefined) payload.timeSlot = updates.timeSlot;
      if (updates.mpesaReceiptNumber !== undefined) {
        payload.mpesaRef = updates.mpesaReceiptNumber;
        payload.mpesa_receipt_number = updates.mpesaReceiptNumber;
      }
      if (updates.mpesaPhone !== undefined) payload.mpesa_phone = updates.mpesaPhone;
      if (updates.paymentStatus !== undefined) payload.paymentStatus = updates.paymentStatus;
      if (updates.status !== undefined) payload.status = updates.status;

      const { data, error } = await supabase
        .from("Orders")
        .update(payload)
        .eq("id", dbId)
        .select();

      if (!error && data && data.length > 0) {
        return data[0];
      }
    } catch (e) {
      console.warn("updateOrderDetails Supabase notice:", e);
    }
  }

  // Local storage fallback
  try {
    const local = localStorage.getItem('goldtribe_orders');
    if (local) {
      const parsed = JSON.parse(local) as Order[];
      const idx = parsed.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        parsed[idx] = { ...parsed[idx], ...updates };
        localStorage.setItem('goldtribe_orders', JSON.stringify(parsed));
      }
    }
  } catch (e) {
    console.warn("updateOrderDetails localStorage notice:", e);
  }

  return { id: dbId, ...updates };
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  // 1. Firebase Firestore
  if (isFirebaseConfigured) {
    try {
      const fbOrders = await getFirebaseOrders();
      if (fbOrders && fbOrders.length > 0) {
        return fbOrders.map((o, idx) => ({
          ...o,
          dbId: idx + 1,
          trackingId: o.id,
          rawCreatedAt: o.createdAt || new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn("fetchAdminOrders Firebase notice:", e);
    }
  }

  // 2. Supabase
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("Orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (!error && data && data.length > 0) {
        return data.map((row) =>
          mapRowToAdminOrder(row as Record<string, unknown>)
        );
      }
    } catch (e) {
      console.warn("fetchAdminOrders Supabase notice:", e);
    }
  }

  // 3. Fallback to localStorage or sample orders
  try {
    const local = localStorage.getItem('goldtribe_orders');
    if (local) {
      const parsed = JSON.parse(local) as Order[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((o, idx) => ({
          ...o,
          dbId: idx + 1,
          trackingId: o.id,
          rawCreatedAt: o.createdAt || new Date().toISOString(),
        }));
      }
    }
  } catch (e) {
    console.warn("localStorage fallback notice:", e);
  }

  return SAMPLE_ORDERS.map((o, idx) => ({
    ...o,
    dbId: idx + 1,
    trackingId: o.id,
    rawCreatedAt: o.createdAt || new Date().toISOString(),
  }));
}

export async function updateOrderStatus(
  dbId: number,
  status: OrderStatus,
  orderId?: string
) {
  if (orderId && isFirebaseConfigured) {
    try {
      await updateFirebaseOrderStatus(orderId, status);
    } catch (e) {
      console.warn("updateOrderStatus Firebase notice:", e);
    }
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("Orders")
        .update({ status })
        .eq("id", dbId)
        .select();

      if (!error && data && data.length > 0) {
        return data[0];
      }
    } catch (e) {
      console.warn("updateOrderStatus Supabase notice:", e);
    }
  }
  return { id: dbId, status };
}

export async function updateOrderPaymentStatus(
  dbId: number,
  paymentStatus: PaymentStatus,
  orderId?: string
) {
  if (orderId && isFirebaseConfigured) {
    try {
      await updateFirebasePaymentStatus(orderId, paymentStatus);
    } catch (e) {
      console.warn("updateOrderPaymentStatus Firebase notice:", e);
    }
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("Orders")
        .update({ paymentStatus })
        .eq("id", dbId)
        .select();

      if (!error && data && data.length > 0) {
        return data[0];
      }
    } catch (e) {
      console.warn("updateOrderPaymentStatus Supabase notice:", e);
    }
  }
  return { id: dbId, paymentStatus };
}

export async function deleteOrderById(
  dbId: number,
  orderId?: string
): Promise<void> {
  if (orderId && isFirebaseConfigured) {
    try {
      await deleteFirebaseOrder(orderId);
    } catch (e) {
      console.warn("deleteOrderById Firebase notice:", e);
    }
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from("Orders")
        .delete()
        .eq("id", dbId);
    } catch (e) {
      console.warn("deleteOrderById Supabase notice:", e);
    }
  }
}
