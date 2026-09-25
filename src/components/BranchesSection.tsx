import React from 'react';
import { motion } from 'motion/react';
import { INITIAL_BRANCHES } from '../data/initialData';
import { MapPin, Phone, MessageSquare, ExternalLink, Clock, Truck, ArrowRight } from 'lucide-react';

interface BranchesSectionProps {
  onOpenBooking: () => void;
}

export const BranchesSection: React.FC<BranchesSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="locations" className="py-20 sm:py-28 bg-[#FAFAFB] dark:bg-[#0c0418] relative transition-colors duration-200 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="text-xs font-semibold tracking-tight text-[#5E228B] dark:text-[#FED65B]">
              Physical Locations & Rider Drop-offs
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-neutral-900 dark:text-white tracking-[-0.02em]">
              Our Branch Hubs
            </h2>
            <p className="text-xs sm:text-sm font-worksans text-neutral-600 dark:text-neutral-400">
              Drop off your laundry directly or summon a rider for free collection within 1km.
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onOpenBooking}
            className="px-5 py-2.5 rounded-full bg-[#5E228B] text-white font-bold font-manrope text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(94,34,139,0.3)] flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Truck className="w-3.5 h-3.5 text-[#FED65B]" />
            <span>Book Courier to Gate</span>
          </motion.button>
        </div>

        {/* Branch Cards with Emil Kowalski Craft Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_BRANCHES.map((branch) => (
            <motion.div
              key={branch.id}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              {/* Top hairline highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/[0.08] dark:via-white/[0.15] to-transparent" />

              <div className="space-y-5">
                {/* Branch Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5E228B]/[0.08] dark:bg-white/[0.08] text-[#5E228B] dark:text-[#FED65B] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-manrope text-neutral-900 dark:text-white tracking-tight">
                        {branch.name}
                      </h3>
                      <p className="text-xs text-[#5E228B] dark:text-[#FED65B] font-semibold font-manrope">
                        {branch.locationName}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Open Now · 7am–8pm
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs font-worksans text-neutral-600 dark:text-neutral-300">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{branch.fullAddress}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{branch.hours}</span>
                  </p>
                </div>

                {/* Branch Image Frame */}
                {branch.image && (
                  <div className="h-44 rounded-2xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-neutral-100 dark:bg-white/[0.04]">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <a
                  href={`tel:${branch.phone}`}
                  className="inline-flex items-center gap-2 text-sm font-bold font-manrope text-neutral-900 dark:text-white hover:text-[#5E228B] dark:hover:text-[#FED65B] transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#E2B227]" />
                  <span>{branch.phoneDisplay}</span>
                </a>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <a
                    href={`https://wa.me/${branch.whatsapp}?text=Hello%20Goldtribe%20Link%20Laundromat,%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-manrope flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={onOpenBooking}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-full bg-[#5E228B] hover:bg-[#501a78] text-white text-xs font-bold font-manrope flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3 text-[#FED65B]" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
