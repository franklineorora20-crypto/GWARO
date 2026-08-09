import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, Truck, Menu, X, Sparkles, MapPin, 
  ChevronDown, LayoutDashboard, Home, Shirt, Calculator, 
  Search, Crown, ArrowRight, Clock, Layers, HelpCircle,
  Sun, Moon
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
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onNavigateToSection,
  activeOrdersCount,
  orders,
  onSelectOrderToTrack,
  activePage = 'home',
  onSelectPage
}) => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phoneDropdown, setPhoneDropdown] = useState(false);
  const [logoDashboardOpen, setLogoDashboardOpen] = useState(false);

  const dashboardRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dashboardRef.current && !dashboardRef.current.contains(event.target as Node)) {
        setLogoDashboardOpen(false);
      }
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
    setLogoDashboardOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#120822]/95 backdrop-blur-md border-b border-[#E5E2E1] dark:border-white/10 shadow-xs transition-colors duration-200">
      {/* Main Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex justify-between items-center">
        {/* Brand Logo & Motto - Click Logo to Toggle Dashboard Dropdown */}
       <div className="relative" ref={dashboardRef}>
  <button
    onClick={() => setLogoDashboardOpen(!logoDashboardOpen)}
    className="flex items-center gap-2 text-left focus:outline-none group cursor-pointer p-1.5 sm:p-2 rounded-2xl hover:bg-[#5E228B]/5 transition-all"
    title="Click Logo for Goldtribe Dashboard"
    aria-expanded={logoDashboardOpen}
  >
    <img 
    src={logo}
  alt="Goldtribe Link Limited"
  className="h-14 sm:h-16 w-auto object-contain"
