import { isFirebaseConfigured, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface ManualPaymentRecord {
  order_id: string;
  amount: number;
  mpesa_code: string;
  timestamp: string;
  status: "Payment Submitted" | string;
  customerName?: string;
  phone?: string;
}

/**
 * Saves a manual M-PESA payment submission to LocalStorage, Firebase, and Supabase if configured.
 */
export async function saveManualPayment(record: ManualPaymentRecord): Promise<boolean> {
  const cleanRecord: ManualPaymentRecord = {
    order_id: record.order_id,
    amount: record.amount,
    mpesa_code: record.mpesa_code.toUpperCase().trim(),
    timestamp: record.timestamp || new Date().toISOString(),
    status: record.status || "Payment Submitted",
    customerName: record.customerName || "Customer",
    phone: record.phone || "",
  };

  // 1. LocalStorage
  try {
    const existing = localStorage.getItem("goldtribe_manual_payments");
    const list: ManualPaymentRecord[] = existing ? JSON.parse(existing) : [];
    // Replace if same order_id, else append
    const updated = [cleanRecord, ...list.filter((item) => item.order_id !== cleanRecord.order_id)];
    localStorage.setItem("goldtribe_manual_payments", JSON.stringify(updated));

    // Also update existing orders in goldtribe_orders
    const localOrders = localStorage.getItem("goldtribe_orders");
    if (localOrders) {
      const parsedOrders = JSON.parse(localOrders);
      if (Array.isArray(parsedOrders)) {
        const updatedOrders = parsedOrders.map((ord: any) => {
          if (ord.id === cleanRecord.order_id) {
            return {
              ...ord,
              paymentStatus: "Payment Submitted",
              mpesaRef: cleanRecord.mpesa_code,
              status: "Payment Submitted",
            };
          }
          return ord;
        });
        localStorage.setItem("goldtribe_orders", JSON.stringify(updatedOrders));
      }
    }
  } catch (err) {
    console.warn("Error saving manual payment to localStorage:", err);
  }

  // 2. Firebase Firestore
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "manual_payments", cleanRecord.order_id);
      await setDoc(docRef, cleanRecord, { merge: true });

      // Update matching order document in Firebase as well
      const orderRef = doc(db, "orders", cleanRecord.order_id);
      await setDoc(
        orderRef,
        {
          paymentStatus: "Payment Submitted",
          mpesaRef: cleanRecord.mpesa_code,
          status: "Payment Submitted",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Error saving manual payment to Firebase:", err);
    }
  }

  // 3. Supabase
  if (isSupabaseConfigured) {
    try {
      await supabase.from("Orders").update({
        paymentStatus: "Payment Submitted",
        mpesaRef: cleanRecord.mpesa_code,
        mpesa_receipt_number: cleanRecord.mpesa_code,
        status: "Payment Submitted",
      }).eq("tracking_id", cleanRecord.order_id);
    } catch (err) {
      console.warn("Error saving manual payment to Supabase:", err);
    }
  }

  return true;
}
