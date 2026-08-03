import React, { useState } from 'react';
import { 
  Truck, Calculator, Search, Shirt, MapPin, Crown, HelpCircle, 
  ArrowRight, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Zap, Clock 
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
  const [showAllMobile, setShowAllMobile] = useState(false);

  return (
    <section id="quick-hub" className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="bg-gradient-to-br from-[#3D175D] via-[#4A1772] to-[#260B3E] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-[#D8A620]/40 space-y-6 relative overflow-hidden">
        {/* Subtle Background Glows & Patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FED65B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* 1. HERO CLARITY HEADER */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/15 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FED65B] text-[#2F2F2F] text-[11px] font-black font-manrope uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#5E228B]" />
              <span>Instant Laundry Hub</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold font-manrope text-white tracking-tight leading-tight">
              Your Laundry, Sorted in <span className="text-[#FED65B]">60 Seconds</span>
            </h2>
            
            <p className="text-sm sm:text-base text-gray-200 font-worksans">
              Book pickup, get a quote, or track your order — all in one place
            </p>
          </div>

          {/* Primary Big Gold Button */}
          <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5">
            <button
              onClick={onOpenBooking}
              className="bg-[#FED65B] hover:bg-[#eec33d] text-[#2F2F2F] px-7 py-4 rounded-full font-black font-manrope text-base sm:text-lg flex items-center gap-3 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer border-2 border-white/40 group"
            >
              <Truck className="w-5 h-5 text-[#5E228B]" />
              <span>Book Collection Now</span>
              <ArrowRight className="w-5 h-5 text-[#5E228B] group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-[11px] font-bold font-manrope text-amber-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FED65B]" />
              <span>Riders active in Rongai & Ngong</span>
            </span>
          </div>
        </div>

        {/* 4. TRUST ELEMENTS BAR */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold font-manrope border border-white/15 text-gray-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FED65B]" />
            <span>Eco Sanitized Wash</span>
          </div>
          <div className="hidden sm:block text-white/30">•</div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FED65B]" />
            <span>Same Day in Rongai & Ngong</span>
          </div>
          <div className="hidden sm:block text-white/30">•</div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FED65B]" />
            <span>500+ Happy Local Customers</span>
          </div>
        </div>

        {/* 2 & 3. ACTION-DRIVEN CARDS GRID */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Card 2: Price Estimator */}
          <div
            onClick={() => onNavigateToPage('calculator')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FED65B] rounded-2xl p-4.5 transition-all duration-300 cursor-pointer flex items-center justify-between group shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-[#FED65B] border border-amber-400/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-manrope text-white group-hover:text-[#FED65B] transition-colors">
                    Price Estimator
                  </h3>
                  <span className="text-[9px] font-extrabold px-2 py-0.2 rounded-full bg-[#FED65B] text-[#2F2F2F] uppercase">
                    Live Rates
                  </span>
                </div>
                <p className="text-xs text-gray-200 font-worksans mt-0.5 leading-snug">
                  Instant Ksh cost calculator for wash & iron
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FED65B] group-hover:text-[#2F2F2F] text-white flex items-center justify-center transition-all shrink-0 ml-2">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Order Tracker */}
          <div
            onClick={() => onNavigateToPage('track')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FED65B] rounded-2xl p-4.5 transition-all duration-300 cursor-pointer flex items-center justify-between group shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-manrope text-white group-hover:text-[#FED65B] transition-colors">
                    Order Tracker
                  </h3>
                  <span className="text-[9px] font-extrabold px-2 py-0.2 rounded-full bg-emerald-400 text-[#2F2F2F] uppercase">
                    {ordersCount > 0 ? `${ordersCount} Active` : 'M-Pesa Receipts'}
                  </span>
                </div>
                <p className="text-xs text-gray-200 font-worksans mt-0.5 leading-snug">
                  Real-time live status & M-Pesa receipt tracker
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FED65B] group-hover:text-[#2F2F2F] text-white flex items-center justify-center transition-all shrink-0 ml-2">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 4: Wash & Fold, Dry Cleaning, Duvets */}
          <div
            onClick={() => onNavigateToPage('services')}
            className={`bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FED65B] rounded-2xl p-4.5 transition-all duration-300 cursor-pointer flex items-center justify-between group shadow-lg hover:-translate-y-1 ${
              !showAllMobile ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                <Shirt className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-manrope text-white group-hover:text-[#FED65B] transition-colors">
                    Wash, Dry Clean & Duvets
                  </h3>
                  <span className="text-[9px] font-extrabold px-2 py-0.2 rounded-full bg-purple-300 text-[#2F2F2F] uppercase">
                    From 150/kg
                  </span>
                </div>
                <p className="text-xs text-gray-200 font-worksans mt-0.5 leading-snug">
                  Complete rates for suits, duvets & carpets
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FED65B] group-hover:text-[#2F2F2F] text-white flex items-center justify-center transition-all shrink-0 ml-2">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 5: Rongai & Ngong Branches */}
          <div
            onClick={() => onNavigateToPage('branches')}
            className={`bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FED65B] rounded-2xl p-4.5 transition-all duration-300 cursor-pointer flex items-center justify-between group shadow-lg hover:-translate-y-1 ${
              !showAllMobile ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-manrope text-white group-hover:text-[#FED65B] transition-colors">
                    Rongai & Ngong Hubs
                  </h3>
                  <span className="text-[9px] font-extrabold px-2 py-0.2 rounded-full bg-blue-300 text-[#2F2F2F] uppercase">
                    Magadi Rd
                  </span>
                </div>
                <p className="text-xs text-gray-200 font-worksans mt-0.5 leading-snug">
                  Branch opening hours, directions & drop-off
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FED65B] group-hover:text-[#2F2F2F] text-white flex items-center justify-center transition-all shrink-0 ml-2">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 6: Save 20% with Gold Pass */}
          <div
            onClick={() => onNavigateToPage('memberships')}
            className={`bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FED65B] rounded-2xl p-4.5 transition-all duration-300 cursor-pointer flex items-center justify-between group shadow-lg hover:-translate-y-1 ${
              !showAllMobile ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 text-[#FED65B] border border-yellow-400/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-manrope text-white group-hover:text-[#FED65B] transition-colors">
                    Save 20% with Gold Pass
                  </h3>
                  <span className="text-[9px] font-extrabold px-2 py-0.2 rounded-full bg-[#FED65B] text-[#2F2F2F] uppercase">
                    VIP Monthly
                  </span>
                </div>
                <p className="text-xs text-gray-200 font-worksans mt-0.5 leading-snug">
                  Unlimited monthly laundry subscriptions
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FED65B] group-hover:text-[#2F2F2F] text-white flex items-center justify-center transition-all shrink-0 ml-2">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

        </div>

        {/* Mobile Toggle Button for Extra Cards */}
        <div className="sm:hidden text-center pt-2 relative z-10">
          <button
            onClick={() => setShowAllMobile(!showAllMobile)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold font-manrope text-xs cursor-pointer active:scale-95 transition-all"
          >
            <span>{showAllMobile ? 'Show Fewer Hub Cards' : 'View All Services, Branch Hubs & Gold Pass'}</span>
            {showAllMobile ? <ChevronUp className="w-4 h-4 text-[#FED65B]" /> : <ChevronDown className="w-4 h-4 text-[#FED65B]" />}
          </button>
        </div>

      </div>
    </section>
  );
};
