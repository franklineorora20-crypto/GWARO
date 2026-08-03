import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Home, LucideIcon, Sparkles } from 'lucide-react';
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
  badge = 'Goldtribe Link Page',
  onBackToHome,
  onOpenBooking,
  activePage,
  onSelectPage,
}) => {
  return (
    <div className="bg-[#341168] text-white pt-24 sm:pt-28 pb-12 px-4 sm:px-6 relative overflow-hidden shadow-lg">
      {/* Background Subtle Accents */}
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#fed65b]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-manrope">
          <div className="flex items-center gap-2 text-white/70">
            <button
              onClick={onBackToHome}
              className="hover:text-[#fed65b] transition-colors flex items-center gap-1 font-bold cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-[#fed65b] font-bold capitalize">{activePage} Page</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-manrope flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home Overview</span>
            </button>
          </div>
        </div>

        {/* Title & Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fed65b] text-[#745c00] text-xs font-extrabold font-manrope">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-manrope tracking-tight text-white flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-white/10 text-[#fed65b] inline-flex items-center justify-center">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </span>
              <span>{title}</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 font-worksans leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Quick Page Navigator Tabs on Banner */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 space-y-2 shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#fed65b] tracking-wider block font-manrope">
              Quick Switch Page
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs font-manrope font-bold">
              {[
                { id: 'services', label: 'Services' },
                { id: 'calculator', label: 'Estimator' },
                { id: 'track', label: 'Order Tracker' },
                { id: 'memberships', label: 'VIP Pass' },
                { id: 'branches', label: 'Branches' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onSelectPage(tab.id as PageType)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    activePage === tab.id
                      ? 'bg-[#fed65b] text-[#341168]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
