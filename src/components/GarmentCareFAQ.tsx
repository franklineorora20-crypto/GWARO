import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <section id="faq" className="py-20 sm:py-28 bg-[#FAFAFB] dark:bg-[#0c0418] relative transition-colors duration-200 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-semibold tracking-tight text-[#5E228B] dark:text-[#FED65B]">
            Care Advisory & Knowledge · Fabric Preservation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-neutral-900 dark:text-white tracking-[-0.02em] [text-wrap:balance]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm font-worksans text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Everything you need to know about collection logistics, payment verification, and fabric preservation.
          </p>

          {/* Emil Kowalski Segmented Switcher */}
          <div className="flex justify-center p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] w-fit mx-auto mt-4">
            <button
              onClick={() => setActiveTab('faqs')}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold font-manrope transition-colors cursor-pointer z-10 ${
                activeTab === 'faqs' ? 'text-white dark:text-[#0c0418]' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {activeTab === 'faqs' && (
                <motion.div
                  layoutId="faqTabPill"
                  transition={{ type: "spring", stiffness: 440, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#5E228B] dark:bg-[#FED65B] shadow-[0_2px_8px_rgba(94,34,139,0.25)] -z-10"
                />
              )}
              <span>General Questions</span>
            </button>

            <button
              onClick={() => setActiveTab('stain-guide')}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold font-manrope transition-colors cursor-pointer z-10 ${
                activeTab === 'stain-guide' ? 'text-white dark:text-[#0c0418]' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {activeTab === 'stain-guide' && (
                <motion.div
                  layoutId="faqTabPill"
                  transition={{ type: "spring", stiffness: 440, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#5E228B] dark:bg-[#FED65B] shadow-[0_2px_8px_rgba(94,34,139,0.25)] -z-10"
                />
              )}
              <span>Fabric Care Guide</span>
            </button>
          </div>
        </div>

        {/* Tab 1: FAQs with Emil Kowalski Spring Accordion */}
        {activeTab === 'faqs' && (
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#130722] rounded-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-2xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center font-bold font-manrope text-sm sm:text-base text-neutral-900 dark:text-white hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="shrink-0 text-[#5E228B] dark:text-[#FED65B]"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-xs sm:text-sm font-worksans text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-black/[0.04] dark:border-white/[0.06]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Garment Care Guide */}
        {activeTab === 'stain-guide' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stainGuide.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                className="bg-white dark:bg-[#130722] rounded-2xl p-6 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs space-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FED65B]/40 to-transparent" />
                <div className="text-xs font-bold font-manrope text-[#5E228B] dark:text-[#FED65B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{item.fabric}</span>
                </div>
                <p className="text-xs font-worksans text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {item.tip}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