/>
    <ChevronDown
      className={`w-4 h-4 text-[#5E228B] dark:text-[#FED65B] transition-transform duration-200 group-hover:scale-110 ${
        logoDashboardOpen
          ? 'rotate-180 text-[#D8A620]'
          : ''
      }`}
    />
  </button>

          {/* Dropdown Quick Hub Screen Navigator */}
          <AnimatePresence>
            {logoDashboardOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-0 mt-3 w-[300px] sm:w-[400px] bg-gradient-to-br from-[#4A3078] to-[#5B3F8C] text-white rounded-3xl shadow-2xl border border-[#D8A620]/40 p-5 z-50 space-y-4"
              >
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-white/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#D8A620] text-[#5B3F8C] flex items-center justify-center font-black shadow-xs">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold font-manrope text-white tracking-tight">
                        Goldtribe Dashboard
                      </h3>
                      <p className="text-[10px] text-white/70">Jump directly to any page section</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavClick('all')}
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePage === 'all'
                        ? 'bg-[#D8A620] text-[#2F2F2F]'
                        : 'bg-white/10 hover:bg-white/20 text-[#D8A620] border border-[#D8A620]/30'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Full View</span>
                  </button>
                </div>

                {/* Compact Eye-Catching Screen Navigator Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { page: 'home', label: 'Home Overview', icon: Home },
                    { page: 'services', label: 'Garment Services', icon: Shirt },
                    { page: 'calculator', label: 'Price Estimator', icon: Calculator },
                    { page: 'track', label: 'Order Tracker', icon: Search, badge: activeOrdersCount > 0 ? `${activeOrdersCount}` : undefined },
                    { page: 'memberships', label: 'VIP Gold Pass', icon: Crown },
                    { page: 'branches', label: 'Branch Hubs', icon: MapPin },
                    { page: 'faq', label: 'FAQ & Reviews', icon: HelpCircle },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isActive = activePage === item.page;
                    return (
                      <button
                        key={item.page}
                        onClick={() => handleNavClick(item.page)}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border text-left transition-all group cursor-pointer ${
                          isActive
                            ? 'bg-[#D8A620] border-[#D8A620] text-[#2F2F2F] font-black shadow-md'
                            : 'bg-white/10 border-white/15 hover:bg-white/20 text-white font-bold'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className={`p-1.5 rounded-xl shrink-0 ${isActive ? 'bg-[#5B3F8C] text-[#D8A620]' : 'bg-white/10 text-[#D8A620]'}`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-manrope truncate">
                            {item.label}
                          </span>
                        </div>

                        {item.badge ? (
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0 ${isActive ? 'bg-[#5B3F8C] text-white' : 'bg-[#D8A620] text-[#2F2F2F]'}`}>
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Recent Order Quick Bar */}
                {orders && orders.length > 0 && (
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-white/90 truncate">
                      <Clock className="w-3.5 h-3.5 text-[#D8A620] shrink-0" />
                      <span className="font-bold truncate">Order #{orders[0].id}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-[#D8A620] text-[#2F2F2F]">
                        {orders[0].status}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (onSelectOrderToTrack) onSelectOrderToTrack(orders[0].id);
                        else handleNavClick('track');
                        setLogoDashboardOpen(false);
                      }}
                      className="text-xs font-extrabold text-[#D8A620] hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                    >
                      <span>Track</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Nav Links - Streamlined */}
        <div className="hidden lg:flex items-center gap-1.5 font-manrope text-xs font-bold p-1 bg-[#FAFAFA] dark:bg-[#1f0e34] rounded-full border border-[#E5E2E1] dark:border-white/10">
          {[
            { page: 'home', label: 'Home' },
            { page: 'services', label: 'Services' },
          ].map((tab) => {
            const isActive = activePage === tab.page;
            return (
              <button
                key={tab.page}
                onClick={() => handleNavClick(tab.page)}
                className={`px-4 py-2 rounded-full transition-all cursor-pointer relative flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#5E228B] text-white shadow-xs'
                    : 'text-[#2B2B2B] dark:text-gray-200 hover:text-[#5E228B] dark:hover:text-[#FED65B] hover:bg-white dark:hover:bg-white/10'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Phone Dropdown */}
          <div className="relative" ref={phoneRef}>
            <button
              onClick={() => setPhoneDropdown(!phoneDropdown)}
              className="px-3.5 py-2 rounded-full border border-[#5E228B]/20 text-[#5E228B] hover:bg-[#5E228B]/5 text-xs font-bold font-manrope flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#FED65B]" />
              <span>Call Branch</span>
            </button>

            <AnimatePresence>
              {phoneDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E2E1] p-3 z-50 space-y-2"
                >
                  <p className="text-[11px] font-bold text-[#5F5F5F] uppercase px-2">Select Branch Hub</p>
                  <a
                    href="tel:0777349743"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAFAFA] transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-[#5E228B]" />
                    <div>
                      <div className="text-xs font-bold text-[#2F2F2F]">Rongai Branch</div>
                      <div className="text-[11px] text-[#FED65B] font-bold">0777 349 743</div>
                    </div>
                  </a>
                  <a
                    href="tel:0777140102"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAFAFA] transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-[#5E228B]" />
                    <div>
                      <div className="text-xs font-bold text-[#2F2F2F]">Ngong Branch</div>
                      <div className="text-[11px] text-[#FED65B] font-bold">0777 140 102</div>
                    </div>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full border border-[#5E228B]/20 text-[#5E228B] dark:text-[#FED65B] dark:border-white/20 hover:bg-[#5E228B]/10 transition-colors cursor-pointer flex items-center justify-center"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#FED65B]" /> : <Moon className="w-4 h-4 text-[#5E228B]" />}
          </button>

          {/* Book Collection Button */}
          <button
            onClick={() => onOpenBooking()}
            className="bg-[#5E228B] hover:bg-[#4A1772] text-white px-5 py-2.5 rounded-full text-xs font-bold font-manrope transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#FED65B]" />
            <span>Book Collection</span>
          </button>

          <a
            href="/admin"
            className="bg-white dark:bg-transparent dark:text-white dark:border-white/30 text-[#5E228B] border border-[#5E228B] px-4 py-2.5 rounded-full text-xs font-bold font-manrope transition-colors hover:bg-[#5E228B] hover:text-white"
          >
            Admin Login
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-[#5E228B]/20 text-[#5E228B] dark:text-[#FED65B] dark:border-white/20"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#FED65B]" /> : <Moon className="w-4 h-4 text-[#5E228B]" />}
          </button>
          <button
            onClick={() => onOpenBooking()}
            className="bg-[#5E228B] text-white p-2 rounded-full shadow-sm text-xs"
            title="Book Collection"
          >
            <Truck className="w-4 h-4 text-[#fed65b]" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1c1b1b] dark:text-white hover:bg-[#f0eded] dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-white border-b border-[#e5e2e1] px-4 pt-3 pb-6 space-y-3 font-manrope overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#4A3078] to-[#5B3F8C] text-white rounded-2xl mb-2 border border-[#D8A620]/30 shadow-xs">
              <div className="inline-flex items-center gap-1.5 bg-[#D8A620] text-[#2F2F2F] text-[10px] font-black font-manrope uppercase px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#2F2F2F]" />
                <span>GOLDTRIBE LINK</span>
              </div>
              <span className="text-[10px] bg-white/20 text-[#D8A620] font-bold px-2 py-0.5 rounded-full font-manrope border border-[#D8A620]/30">
                Rongai & Ngong Hubs
              </span>
            </div>

            <button
              onClick={() => handleNavClick('hero')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#FAFAFA] text-sm font-semibold text-[#2F2F2F] flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-[#5B3F8C]" />
              <span>Home Overview</span>
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#FAFAFA] text-sm font-semibold text-[#2F2F2F] flex items-center gap-2"
            >
              <Shirt className="w-4 h-4 text-[#5B3F8C]" />
              <span>Our Services</span>
            </button>
            <button
              onClick={() => handleNavClick('calculator')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#FAFAFA] text-sm font-semibold text-[#5B3F8C] flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#5B3F8C]" />
              <span>Price Estimator</span>
            </button>
            <button
              onClick={() => handleNavClick('track')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#FAFAFA] text-sm font-semibold text-[#2F2F2F] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#5B3F8C]" />
                <span>Track Order</span>
              </span>
              {activeOrdersCount > 0 && (
                <span className="bg-[#D8A620] text-[#2F2F2F] text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeOrdersCount} active
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('memberships')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#FAFAFA] text-sm font-bold text-[#D8A620] flex items-center gap-2"
            >
              <Crown className="w-4 h-4 text-[#D8A620]" />
              <span>Gold Pass VIP Memberships</span>
            </button>
            <button
              onClick={() => handleNavClick('locations')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#FAFAFA] text-sm font-semibold text-[#2F2F2F] flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#5B3F8C]" />
              <span>Our Branches (Rongai & Ngong)</span>
            </button>

            <div className="pt-2 border-t border-[#E5E2E1] space-y-2">
              <button
                onClick={() => {
                  onOpenBooking();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#5B3F8C] text-white py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#D8A620]" />
                <span>Book Collection Now</span>
              </button>

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <a
                href="tel:0777349743"
                className="p-2.5 rounded-xl border border-[#E5E2E1] text-xs font-bold text-[#5B3F8C] bg-[#FAFAFA]"
              >
                Call Rongai
              </a>
              <a
                href="tel:0777140102"
                className="p-2.5 rounded-xl border border-[#E5E2E1] text-xs font-bold text-[#5B3F8C] bg-[#FAFAFA]"
              >
                Call Ngong
              </a>
            </div>
            <a
              href="/admin"
              className="w-full inline-flex items-center justify-center gap-2 p-3 rounded-xl border border-[#5B3F8C] text-xs font-bold text-[#5B3F8C] bg-white hover:bg-[#F4F0FF] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Login
            </a>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
