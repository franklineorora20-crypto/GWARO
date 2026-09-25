import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, OrderItem } from '../types';
import { X, Truck, CheckCircle2, Calendar, Clock, MapPin, Phone, CreditCard, Sparkles, RefreshCw, ChevronLeft } from 'lucide-react';
import { INITIAL_SERVICES } from '../data/initialData';
import { mapDbOrderToOrder } from '../lib/orders';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { saveOrderToFirebase, isFirebaseConfigured } from '../lib/firebaseOrders';
import { ManualMpesaPayment } from './ManualMpesaPayment';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceName?: string;
  prefilledItems?: OrderItem[];
  prefilledTotal?: number;
  onOrderCreated: (newOrder: Order) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceName,
  prefilledItems,
  prefilledTotal,
  onOrderCreated
}) => {
  // Step state: 1 = Details & Location, 2 = Date & Time, 3 = M-Pesa Payment Simulation & Confirmation
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('07');
  const [branch, setBranch] = useState<'Rongai Branch' | 'Ngong Branch'>('Rongai Branch');
  const [address, setAddress] = useState('');
  const [estatePreset, setEstatePreset] = useState('Rongai - Magadi Road');
  const [formError, setFormError] = useState<string | null>(null);
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Morning (8:00 AM - 11:00 AM)');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cod'>('mpesa');
  const [mpesaNumber, setMpesaNumber] = useState('07');

  // Selected Service items
  const [selectedServiceName, setSelectedServiceName] = useState<string>(
    preselectedServiceName || INITIAL_SERVICES[0].name
  );
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (preselectedServiceName) {
      setSelectedServiceName(preselectedServiceName);
    }
  }, [preselectedServiceName]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizePhoneNumber = (value: string) => String(value).trim().replace(/[^0-9]/g, '');
  const isValidMpesaNumber = (value: string) => {
    const digits = normalizePhoneNumber(value);
    return /^07\d{8}$/.test(digits) || /^2547\d{8}$/.test(digits);
  };

  const selectedService = INITIAL_SERVICES.find(s => s.name === selectedServiceName) || INITIAL_SERVICES[0];

  // Total price calculation
  let computedItems: OrderItem[] = [];
  let calculatedTotal = 0;

  if (prefilledItems && prefilledItems.length > 0 && prefilledTotal) {
    computedItems = prefilledItems;
    calculatedTotal = prefilledTotal;
  } else {
    computedItems = [
      {
        serviceName: selectedService.name,
        quantity: quantity,
        unitPrice: selectedService.price
      }
    ];
    calculatedTotal = quantity * selectedService.price;
  }

  const commonEstates = [
    'Rongai - Magadi Road',
    'Rongai - Hill Valley Place',
    'Rongai - Rimpa Estate',
    'Rongai - Kiserian Junction',
    'Ngong - Country Arcade',
    'Ngong - Matasia',
    'Ngong - Olkeri',
    'Karen / Kuwinda',
    'Langata / Uhuru Gardens',
    'Kilimani / Lavington'
  ];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!customerName.trim()) {
      setFormError('Please enter your full name before continuing.');
      return;
    }
    if (!phone || !isValidMpesaNumber(phone)) {
      setFormError('Please enter a valid phone number (07XXXXXXXX or 2547XXXXXXXX).');
      return;
    }
    if (step === 1) {
      setMpesaNumber(phone);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const completeOrderCreation = async (payStatus: 'Paid via M-Pesa' | 'Payment Submitted' | 'Pay on Delivery', refCode?: string) => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderId = `GL-${randomDigits}`;
    const fullAddressText = `${estatePreset}, ${address || 'Near landmark'}`;

    const defaultRefCode = refCode || (payStatus === 'Paid via M-Pesa' || payStatus === 'Payment Submitted' ? `SDX${Math.floor(100000 + Math.random() * 900000)}` : undefined);

    const newOrder: Order = {
      id: orderId,
      customerName,
      email: email || undefined,
      phone,
      branch,
      address: fullAddressText,
      items: computedItems,
      totalPrice: calculatedTotal,
      status: payStatus === 'Payment Submitted' ? 'Payment Submitted' : 'Order Received',
      createdAt: 'Just now',
      estimatedDelivery: 'Within 24 Hours',
      paymentStatus: payStatus,
      mpesaRef: defaultRefCode,
      mpesaPhone: mpesaNumber || phone,
      deliveryType: 'Delivery to Door',
      specialNotes: specialNotes || 'Handle with Goldtribe standard care.',
      trackingNotes: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Pickup booked for ${pickupDate} (${timeSlot}) at ${fullAddressText}. Status: ${payStatus}.`,
          status: payStatus === 'Payment Submitted' ? 'Payment Submitted' : 'Order Received',
        },
      ],
    };

    if (isFirebaseConfigured) {
      try {
        await saveOrderToFirebase(newOrder);
      } catch (e) {
        console.warn('Firebase order save notice:', e);
      }
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("Orders")
          .insert([
            {
              tracking_id: newOrder.id,
              customerName: newOrder.customerName,
              email: newOrder.email,
              phone: newOrder.phone,
              branch: newOrder.branch,
              address: newOrder.address,
              items: newOrder.items,
              totalPrice: newOrder.totalPrice,
              status: newOrder.status,
              created_at: new Date().toISOString(),
              estimatedDelivery: newOrder.estimatedDelivery,
              paymentStatus: newOrder.paymentStatus,
              mpesaRef: newOrder.mpesaRef ?? null,
              mpesa_receipt_number: newOrder.mpesaRef ?? null,
              mpesa_phone: newOrder.mpesaPhone ?? newOrder.phone,
              deliveryType: newOrder.deliveryType,
              specialNotes: newOrder.specialNotes,
              trackingNotes: newOrder.trackingNotes,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          const formattedOrder = mapDbOrderToOrder(data as Record<string, unknown>);
          onOrderCreated(formattedOrder);
          onClose();
          return;
        }
      } catch (err: any) {
        console.warn("Supabase insert notice, falling back to local:", err);
      }
    }

    onOrderCreated(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop with smooth blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md -z-10"
      />

      {/* Modal Surface with Emil Kowalski Spring Entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-white dark:bg-[#130722] text-neutral-900 dark:text-white rounded-3xl max-w-xl w-full p-4 sm:p-7 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35)] border border-black/[0.08] dark:border-white/[0.1] space-y-5 sm:space-y-6 relative my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden"
      >
        {/* Subtle Top Inset Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FED65B]/60 to-transparent" />

        {/* Modal Header with quiet metadata */}
        <div className="flex justify-between items-start border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
          <div>
            <div className="text-[11px] font-semibold text-[#5E228B] dark:text-[#FED65B] tracking-tight flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Doorstep Pickup & Return · Rongai & Ngong</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-manrope text-neutral-900 dark:text-white tracking-tight mt-1">
              Book Concierge Collection
            </h3>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Multi-step Indicator with Emil Kowalski fluid active pill */}
        <div className="relative grid grid-cols-3 gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-white/[0.05] text-center text-xs font-manrope font-semibold">
          {[
            { stepNum: 1, label: '1. Location' },
            { stepNum: 2, label: '2. Schedule' },
            { stepNum: 3, label: '3. Payment' },
          ].map((s) => {
            const isCurrent = step === s.stepNum;
            const isDone = step > s.stepNum;
            return (
              <div
                key={s.stepNum}
                className={`relative py-1.5 px-2 rounded-lg transition-colors z-10 ${
                  isCurrent
                    ? 'text-white dark:text-[#0c0418] font-bold'
                    : isDone
                    ? 'text-[#5E228B] dark:text-[#FED65B]'
                    : 'text-neutral-500'
                }`}
              >
                {isCurrent && (
                  <motion.div
                    layoutId="activeBookingStep"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-[#5E228B] dark:bg-[#FED65B] shadow-xs -z-10"
                  />
                )}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Customer Details & Service Selection */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4 font-worksans">
            {!prefilledItems && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope">
                  Primary Garment Service
                </label>
                <select
                  value={selectedServiceName}
                  onChange={(e) => setSelectedServiceName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B]"
                >
                  <optgroup label="--- Normal Laundry ---">
                    {INITIAL_SERVICES.filter(s => s.category === 'laundry').map(s => (
                      <option key={s.id} value={s.name} className="dark:bg-[#130722]">
                        {s.name} — Ksh {s.price}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="--- Executive Dry Cleaning ---">
                    {INITIAL_SERVICES.filter(s => s.category === 'dry-cleaning').map(s => (
                      <option key={s.id} value={s.name} className="dark:bg-[#130722]">
                        {s.name} — Ksh {s.price}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="--- Duvet Clinic ---">
                    {INITIAL_SERVICES.filter(s => s.category === 'duvet-clinic').map(s => (
                      <option key={s.id} value={s.name} className="dark:bg-[#130722]">
                        {s.name} — Ksh {s.price}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Load / Quantity:</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-16 p-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] text-center font-bold text-xs tabular-nums dark:bg-white/[0.04]"
                  />
                  <span className="text-xs text-neutral-400">{selectedService.priceUnit}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Njoroge"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                  Phone (M-Pesa) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="07XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B] tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                Servicing Hub
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: 'Rongai Branch', label: 'Rongai Hub (Magadi Rd)' },
                  { name: 'Ngong Branch', label: 'Ngong Hub (Country Arcade)' }
                ].map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => setBranch(b.name as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold font-manrope transition-all cursor-pointer ${
                      branch === b.name
                        ? 'bg-[#5E228B] text-white border-transparent shadow-xs'
                        : 'bg-neutral-50 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-300 border-black/[0.08] dark:border-white/[0.08]'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                  Estate / Area
                </label>
                <select
                  value={estatePreset}
                  onChange={(e) => setEstatePreset(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B]"
                >
                  {commonEstates.map((est, i) => (
                    <option key={i} value={est} className="dark:bg-[#130722]">{est}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                  House / Gate Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hill Valley Court, Hse B4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B]"
                />
              </div>
            </div>

            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2 overflow-hidden"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>{formError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#5E228B] hover:bg-[#501a78] text-white font-bold font-manrope text-sm transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(94,34,139,0.3)] mt-2"
            >
              Continue to Schedule Window
            </motion.button>
          </form>
        )}

        {/* Step 2: Pickup Schedule & Instructions */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-4 font-worksans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                  Pickup Date
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                  Rider Window
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B]"
                >
                  <option value="Morning (8:00 AM - 11:00 AM)" className="dark:bg-[#130722]">Morning (8:00 AM - 11:00 AM)</option>
                  <option value="Afternoon (1:00 PM - 4:00 PM)" className="dark:bg-[#130722]">Afternoon (1:00 PM - 4:00 PM)</option>
                  <option value="Evening (5:00 PM - 8:00 PM)" className="dark:bg-[#130722]">Evening (5:00 PM - 8:00 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                Special Garment Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Crisp collar starch, delicate buttons on blazer..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B]"
              />
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-2 text-xs">
              <div className="flex justify-between items-center text-neutral-500">
                <span>Total Items</span>
                <span>{computedItems.length} service item(s)</span>
              </div>
              <div className="flex justify-between items-center font-bold text-sm text-neutral-900 dark:text-white pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <span>Estimated Due</span>
                <span className="text-[#5E228B] dark:text-[#FED65B] tabular-nums font-manrope font-extrabold text-base">
                  Ksh {calculatedTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.05] cursor-pointer"
              >
                Back
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 py-3 rounded-full bg-[#5E228B] hover:bg-[#501a78] text-white font-bold font-manrope text-xs sm:text-sm cursor-pointer shadow-xs"
              >
                Continue to Payment
              </motion.button>
            </div>
          </form>
        )}

        {/* Step 3: Payment Method & Submit */}
        {step === 3 && (
          <div className="space-y-4 font-worksans">
            <div className="flex items-center justify-between p-1.5 rounded-xl bg-neutral-100 dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 font-manrope px-2">Payment Method:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-manrope transition-all cursor-pointer ${
                    paymentMethod === 'mpesa'
                      ? 'bg-[#5E228B] text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  M-PESA Paybill
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-manrope transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-[#5E228B] text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  Pay on Delivery
                </button>
              </div>
            </div>

            {paymentMethod === 'mpesa' ? (
              <ManualMpesaPayment
                amount={calculatedTotal}
                customerName={customerName}
                phone={phone}
                onPaymentSubmitted={(record) => {
                  completeOrderCreation('Payment Submitted', record.mpesa_code);
                }}
              />
            ) : (
              <div className="p-5 bg-neutral-50 dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] space-y-4 text-center">
                <div className="text-sm font-bold text-neutral-900 dark:text-white font-manrope">
                  Doorstep Payment Option
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Pay the Goldtribe rider directly via Cash or M-Pesa Till upon delivery. Amount due: <strong className="text-[#5E228B] dark:text-[#FED65B] tabular-nums">Ksh {calculatedTotal.toLocaleString()}</strong>
                </p>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-4 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.05] cursor-pointer"
                  >
                    Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => completeOrderCreation('Pay on Delivery')}
                    className="flex-1 py-3 rounded-full bg-[#5E228B] hover:bg-[#501a78] text-white font-bold font-manrope text-xs sm:text-sm cursor-pointer shadow-xs"
                  >
                    Confirm Booking
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
