import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Clock, CheckCircle2, Calculator, Zap, ChevronRight } from 'lucide-react';
import heroImage from '../assets/images/hero_laundry_pristine_1790275438376.jpg';

interface HeroProps {
  onOpenBooking: (preselectedItem?: string) => void;
  onNavigateToTrack: () => void;
  onNavigateToCalculator: () => void;
}

const QUICK_ESTIMATES = [
  { id: 'wash', name: 'Wash & Fold (1-7kg)', price: 450, unit: 'load', time: '24h return' },
  { id: 'suit', name: 'Executive 2-Pc Suit', price: 450, unit: 'suit', time: '48h finish' },
  { id: 'duvet', name: 'Duvet Sanitization', price: 850, unit: 'piece', time: '24h fluff' },
];

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onNavigateToTrack,
  onNavigateToCalculator
}) => {
  const [selectedQuick, setSelectedQuick] = useState(QUICK_ESTIMATES[0]);

  return (
    <section id="hero" className="relative min-h-[88vh] flex items-center overflow-hidden bg-[#FAFAFB] dark:bg-[#0c0418] pt-10 pb-16 sm:pb-20 transition-colors duration-200">
      {/* Background Micro Ambient Glow */}
      <div className="absolute inset-0 hero-pattern pointer-events-none"></div>
      <div className="absolute top-12 right-1/4 w-[420px] h-[420px] bg-[#5E228B]/[0.07] dark:bg-[#FED65B]/[0.05] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-[#FED65B]/[0.08] dark:bg-[#5E228B]/[0.08] rounded-full blur-[90px] pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Editorial Headline & High-Intent Action */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Unboxed Metadata Kicker (Anti-slop Zero-Pill) */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-tight text-[#5E228B] dark:text-[#FED65B]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Concierge Garment Care</span>
            </span>
            <span className="text-neutral-300 dark:text-neutral-600 font-normal">·</span>
            <span>Rongai & Ngong Hubs</span>
            <span className="text-neutral-300 dark:text-neutral-600 font-normal">·</span>
            <span>24h Turnaround</span>
          </div>

          {/* Typographic Display Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-manrope text-neutral-900 dark:text-white leading-[1.1] sm:leading-[1.08] tracking-[-0.03em] [text-wrap:balance] break-words">
            Pristine Garment Care, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#5E228B] via-[#7B33B3] to-[#D8A620] dark:from-[#FED65B] dark:via-[#F6E08A] dark:to-[#FFF] bg-clip-text text-transparent">
              Engineered with Obsession.
            </span>
          </h1>

          {/* Prose Description */}
          <p className="text-sm sm:text-base lg:text-lg font-worksans text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
            From executive suits to hypoallergenic duvet revival, Goldtribe delivers high-end garment stewardship right to your doorstep in Rongai and Ngong.
          </p>

          {/* Emil Kowalski Style Interactive Quick Estimate Widget */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#140824] border border-black/[0.08] dark:border-white/[0.1] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3 max-w-xl">
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Instant Estimate Selector</span>
              <span>No surprise fees</span>
            </div>

            {/* Segmented Quick Switcher */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-white/[0.05]">
              {QUICK_ESTIMATES.map((item) => {
                const isSelected = selectedQuick.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedQuick(item)}
                    className={`relative py-1.5 px-1.5 sm:px-2 rounded-lg text-[11px] sm:text-xs font-semibold font-manrope transition-colors cursor-pointer text-center truncate ${
                      isSelected
                        ? 'text-neutral-900 dark:text-white'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeEstimatePill"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                        className="absolute inset-0 rounded-lg bg-white dark:bg-[#23123d] shadow-[0_1px_3px_rgba(0,0,0,0.08)] -z-10"
                      />
                    )}
                    <span className="truncate">{item.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Counter & Pre-Book Trigger */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="space-y-0.5 min-w-0 pr-2">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-lg sm:text-2xl font-extrabold font-manrope text-[#5E228B] dark:text-[#FED65B] tabular-nums">
                    Ksh {selectedQuick.price.toLocaleString()}
                  </span>
                  <span className="text-neutral-500 text-[11px]">/ {selectedQuick.unit}</span>
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
                  {selectedQuick.name} · {selectedQuick.time}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenBooking(selectedQuick.name)}
                className="px-3 sm:px-3.5 py-2 rounded-xl bg-[#5E228B] hover:bg-[#501a78] text-white font-bold text-xs font-manrope shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_6px_rgba(94,34,139,0.25)] flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <span>Book This</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FED65B]" />
              </motion.button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto bg-[#5E228B] hover:bg-[#4E1775] text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold font-manrope text-xs sm:text-sm transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_4px_16px_rgba(94,34,139,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_24px_rgba(94,34,139,0.4)] flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Truck className="w-4 h-4 text-[#FED65B]" />
              <span>Schedule Free Doorstep Pickup</span>
              <ArrowRight className="w-4 h-4 text-[#FED65B] group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onNavigateToCalculator}
              className="w-full sm:w-auto px-5 py-3 sm:py-3.5 rounded-full border border-black/[0.1] dark:border-white/[0.12] bg-white dark:bg-white/[0.04] hover:bg-neutral-50 dark:hover:bg-white/[0.08] text-neutral-800 dark:text-neutral-100 font-bold font-manrope text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Calculator className="w-4 h-4 text-[#E2B227]" />
              <span>Full Price Calculator</span>
            </motion.button>
          </div>

          {/* Social Proof Line */}
          <div className="flex items-center gap-3 pt-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            <div className="flex -space-x-2">
              <span className="w-7 h-7 rounded-full bg-[#5E228B] text-white font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-[#0c0418]">
                RN
              </span>
              <span className="w-7 h-7 rounded-full bg-[#E2B227] text-neutral-900 font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-[#0c0418]">
                NG
              </span>
              <span className="w-7 h-7 rounded-full bg-neutral-900 dark:bg-neutral-800 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-[#0c0418]">
                ★
              </span>
            </div>
            <span>
              Trusted by <strong className="text-neutral-900 dark:text-white font-bold">500+ households</strong> across Rongai & Ngong weekly
            </span>
          </div>
        </div>

        {/* Right Column: Hero Visual Asset with Emil Kowalski Craft Framing */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden border border-black/[0.08] dark:border-white/[0.1] shadow-[0_20px_48px_-12px_rgba(0,0,0,0.18)] bg-neutral-100 dark:bg-white/[0.04] aspect-[4/3] group">
            <img 
              src={heroImage} 
              alt="Pristine folded linen and executive garment care by Goldtribe" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Gradient Contrast Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6" />

            {/* Overlay Info Card */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-[#120722]/90 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs font-bold font-manrope text-neutral-900 dark:text-white truncate">
                  Executive Steam Finish
                </div>
                <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-300 font-medium truncate">
                  Zero shrinkage · Fiber-nourishing eco solvent
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#5E228B] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#FED65B]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
