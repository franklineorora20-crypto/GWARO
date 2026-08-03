import React from 'react';
import { Users, Star, Clock, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-[#5E228B] via-[#4A1772] to-[#391258] text-white py-6 border-y border-[#D8A620]/30 shadow-md relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-10 w-64 h-64 bg-[#FED65B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/15">
          {/* Trust Stat 1 */}
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4 first:pt-0">
            <div className="w-14 h-14 rounded-2xl bg-[#FED65B] text-[#5E228B] flex items-center justify-center shrink-0 shadow-lg font-black text-xl">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold font-manrope text-xl sm:text-2xl text-[#FED65B] tracking-tight">
                  500+
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-md">
                  Rongai & Ngong
                </span>
              </div>
              <p className="text-sm font-bold font-manrope text-white leading-tight">
                Local Families Served
              </p>
              <p className="text-xs text-white/80 font-worksans mt-0.5">
                Weekly door-to-door concierge laundry care
              </p>
            </div>
          </div>

          {/* Trust Stat 2 */}
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FED65B] text-[#5E228B] flex items-center justify-center shrink-0 shadow-lg font-black text-xl">
              <Star className="w-7 h-7 fill-[#5E228B]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold font-manrope text-xl sm:text-2xl text-[#FED65B] tracking-tight">
                  4.8★
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-md">
                  Google Verified
                </span>
              </div>
              <p className="text-sm font-bold font-manrope text-white leading-tight">
                Google Customer Rating
              </p>
              <p className="text-xs text-white/80 font-worksans mt-0.5">
                Over 180+ 5-star customer reviews
              </p>
            </div>
          </div>

          {/* Trust Stat 3 */}
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FED65B] text-[#5E228B] flex items-center justify-center shrink-0 shadow-lg font-black text-xl">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold font-manrope text-xl sm:text-2xl text-[#FED65B] tracking-tight">
                  24hr
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#FED65B] text-[#5E228B] px-2 py-0.5 rounded-md font-bold">
                  Express
                </span>
              </div>
              <p className="text-sm font-bold font-manrope text-white leading-tight">
                Express Turnaround
              </p>
              <p className="text-xs text-white/80 font-worksans mt-0.5">
                Same-day & 24hr doorstep pickup & return
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
