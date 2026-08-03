import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
export { isFirebaseConfigured };
import type { Order, OrderStatus, PaymentStatus } from "../types";

const ORDERS_COLLECTION = "orders";

export async function saveOrderToFirebase(order: Order): Promise<boolean> {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(docRef, {
      ...order,
      tracking_id: order.id,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("Error saving order to Firebase:", error);
    return false;
  }
}

export async function getFirebaseOrders(): Promise<Order[] | null> {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    
    return snapshot.docs.map((d) => d.data() as Order);
  } catch (error) {
    console.warn("Error fetching Firebase orders:", error);
    return null;
  }
}

export async function getFirebaseOrderByTrackingId(trackingId: string): Promise<Order | null> {
  if (!db || !isFirebaseConfigured) return null;
  const clean = trackingId.trim().replace(/^#/, '');
  if (!clean) return null;

  try {
    // 1. Check doc by ID
    const docRef = doc(db, ORDERS_COLLECTION, clean);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Order;
    }

    // 2. Query by tracking_id
    const q = query(collection(db, ORDERS_COLLECTION), where("tracking_id", "==", clean));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data() as Order;
    }

    // 3. Query uppercase tracking_id
    const upper = clean.toUpperCase();
    if (upper !== clean) {
      const qUpper = query(collection(db, ORDERS_COLLECTION), where("tracking_id", "==", upper));
      const snapUpper = await getDocs(qUpper);
      if (!snapUpper.empty) {
        return snapUpper.docs[0].data() as Order;
      }
    }

    // 4. Query by phone number
    const qPhone = query(collection(db, ORDERS_COLLECTION), where("phone", "==", clean));
    const snapPhone = await getDocs(qPhone);
    if (!snapPhone.empty) {
      return snapPhone.docs[0].data() as Order;
    }

    return null;
  } catch (error) {
    console.warn("Error finding Firebase order:", error);
    return null;
  }
}

export async function updateFirebaseOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.warn("Error updating Firebase order status:", error);
    return false;
  }
}

export async function updateFirebasePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<boolean> {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      paymentStatus,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.warn("Error updating Firebase payment status:", error);
    return false;
  }
}

export async function deleteFirebaseOrder(orderId: string): Promise<boolean> {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.warn("Error deleting Firebase order:", error);
    return false;
  }
}

export function subscribeToFirebaseOrders(callback: (orders: Order[]) => void) {
  if (!db || !isFirebaseConfigured) return () => {};
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((d) => d.data() as Order);
      callback(orders);
    }, (error) => {
      console.warn("Firebase realtime snapshot error:", error);
    });
  } catch (error) {
    console.warn("Failed to subscribe to Firebase orders:", error);
    return () => {};
  }
}
