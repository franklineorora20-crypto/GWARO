import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { Phone, MapPin, Truck, ShieldCheck, X } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onNavigateToSection
}) => {
  const [modalType, setModalType] = useState<'terms' | 'policy' | null>(null);

  return (
    <footer className="bg-[#0b0416] text-neutral-400 pt-16 pb-28 sm:pb-12 font-worksans border-t border-white/[0.08] w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Col 1: Brand & Identity */}
        <div className="space-y-4">
          <Logo size="lg" variant="dark" showMotto={true} />
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Goldtribe Link Laundromat — Premium concierge garment care, dry cleaning, duvet clinic, and housekeeping services. <strong className="text-white font-manrope">Usafi: Kazi Yetu.</strong>
          </p>
          <div className="text-xs text-neutral-400 flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-[#FED65B]" />
            <span>100% Quality Satisfaction Guarantee</span>
          </div>
        </div>

        {/* Col 2: Rongai Hub */}
        <div className="space-y-2.5 text-xs sm:text-sm">
          <h4 className="text-xs font-bold font-manrope text-white uppercase tracking-wider">Rongai Hub</h4>
          <a href="tel:0777349743" className="block text-[#FED65B] font-bold font-manrope text-sm hover:underline tabular-nums">
            0777 349 743
          </a>
          <p className="flex items-start gap-2 text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-[#FED65B] shrink-0 mt-0.5" />
            <span>Hill Valley Place, Magadi Road, Rongai</span>
          </p>
          <p className="text-xs text-neutral-500">Mon - Sat: 7:00 AM – 8:00 PM</p>
        </div>

        {/* Col 3: Ngong Hub */}
        <div className="space-y-2.5 text-xs sm:text-sm">
          <h4 className="text-xs font-bold font-manrope text-white uppercase tracking-wider">Ngong Hub</h4>
          <a href="tel:0777140102" className="block text-[#FED65B] font-bold font-manrope text-sm hover:underline tabular-nums">
            0777 140 102
          </a>
          <p className="flex items-start gap-2 text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-[#FED65B] shrink-0 mt-0.5" />
            <span>Country Arcade, Ngong Town</span>
          </p>
          <p className="text-xs text-neutral-500">Mon - Sat: 7:00 AM – 8:00 PM</p>
        </div>

        {/* Col 4: Quick Navigation & Action */}
        <div className="space-y-3 text-xs sm:text-sm">
          <h4 className="text-xs font-bold font-manrope text-white uppercase tracking-wider">Concierge Links</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onNavigateToSection('memberships')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                VIP Gold Pass Subscriptions
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigateToSection('terms')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigateToSection('privacy')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy (ODPC)
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigateToSection('refund')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Refund & Claims Policy
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigateToSection('faq')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                FAQ & Care Advice
              </button>
            </li>
          </ul>

          <div className="pt-1">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onOpenBooking}
              className="bg-[#FED65B] text-[#0b0416] px-4 py-2 rounded-full font-bold font-manrope text-xs hover:bg-[#ffe082] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Book Collection</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.08] pt-8 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
        <p>
          © 2026 Goldtribe Link Laundromat. All prices inclusive of 16% VAT. Usafi: Kazi Yetu.
        </p>

        <div className="flex gap-6 font-medium text-neutral-400">
          <button onClick={() => onNavigateToSection('privacy')} className="hover:text-white cursor-pointer">Privacy Policy</button>
          <button onClick={() => onNavigateToSection('terms')} className="hover:text-white cursor-pointer">Terms of Service</button>
          <button onClick={() => onNavigateToSection('refund')} className="hover:text-white cursor-pointer">Refund Policy</button>
        </div>
      </div>

      {/* Policy Modal with Emil Kowalski Spring Entrance */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-white dark:bg-[#130722] text-neutral-900 dark:text-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-black/[0.08] dark:border-white/[0.1] font-worksans relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                <h3 className="text-base font-bold font-manrope text-neutral-900 dark:text-white">
                  {modalType === 'terms' ? 'Terms of Service & Privacy' : 'Garment Care & Order Policy'}
                </h3>
                <button 
                  onClick={() => setModalType(null)} 
                  className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-3 leading-relaxed max-h-72 overflow-y-auto pr-1">
                <p>
                  <strong>1. Garment Inspection:</strong> Goldtribe Link Laundromat inspects all incoming garments at the Rongai and Ngong hubs for pre-existing wear, delicate trimmings, or loose buttons before processing.
                </p>
                <p>
                  <strong>2. Doorstep Pickup & Delivery:</strong> Free doorstep delivery applies to orders valued at Ksh 1,500 or more in Rongai, Ngong, Matasia, Karen, and surrounding suburbs.
                </p>
                <p>
                  <strong>3. Payment Policy:</strong> Payments are processed via M-Pesa or Cash on Delivery. Official M-Pesa receipts are provided digitally.
                </p>
                <p>
                  <strong>4. Guarantee:</strong> If you are not satisfied with the freshness or press of any garment, notify us within 24 hours for a complimentary re-clean.
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setModalType(null)}
                className="w-full py-2.5 rounded-full bg-[#5E228B] hover:bg-[#501a78] text-white font-bold text-xs font-manrope cursor-pointer"
              >
                Close Notice
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};
