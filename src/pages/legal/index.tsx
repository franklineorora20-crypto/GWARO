import React from 'react';
import { ShieldCheck, FileText, Scale, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import type { PageType } from '../../types';

interface LegalPageProps {
  onNavigate: (page: PageType) => void;
}

export const TermsPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-worksans text-neutral-800 dark:text-neutral-200">
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-bold font-manrope text-[#5E228B] dark:text-[#FED65B] hover:underline mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-10 border border-black/[0.08] dark:border-white/[0.1] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#5E228B] text-[#FED65B] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E228B] dark:text-[#FED65B] font-manrope">
              Legal & Regulatory Framework · Republic of Kenya
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope text-neutral-900 dark:text-white">
              Terms of Service
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          Effective Date: September 1, 2026 · Governed by the Laws of Kenya (Consumer Protection Act, No. 46 of 2012)
        </p>

        <div className="space-y-5 text-sm leading-relaxed">
          <div>
            <h2 className="text-base font-bold font-manrope text-neutral-900 dark:text-white mb-1.5">
              1. Scope of Garment Care & Concierge Services
            </h2>
            <p>
              Goldtribe Link Laundromat ("Goldtribe", "we", "our") provides professional laundry, dry cleaning, duvet sanitization, carpet cleaning, and doorstep pickup/delivery across Ongata Rongai, Ngong, Karen, Matasia, and Kiserian. By booking a collection or dropping off items at our branches, you agree to these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold font-manrope text-neutral-900 dark:text-white mb-1.5">
              2. Garment Inspection, Tagging & Pre-Existing Conditions
            </h2>
            <p>
              Every load is weighed, itemized, and inspected for colorfastness, delicate trims, and pocket contents upon arrival at our Rongai or Ngong hub. Customers must empty all pockets prior to collection. Goldtribe is not liable for damage caused by forgotten items (pens, lipstick, coins, electronics) or manufacturer care-label inaccuracies.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold font-manrope text-neutral-900 dark:text-white mb-1.5">
              3. Pricing, 16% KRA VAT & M-Pesa Payments
            </h2>
            <p>
              All quoted rates are in Kenyan Shillings (KSh) and are inclusive of 16% Value Added Tax (VAT) in accordance with the Value Added Tax Act (Cap 476, Laws of Kenya). Payments made via Safaricom M-Pesa STK Push or Paybill (880100) are verified directly against the Safaricom Daraja API before official receipts are issued.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold font-manrope text-neutral-900 dark:text-white mb-1.5">
              4. Uncollected Garments (90-Day Storage Window)
            </h2>
            <p>
              Processed items are held free of charge for 30 days after completion notification via SMS/WhatsApp. Items uncollected after 90 days despite three documented notices may be donated to registered charitable homes in Kajiado County in accordance with the Disposal of Uncollected Goods Act (Cap 38, Laws of Kenya).
            </p>
          </div>
        </div>

        <div className="pt-5 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#5E228B] dark:text-[#FED65B]" /> Hill Valley Place, Magadi Rd, Rongai & Country Arcade, Ngong</span>
          <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#5E228B] dark:text-[#FED65B]" /> +254 777 349 743 / +254 777 140 102</span>
          <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#5E228B] dark:text-[#FED65B]" /> goldtribelink@gmail.com</span>
        </div>
      </div>
    </section>
  );
};

