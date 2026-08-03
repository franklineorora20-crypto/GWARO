import React from 'react';
import { Truck, Phone, MessageCircle } from 'lucide-react';

interface MobileBottomBarProps {
  onOpenBooking: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onOpenBooking }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 dark:bg-[#120822]/95 backdrop-blur-md border-t border-[#E5E2E1] dark:border-white/10 p-2.5 px-3 flex items-center gap-2 shadow-2xl">
      {/* Primary Big CTA */}
      <button
        onClick={onOpenBooking}
        className="flex-1 bg-[#5E228B] hover:bg-[#4A1772] text-white py-3 px-4 rounded-2xl font-black font-manrope text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
      >
        <Truck className="w-4 h-4 text-[#FED65B]" />
        <span>Book Collection Now</span>
      </button>

      {/* Direct Call Button */}
      <a
        href="tel:0777349743"
        className="p-3 rounded-2xl bg-[#5E228B]/10 dark:bg-white/10 text-[#5E228B] dark:text-[#FED65B] border border-[#5E228B]/20 dark:border-white/20 hover:bg-[#5E228B]/20 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        title="Call Goldtribe Rongai Branch"
      >
        <Phone className="w-4 h-4" />
      </a>

      {/* Direct WhatsApp Button */}
      <a
        href="https://wa.me/254777349743?text=Hi%20Goldtribe!%20I'd%20like%20to%20book%20a%20laundry%20pickup."
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-2xl bg-[#25D366] text-white hover:bg-[#20ba5a] flex items-center justify-center shadow-md transition-colors cursor-pointer shrink-0"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
      </a>
    </div>
  );
};
