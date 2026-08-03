import React, { useState } from 'react';
import { MembershipPlan } from '../types';
import { MEMBERSHIP_PLANS } from '../data/initialData';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Star, X, CreditCard } from 'lucide-react';

interface GoldPassMembershipsProps {
  onShowToast: (title: string, message?: string) => void;
}

export const GoldPassMemberships: React.FC<GoldPassMembershipsProps> = ({ onShowToast }) => {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [phone, setPhone] = useState('07');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      alert('Please enter a valid M-Pesa phone number.');
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
    }, 1500);
  };

  return (
    <section id="memberships" className="py-16 sm:py-24 bg-[#fcf9f8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fed65b] text-[#745c00] font-extrabold text-xs uppercase tracking-wider font-manrope shadow-sm">
            <Star className="w-4 h-4 text-[#341168] fill-[#341168]" />
            <span>VIP Concierge Laundry</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-manrope text-[#341168]">
            Gold Pass Monthly Memberships
          </h2>
          <p className="text-sm sm:text-base font-worksans text-[#4a4550]">
            Save up to 30% monthly with unlimited doorstep pickups, priority 12-24hr turnaround, and free duvet washing vouchers.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative border ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#341168] text-[#fed65b] text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider font-manrope shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#fed65b]" />
                  <span>Most Popular in Rongai & Ngong</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold font-manrope text-[#341168]">
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-worksans text-[#4a4550] mt-1">
                    {plan.description}
                  </p>
                </div>

                <div className="py-2 border-y border-[#e5e2e1]">
                  <span className="text-3xl sm:text-4xl font-extrabold font-manrope text-[#341168]">
                    Ksh {plan.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#7b7581] font-worksans ml-1">/ {plan.period}</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm font-worksans text-[#1c1b1b]">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[#e5e2e1]/60">
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-3.5 rounded-full font-extrabold font-manrope text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-[#341168] text-[#fed65b] hover:bg-[#4b2c7f] shadow-lg hover:shadow-xl'
                      : 'bg-[#fed65b] text-[#341168] hover:bg-[#ffe088]'
                  }`}
                >
                  <span>Subscribe to {plan.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1c1b1b] rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-[#e5e2e1] font-worksans animate-bounce-in">
            <div className="flex justify-between items-start border-b border-[#e5e2e1] pb-4">
              <div>
                <span className="text-xs font-bold text-[#735c00] font-manrope uppercase">Gold Pass VIP Signup</span>
                <h3 className="text-xl font-extrabold font-manrope text-[#341168] mt-0.5">
                  {selectedPlan.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-1.5 text-[#7b7581] hover:text-[#1c1b1b] rounded-full hover:bg-[#f6f3f2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#f6f3f2] p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs font-bold font-manrope text-[#341168]">
                <span>Monthly Plan Rate</span>
                <span className="text-[#735c00]">Ksh {selectedPlan.price.toLocaleString()} / month</span>
              </div>
              <p className="text-[11px] text-[#4a4550]">
                Includes free weekly doorstep pickups across Rongai, Ngong, Matasia, Karen, and Langata.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#341168] block font-manrope mb-1">
                  M-Pesa Phone Number for Auto-Billing
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712345678"
                  className="w-full p-3 rounded-2xl border border-[#e5e2e1] bg-[#f6f3f2] text-sm font-bold focus:ring-2 focus:ring-[#341168]"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Instant M-Pesa STK Push prompt will be sent upon clicking Activate.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-[#341168] text-[#fed65b] font-extrabold font-manrope text-sm hover:bg-[#4b2c7f] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                {submitting ? 'Processing M-Pesa...' : `Activate Gold Pass (Ksh ${selectedPlan.price.toLocaleString()})`}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
