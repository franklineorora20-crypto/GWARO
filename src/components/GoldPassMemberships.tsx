import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MembershipPlan } from '../types';
import { MEMBERSHIP_PLANS } from '../data/initialData';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Star, X, CreditCard } from 'lucide-react';

interface GoldPassMembershipsProps {
  onShowToast: (title: string, message?: string) => void;
}

export const GoldPassMemberships: React.FC<GoldPassMembershipsProps> = ({ onShowToast }) => {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [phone, setPhone] = useState('07');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    if (!cleanDigits || cleanDigits.length < 10) {
      setPhoneError('Please enter a valid M-Pesa phone number (e.g. 07XXXXXXXX or 2547XXXXXXXX).');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onShowToast(
        'Gold Pass Activated!',
        `Welcome to the ${selectedPlan?.name}! M-Pesa prompt sent to ${phone}.`
      );
      setSelectedPlan(null);
    }, 1200);
  };

  return (
    <section id="memberships" className="py-20 sm:py-28 bg-[#FAFAFB] dark:bg-[#0c0418] relative transition-colors duration-200 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="text-xs font-semibold tracking-tight text-[#5E228B] dark:text-[#FED65B]">
            VIP Concierge Laundry · Priority 24h Delivery
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-manrope text-neutral-900 dark:text-white tracking-[-0.02em] [text-wrap:balance]">
            Gold Pass Monthly Memberships
          </h2>
          <p className="text-sm sm:text-base font-worksans text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Predictable monthly billing with unlimited doorstep rider collections, zero delivery surcharges, and free duvet revitalizing credits.
          </p>
        </div>

        {/* Pricing Cards Grid with Emil Kowalski Craft Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isFeatured = plan.popular;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-colors relative border ${
                  isFeatured
                    ? 'bg-[#140824] text-white border-[#5E228B] dark:border-[#FED65B]/40 shadow-xl'
                    : 'bg-white dark:bg-[#130722] text-neutral-900 dark:text-white border-black/[0.08] dark:border-white/[0.1] shadow-2xs'
                }`}
              >
                {/* Subtle top bevel */}
                <div className={`absolute top-0 left-0 right-0 h-[1px] ${
                  isFeatured ? 'bg-gradient-to-r from-transparent via-[#FED65B]/60 to-transparent' : 'bg-gradient-to-r from-transparent via-black/[0.08] dark:via-white/[0.1] to-transparent'
                }`} />

                {isFeatured && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-tight text-[#FED65B] mb-2 font-manrope">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Most Popular Household Pass</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl sm:text-2xl font-extrabold font-manrope tracking-tight ${
                      isFeatured ? 'text-white' : 'text-neutral-900 dark:text-white'
                    }`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs sm:text-sm font-worksans mt-1 leading-relaxed ${
                      isFeatured ? 'text-white/70' : 'text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className={`py-4 border-y ${isFeatured ? 'border-white/[0.1]' : 'border-black/[0.06] dark:border-white/[0.08]'}`}>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl sm:text-4xl font-extrabold font-manrope tabular-nums ${
                        isFeatured ? 'text-[#FED65B]' : 'text-[#5E228B] dark:text-[#FED65B]'
                      }`}>
                        Ksh {plan.price.toLocaleString()}
                      </span>
                      <span className={`text-xs font-worksans ${isFeatured ? 'text-white/60' : 'text-neutral-500'}`}>
                        / {plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs sm:text-sm font-worksans">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isFeatured ? 'text-[#FED65B]' : 'text-[#5E228B] dark:text-[#FED65B]'
                        }`} />
                        <span className={isFeatured ? 'text-white/85' : 'text-neutral-700 dark:text-neutral-300'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`pt-6 mt-6 border-t ${isFeatured ? 'border-white/[0.1]' : 'border-black/[0.06] dark:border-white/[0.08]'}`}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-3.5 rounded-full font-bold font-manrope text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isFeatured
                        ? 'bg-[#FED65B] hover:bg-[#ffe180] text-[#140824] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_16px_rgba(254,214,91,0.25)]'
                        : 'bg-[#5E228B] hover:bg-[#501a78] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(94,34,139,0.25)]'
                    }`}
                  >
                    <span>Subscribe to {plan.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Subscription Checkout Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-white dark:bg-[#130722] text-neutral-900 dark:text-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-black/[0.08] dark:border-white/[0.1] space-y-5 relative my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden"
            >
              <div className="flex justify-between items-start border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                <div>
                  <h3 className="text-lg font-bold font-manrope text-neutral-900 dark:text-white">
                    Activate {selectedPlan.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-worksans">Instant M-Pesa automatic prompt</p>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-1 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subscription Term</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedPlan.period}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-white pt-1">
                  <span>Monthly Charge</span>
                  <span className="text-[#5E228B] dark:text-[#FED65B] tabular-nums">Ksh {selectedPlan.price.toLocaleString()}</span>
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B] tabular-nums"
                  />
                </div>

                <AnimatePresence>
                  {phoneError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -6, height: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 28 }}
                      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2 overflow-hidden"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{phoneError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={submitting}
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#5E228B] hover:bg-[#501a78] text-white font-bold font-manrope text-xs sm:text-sm transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(94,34,139,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending STK Prompt...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-[#FED65B]" />
                      <span>Prompt Ksh {selectedPlan.price.toLocaleString()} on Phone</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
