import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Home, LucideIcon } from 'lucide-react';
import { PageType } from '../types';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: string;
  onBackToHome: () => void;
  onOpenBooking?: () => void;
  activePage: PageType;
  onSelectPage: (page: PageType) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  badge = 'Goldtribe Concierge',
  onBackToHome,
  activePage,
  onSelectPage,
}) => {
  return (
    <div className="bg-[#120524] text-white pt-24 sm:pt-28 pb-10 px-4 sm:px-6 relative overflow-hidden border-b border-white/[0.08]">
      {/* Background Subtle Accents */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-[#5E228B]/[0.15] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/4 -bottom-10 w-96 h-96 bg-[#FED65B]/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Unboxed Breadcrumb Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-manrope">
          <div className="flex items-center gap-2 text-white/60">
            <button
              onClick={onBackToHome}
              className="hover:text-white transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span className="text-white/30">/</span>
            <span className="text-[#FED65B] font-semibold capitalize">{activePage}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onBackToHome}
            className="px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white/90 text-xs font-semibold font-manrope flex items-center gap-1.5 transition-colors cursor-pointer border border-white/[0.08]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </motion.button>
        </div>

        {/* Title & Page Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold tracking-tight text-[#FED65B]">
              {badge} · Rongai & Ngong
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-manrope tracking-[-0.02em] text-white flex items-center gap-2.5 sm:gap-3 break-words">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.08] text-[#FED65B] inline-flex items-center justify-center shrink-0 border border-white/[0.1]">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <span>{title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/70 font-worksans leading-relaxed max-w-xl">
              {subtitle}
            </p>
          </div>

          {/* Quick Page Switcher with sliding spring indicator */}
          <div className="p-1 rounded-2xl sm:rounded-full bg-white/[0.05] border border-white/[0.08] flex overflow-x-auto no-scrollbar max-w-full sm:flex-wrap gap-1 text-xs font-manrope shrink-0">
            {[
              { id: 'services', label: 'Services' },
              { id: 'calculator', label: 'Estimator' },
              { id: 'track', label: 'Track' },
              { id: 'memberships', label: 'VIP Pass' },
              { id: 'branches', label: 'Branches' },
            ].map((tab) => {
              const isActive = activePage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectPage(tab.id as PageType)}
                  className={`relative px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 z-10 ${
                    isActive ? 'text-[#0c0418] font-bold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="headerPagePill"
                      transition={{ type: "spring", stiffness: 440, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-[#FED65B] shadow-2xs -z-10"
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
