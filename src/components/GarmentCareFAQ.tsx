import React, { useState } from 'react';
import { FAQS } from '../data/initialData';
import { HelpCircle, ChevronDown, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

export const GarmentCareFAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'faqs' | 'stain-guide'>('faqs');

  const stainGuide = [
    {
      fabric: 'Executive Silk & Chiffon',
      tip: 'Never rub silk stains vigorously. Water drops can mark delicate silk. Goldtribe uses gentle specialized non-aqueous solvents to preserve sheen and structure.'
    },
    {
      fabric: 'Heavy Wool Suits & Blazers',
      tip: 'Hang on wide padded hangers between wears. Steam press rather than direct iron to prevent fiber shine. Dry clean every 3-4 wears to extract city dust.'
    },
    {
      fabric: 'King Down & Fiberfill Duvets',
      tip: 'Wash duvets every 3 months to eliminate dust-mites and skin oil buildup. Sun air alone does not sanitize down deep inside; thermal washing is essential.'
    },
    {
      fabric: 'Genuine Leather & Suede Jackets',
      tip: 'Keep away from direct heat sources. Treat with natural conditioning oils annually to prevent cracking and maintain suppleness.'
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#f6f3f2] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#341168]/10 text-[#341168] font-bold text-xs uppercase font-manrope">
            <HelpCircle className="w-3.5 h-3.5 text-[#735c00]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-[#341168]">
            FAQ & Garment Care Knowledge
          </h2>
          <p className="text-sm font-worksans text-[#4a4550]">
            Everything you need to know about our collection logistics, payment methods, and fabric preservation.
          </p>

          {/* Toggle Tabs */}
          <div className="inline-flex p-1.5 bg-white rounded-full border border-[#e5e2e1] shadow-xs">
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-5 py-2 rounded-full text-xs font-bold font-manrope transition-all cursor-pointer ${
                activeTab === 'faqs' ? 'bg-[#341168] text-white shadow-sm' : 'text-[#4a4550] hover:text-[#341168]'
              }`}
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => setActiveTab('stain-guide')}
              className={`px-5 py-2 rounded-full text-xs font-bold font-manrope transition-all cursor-pointer ${
                activeTab === 'stain-guide' ? 'bg-[#341168] text-white shadow-sm' : 'text-[#4a4550] hover:text-[#341168]'
              }`}
            >
              Fabric Care Guide
            </button>
          </div>
        </div>

        {/* Tab 1: FAQs */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#e5e2e1] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center font-bold font-manrope text-sm sm:text-base text-[#341168] hover:bg-[#f6f3f2] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#735c00] transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm font-worksans text-[#4a4550] leading-relaxed border-t border-[#f6f3f2] animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Garment Care Guide */}
        {activeTab === 'stain-guide' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stainGuide.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-[#e5e2e1] shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-[#341168] font-bold font-manrope text-sm">
                  <BookOpen className="w-4 h-4 text-[#735c00]" />
                  <span>{item.fabric}</span>
                </div>
                <p className="text-xs sm:text-sm font-worksans text-[#4a4550] leading-relaxed">
                  {item.tip}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
