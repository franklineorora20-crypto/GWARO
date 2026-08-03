import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-in">
      <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
        toast.type === 'error' 
          ? 'bg-red-900/90 text-white border-red-700' 
          : toast.type === 'info'
          ? 'bg-[#341168]/95 text-white border-[#4b2c7f]'
          : 'bg-[#341168]/95 text-white border-[#fed65b]'
      }`}>
        {toast.type === 'error' ? (
          <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
        ) : toast.type === 'info' ? (
          <Info className="w-6 h-6 text-[#fed65b] shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-6 h-6 text-[#fed65b] shrink-0 mt-0.5" />
        )}

        <div className="flex-1">
          <h4 className="font-bold font-manrope text-sm text-[#fed65b]">{toast.title}</h4>
          {toast.message && <p className="text-xs text-white/90 mt-1 font-worksans">{toast.message}</p>}
        </div>

        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
