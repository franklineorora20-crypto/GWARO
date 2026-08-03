import React, { useState } from 'react';
import { LOGO_URL } from '../data/initialData';
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
    <footer className="bg-[#25292c] text-[#a7aaae] pt-16 pb-12 font-worksans border-t border-[#3b3f42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Col 1: Brand & Logo */}
        <div className="space-y-4">
          <Logo size="lg" variant="dark" showMotto={true} />
          <p className="text-xs sm:text-sm text-[#a7aaae] leading-relaxed">
            Goldtribe Link Laundromat — Premium concierge garment care, dry cleaning, duvet clinic, and housekeeping services. <strong className="text-white font-manrope">Usafi: Kazi Yetu.</strong>
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#fed65b] text-xs font-bold font-manrope">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Quality Satisfaction Guarantee
            </span>
          </div>
        </div>

        {/* Col 2: Rongai Hub */}
        <div className="space-y-3 text-xs sm:text-sm">
          <h4 className="text-sm font-bold font-manrope text-white uppercase tracking-wider">Contact Rongai</h4>
          <a href="tel:0777349743" className="block text-[#fed65b] font-bold font-manrope text-base hover:underline">
            Rongai: 0777 349 743
          </a>
          <p className="flex items-start gap-2 text-[#a7aaae]">
            <MapPin className="w-4 h-4 text-[#fed65b] shrink-0 mt-0.5" />
            <span>Hill Valley Place, Magadi Road, near Magenche, Rongai</span>
          </p>
          <p className="text-xs text-[#a7aaae]">Operating: Mon - Sat 7am - 8pm</p>
        </div>

        {/* Col 3: Ngong Hub */}
        <div className="space-y-3 text-xs sm:text-sm">
          <h4 className="text-sm font-bold font-manrope text-white uppercase tracking-wider">Contact Ngong</h4>
          <a href="tel:0777140102" className="block text-[#fed65b] font-bold font-manrope text-base hover:underline">
            Ngong: 0777 140 102
          </a>
          <p className="flex items-start gap-2 text-[#a7aaae]">
            <MapPin className="w-4 h-4 text-[#fed65b] shrink-0 mt-0.5" />
            <span>Ngong Town, Country Arcade</span>
          </p>
          <p className="text-xs text-[#a7aaae]">Operating: Mon - Sat 7am - 8pm</p>
        </div>

        {/* Col 4: Quick Links */}
        <div className="space-y-3 text-xs sm:text-sm">
          <h4 className="text-sm font-bold font-manrope text-white uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => onNavigateToSection('memberships')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Gold Pass Memberships
              </button>
            </li>
            <li>
              <button 
                onClick={() => setModalType('terms')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button 
                onClick={() => setModalType('policy')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Garment & Order Policy
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

          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="bg-[#fed65b] text-[#341168] px-5 py-2.5 rounded-full font-bold font-manrope text-xs hover:bg-white transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Book Collection</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#43474b] pt-8 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <p className="text-[#a7aaae]">
          © 2024 Goldtribe Link Laundromat. Usafi: Kazi Yetu.
        </p>

        <div className="flex gap-6 font-bold text-[#fed65b]">
          <button onClick={() => setModalType('terms')} className="hover:underline cursor-pointer">Privacy Policy</button>
          <button onClick={() => setModalType('policy')} className="hover:underline cursor-pointer">Cookies Settings</button>
        </div>
      </div>

      {/* Policy Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1c1b1b] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#e5e2e1] font-worksans animate-bounce-in">
            <div className="flex justify-between items-center border-b border-[#e5e2e1] pb-3">
              <h3 className="text-lg font-bold font-manrope text-[#341168]">
                {modalType === 'terms' ? 'Terms of Service & Privacy' : 'Garment Care & Order Policy'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-[#7b7581] hover:text-[#1c1b1b]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#4a4550] space-y-3 leading-relaxed max-h-72 overflow-y-auto">
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

            <button
              onClick={() => setModalType(null)}
              className="w-full py-3 rounded-full bg-[#341168] text-white font-bold text-xs font-manrope cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
