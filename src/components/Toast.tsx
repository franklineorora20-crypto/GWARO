import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X, Copy, Check } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
  actionLabel?: string;
  onAction?: () => void;
  copyText?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

/**
 * Sonner-inspired Notification Toast by Emil Kowalski
 * Features physical spring physics, tactile micro-highlights, drag-to-dismiss, and copy action.
 */
export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!toast) return;
    if (isHovered) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, onClose, isHovered]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 pointer-events-none select-none">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94, transition: { duration: 0.15 } }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 26,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 100 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 60 || info.velocity.x > 300) {
                onClose();
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="pointer-events-auto w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl bg-[#130724] text-white p-4 border border-white/[0.12] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl flex flex-col gap-2 relative overflow-hidden"
          >
            {/* Top Accent Light Bar */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${
              toast.type === 'error'
                ? 'bg-rose-500'
                : toast.type === 'info'
                ? 'bg-sky-400'
                : 'bg-gradient-to-r from-[#FED65B] via-[#E2B227] to-[#FED65B]'
            }`} />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                  toast.type === 'error'
                    ? 'bg-rose-500/15 text-rose-400'
                    : toast.type === 'info'
                    ? 'bg-sky-500/15 text-sky-400'
                    : 'bg-[#FED65B]/15 text-[#FED65B]'
                }`}>
                  {toast.type === 'error' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : toast.type === 'info' ? (
                    <Info className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold font-manrope text-white tracking-tight leading-snug">
                    {toast.title}
                  </h4>
                  {toast.message && (
                    <p className="text-xs text-white/70 font-worksans leading-relaxed">
                      {toast.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Optional Action or Copy Pill Bar */}
            {(toast.actionLabel || toast.copyText) && (
              <div className="pt-2 mt-1 border-t border-white/[0.08] flex items-center justify-between gap-2 text-xs">
                {toast.copyText && (
                  <button
                    onClick={() => handleCopy(toast.copyText!)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[#FED65B] font-mono text-[11px] transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : toast.copyText}</span>
                  </button>
                )}

                {toast.actionLabel && toast.onAction && (
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      onClose();
                    }}
                    className="ml-auto px-3 py-1 rounded-lg bg-[#FED65B] hover:bg-[#ffe180] text-[#130724] font-bold font-manrope text-xs transition-colors cursor-pointer"
                  >
                    {toast.actionLabel}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
