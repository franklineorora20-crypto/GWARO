import React from 'react';
import { motion } from 'motion/react';
import { 
  Truck, Calculator, Search, Shirt, MapPin, Crown, 
  ArrowRight, Sparkles, CheckCircle2, Clock 
} from 'lucide-react';
import { PageType } from '../types';

interface QuickHubProps {
  ordersCount: number;
  onOpenBooking: () => void;
  onNavigateToPage: (page: PageType) => void;
}

export const QuickHub: React.FC<QuickHubProps> = ({
  ordersCount,
  onOpenBooking,
  onNavigateToPage,
}) => {
  return (
    <section id="quick-hub" className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-8 text-neutral-900 dark:text-white border border-black/[0.08] dark:border-white/[0.1] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6 relative overflow-hidden transition-colors duration-200">
        {/* Subtle Ambient Micro-Light */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5E228B]/[0.04] dark:bg-[#FED65B]/[0.04] rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="text-xs font-semibold tracking-tight text-[#5E228B] dark:text-[#FED65B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Speed & Precision Hub</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold font-manrope text-neutral-900 dark:text-white tracking-tight leading-tight">
              Concierge Laundry, Sorted in Moments
            </h2>
            
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-worksans">
              Instant pricing, live status tracking, and door-to-door booking for busy Nairobi south-west residents.
            </p>
          </div>

          {/* Primary Action Button with Micro-Bevel */}
          <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onOpenBooking}
              className="bg-[#5E228B] hover:bg-[#501a78] text-white px-6 py-3.5 rounded-full font-bold font-manrope text-sm flex items-center gap-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_16px_rgba(94,34,139,0.3)] transition-all cursor-pointer group"
            >
              <Truck className="w-4 h-4 text-[#FED65B]" />
              <span>Book Collection Now</span>
              <ArrowRight className="w-4 h-4 text-[#FED65B] group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#E2B227]" />
              <span>Active courier dispatch today</span>
            </span>
          </div>
        </div>

        {/* Action-Driven Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Price Estimator */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigateToPage('calculator')}
            className="p-4.5 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] hover:border-[#5E228B]/30 dark:hover:border-[#FED65B]/30 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#5E228B]/[0.08] dark:bg-white/[0.08] text-[#5E228B] dark:text-[#FED65B] flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#5E228B] dark:group-hover:text-[#FED65B] group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-manrope text-neutral-900 dark:text-white">
                Price Estimator
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-worksans mt-0.5">
                Instant Ksh calculator for wash & fold, suits, and duvets
              </p>
            </div>
          </motion.div>

          {/* Card 2: Order Tracker */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigateToPage('track')}
            className="p-4.5 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] hover:border-[#5E228B]/30 dark:hover:border-[#FED65B]/30 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              {ordersCount > 0 && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {ordersCount} active
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-manrope text-neutral-900 dark:text-white">
                Order Tracker
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-worksans mt-0.5">
                Real-time transit updates & M-Pesa receipt verification
              </p>
            </div>
          </motion.div>

          {/* Card 3: Branches */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigateToPage('branches')}
            className="p-4.5 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] hover:border-[#5E228B]/30 dark:hover:border-[#FED65B]/30 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-manrope text-neutral-900 dark:text-white">
                Rongai & Ngong Hubs
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-worksans mt-0.5">
                Operating hours, directions & customer drop-off points
              </p>
            </div>
          </motion.div>

          {/* Card 4: VIP Gold Pass */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigateToPage('memberships')}
            className="p-4.5 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] hover:border-[#5E228B]/30 dark:hover:border-[#FED65B]/30 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#FED65B]/20 text-[#D8A620] flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D8A620] group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-manrope text-neutral-900 dark:text-white">
                VIP Gold Pass
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-worksans mt-0.5">
                Save 20% with unlimited monthly household laundry plans
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
