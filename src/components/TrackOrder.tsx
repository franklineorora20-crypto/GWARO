import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { getOrderByTrackingId, mapDbOrderToOrder } from "../lib/orders";
import { SAMPLE_ORDERS } from "../data/initialData";
import type { Order, OrderStatus } from "../types";
import { CheckCircle2, MapPin, Clock, Truck, Package, CreditCard, Search, ArrowRight, Copy, Check, Sparkles } from "lucide-react";
import { TrackOrderSkeleton } from "./SkeletonLoaders";

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
  const [copied, setCopied] = useState(false);

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

    // Graceful minimum buffer to allow skeleton loader to render smoothly without flickering
    const minBuffer = new Promise((resolve) => setTimeout(resolve, 320));

    // 1) Try Supabase / Firebase
    try {
      const data = await getOrderByTrackingId(raw);
      if (data) {
        await minBuffer;
        const mapped = mapDbOrderToOrder(data);
        setOrder(mapped);
        setSubscribedId(mapped.id || raw);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Database order query notice:", e);
    }

    // 2) Try orders passed in props
    const matchFromProps = orders.find((o) => isOrderMatch(o, raw));
    if (matchFromProps) {
      await minBuffer;
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
            await minBuffer;
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
      await minBuffer;
      setOrder(matchSample);
      setSubscribedId(matchSample.id);
      setLoading(false);
      return;
    }

    await minBuffer;
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

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  useEffect(() => {
    if (initialTrackingId && initialTrackingId.trim()) {
      setTrackingId(initialTrackingId.trim());
      fetchOrder(initialTrackingId.trim());
    }
  }, [initialTrackingId, orders]);

  useEffect(() => {
    if (!subscribedId) return;

    try {
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
    } catch (e) {
      console.warn("Realtime order subscription notice:", e);
    }
  }, [subscribedId]);

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAFB] dark:bg-[#0c0418] text-neutral-900 dark:text-white transition-colors duration-200 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center mx-auto max-w-2xl space-y-3">
          <div className="text-xs font-semibold tracking-tight text-[#5E228B] dark:text-[#FED65B]">
            Live Transit Tracker · Automated SMS & WhatsApp Updates
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-manrope tracking-[-0.02em] [text-wrap:balance]">
            Garment Status & Milestones
          </h1>
          <p className="text-sm font-worksans text-neutral-600 dark:text-neutral-400">
            Enter your order tracking ID or registered M-Pesa phone number to see exactly where your garments are right now.
          </p>
        </div>

        {/* Minimalist Command-Style Search Card */}
        <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                placeholder="Tracking ID (e.g. GL-1234) or Phone number"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B] tabular-nums transition-colors"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleTrack}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#5E228B] hover:bg-[#501a78] text-white font-bold text-xs sm:text-sm font-manrope shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(94,34,139,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FED65B] animate-ping" />
                  <span>Searching...</span>
                </div>
              ) : (
                <>
                  <span>Track Order</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FED65B]" />
                </>
              )}
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Quick Demo ID pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08] text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Quick examples:</span>
            {['GL-1234', 'GL-5678', 'GL-9012'].map((demoId) => (
              <button
                key={demoId}
                onClick={() => handleSelectDemo(demoId)}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-white/[0.05] hover:bg-neutral-200 dark:hover:bg-white/[0.1] text-neutral-800 dark:text-neutral-200 font-mono text-[11px] transition-colors cursor-pointer"
              >
                {demoId}
              </button>
            ))}
          </div>
        </div>

        {/* Order Details & Stepper or Skeleton Loading State */}
        <AnimatePresence mode="wait">
          {loading ? (
            <TrackOrderSkeleton key="order-skeleton" />
          ) : order ? (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="grid gap-6 lg:grid-cols-12 items-start"
            >
              {/* Stepper Timeline & Items (Left 7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-6">
                  {/* Title & Copy ID */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-lg text-neutral-900 dark:text-white">
                          #{order.id}
                        </span>
                        <button
                          onClick={() => handleCopyId(order.id)}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                          title="Copy tracking code"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 font-worksans mt-0.5">
                        {order.customerName} · {order.branch}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E228B] text-white text-xs font-bold font-manrope shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FED65B]" />
                      <span>{normalizeStatus(order.status)}</span>
                    </span>
                  </div>

                  {/* Stepper Nodes */}
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                      Process Milestones
                    </p>
                    <div className="space-y-3">
                      {STATUS_STEPS.map((step, index) => {
                        const stepIndex = getStepIndex(order.status);
                        const isDone = index < stepIndex;
                        const isCurrent = index === stepIndex;

                        return (
                          <div key={step} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                              isDone 
                                ? 'bg-emerald-500 text-white' 
                                : isCurrent 
                                ? 'bg-[#5E228B] dark:bg-[#FED65B] text-white dark:text-[#0c0418] shadow-2xs ring-4 ring-[#5E228B]/15' 
                                : 'bg-neutral-100 dark:bg-white/[0.06] text-neutral-400'
                            }`}>
                              {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[10px] tabular-nums">{index + 1}</span>}
                            </div>
                            <span className={`text-xs font-manrope font-semibold ${
                              isCurrent ? 'text-[#5E228B] dark:text-[#FED65B] font-bold' : isDone ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'
                            }`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Items Breakdown Card */}
                {order.items && order.items.length > 0 && (
                  <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                      <Package className="w-3.5 h-3.5" />
                      <span>Garments in transit</span>
                    </div>

                    <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold text-neutral-900 dark:text-white">{item.serviceName}</span>
                            <span className="text-neutral-500 ml-2 tabular-nums">×{item.quantity}</span>
                          </div>
                          <span className="font-bold tabular-nums text-neutral-900 dark:text-white">
                            Ksh {(item.quantity * item.unitPrice).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex justify-between items-center font-manrope">
                      <span className="text-xs font-semibold text-neutral-500">Total Price</span>
                      <span className="text-base font-extrabold text-[#5E228B] dark:text-[#FED65B] tabular-nums">
                        Ksh {order.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Meta Sidebar (Right 5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Destination & Hub</span>
                  </div>
                  <div className="text-xs space-y-2 text-neutral-700 dark:text-neutral-300">
                    <div>
                      <div className="text-neutral-400 text-[11px]">Address</div>
                      <div className="font-semibold">{order.address}</div>
                    </div>
                    <div>
                      <div className="text-neutral-400 text-[11px]">Branch</div>
                      <div className="font-semibold">{order.branch}</div>
                    </div>
                    <div>
                      <div className="text-neutral-400 text-[11px]">Estimated Return</div>
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400">{order.estimatedDelivery}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Payment Verification</span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Status</span>
                      <span className="font-bold text-[#5E228B] dark:text-[#FED65B]">{order.paymentStatus}</span>
                    </div>
                    {order.mpesaRef && (
                      <div className="flex justify-between items-center pt-1 border-t border-black/[0.06] dark:border-white/[0.06]">
                        <span className="text-neutral-400">Receipt Code</span>
                        <span className="font-mono font-bold text-neutral-900 dark:text-white">{order.mpesaRef}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrackOrder;
