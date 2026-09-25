import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send } from 'lucide-react';

interface FloatingWhatsAppProps {
  phone?: string;
  defaultMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phone = '254777349743',
  defaultMessage = "Hi Goldtribe Link Laundromat! I'd like to book a laundry pickup or get a quote."
}) => {
  const [openTooltip, setOpenTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Quick Greeting Tooltip */}
      <AnimatePresence>
        {openTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="bg-white dark:bg-[#130722] text-neutral-900 dark:text-white border border-black/[0.08] dark:border-white/[0.1] shadow-xl rounded-2xl p-3.5 max-w-[240px] text-xs font-worksans relative"
          >
            <button
              onClick={() => setOpenTooltip(false)}
              className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-md transition-colors cursor-pointer"
              title="Close"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="text-[#25D366] font-bold font-manrope text-[11px] mb-1">
              WhatsApp Concierge
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">
              Need a rapid quote or immediate rider dispatch in Rongai & Ngong?
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#25D366] hover:underline"
            >
              <span>Chat directly now</span>
              <Send className="w-3 h-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Button */}
      <motion.a
        whileTap={{ scale: 0.94 }}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_24px_rgba(37,211,102,0.35)] transition-colors flex items-center gap-2 cursor-pointer relative"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="hidden md:inline font-bold font-manrope text-xs tracking-tight pr-1">
          WhatsApp Chat
        </span>
      </motion.a>
    </div>
  );
};
