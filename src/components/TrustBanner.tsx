import React from 'react';
import { Users, Star, Clock } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  return (
    <section className="bg-white dark:bg-[#110521] text-neutral-900 dark:text-white py-8 border-y border-black/[0.06] dark:border-white/[0.08] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-black/[0.06] dark:divide-white/[0.08]">
          {/* Trust Stat 1 */}
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4 first:pt-0">
            <div className="w-12 h-12 rounded-2xl bg-[#5E228B]/[0.08] dark:bg-white/[0.08] text-[#5E228B] dark:text-[#FED65B] flex items-center justify-center shrink-0 border border-black/[0.06] dark:border-white/[0.08]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold font-manrope text-2xl text-neutral-900 dark:text-white tracking-tight tabular-nums">
                  500+
                </span>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  Rongai & Ngong
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold font-manrope text-neutral-900 dark:text-white leading-tight">
                Households Served Weekly
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-worksans mt-0.5">
                Reliable door-to-door concierge turnaround
              </p>
            </div>
          </div>

          {/* Trust Stat 2 */}
          <div className="flex items-center gap-4 pt-6 md:pt-0 md:px-8">
            <div className="w-12 h-12 rounded-2xl bg-[#FED65B]/20 text-[#D8A620] flex items-center justify-center shrink-0 border border-[#FED65B]/30">
              <Star className="w-6 h-6 fill-[#D8A620]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold font-manrope text-2xl text-neutral-900 dark:text-white tracking-tight tabular-nums">
                  4.8★
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Verified Local
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold font-manrope text-neutral-900 dark:text-white leading-tight">
                Highest Rated Laundromat
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-worksans mt-0.5">
                Over 180+ verified Google customer reviews
              </p>
            </div>
          </div>

          {/* Trust Stat 3 */}
          <div className="flex items-center gap-4 pt-6 md:pt-0 md:px-8">
            <div className="w-12 h-12 rounded-2xl bg-[#5E228B]/[0.08] dark:bg-white/[0.08] text-[#5E228B] dark:text-[#FED65B] flex items-center justify-center shrink-0 border border-black/[0.06] dark:border-white/[0.08]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold font-manrope text-2xl text-neutral-900 dark:text-white tracking-tight tabular-nums">
                  24h
                </span>
                <span className="text-xs font-semibold text-[#5E228B] dark:text-[#FED65B]">
                  Guaranteed
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold font-manrope text-neutral-900 dark:text-white leading-tight">
                Doorstep Return Guarantee
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-worksans mt-0.5">
                Same-day express or standard 24-hour return
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
