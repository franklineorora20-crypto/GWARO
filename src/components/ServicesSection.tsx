import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceCategory, ServiceItem } from '../types';
import { INITIAL_SERVICES } from '../data/initialData';
import { Shirt, Sparkles, CheckCircle2, ArrowRight, Bed, Layers, Building2, Plus, Clock } from 'lucide-react';
import { ImageWithSkeleton, ServiceCardSkeleton } from './SkeletonLoaders';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceName: string) => void;
  onOpenBooking: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForBooking,
  onOpenBooking
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [isFiltering, setIsFiltering] = useState(false);

  const handleCategoryChange = (catKey: ServiceCategory) => {
    if (catKey === selectedCategory) return;
    setSelectedCategory(catKey);
    setIsFiltering(true);
    setTimeout(() => {
      setIsFiltering(false);
    }, 180);
  };

  const categories: { key: ServiceCategory; label: string }[] = [
    { key: 'all', label: 'All Services' },
    { key: 'laundry', label: 'Wash & Fold' },
    { key: 'dry-cleaning', label: 'Dry Cleaning' },
    { key: 'duvet-clinic', label: 'Duvet Clinic' },
    { key: 'carpet-cleaning', label: 'Carpets & Linens' },
    { key: 'janitorial', label: 'Janitorial' },
  ];

  const filteredServices = selectedCategory === 'all' 
    ? INITIAL_SERVICES.filter(s => s.popular || ['s-1', 's-2', 's-3', 's-5', 's-10', 's-11'].includes(s.id))
    : INITIAL_SERVICES.filter(s => s.category === selectedCategory);

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#FAFAFB] dark:bg-[#0c0418] transition-colors duration-200 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          {/* Unboxed editorial lead-in */}
          <div className="text-xs font-semibold tracking-tight text-[#5E228B] dark:text-[#FED65B]">
            Pristine Garment Treatments · Non-Toxic Chemistry
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-neutral-900 dark:text-white tracking-[-0.02em] [text-wrap:balance]">
            Specialist Care for Every Fabric
          </h2>
          <p className="text-sm sm:text-base font-worksans text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Every garment receives bespoke fabric assessment, pH-balanced sanitization, and artisanal steam press calibration.
          </p>

          {/* Emil Kowalski Style Segmented Category Tabs with sliding spring pill */}
          <div className="flex overflow-x-auto no-scrollbar max-w-full sm:flex-wrap justify-start sm:justify-center gap-1 p-1 rounded-2xl sm:rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] w-full sm:w-fit mx-auto mt-6">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold font-manrope transition-colors cursor-pointer whitespace-nowrap shrink-0 z-10 ${
                    isSelected
                      ? 'text-white dark:text-[#0c0418]'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="serviceFilterPill"
                      transition={{ type: "spring", stiffness: 440, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-[#5E228B] dark:bg-[#FED65B] shadow-[0_2px_8px_rgba(94,34,139,0.25)] -z-10"
                    />
                  )}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Grid Layout with Tactile Cards */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {isFiltering ? (
              [...Array(filteredServices.length || 3)].map((_, idx) => (
                <ServiceCardSkeleton key={`skeleton-${idx}`} />
              ))
            ) : (
              filteredServices.map((service) => {
                const isLeadCard = service.popular && (service.id === 's-1' || service.id === 's-3');

                return (
                  <motion.div
                    layout
                    key={service.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  whileHover={{ y: -3 }}
                  className={`rounded-2xl p-6 transition-colors flex flex-col justify-between border bg-white dark:bg-[#130722] text-neutral-900 dark:text-white border-black/[0.08] dark:border-white/[0.1] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] group relative overflow-hidden`}
                >
                  {/* Subtle Top Micro-Highlight line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/[0.08] dark:via-white/[0.15] to-transparent" />

                  <div>
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#5E228B]/[0.08] dark:bg-white/[0.08] text-[#5E228B] dark:text-[#FED65B] flex items-center justify-center transition-colors group-hover:bg-[#5E228B] group-hover:text-white dark:group-hover:bg-[#FED65B] dark:group-hover:text-black">
                        {service.category === 'laundry' && <Shirt className="w-5 h-5" />}
                        {service.category === 'dry-cleaning' && <Sparkles className="w-5 h-5" />}
                        {service.category === 'duvet-clinic' && <Bed className="w-5 h-5" />}
                        {service.category === 'carpet-cleaning' && <Layers className="w-5 h-5" />}
                        {service.category === 'janitorial' && <Building2 className="w-5 h-5" />}
                      </div>

                      {/* Quiet Unboxed Status */}
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#E2B227]" />
                        <span className="tabular-nums">{service.turnaround}</span>
                      </div>
                    </div>

                    {/* Image Preview if present */}
                    {service.image && (
                      <div className="rounded-xl overflow-hidden mb-4 h-40 bg-neutral-100 dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08]">
                        <ImageWithSkeleton 
                          src={service.image} 
                          alt={service.name} 
                          aspectClassName="h-40 w-full"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold font-manrope tracking-tight text-neutral-900 dark:text-white mb-1.5">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-worksans text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-1.5 mb-6 text-xs text-neutral-600 dark:text-neutral-400 font-worksans">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#E2B227] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between mt-2">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 tracking-wider">
                        Transparent Rate
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-extrabold font-manrope text-[#5E228B] dark:text-[#FED65B] tabular-nums">
                          Ksh {service.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-neutral-500">
                          / {service.priceUnit}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onSelectServiceForBooking(service.name);
                        onOpenBooking();
                      }}
                      className="px-3.5 py-2 rounded-xl font-bold text-xs font-manrope bg-[#5E228B] hover:bg-[#4d1973] text-white flex items-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3 h-3 text-[#FED65B]" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quiet B2B / Hostel Quote Adjacency Box */}
        <div className="mt-14 rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#130722] border border-black/[0.08] dark:border-white/[0.1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold font-manrope text-neutral-900 dark:text-white tracking-tight">
              Commercial & Hostel Bulk Contracts
            </h3>
            <p className="text-xs sm:text-sm font-worksans text-neutral-600 dark:text-neutral-400">
              Weekly scheduled collection with corporate tax invoicing for Rongai, Ngong, and Karen institutions.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onOpenBooking}
            className="shrink-0 bg-[#FED65B] hover:bg-[#fad046] text-[#1c1b1b] px-5 py-2.5 rounded-full font-bold text-xs font-manrope transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_3px_rgba(0,0,0,0.1)] cursor-pointer"
          >
            Request Institutional Rate Sheet
          </motion.button>
        </div>
      </div>
    </section>
  );
};
