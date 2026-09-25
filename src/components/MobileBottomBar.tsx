import React from 'react';
import { motion } from 'motion/react';
import { Truck, Phone, MessageCircle } from 'lucide-react';

interface MobileBottomBarProps {
  onOpenBooking: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onOpenBooking }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/90 dark:bg-[#0e041d]/90 backdrop-blur-xl border-t border-black/[0.08] dark:border-white/[0.1] p-2.5 px-3 flex items-center gap-2 shadow-[0_-8px_24px_rgba(0,0,0,0.12)]">
      {/* Primary Big CTA with Emil Kowalski Micro-Bevel */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onOpenBooking}
        className="flex-1 bg-[#5E228B] hover:bg-[#4A1772] text-white py-3 px-4 rounded-2xl font-bold font-manrope text-xs flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(94,34,139,0.3)] cursor-pointer"
      >
        <Truck className="w-4 h-4 text-[#FED65B]" />
        <span>Book Collection Now</span>
      </motion.button>

      {/* Direct Call Button */}
      <motion.a
        whileTap={{ scale: 0.94 }}
        href="tel:0777349743"
        className="p-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] text-[#5E228B] dark:text-[#FED65B] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center cursor-pointer shrink-0"
        title="Call Goldtribe Rongai Branch"
      >
        <Phone className="w-4 h-4" />
      </motion.a>

      {/* Direct WhatsApp Button */}
      <motion.a
        whileTap={{ scale: 0.94 }}
        href="https://wa.me/254777349743?text=Hi%20Goldtribe!%20I'd%20like%20to%20book%20a%20laundry%20pickup."
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-xs cursor-pointer shrink-0"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
      </motion.a>
    </div>
  );
};
