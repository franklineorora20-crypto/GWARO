import React, { useState } from 'react';
import { ServiceCategory, ServiceItem } from '../types';
import { INITIAL_SERVICES } from '../data/initialData';
import { Shirt, Sparkles, CheckCircle2, ArrowRight, Bed, Layers, Building2, Plus } from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceName: string) => void;
  onOpenBooking: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForBooking,
  onOpenBooking
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');

  const categories: { key: ServiceCategory; label: string }[] = [
    { key: 'all', label: 'All Services' },
    { key: 'laundry', label: 'Professional Laundry' },
    { key: 'dry-cleaning', label: 'Dry Cleaning' },
    { key: 'duvet-clinic', label: 'Duvet Clinic' },
    { key: 'carpet-cleaning', label: 'Carpets & Curtains' },
    { key: 'janitorial', label: 'Janitorial Services' },
  ];

  const filteredServices = selectedCategory === 'all' 
    ? INITIAL_SERVICES 
    : INITIAL_SERVICES.filter(s => s.category === selectedCategory);

  return (
    <section id="services" className="py-16 sm:py-24 bg-[#f6f3f2] dark:bg-[#0f0717] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#341168]/10 dark:bg-white/10 text-[#341168] dark:text-[#FED65B] font-bold text-xs uppercase tracking-wider font-manrope">
            <Sparkles className="w-3.5 h-3.5 text-[#735c00] dark:text-[#FED65B]" />
            <span>Garment & Space Revitalization</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-[#341168] dark:text-white">
            Our Specialist Services
          </h2>
          <p className="text-sm sm:text-base font-worksans text-[#4a4550] dark:text-gray-300">
            From executive suits to heavy king duvets and household carpets, Goldtribe Link Laundromat handles every garment with specialized care.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold font-manrope transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-[#341168] dark:bg-[#FED65B] text-white dark:text-[#2F2F2F] shadow-md font-black'
                    : 'bg-white dark:bg-[#1a0c2a] text-[#4a4550] dark:text-gray-200 border border-[#e5e2e1] dark:border-white/10 hover:border-[#341168]/30 dark:hover:border-white/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isDuvet = service.category === 'duvet-clinic';

            return (
              <div
                key={service.id}
                className={`rounded-3xl p-6 transition-all duration-300 group flex flex-col justify-between border ${
                  isDuvet 
                    ? 'bg-[#341168] dark:bg-[#25103c] text-white border-[#341168] dark:border-[#FED65B]/40 shadow-xl relative overflow-hidden' 
                    : 'bg-white dark:bg-[#1a0c2a] text-[#1c1b1b] dark:text-white border-[#e5e2e1] dark:border-white/10 hover:border-[#fed65b] hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDuvet 
                        ? 'bg-[#fed65b] text-[#341168]' 
                        : 'bg-[#341168]/10 dark:bg-white/10 text-[#341168] dark:text-[#FED65B] group-hover:bg-[#fed65b] dark:group-hover:bg-[#FED65B] dark:group-hover:text-[#2F2F2F] transition-colors'
                    }`}>
                      {service.category === 'laundry' && <Shirt className="w-6 h-6" />}
                      {service.category === 'dry-cleaning' && <Sparkles className="w-6 h-6" />}
                      {service.category === 'duvet-clinic' && <Bed className="w-6 h-6" />}
                      {service.category === 'carpet-cleaning' && <Layers className="w-6 h-6" />}
                      {service.category === 'janitorial' && <Building2 className="w-6 h-6" />}
                    </div>

                    {service.popular && (
                      <span className="bg-[#fed65b] text-[#745c00] font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                        Best Seller
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-xl font-bold font-manrope mb-2 ${isDuvet ? 'text-white' : 'text-[#341168] dark:text-white'}`}>
                    {service.name}
                  </h3>
                  <p className={`text-xs sm:text-sm font-worksans mb-4 leading-relaxed ${
                    isDuvet ? 'text-white/80' : 'text-[#4a4550] dark:text-gray-300'
                  }`}>
                    {service.description}
                  </p>

                  {/* Service Card Image if present */}
                  {service.image && (
                    <div className="rounded-2xl overflow-hidden mb-4 h-36 border border-black/5 dark:border-white/10">
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Features List */}
                  <ul className="space-y-1.5 mb-6 text-xs font-worksans">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className={`flex items-center gap-2 ${isDuvet ? 'text-white/90' : 'text-[#4a4550] dark:text-gray-300'}`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isDuvet ? 'text-[#fed65b]' : 'text-[#735c00] dark:text-[#FED65B]'}`} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Footer */}
                <div className={`pt-4 border-t flex items-center justify-between mt-2 ${
                  isDuvet ? 'border-white/20' : 'border-[#e5e2e1] dark:border-white/10'
                }`}>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7b7581] dark:text-gray-400 block">Standard Rate</span>
                    <span className={`text-lg sm:text-xl font-extrabold font-manrope ${
                      isDuvet ? 'text-[#fed65b]' : 'text-[#341168] dark:text-[#FED65B]'
                    }`}>
                      Ksh {service.price.toLocaleString()}
                    </span>
                    <span className={`text-xs ml-1 font-worksans ${isDuvet ? 'text-white/70' : 'text-[#4a4550] dark:text-gray-300'}`}>
                      / {service.priceUnit}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectServiceForBooking(service.name);
                      onOpenBooking();
                    }}
                    className={`px-4 py-2 rounded-full font-bold text-xs font-manrope flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDuvet 
                        ? 'bg-[#fed65b] text-[#341168] hover:bg-white' 
                        : 'bg-[#341168] dark:bg-[#5E228B] text-white hover:bg-[#4b2c7f] dark:hover:bg-[#4A1772]'
                    }`}
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner callout */}
        <div className="mt-12 bg-white dark:bg-[#1a0c2a] rounded-3xl p-6 sm:p-8 border border-[#e5e2e1] dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold font-manrope text-[#341168] dark:text-white">
              Need commercial, hostel, or recurring bulk laundry rates?
            </h3>
            <p className="text-xs sm:text-sm font-worksans text-[#4a4550] dark:text-gray-300">
              We offer customized corporate invoicing and weekly scheduled pickups for Rongai and Ngong businesses.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="shrink-0 bg-[#fed65b] text-[#745c00] px-6 py-3 rounded-full font-bold text-xs sm:text-sm font-manrope hover:bg-[#ffe088] transition-colors cursor-pointer"
          >
            Request Corporate Quote
          </button>
        </div>
      </div>
    </section>
  );
};
