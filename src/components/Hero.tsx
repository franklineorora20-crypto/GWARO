import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Clock, CheckCircle2, Calculator, Zap } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onNavigateToTrack: () => void;
  onNavigateToCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onNavigateToTrack,
  onNavigateToCalculator
}) => {
  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center overflow-hidden bg-white dark:bg-[#0f0717] pt-8 pb-12 sm:pb-16 transition-colors duration-200">
      {/* Background Patterns */}
      <div className="absolute inset-0 hero-pattern pointer-events-none opacity-50 dark:opacity-10"></div>
      <div className="absolute top-20 -right-20 w-96 h-96 bg-[#5E228B]/10 dark:bg-[#FED65B]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-[#FED65B]/20 dark:bg-[#5E228B]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Text Left Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FED65B]/20 dark:bg-[#FED65B]/10 border border-[#D8A620] text-[#5E228B] dark:text-[#FED65B] font-bold text-xs sm:text-sm font-manrope shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#D8A620]" />
            <span>Premium Concierge Laundry & Dry Cleaning</span>
          </div>

          {/* Display Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-manrope text-[#2B1B40] dark:text-white leading-[1.12] tracking-tight">
            Pristine Garment Care <br />
            <span className="text-[#5E228B] dark:text-[#FED65B] bg-gradient-to-r from-[#5E228B] via-[#7B33B3] to-[#D8A620] dark:from-[#FED65B] dark:to-[#FFF0B3] bg-clip-text text-transparent drop-shadow-xs">
              For Every Fiber.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg font-worksans text-[#2B2B2B] dark:text-gray-200 max-w-2xl leading-relaxed">
            Goldtribe Link Laundromat delivers professional, high-end garment care for busy professionals and families in <span className="font-bold text-[#5E228B] dark:text-[#FED65B]">Rongai</span> and <span className="font-bold text-[#5E228B] dark:text-[#FED65B]">Ngong</span>. We don't just wash; we revitalize.
          </p>

          {/* Quick Features List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-manrope font-bold text-[#222222] dark:text-white pt-1">
            <div className="flex items-center gap-2 bg-white/90 dark:bg-[#1a0c2a] p-2.5 rounded-xl border border-[#E5E2E1] dark:border-white/10 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#D8A620]" />
              <span>Doorstep Pickup</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 dark:bg-[#1a0c2a] p-2.5 rounded-xl border border-[#E5E2E1] dark:border-white/10 shadow-2xs">
              <Clock className="w-4 h-4 text-[#5E228B] dark:text-[#FED65B]" />
              <span>Same Day Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 dark:bg-[#1a0c2a] p-2.5 rounded-xl border border-[#E5E2E1] dark:border-white/10 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#D8A620]" />
              <span>Eco Sanitized Wash</span>
            </div>
          </div>

          {/* Streamlined Call-to-action Section */}
          <div className="space-y-3 pt-2">
            {/* Primary Big Purple Button */}
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto bg-[#5E228B] text-white px-8 py-4 sm:py-4.5 rounded-full font-black font-manrope text-base sm:text-lg hover:bg-[#4A1772] transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:shadow-purple-900/30 active:scale-98 group cursor-pointer border-2 border-[#FED65B]"
            >
              <Truck className="w-6 h-6 text-[#FED65B]" />
              <span>Book a Collection</span>
              <ArrowRight className="w-5 h-5 text-[#FED65B] group-hover:translate-x-1.5 transition-transform" />
            </button>

            {/* Secondary Text Links below CTA */}
            <div className="flex items-center gap-3 text-xs sm:text-sm font-bold font-manrope text-[#222222] dark:text-gray-200 pt-1">
              <button
                onClick={onNavigateToTrack}
                className="hover:text-[#5E228B] dark:hover:text-[#FED65B] underline decoration-2 decoration-[#5E228B]/40 dark:decoration-[#FED65B]/40 hover:decoration-[#5E228B] cursor-pointer transition-colors"
              >
                Track Order
              </button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button
                onClick={onNavigateToCalculator}
                className="hover:text-[#5E228B] dark:hover:text-[#FED65B] underline decoration-2 decoration-[#5E228B]/40 dark:decoration-[#FED65B]/40 hover:decoration-[#5E228B] cursor-pointer transition-colors flex items-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5 text-[#D8A620]" />
                <span>Get Instant Quote</span>
              </button>
            </div>

            {/* Urgency Pickup Slot Bar */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold font-manrope shadow-2xs">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500 animate-pulse" />
              <span>Next pickup slot: <strong className="text-[#5E228B] dark:text-[#FED65B]">Today 4:00 PM – 6:00 PM</strong> in Rongai & Ngong</span>
            </div>
          </div>

          {/* Social Proof Stat Line */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#E5E2E1] dark:border-white/10">
            <div className="flex -space-x-3">
              <div className="w-9 h-9 rounded-full border-2 border-white dark:border-[#1a0c2a] bg-[#5E228B] text-white font-bold text-xs flex items-center justify-center">
                RN
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white dark:border-[#1a0c2a] bg-[#D8A620] text-[#2F2F2F] font-bold text-xs flex items-center justify-center">
                NG
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white dark:border-[#1a0c2a] bg-[#5E228B] text-white font-bold text-xs flex items-center justify-center">
                4.8★
              </div>
            </div>
            <p className="text-xs sm:text-sm font-worksans text-[#2D2D2D] dark:text-gray-300 font-medium">
              <span className="text-[#5E228B] dark:text-[#FED65B] font-extrabold font-manrope text-base">500+</span> local families served weekly • <span className="font-bold text-[#5E228B] dark:text-[#FED65B]">4.8★ Google Rating</span>
            </p>
          </div>
        </div>

        {/* Hero Visual (Bento Grid) - Benefit Driven Visuals */}
        <div className="lg:col-span-5 grid grid-cols-2 grid-rows-2 gap-3.5 h-[440px] sm:h-[500px]">
          {/* Card 1: Crisp folded executive shirts */}
          <div className="col-span-1 row-span-2 rounded-3xl overflow-hidden relative shadow-xl border border-white/40 dark:border-white/10 group">
            <img 
              src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80" 
              alt="Crisp freshly ironed and folded clothes" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#391258]/90 via-[#391258]/30 to-transparent flex flex-col justify-end p-5">
              <span className="bg-[#FED65B] text-[#2F2F2F] font-black text-[10px] px-2.5 py-1 rounded-full w-fit uppercase tracking-wider shadow-xs">
                Wrinkle-Free Guarantee
              </span>
              <p className="text-white font-manrope font-bold text-sm sm:text-base mt-1.5 leading-snug">
                Pristine Folding & Executive Steam Pressing
              </p>
            </div>
          </div>

          {/* Card 2: Doorstep Boda/Rider Pickup */}
          <div className="col-span-1 row-span-1 rounded-3xl bg-gradient-to-br from-[#5E228B] to-[#4A1772] p-4 sm:p-5 flex flex-col justify-between shadow-lg text-white relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-[#FED65B] text-[#5E228B] flex items-center justify-center font-black">
                <Truck className="w-5 h-5 text-[#5E228B]" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-[#FED65B] px-2 py-0.5 rounded-full">
                Doorstep Pickup
              </span>
            </div>
            <div>
              <p className="font-manrope font-black text-base sm:text-lg leading-tight text-white">
                Rongai & Ngong Rider Concierge
              </p>
              <p className="text-[11px] font-worksans text-white/80 mt-1">
                We pick up right from your gate or office doorstep
              </p>
            </div>
          </div>

          {/* Card 3: Same Day Express Guarantee */}
          <div className="col-span-1 row-span-1 rounded-3xl bg-[#D8A620] p-4 sm:p-5 flex flex-col justify-between shadow-lg text-[#2F2F2F] hover:bg-[#E5B22A] transition-colors relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-[#5E228B] text-white flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FED65B]" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#5E228B]/15 text-[#5E228B] px-2 py-0.5 rounded-full">
                Express
              </span>
            </div>
            <div>
              <p className="font-manrope font-black text-base sm:text-lg leading-tight text-[#2F2F2F]">
                24hr Express <br />Turnaround
              </p>
              <p className="text-[11px] font-worksans text-[#2F2F2F]/90 font-medium mt-1">
                Pickup morning, returned fresh same evening
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
