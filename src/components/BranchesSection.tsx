import React from 'react';
import { INITIAL_BRANCHES } from '../data/initialData';
import { MapPin, Phone, MessageSquare, ExternalLink, Clock, Truck, ShieldCheck } from 'lucide-react';

interface BranchesSectionProps {
  onOpenBooking: () => void;
}

export const BranchesSection: React.FC<BranchesSectionProps> = ({ onOpenBooking }) => {
  // Check if open (7:00 AM to 8:00 PM)
  const now = new Date();
  const hour = now.getHours();
  const isOpenNow = hour >= 7 && hour < 20;

  return (
    <section id="locations" className="py-16 sm:py-24 bg-[#f6f3f2] dark:bg-[#0f0717] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header matching Image 5 */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-[#e5e2e1] dark:border-white/10 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-[#341168] dark:text-white">
              Our Branches
            </h2>
            <p className="text-sm font-worksans text-[#4a4550] dark:text-gray-300">
              Conveniently located to serve you better.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1a0c2a] text-[#341168] dark:text-white font-bold text-xs font-manrope border border-[#e5e2e1] dark:border-white/10 shadow-2xs">
              <Truck className="w-4 h-4 text-[#735c00] dark:text-[#FED65B]" />
              <span>Pick Up & Delivery Available</span>
            </span>
          </div>
        </div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INITIAL_BRANCHES.map((branch) => (
            <div
              key={branch.id}
              className="bg-white dark:bg-[#1a0c2a] rounded-3xl p-6 sm:p-8 border border-[#e5e2e1] dark:border-white/10 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Branch Name & Phone Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#341168] dark:bg-[#5E228B] text-white flex items-center justify-center shadow-md border border-[#FED65B]/30">
                      <MapPin className="w-6 h-6 text-[#fed65b]" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold font-manrope text-[#341168] dark:text-white">
                        {branch.name}
                      </h3>
                      <p className="text-xs text-[#735c00] dark:text-[#FED65B] font-bold font-worksans">
                        {branch.locationName}
                      </p>
                    </div>
                  </div>

                  <span className="bg-[#fed65b]/30 dark:bg-[#FED65B]/20 text-[#745c00] dark:text-[#FED65B] text-xs font-bold px-3 py-1 rounded-full font-manrope">
                    Active Hub
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 font-worksans text-xs sm:text-sm text-[#4a4550] dark:text-gray-300">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#341168] dark:text-[#FED65B] shrink-0 mt-1" />
                    <span>{branch.fullAddress}</span>
                  </p>

                  <p className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#341168] dark:text-[#FED65B] shrink-0" />
                    <span>{branch.hours}</span>
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={`tel:${branch.phone}`}
                      className="inline-flex items-center gap-2 text-base sm:text-lg font-bold font-manrope text-[#341168] dark:text-[#FED65B] hover:text-[#735c00] transition-colors"
                    >
                      <Phone className="w-5 h-5 text-[#735c00] dark:text-[#FED65B]" />
                      <span>{branch.phoneDisplay}</span>
                    </a>

                    <a
                      href={`https://wa.me/${branch.whatsapp}?text=Hello%20Goldtribe%20Link%20Laundromat,%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs font-manrope flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Us</span>
                    </a>
                  </div>
                </div>

                {/* Branch Image */}
                <div className="h-48 rounded-2xl overflow-hidden border border-[#e5e2e1] relative group-hover:shadow-md transition-all">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(branch.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#341168] px-3 py-1.5 rounded-full text-xs font-bold font-manrope shadow-md flex items-center gap-1 hover:bg-white transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-[#735c00]" />
                  </a>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 mt-6 border-t border-[#e5e2e1] flex justify-between items-center">
                <span className="text-xs text-[#7b7581] font-worksans">Doorstep Collection Available</span>
                <button
                  onClick={onOpenBooking}
                  className="bg-[#341168] text-white px-5 py-2.5 rounded-full text-xs font-bold font-manrope hover:bg-[#4b2c7f] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Truck className="w-3.5 h-3.5 text-[#fed65b]" />
                  <span>Book Collection</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
