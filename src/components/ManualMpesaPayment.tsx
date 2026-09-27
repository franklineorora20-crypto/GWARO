import React, { useState } from 'react';
import { Copy, Check, Clock, CheckCircle2, ArrowRight, Sparkles, Smartphone, Lock, Truck, Banknote } from 'lucide-react';
import { saveManualPayment } from '../lib/manualPayments';

export interface ManualMpesaPaymentProps {
  amount: number;
  orderId?: string;
  customerName?: string;
  phone?: string;
  onPaymentSubmitted?: (details: {
    order_id: string;
    amount: number;
    mpesa_code: string;
    timestamp: string;
    status: string;
  }) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const ManualMpesaPayment: React.FC<ManualMpesaPaymentProps> = ({
  amount,
  orderId = `GL-${Math.floor(1000 + Math.random() * 9000)}`,
  customerName = 'Valued Customer',
  phone = '',
  onPaymentSubmitted,
  onClose,
  isModal = false,
}) => {
  const [paymentMode, setPaymentMode] = useState<'paybill' | 'cod'>('paybill');
  const [copiedField, setCopiedField] = useState<'business' | 'account' | null>(null);
  const [mpesaCode, setMpesaCode] = useState('');
  const [inputError, setInputError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState<{
    order_id: string;
    amount: number;
    mpesa_code: string;
    timestamp: string;
    status: string;
  } | null>(null);

  const businessNo = '880100';
  const accountNo = '1006242177';

  const handleCopy = (text: string, field: 'business' | 'account') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.warn('Clipboard copy fallback:', err);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputError('');
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
    setMpesaCode(cleaned);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = mpesaCode.trim().toUpperCase();

    if (cleanCode.length !== 10) {
      setInputError('Please enter a valid 10-character M-PESA transaction code (e.g., SDX4J2K9L0).');
      return;
    }

    setIsSubmitting(true);
    setInputError('');

    try {
      const response = await fetch('/api/verify-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mpesaCode: cleanCode,
          amount,
          phone,
          orderId,
          customerName,
        }),
      });

      const verifyData = await response.json().catch(() => ({}));

      if (!response.ok || !verifyData.verified) {
        setIsSubmitting(false);
        setInputError(
          verifyData.error ||
            'Could not verify M-PESA code with Safaricom Daraja. Please check your SMS receipt or choose Pay on Delivery.'
        );
        return;
      }

      const timestamp = new Date().toISOString();
      const record = {
        order_id: orderId,
        amount,
        mpesa_code: cleanCode,
        timestamp,
        status: 'Paid via M-Pesa',
        customerName,
        phone,
      };

      await saveManualPayment(record);

      setIsSubmitting(false);
      setSubmittedDetails(record);

