import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';

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
      {openTooltip && (
        <div className="bg-white dark:bg-[#1a0c2a] text-[#2F2F2F] dark:text-white border border-[#E5E2E1] dark:border-white/20 shadow-2xl rounded-2xl p-3 max-w-[240px] text-xs font-worksans relative animate-bounce-subtle">
          <button
            onClick={() => setOpenTooltip(false)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center text-[10px] hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1.5 text-[#25D366] font-bold font-manrope text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Kenya WhatsApp</span>
          </div>
          <p className="mt-1 text-[#2D2D2D] dark:text-gray-200 font-medium leading-tight">
            Need a quick laundry quote or pickup in Rongai or Ngong?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#25D366] hover:underline"
          >
            <span>Chat directly now</span>
            <Send className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Main WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2.5 active:scale-95 cursor-pointer relative"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white" />
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="hidden md:inline font-extrabold font-manrope text-xs tracking-tight pr-1">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};
