import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { getOrderByTrackingId, mapDbOrderToOrder } from "../lib/orders";
import { SAMPLE_ORDERS } from "../data/initialData";
import type { Order, OrderStatus } from "../types";
import { CheckCircle2, MapPin, Clock, Truck, Package, CreditCard } from "lucide-react";

interface TrackOrderProps {
  initialTrackingId?: string;
  orders?: Order[];
}

const STATUS_STEPS: OrderStatus[] = [
  "Order Received",
  "Pickup Scheduled",
  "Picked Up",
  "Washing",
  "Drying",
  "Ironing",
  "Quality Check",
  "Ready for Delivery",
  "Out for Delivery",
  "Delivered",
];

const normalizeStatus = (status: OrderStatus): OrderStatus => {
  switch (status) {
    case "Inspection & Sorting":
      return "Pickup Scheduled";
    case "In Wash & Revitalizing":
      return "Washing";
    case "Ready for Pickup / Out for Delivery":
      return "Out for Delivery";
    case "Completed":
      return "Delivered";
    default:
      return status;
  }
};

const getStepIndex = (status: OrderStatus) => {
  return STATUS_STEPS.indexOf(normalizeStatus(status));
};

const isOrderMatch = (o: Order, rawQuery: string): boolean => {
  const qAlpha = rawQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!qAlpha) return false;

  const idAlpha = String(o.id ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const phoneAlpha = String(o.phone ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const nameAlpha = String(o.customerName ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (idAlpha === qAlpha || idAlpha.includes(qAlpha) || qAlpha.includes(idAlpha)) return true;
  if (phoneAlpha && (phoneAlpha === qAlpha || phoneAlpha.includes(qAlpha) || qAlpha.includes(phoneAlpha))) return true;
  if (nameAlpha && (nameAlpha.includes(qAlpha) || qAlpha.includes(nameAlpha))) return true;

  return false;
};

const TrackOrder: React.FC<TrackOrderProps> = ({ initialTrackingId = '', orders = [] }) => {
  const [trackingId, setTrackingId] = useState(initialTrackingId || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribedId, setSubscribedId] = useState("");

  const fetchOrder = async (id: string) => {
    setError("");
    setLoading(true);
    setOrder(null);

    const raw = id.trim();
    if (!raw) {
      setError("Please enter a valid tracking ID or phone number.");
      setLoading(false);
      return;
    }

    // 1) Try Supabase
    try {
      const data = await getOrderByTrackingId(raw);
      if (data) {
        const mapped = mapDbOrderToOrder(data);
        setOrder(mapped);
        setSubscribedId(mapped.id || raw);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Supabase order query notice:", e);
    }

    // 2) Try orders passed in props
    const matchFromProps = orders.find((o) => isOrderMatch(o, raw));
    if (matchFromProps) {
      setOrder(matchFromProps);
      setSubscribedId(matchFromProps.id);
      setLoading(false);
      return;
    }

    // 3) Try localStorage
    try {
      const local = localStorage.getItem('goldtribe_orders');
      if (local) {
        const parsed = JSON.parse(local) as Order[];
        if (Array.isArray(parsed)) {
          const matchLocal = parsed.find((o) => isOrderMatch(o, raw));
          if (matchLocal) {
            setOrder(matchLocal);
            setSubscribedId(matchLocal.id);
            setLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn("localStorage lookup notice:", e);
    }

    // 4) Try SAMPLE_ORDERS
    const matchSample = SAMPLE_ORDERS.find((o) => isOrderMatch(o, raw));
    if (matchSample) {
      setOrder(matchSample);
      setSubscribedId(matchSample.id);
      setLoading(false);
      return;
    }

    setError("Order not found. Please verify your tracking number or phone number.");
    setLoading(false);
  };

  const handleTrack = async () => {
    const id = trackingId.trim();
    if (!id) {
      setError("Enter a valid tracking ID or phone number.");
      return;
    }
    await fetchOrder(id);
  };

  const handleSelectDemo = async (orderId: string) => {
    setTrackingId(orderId);
    await fetchOrder(orderId);
  };

  useEffect(() => {
    if (initialTrackingId && initialTrackingId.trim()) {
      setTrackingId(initialTrackingId.trim());
      fetchOrder(initialTrackingId.trim());
    }
  }, [initialTrackingId, orders]);

  useEffect(() => {
    if (!subscribedId) return;

    const channel = supabase
      .channel(`track-order-${subscribedId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Orders",
          filter: `tracking_id=eq.${subscribedId}`,
        },
        async () => {
          await fetchOrder(subscribedId);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [subscribedId]);

  return (
    <section className="py-16 sm:py-20 bg-[#f5f1ed] text-[#1c1b1b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center mx-auto max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fed65b]/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#341168]">
            <Truck className="w-4 h-4" /> Real-Time Order Tracking
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-manrope">
            Track your laundry order instantly
          </h1>
          <p className="text-sm sm:text-base text-[#4a4550] font-worksans">
            Enter your tracking ID or phone number to view live processing status and activity updates.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-[#e8e2db] overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-[1.5fr_0.8fr] items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[#7b7581] mb-2">
                  Order Tracking ID or Phone
                </label>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. GL-1234 or 0712345678"
                  className="w-full rounded-2xl border border-[#ddd5c8] bg-[#fcfbf9] px-4 py-3 text-sm text-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-[#341168]/20"
                />
              </div>

              <button
                type="button"
                onClick={handleTrack}
                className="rounded-2xl bg-[#341168] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg hover:bg-[#4b2c7f] transition cursor-pointer"
              >
                {loading ? "Searching..." : "Track Order"}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {orders.length > 0 && (
              <div className="mt-6 rounded-3xl border border-[#e8e2db] bg-[#fcfbf9] p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7b7581] font-bold">Recent Bookings</p>
                    <p className="text-sm text-[#4a4550]">Tap an order to view full live tracking.</p>
                  </div>
                  <span className="text-xs font-semibold text-[#341168]">{orders.length} orders</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {orders.slice(0, 6).map((historyOrder) => (
                    <button
                      key={historyOrder.id}
                      type="button"
                      onClick={() => handleSelectDemo(historyOrder.id)}
                      className="rounded-2xl border border-[#ddd5c8] bg-white p-4 text-left text-sm hover:border-[#341168] hover:bg-[#f8f4ee] transition cursor-pointer"
                    >
                      <p className="font-bold text-[#341168]">{historyOrder.id}</p>
                      <p className="text-[#4a4550]">{historyOrder.customerName}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[#7b7581]">{historyOrder.paymentStatus}</p>
                      <p className="text-xs text-[#7b7581] mt-1">{normalizeStatus(historyOrder.status)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {order && (
            <div className="border-t border-[#e8e2db] bg-[#faf7f3] p-6 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-5">
                  <div className="rounded-3xl bg-white border border-[#e8e2db] p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#7b7581] font-bold">
                          Order Summary
                        </p>
                        <h2 className="mt-3 text-2xl font-extrabold text-[#341168]">
                          {order.id}
                        </h2>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#341168] px-4 py-2 text-xs font-bold text-[#fed65b]">
                        <CheckCircle2 className="w-4 h-4" /> {normalizeStatus(order.status)}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-[#f6f3f2] p-4 text-sm text-[#4a4550]">
                        <p className="font-semibold text-[#341168]">Customer</p>
                        <p>{order.customerName}</p>
                        <p className="mt-2 text-xs text-[#7b7581]">Phone</p>
                        <p>{order.phone}</p>
                      </div>
                      <div className="rounded-2xl bg-[#f6f3f2] p-4 text-sm text-[#4a4550]">
                        <p className="font-semibold text-[#341168]">Delivery</p>
                        <p>{order.deliveryType}</p>
                        <p className="mt-2 text-xs text-[#7b7581]">Estimated Return</p>
                        <p>{order.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>

                  {/* Garment details breakdown */}
                  {order.items && order.items.length > 0 && (
                    <div className="rounded-3xl bg-white border border-[#e8e2db] p-6 shadow-sm">
                      <div className="flex items-center gap-2 text-[#341168] text-sm font-bold uppercase tracking-[0.2em] mb-4">
                        <Package className="w-4 h-4" /> Garments Breakdown
                      </div>
                      <div className="divide-y divide-[#e8e2db]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between items-center text-sm">
                            <div>
                              <p className="font-bold text-[#1c1b1b]">{item.serviceName}</p>
                              <p className="text-xs text-[#7b7581]">Qty: {item.quantity} × Ksh {item.unitPrice.toLocaleString()}</p>
                            </div>
                            <p className="font-extrabold text-[#341168]">Ksh {(item.quantity * item.unitPrice).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#e8e2db] flex justify-between items-center font-manrope">
                        <span className="text-sm font-bold text-[#4a4550]">Total Price</span>
                        <span className="text-lg font-extrabold text-[#341168]">Ksh {order.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl bg-white border border-[#e8e2db] p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7b7581] font-bold">
                      Live status timeline
                    </p>
                    <div className="mt-6 space-y-4">
                      {STATUS_STEPS.map((step, index) => {
                        const stepIndex = getStepIndex(order.status);
                        const isActive = index === stepIndex;
                        const isCompleted = index < stepIndex;

                        return (
                          <div key={step} className="flex items-start gap-4">
                            <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${isCompleted ? 'bg-[#fed65b] border-[#fed65b] text-[#341168]' : isActive ? 'bg-[#341168] border-[#341168] text-white' : 'bg-white border-[#ded7cb] text-[#7b7581]'}`}>
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                            </div>
                            <div>
                              <p className={`font-semibold ${isActive ? 'text-[#341168]' : 'text-[#4a4550]'}`}>
                                {step}
                              </p>
                              {isActive && (
                                <p className="text-sm text-[#7b7581] mt-1">
                                  Your order is currently in this step.
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl bg-white border border-[#e8e2db] p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-[#341168] text-sm font-bold uppercase tracking-[0.2em]">
                      <MapPin className="w-4 h-4" /> Pickup & Delivery
                    </div>
                    <div className="mt-4 text-sm text-[#4a4550] space-y-2">
                      <p className="font-semibold">Delivery Address</p>
                      <p>{order.address}</p>
                      <p className="font-semibold mt-4">Branch</p>
                      <p>{order.branch}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white border border-[#e8e2db] p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-[#341168] text-sm font-bold uppercase tracking-[0.2em]">
                      <CreditCard className="w-4 h-4" /> Payment Details
                    </div>
                    <div className="mt-4 text-sm text-[#4a4550] space-y-2">
                      <p className="font-semibold">Payment Status</p>
                      <p className="inline-block px-3 py-1 rounded-full bg-[#f6f3f2] font-bold text-xs text-[#341168]">{order.paymentStatus}</p>
                      {order.mpesaRef && (
                        <>
                          <p className="font-semibold mt-3">M-Pesa Receipt</p>
                          <p className="font-mono text-xs text-[#341168]">{order.mpesaRef}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white border border-[#e8e2db] p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-[#341168] text-sm font-bold uppercase tracking-[0.2em]">
                      <Clock className="w-4 h-4" /> Activity log
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-[#4a4550]">
                      {order.trackingNotes && order.trackingNotes.length > 0 ? (
                        order.trackingNotes.map((note, index) => (
                          <motion.div
                            key={`${note.time}-${index}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.04 }}
                            className="rounded-2xl bg-[#f6f3f2] p-4"
                          >
                            <div className="flex items-center justify-between gap-3 text-xs text-[#7b7581] font-semibold">
                              <span>{note.time}</span>
                              <span>{normalizeStatus(note.status)}</span>
                            </div>
                            <p className="mt-2 text-sm text-[#4a4550]">{note.note}</p>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-sm text-[#7b7581]">No activity recorded yet. Check back shortly for live progress.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrackOrder;

