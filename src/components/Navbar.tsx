import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, Truck, Menu, X, Sparkles, MapPin, 
  ChevronDown, LayoutDashboard, Home, Shirt, Calculator, 
  Search, Crown, ArrowRight, Clock, Layers, HelpCircle,
  Sun, Moon, Command
} from 'lucide-react';
import logo from '../assets/images/goldtribe-logo.svg';
import { Order, PageType } from '../types';
import { useDarkMode } from '../lib/useDarkMode';

interface NavbarProps {
  onOpenBooking: (preselectedItem?: string) => void;
  onNavigateToSection: (sectionId: string) => void;
  activeOrdersCount: number;
  orders?: Order[];
  onSelectOrderToTrack?: (orderId: string) => void;
  activePage?: PageType;
  onSelectPage?: (page: PageType) => void;
  onOpenQuickHub?: () => void;
}

const NAV_ITEMS: { page: PageType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { page: 'home', label: 'Home', icon: Home },
  { page: 'services', label: 'Services', icon: Shirt },
  { page: 'calculator', label: 'Calculator', icon: Calculator },
  { page: 'track', label: 'Track', icon: Search },
  { page: 'branches', label: 'Branches', icon: MapPin },
  { page: 'memberships', label: 'VIP Pass', icon: Crown },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onNavigateToSection,
  activeOrdersCount,
  orders,
  onSelectOrderToTrack,
  activePage = 'home',
  onSelectPage,
  onOpenQuickHub
}) => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phoneDropdown, setPhoneDropdown] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (phoneRef.current && !phoneRef.current.contains(event.target as Node)) {
        setPhoneDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (pageOrId: string) => {
    const pageMap: Record<string, PageType> = {
      hero: 'home',
      home: 'home',
      services: 'services',
      calculator: 'calculator',
      track: 'track',
      memberships: 'memberships',
      locations: 'branches',
      branches: 'branches',
      faq: 'faq',
      all: 'all',
    };

    const targetPage = pageMap[pageOrId] || 'home';

    if (onSelectPage) {
      onSelectPage(targetPage);
    } else {
      onNavigateToSection(pageOrId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#0c0418]/85 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
        {/* Zone 1: Single text/logo element Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            title="Goldtribe Link Laundromat"
          >
            <img 
              src={logo}
              alt="Goldtribe Link"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className="block font-manrope font-extrabold text-sm tracking-tight text-[#1c1b1b] dark:text-white leading-tight">
                Goldtribe Link
              </span>
              <span className="block text-[11px] font-medium text-[#5E228B] dark:text-[#FED65B] tracking-tight">
                Concierge Laundromat
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean 4-6 nav links with Emil Kowalski sliding pill layoutId */}
        <div 
          onMouseLeave={() => setHoveredTab(null)}
          className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.page;
            const isHovered = hoveredTab === item.page;

            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                onMouseEnter={() => setHoveredTab(item.page)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold font-manrope transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 z-10 ${
                  isActive
                    ? 'text-white dark:text-[#0c0418]'
                    : 'text-[#444] dark:text-neutral-300 hover:text-black dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[#5E228B] dark:bg-[#FED65B] shadow-[0_2px_8px_rgba(94,34,139,0.3)] dark:shadow-[0_2px_10px_rgba(254,214,91,0.25)] -z-10"
                  />
                )}
                {!isActive && isHovered && (
                  <motion.div
                    layoutId="hoverNavPill"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="absolute inset-0 rounded-full bg-black/[0.05] dark:bg-white/[0.08] -z-10"
                  />
                )}
                <span>{item.label}</span>
                {item.page === 'track' && activeOrdersCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                    isActive ? 'bg-white/20 text-white dark:text-black' : 'bg-[#FED65B] text-[#1c1b1b]'
                  }`}>
                    {activeOrdersCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Zone 3: 1-2 Primary actions with tactile micro-highlights */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Quick Hub Hotkey Button */}
          {onOpenQuickHub && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onOpenQuickHub}
              className="px-2.5 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Quick Search (⌘K)"
            >
              <Command className="w-3.5 h-3.5 text-neutral-400" />
              <kbd className="text-[10px] font-mono bg-black/[0.05] dark:bg-white/[0.1] px-1 py-0.5 rounded text-neutral-500 dark:text-neutral-400">⌘K</kbd>
            </motion.button>
          )}

          {/* Call Branch Dropdown */}
          <div className="relative" ref={phoneRef}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setPhoneDropdown(!phoneDropdown)}
              className="px-3.5 py-2 rounded-full text-xs font-semibold font-manrope text-[#2F2F2F] dark:text-neutral-200 border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#E2B227]" />
              <span>Call Hub</span>
              <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${phoneDropdown ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {phoneDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#160a29] rounded-2xl shadow-xl border border-black/[0.08] dark:border-white/[0.12] p-2.5 z-50 space-y-1.5"
                >
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">Direct Branch Hubs</p>
                  <a
                    href="tel:0777349743"
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#5E228B]/10 dark:bg-white/10 flex items-center justify-center text-[#5E228B] dark:text-[#FED65B]">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">Rongai Hub</div>
                      <div className="text-[11px] text-[#E2B227] font-semibold tabular-nums">0777 349 743</div>
                    </div>
                  </a>
                  <a
                    href="tel:0777140102"
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#5E228B]/10 dark:bg-white/10 flex items-center justify-center text-[#5E228B] dark:text-[#FED65B]">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">Ngong Hub</div>
                      <div className="text-[11px] text-[#E2B227] font-semibold tabular-nums">0777 140 102</div>
                    </div>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Spring Toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#FED65B]" /> : <Moon className="w-4 h-4 text-[#5E228B]" />}
          </motion.button>

          {/* Primary Book Collection Action - Emil Kowalski Micro-Bevel */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenBooking()}
            className="bg-[#5E228B] hover:bg-[#521b7d] text-white px-4.5 py-2.5 rounded-full text-xs font-bold font-manrope transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(94,34,139,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_16px_rgba(94,34,139,0.4)] flex items-center gap-2 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-[#FED65B]" />
            <span>Book Collection</span>
          </motion.button>

          {/* Admin link */}
          <a
            href="/admin"
            className="text-[11px] font-semibold font-manrope text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white px-2.5 py-1.5 transition-colors"
          >
            Admin
          </a>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-200"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#FED65B]" /> : <Moon className="w-4 h-4 text-[#5E228B]" />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenBooking()}
            className="bg-[#5E228B] text-white px-3 py-1.5 rounded-full text-xs font-bold font-manrope shadow-xs flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5 text-[#FED65B]" />
            <span>Book</span>
          </motion.button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer with smooth spring collapse */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="md:hidden bg-white/95 dark:bg-[#100520]/95 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] px-4 pt-3 pb-6 space-y-2 font-manrope overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 pb-2">
              {NAV_ITEMS.map((item) => {
                const IconComp = item.icon;
                const isActive = activePage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleNavClick(item.page)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#5E228B] text-white font-bold shadow-xs'
                        : 'bg-black/[0.03] dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-200'
                    }`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2 text-xs">
              <a
                href="tel:0777349743"
                className="flex-1 py-2 px-3 text-center rounded-xl bg-black/[0.03] dark:bg-white/[0.05] font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Call Rongai
              </a>
              <a
                href="tel:0777140102"
                className="flex-1 py-2 px-3 text-center rounded-xl bg-black/[0.03] dark:bg-white/[0.05] font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Call Ngong
              </a>
              <a
                href="/admin"
                className="py-2 px-3 text-center rounded-xl border border-black/[0.08] dark:border-white/[0.1] font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Admin
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
