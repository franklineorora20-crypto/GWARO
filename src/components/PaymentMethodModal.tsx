import React, { useState } from 'react';
import { X, Truck, CreditCard } from 'lucide-react';
import { ManualMpesaPayment } from './ManualMpesaPayment';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId?: string;
  customerName?: string;
  defaultPhone?: string;
  onPaymentSuccess?: (mpesaRef?: string) => void;
  onPaymentInitiated?: (checkoutRequestId?: string) => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  amount,
  orderId = `GL-${Math.floor(1000 + Math.random() * 9000)}`,
  customerName = 'Valued Customer',
  defaultPhone = '07',
  onPaymentSuccess,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cod'>('mpesa');

  const handleCodSubmit = () => {
    if (onPaymentSuccess) {
      onPaymentSuccess('PAY_ON_DELIVERY');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-xl mx-auto space-y-4 my-8">
        {/* Method Toggle Header */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#e5e2e1] shadow-md flex items-center justify-between gap-3">
          <div className="text-xs font-extrabold font-manrope text-[#341168] uppercase tracking-wider">
            Payment Option
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('mpesa')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-manrope transition-all cursor-pointer flex items-center gap-1.5 ${
                paymentMethod === 'mpesa'
                  ? 'bg-[#341168] text-white shadow-sm'
                  : 'bg-[#f6f3f2] text-[#4a4550] hover:bg-[#e5e2e1]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>M-PESA Paybill</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-manrope transition-all cursor-pointer flex items-center gap-1.5 ${
                paymentMethod === 'cod'
                  ? 'bg-[#341168] text-white shadow-sm'
                  : 'bg-[#f6f3f2] text-[#4a4550] hover:bg-[#e5e2e1]'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Pay on Delivery</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7b7581] hover:text-[#1c1b1b] rounded-full hover:bg-[#f6f3f2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentMethod === 'mpesa' ? (
          <ManualMpesaPayment
            amount={amount}
            orderId={orderId}
            customerName={customerName}
            phone={defaultPhone}
            onClose={onClose}
            onPaymentSubmitted={(record) => {
              if (onPaymentSuccess) {
                onPaymentSuccess(record.mpesa_code);
              }
            }}
          />
        ) : (
          <div className="bg-white rounded-3xl p-6 border-2 border-[#6B46C1] shadow-2xl space-y-5 text-center font-worksans">
            <div className="w-14 h-14 rounded-full bg-purple-100 text-[#341168] flex items-center justify-center mx-auto">
              <Truck className="w-7 h-7 text-[#6B46C1]" />
            </div>
            <h3 className="text-xl font-extrabold font-manrope text-[#341168]">
              Pay on Delivery (Cash / Till)
            </h3>
            <p className="text-xs text-[#7b7581] leading-relaxed max-w-sm mx-auto">
              You can pay via Cash or M-Pesa Till to our express rider upon doorstep delivery of your garments.
            </p>
            <div className="bg-[#f6f3f2] p-4 rounded-2xl text-xs font-bold text-[#341168] border border-[#e5e2e1] flex justify-between">
              <span>Amount Due at Delivery:</span>
              <span className="font-mono text-sm font-black">Ksh {amount.toLocaleString()}</span>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 rounded-full border border-[#e5e2e1] text-xs font-bold font-manrope hover:bg-[#f6f3f2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCodSubmit}
                className="flex-1 py-3.5 rounded-full bg-[#6B46C1] text-white font-extrabold font-manrope text-sm hover:bg-[#341168] transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Confirm Pay on Delivery Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