export const PrivacyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-worksans text-neutral-800 dark:text-neutral-200">
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-bold font-manrope text-[#5E228B] dark:text-[#FED65B] hover:underline mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-10 border border-black/[0.08] dark:border-white/[0.1] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#5E228B] text-[#FED65B] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E228B] dark:text-[#FED65B] font-manrope">
              Kenya ODPC Compliant · Data Protection Act, 2019
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope text-neutral-900 dark:text-white">
              Privacy & Data Protection Policy
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          Compliant with the Office of the Data Protection Commissioner (ODPC) & Kenya Data Protection Act, No. 24 of 2019.
        </p>

        <div className="space-y-5 text-sm leading-relaxed">
          <div>
            <h2 className="text-base font-bold font-manrope text-neutral-900 dark:text-white mb-1.5">
              1. Personal Data We Collect
            </h2>
            <p>
              Under Section 25 of the Kenya Data Protection Act (2019), we collect only the minimum personal data required to fulfill laundry pickup and delivery: your full name, phone number (for rider dispatch and M-Pesa STK Push), pickup/delivery estate address, and M-Pesa transaction reference codes.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold font-manrope text-neutral-900 dark:text-white mb-1.5">
              2. Lawful Basis & Purpose of Processing
            </h2>
            <p>
              Your data is processed strictly for contractual performance (Section 30(1)(b) of the Act): dispatching riders in Rongai and Ngong, sending real-time wash-stage notifications via SMS/WhatsApp, and reconciling Safaricom Daraja M-Pesa receipts. We never sell, rent, or share customer phone numbers with third-party marketers.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold font-manrope text-neutral-900 dark:text-white mb-1.5">
              3. Your Rights as a Data Subject in Kenya (Section 26)
            </h2>
            <p>
              You have the right to: (a) be informed of how your personal data is used; (b) access your order history and personal data; (c) request rectification of inaccurate details; (d) request erasure ("right to be forgotten") of your personal profile; and (e) lodge a complaint with the Office of the Data Protection Commissioner (ODPC) at <strong>www.odpc.go.ke</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold font-manrope text-neutral-900 dark:text-white mb-1.5">
              4. Data Security & Retention
            </h2>
            <p>
              Order records are protected by strict access controls and encrypted transport (TLS 1.3). M-Pesa PINs are entered exclusively on your mobile device via Safaricom SIM Toolkit and are never transmitted to or stored by Goldtribe.
            </p>
          </div>
        </div>

        <div className="pt-5 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <span>Data Protection Officer: Goldtribe Link Laundromat</span>
          <span>Phone: +254 777 349 743</span>
          <span>Email: goldtribelink@gmail.com</span>
        </div>
      </div>
    </section>
  );
};

export const RefundPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-worksans text-neutral-800 dark:text-neutral-200">
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-bold font-manrope text-[#5E228B] dark:text-[#FED65B] hover:underline mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-10 border border-black/[0.08] dark:border-white/[0.1] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#5E228B] text-[#FED65B] flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E228B] dark:text-[#FED65B] font-manrope">
              30-Day Tiered Garment Care Guarantee
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope text-neutral-900 dark:text-white">
              Refund, Re-Wash & Claims Policy
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          Goldtribe Link Laundromat stands behind every garment with our 30-Day Tiered Resolution Guarantee.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
            <div className="text-xs font-bold text-[#5E228B] dark:text-[#FED65B] font-manrope uppercase">Tier 1 · Days 1 – 3</div>
            <div className="text-base font-extrabold font-manrope text-neutral-900 dark:text-white mt-1">100% Free Re-Wash or Full Refund</div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
              Report any pressing, stain, or finishing concern within 72 hours of delivery for complimentary priority pickup, re-processing, or a 100% M-Pesa refund of that item's cleaning charge.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
            <div className="text-xs font-bold text-[#5E228B] dark:text-[#FED65B] font-manrope uppercase">Tier 2 · Days 4 – 14</div>
            <div className="text-base font-extrabold font-manrope text-neutral-900 dark:text-white mt-1">50% Credit or Free Re-Clean</div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
              Claims filed between 4 and 14 days after delivery qualify for a complimentary re-clean or a 50% service credit applied directly to your next Goldtribe booking.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
            <div className="text-xs font-bold text-[#5E228B] dark:text-[#FED65B] font-manrope uppercase">Tier 3 · Days 15 – 30</div>
            <div className="text-base font-extrabold font-manrope text-neutral-900 dark:text-white mt-1">Verified Damage & Loss Coverage</div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
              Up to 30 days post-order, verified garment loss or facility damage is compensated up to 5× the cleaning fee of the affected item via M-Pesa reversal within 48 hours.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed pt-2">
          <h2 className="text-base font-bold font-manrope text-neutral-900 dark:text-white">
            How to Request an M-Pesa Refund or Re-Wash
          </h2>
          <p>
            Contact our Rongai or Ngong branch desk on WhatsApp at <strong>+254 777 349 743</strong> or email <strong>goldtribelink@gmail.com</strong> with your Order Tracking ID (e.g. <code>GL-XXXXXX</code>) and M-Pesa receipt code. Approved M-Pesa refunds are disbursed within 24–48 business hours.
          </p>
        </div>
      </div>
    </section>
  );
};