      if (onPaymentSubmitted) {
        onPaymentSubmitted(record);
      }
    } catch (err) {
      setIsSubmitting(false);
      setInputError(
        'Unable to reach Safaricom Daraja verification service. Please check your connection or choose Pay on Delivery.'
      );
    }
  };

  const handleConfirmCod = async () => {
    setIsSubmitting(true);
    const timestamp = new Date().toISOString();
    const record = {
      order_id: orderId,
      amount,
      mpesa_code: 'PAY_ON_DELIVERY',
      timestamp,
      status: 'Pay on Delivery (Cash/Till)',
      customerName,
      phone,
    };

    await saveManualPayment(record);
    setIsSubmitting(false);
    setSubmittedDetails(record);

    if (onPaymentSubmitted) {
      onPaymentSubmitted(record);
    }
  };

  const formattedAmount = amount > 0 ? amount.toLocaleString() : '0';

  return (
    <div className={`w-full ${isModal ? 'max-w-xl mx-auto' : ''}`}>
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#6B46C1] shadow-2xl space-y-6 relative font-worksans overflow-hidden">
        
        {/* Decorative Gold & Purple Subtle Background Accents */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#6B46C1]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Payment Method Selector Toggle inside the card */}
        {!submittedDetails && (
          <div className="flex bg-[#f6f3f2] p-1.5 rounded-2xl border border-[#e5e2e1] gap-1.5">
            <button
              type="button"
              onClick={() => setPaymentMode('paybill')}
              className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-extrabold font-manrope transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                paymentMode === 'paybill'
                  ? 'bg-[#341168] text-white shadow-md'
                  : 'bg-transparent text-[#7b7581] hover:text-[#341168]'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#D4AF37]" />
              <span>M-PESA Paybill</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMode('cod')}
              className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-extrabold font-manrope transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                paymentMode === 'cod'
                  ? 'bg-[#341168] text-white shadow-md'
                  : 'bg-transparent text-[#7b7581] hover:text-[#341168]'
              }`}
            >
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span>Pay on Delivery</span>
            </button>
          </div>
        )}

        {/* Success State */}
        {submittedDetails ? (
          <div className="space-y-6 animate-fade-in py-2">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-100 border-2 border-[#6B46C1] text-[#6B46C1] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10 text-[#6B46C1]" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#524100] font-extrabold text-xs font-manrope">
                <Sparkles className="w-3.5 h-3.5 text-[#6B46C1]" />
                <span>{submittedDetails.mpesa_code === 'PAY_ON_DELIVERY' ? 'Order Confirmed' : 'Manual Verification Submitted'}</span>
              </div>
              <h3 className="text-2xl font-black font-manrope text-[#341168]">
                {submittedDetails.mpesa_code === 'PAY_ON_DELIVERY' ? 'Pay on Delivery Reserved!' : 'Payment Code Received!'}
              </h3>
              <p className="text-base font-bold text-[#6B46C1] bg-purple-50 p-4 rounded-2xl border border-purple-200">
                {submittedDetails.mpesa_code === 'PAY_ON_DELIVERY' ? (
                  <span>Order <span className="font-mono font-black text-xl text-[#341168] bg-white px-2 py-0.5 rounded border border-[#6B46C1]/30">{submittedDetails.order_id}</span> is set for Pay on Delivery.</span>
                ) : (
                  <span>Code <span className="font-mono font-black text-xl text-[#341168] bg-white px-2 py-0.5 rounded border border-[#6B46C1]/30">{submittedDetails.mpesa_code}</span> Received. We are verifying your payment.</span>
                )}
              </p>
            </div>

            {/* Order Details Breakdown */}
            <div className="bg-[#f6f3f2] rounded-2xl p-4 sm:p-5 border border-[#e5e2e1] space-y-2.5 text-xs text-[#1c1b1b]">
              <div className="flex justify-between items-center border-b border-[#e5e2e1] pb-2">
                <span className="font-bold text-[#7b7581] uppercase font-manrope">Order Reference</span>
                <span className="font-extrabold font-mono text-sm text-[#341168]">{submittedDetails.order_id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#e5e2e1] pb-2">
                <span className="font-bold text-[#7b7581] uppercase font-manrope">Amount Due</span>
                <span className="font-black font-manrope text-sm text-[#341168]">Ksh {formattedAmount}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#e5e2e1] pb-2">
                <span className="font-bold text-[#7b7581] uppercase font-manrope">Payment Method</span>
                <span className="font-extrabold px-2.5 py-1 rounded-full bg-purple-100 text-[#6B46C1] border border-[#6B46C1]/30">
                  {submittedDetails.mpesa_code === 'PAY_ON_DELIVERY' ? 'Pay on Delivery (Cash / Till)' : 'M-PESA Paybill Direct'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#7b7581] pt-1">
                <span>Timestamp</span>
                <span>{new Date(submittedDetails.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
              </div>
            </div>

            <p className="text-xs text-[#524100] text-center font-medium bg-[#FFFDF0] p-3 rounded-xl border border-[#D4AF37]/30">
              📲 Our express rider will contact you prior to pickup/delivery.
            </p>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-[48px] py-3.5 rounded-2xl bg-[#6B46C1] text-white font-extrabold font-manrope text-sm hover:bg-[#341168] transition-all cursor-pointer shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Done</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : paymentMode === 'cod' ? (
          /* Pay on Delivery Mode */
          <div className="space-y-5 py-2 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e2e1] pb-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-1.5">
                  <div className="bg-[#341168] text-[#D4AF37] font-black px-2.5 py-1 rounded-md text-xs font-mono tracking-tight flex items-center gap-1 shadow-xs">
                    <Banknote className="w-3.5 h-3.5" />
                    <span>CASH / TILL</span>
                  </div>
                  <span className="text-[11px] font-extrabold font-manrope uppercase tracking-wider text-[#341168] bg-[#D4AF37]/20 px-2.5 py-1 rounded-md border border-[#D4AF37]/30">
                    Pay on Delivery
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-manrope text-[#341168]">
                  Cash or Till at Doorstep
                </h3>
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="self-end sm:self-auto p-2 text-[#7b7581] hover:text-[#1c1b1b] rounded-full hover:bg-[#f6f3f2] transition-colors cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="bg-[#f6f3f2] rounded-2xl p-4 border border-[#e5e2e1] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6B46C1] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Truck className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#341168] text-sm font-manrope">Doorstep Cash or M-Pesa Till</h4>
                  <p className="text-xs text-[#7b7581]">Pay directly to our rider when we pick up or deliver your garments.</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-[#e5e2e1]">
                <span className="text-xs font-bold text-[#7b7581] uppercase font-manrope">Total Amount Due</span>
                <span className="text-xl font-black font-manrope text-[#341168]">Ksh {formattedAmount}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmCod}
              disabled={isSubmitting}
              className="w-full min-h-[48px] h-12 py-3 rounded-2xl bg-[#6B46C1] text-white font-black font-manrope text-base hover:bg-[#341168] disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-[#6B46C1]/20 active:scale-98 flex items-center justify-center gap-2"
            >
              <Truck className="w-5 h-5 text-[#D4AF37]" />
              <span>Confirm Booking</span>
            </button>

            <div className="bg-[#FFFDF0] rounded-2xl p-3 sm:p-3.5 border border-[#D4AF37]/50 flex items-center gap-3 text-xs text-[#524100] font-bold">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#6B46C1]" />
              </div>
              <div className="leading-snug">
                <span>Express Rider Dispatch</span>
                <span className="block text-[10px] text-[#745c00] font-normal">Our rider will call you on arrival to collect payment via Cash or Till.</span>
              </div>
            </div>
          </div>
        ) : (
          /* M-PESA Paybill Mode */
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e2e1] pb-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-1.5">
                  {/* M-PESA Styled Badge */}
                  <div className="bg-[#00A352] text-white font-black px-2.5 py-1 rounded-md text-xs font-mono tracking-tight flex items-center gap-1 shadow-xs">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>M-PESA</span>
                  </div>
                  <span className="text-[11px] font-extrabold font-manrope uppercase tracking-wider text-[#D4AF37] bg-[#341168] px-2.5 py-1 rounded-md">
                    Paybill Direct
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-manrope text-[#341168]">
                  Complete Payment via M-PESA
                </h3>
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="self-end sm:self-auto p-2 text-[#7b7581] hover:text-[#1c1b1b] rounded-full hover:bg-[#f6f3f2] transition-colors cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Payment Instructions (Numbered List) */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6B46C1] font-manrope flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Payment Instructions
              </h4>

              <div className="space-y-3 text-sm">
                {/* Instruction Step 1 */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f6f3f2] border border-[#e5e2e1]">
                  <div className="w-7 h-7 rounded-full bg-[#341168] text-[#D4AF37] font-black font-manrope flex items-center justify-center text-xs shrink-0 shadow-xs">
                    1
                  </div>
                  <div className="pt-0.5 text-[#1c1b1b] font-medium leading-tight">
                    Go to <strong className="font-extrabold text-[#341168]">M-PESA</strong> &gt; <strong className="font-extrabold text-[#341168]">Lipa na M-PESA</strong> &gt; <strong className="font-extrabold text-[#341168]">Paybill</strong>
                  </div>
                </div>

                {/* Instruction Step 2: Business No */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-[#f6f3f2] border border-[#e5e2e1]">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#341168] text-[#D4AF37] font-black font-manrope flex items-center justify-center text-xs shrink-0 shadow-xs">
                      2
                    </div>
                    <div>
                      <div className="text-xs text-[#7b7581] font-bold uppercase font-manrope">Business No</div>
                      <div className="text-lg font-black font-mono text-[#341168] tracking-wider">{businessNo}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(businessNo, 'business')}
                    className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#6B46C1] text-white font-extrabold font-manrope text-xs hover:bg-[#341168] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    {copiedField === 'business' ? (
                      <>
                        <Check className="w-4 h-4 text-[#D4AF37]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#D4AF37]" />
                        <span>Copy Business No</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instruction Step 3: Account No */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-[#f6f3f2] border border-[#e5e2e1]">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#341168] text-[#D4AF37] font-black font-manrope flex items-center justify-center text-xs shrink-0 shadow-xs">
                      3
                    </div>
                    <div>
                      <div className="text-xs text-[#7b7581] font-bold uppercase font-manrope">Account No</div>
                      <div className="text-lg font-black font-mono text-[#341168] tracking-wider">{accountNo}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(accountNo, 'account')}
                    className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#6B46C1] text-white font-extrabold font-manrope text-xs hover:bg-[#341168] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    {copiedField === 'account' ? (
                      <>
                        <Check className="w-4 h-4 text-[#D4AF37]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#D4AF37]" />
                        <span>Copy Account No</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instruction Step 4: Amount */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#341168] to-[#6B46C1] text-white border border-[#6B46C1]">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-[#341168] font-black font-manrope flex items-center justify-center text-xs shrink-0 shadow-xs">
                      4
                    </div>
                    <div>
                      <div className="text-xs text-[#D4AF37] font-extrabold uppercase font-manrope">Amount to Pay</div>
                      <div className="text-xs text-purple-200">Auto-calculated from your cart</div>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-manrope text-[#D4AF37]">
                    Ksh {formattedAmount}
                  </div>
                </div>
              </div>
            </div>

            {/* Code Confirmation Form */}
            <form onSubmit={handleConfirmPayment} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-sm font-extrabold text-[#341168] block font-manrope">
                  Already Paid? Enter your M-PESA code below
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={mpesaCode}
                    onChange={handleCodeChange}
                    placeholder="e.g. SDX4J2K9L"
                    maxLength={10}
                    className="w-full min-h-[48px] p-3.5 pr-14 rounded-2xl border-2 border-[#6B46C1] bg-white text-lg font-mono font-black text-[#341168] placeholder:text-gray-300 placeholder:font-sans placeholder:font-normal uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all shadow-inner"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-[#6B46C1] bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                    {mpesaCode.length}/10
                  </div>
                </div>
                {inputError && (
                  <p className="text-xs text-red-600 font-bold pt-1">{inputError}</p>
                )}
              </div>

              {/* Confirm Payment Button */}
              <button
                type="submit"
                disabled={isSubmitting || mpesaCode.length !== 10}
                className="w-full min-h-[48px] h-12 py-3 rounded-2xl bg-[#6B46C1] text-white font-black font-manrope text-base hover:bg-[#341168] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-[#6B46C1]/20 active:scale-98 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Saving Payment Details...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                    <span>Confirm Payment</span>
                  </>
                )}
              </button>

              <p className="text-[11px] sm:text-xs text-[#7b7581] text-center font-medium leading-relaxed">
                We will verify your payment in 5-10 minutes and confirm via SMS/WhatsApp
              </p>
            </form>

            {/* Trust Note */}
            <div className="bg-[#FFFDF0] rounded-2xl p-3 sm:p-3.5 border border-[#D4AF37]/50 flex items-center gap-3 text-xs text-[#524100] font-bold">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#6B46C1]" />
              </div>
              <div className="leading-snug">
                <span>Your order is reserved for 30 minutes</span>
                <span className="block text-[10px] text-[#745c00] font-normal">Complete payment within 30 mins to hold your preferred pickup slot.</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
