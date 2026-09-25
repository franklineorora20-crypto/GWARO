import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Plus, Minus, ArrowRight, Truck, Sparkles, RefreshCw, Table, ShieldCheck, Check } from 'lucide-react';
import { INITIAL_SERVICES } from '../data/initialData';

interface PriceCalculatorProps {
  onProceedToBookingWithItems: (items: { serviceName: string; quantity: number; unitPrice: number }[], total: number) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  onProceedToBookingWithItems
}) => {
  const [activeView, setActiveView] = useState<'calculator' | 'pricelist'>('calculator');

  // Quantities for each item id
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    's-1': 1, // 1-7kg Wash & Fold default
    's-3': 1, // 1 suit default
    's-5': 1  // 1 duvet default
  });

  // Add-ons state
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [extraSoftener, setExtraSoftener] = useState(true);
  const [stainTreatment, setStainTreatment] = useState(false);
  const [hangers, setHangers] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleReset = () => {
    setQuantities({ 's-1': 0 });
    setExpressDelivery(false);
    setExtraSoftener(false);
    setStainTreatment(false);
    setHangers(false);
  };

  // Calculate items subtotal
  const selectedItems = INITIAL_SERVICES.map(s => {
    const qty = quantities[s.id] || 0;
    return {
      service: s,
      quantity: qty,
      total: qty * s.price
    };
  }).filter(item => item.quantity > 0);

  const itemsSubtotal = selectedItems.reduce((sum, item) => sum + item.total, 0);

  // Add-ons total
  let addOnsTotal = 0;
  if (expressDelivery) addOnsTotal += 300;
  if (extraSoftener) addOnsTotal += 100;
  if (stainTreatment) addOnsTotal += 200;
  if (hangers) addOnsTotal += 150;

  const deliveryFee = 0; // Free within 1km
  const finalTotal = itemsSubtotal + addOnsTotal + deliveryFee;

  const handleBookQuote = () => {
    const formattedItems = selectedItems.map(item => ({
      serviceName: item.service.name,
      quantity: item.quantity,
      unitPrice: item.service.price
    }));

    if (expressDelivery) {
      formattedItems.push({ serviceName: 'Express Same-Day Turnaround', quantity: 1, unitPrice: 300 });
    }
    if (extraSoftener) {
      formattedItems.push({ serviceName: 'Premium Softener & Lavender Scent', quantity: 1, unitPrice: 100 });
    }
    if (stainTreatment) {
      formattedItems.push({ serviceName: 'Heavy Stain Pre-treatment', quantity: 1, unitPrice: 200 });
    }
    if (hangers) {
      formattedItems.push({ serviceName: 'Garment Hanger Packaging', quantity: 1, unitPrice: 150 });
    }

    onProceedToBookingWithItems(formattedItems, finalTotal);
  };

  // Official Dry Cleaning Full Rates Table
  const dryCleaningList = [
    { name: '2 Pc Suits', unit: '1', price: 450 },
    { name: 'Kaunda Suits', unit: '1', price: 400 },
    { name: 'Kids\' Suits', unit: '1', price: 250 },
    { name: 'White / Cream Coat', unit: '1', price: 250 },
    { name: 'Trench Coat (Long)', unit: '1', price: 550 },
    { name: 'Trench Coat (Short)', unit: '1', price: 450 },
    { name: 'Suede / Leather Coat', unit: '1', price: 700 },
    { name: 'Jacket', unit: '1', price: 300 },
    { name: 'Trouser', unit: '1', price: 200 },
    { name: 'Dress Plain', unit: '1', price: 300 },
    { name: 'Plain Skirt', unit: '1', price: 150 },
    { name: 'Pleated Skirt', unit: '1', price: 350 },
    { name: 'Sleeping Bag', unit: '1', price: 500 },
    { name: 'Mattress Cover', unit: '1', price: 500 },
    { name: 'Executive Shirt', unit: '1', price: 150 },
    { name: 'Coat / Blazer', unit: '1', price: 250 },
    { name: 'Dress Pleated', unit: '1', price: 450 },
    { name: 'Blouse', unit: '1', price: 150 },
    { name: '3 PC Suit', unit: '1', price: 550 },
    { name: 'Linen Suit', unit: '1', price: 550 },
    { name: 'Vitenge / Traditional Dress', unit: '1', price: 400 },
    { name: 'Cashmere Wool Sweater', unit: '1', price: 600 },
    { name: 'Cashmere with Leather Trim', unit: '1', price: 650 },
  ];

  const normalLaundryTiers = [
    {
      tier: 'Standard Load (1-7kg)',
      items: [
        { name: 'Clothes Wash', unit: 'per load', price: 450 },
        { name: 'Clothes Dry', unit: 'per load', price: 450 },
        { name: 'Clothes Iron', unit: 'per load', price: 450 },
        { name: 'Towels Wash', unit: 'per load', price: 600 },
        { name: 'Towels Dry', unit: 'per load', price: 600 },
      ]
    },
    {
      tier: 'Heavy Family Load (12kg)',
      items: [
        { name: 'Clothes Wash', unit: 'per load', price: 750 },
        { name: 'Clothes Dry', unit: 'per load', price: 750 },
        { name: 'Clothes Iron', unit: 'per load', price: 750 },
      ]
    },
    {
      tier: 'Drapery & Linens (3kg)',
      items: [
        { name: 'Curtains Dry', unit: 'per load', price: 500 },
        { name: 'Curtains Iron', unit: 'per load', price: 500 },
      ]
    },
    {
      tier: 'Bedding & Pillows',
      items: [
        { name: 'Duvet Cleaning (Single)', unit: '1 piece', price: 850 },
        { name: 'Duvet Cleaning (King/Queen 2-pc)', unit: '1 set', price: 1400 },
        { name: 'Pillow Wash', unit: '1 pair', price: 450 },
        { name: 'Pillow Dry', unit: '1 pair', price: 450 },
      ]
    }
  ];

  return (
    <section id="calculator" className="py-20 sm:py-28 bg-[#FAFAFB] dark:bg-[#0c0418] relative transition-colors duration-200 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header & View Switcher */}
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-semibold tracking-tight text-[#5E228B] dark:text-[#FED65B]">
            Transparent Pricing · Real-Time Calculation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-neutral-900 dark:text-white tracking-[-0.02em] [text-wrap:balance]">
            Interactive Price Estimator
          </h2>
          <p className="text-sm font-worksans text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Select items to get an instantaneous quote, or inspect our verified fixed price list below.
          </p>

          {/* Emil Kowalski Style Segmented View Switcher */}
          <div className="flex justify-center p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] w-fit mx-auto mt-4">
            <button
              onClick={() => setActiveView('calculator')}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold font-manrope transition-colors cursor-pointer flex items-center gap-2 z-10 ${
                activeView === 'calculator' 
                  ? 'text-white dark:text-[#0c0418]' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {activeView === 'calculator' && (
                <motion.div
                  layoutId="calcViewPill"
                  transition={{ type: "spring", stiffness: 440, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#5E228B] dark:bg-[#FED65B] shadow-[0_2px_8px_rgba(94,34,139,0.25)] -z-10"
                />
              )}
              <Calculator className="w-3.5 h-3.5" />
              <span>Custom Quote</span>
            </button>

            <button
              onClick={() => setActiveView('pricelist')}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold font-manrope transition-colors cursor-pointer flex items-center gap-2 z-10 ${
                activeView === 'pricelist' 
                  ? 'text-white dark:text-[#0c0418]' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {activeView === 'pricelist' && (
                <motion.div
                  layoutId="calcViewPill"
                  transition={{ type: "spring", stiffness: 440, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#5E228B] dark:bg-[#FED65B] shadow-[0_2px_8px_rgba(94,34,139,0.25)] -z-10"
                />
              )}
              <Table className="w-3.5 h-3.5" />
              <span>Complete Rate Sheet</span>
            </button>
          </div>
        </div>

        {/* View 1: Calculator */}
        {activeView === 'calculator' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Items Selector (Left 7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#130722] rounded-2xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
                <div>
                  <h3 className="font-bold font-manrope text-base sm:text-lg text-neutral-900 dark:text-white tracking-tight">
                    Garments & Household Items
                  </h3>
                  <p className="text-xs text-neutral-500 font-worksans">Adjust counts to compute immediate quote</p>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </motion.button>
              </div>

              {/* Garment Counter Cards */}
              <div className="space-y-2.5">
                {INITIAL_SERVICES.slice(0, 7).map((s) => {
                  const qty = quantities[s.id] || 0;

                  return (
                    <div 
                      key={s.id} 
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                        qty > 0 
                          ? 'bg-neutral-50/80 dark:bg-white/[0.05] border-[#5E228B]/30 dark:border-[#FED65B]/30' 
                          : 'bg-white dark:bg-transparent border-black/[0.06] dark:border-white/[0.06]'
                      }`}
                    >
                      <div className="flex-1 pr-3">
                        <div className="font-bold font-manrope text-xs sm:text-sm text-neutral-900 dark:text-white tracking-tight">
                          {s.name}
                        </div>
                        <div className="text-xs text-[#5E228B] dark:text-[#FED65B] font-semibold tabular-nums">
                          Ksh {s.price.toLocaleString()} <span className="text-neutral-400 font-normal">/ {s.priceUnit}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Tactile Counter Buttons with spring micro-interactions */}
                        <div className="flex items-center border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#180a2c] rounded-lg p-0.5 shadow-2xs">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(s.id, -1)}
                            className="w-7 h-7 rounded-md hover:bg-neutral-100 dark:hover:bg-white/[0.08] flex items-center justify-center text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
                            aria-label={`Decrease ${s.name}`}
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>

                          <span className="w-8 text-center font-bold font-manrope text-xs sm:text-sm text-neutral-900 dark:text-white tabular-nums">
                            {qty}
                          </span>

                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(s.id, 1)}
                            className="w-7 h-7 rounded-md bg-[#5E228B] dark:bg-[#FED65B] text-white dark:text-[#0c0418] hover:brightness-110 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                            aria-label={`Increase ${s.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>

                        <div className="w-16 text-right font-bold font-manrope text-xs sm:text-sm text-neutral-900 dark:text-white tabular-nums">
                          Ksh {(qty * s.price).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Care Add-ons with spring checkboxes */}
              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                <h4 className="font-bold font-manrope text-xs sm:text-sm text-neutral-900 dark:text-white mb-3">
                  Optional Care Treatments
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { label: 'Same-Day Express (+Ksh 300)', state: expressDelivery, setter: setExpressDelivery },
                    { label: 'Lavender Softener (+Ksh 100)', state: extraSoftener, setter: setExtraSoftener },
                    { label: 'Stain Pre-treatment (+Ksh 200)', state: stainTreatment, setter: setStainTreatment },
                    { label: 'Garment Hanger Packing (+Ksh 150)', state: hangers, setter: setHangers },
                  ].map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => opt.setter(!opt.state)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                        opt.state 
                          ? 'bg-[#5E228B]/[0.06] dark:bg-white/[0.08] border-[#5E228B]/40 dark:border-[#FED65B]/40 text-neutral-900 dark:text-white' 
                          : 'bg-white dark:bg-transparent border-black/[0.06] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <span className="text-xs font-semibold font-manrope">{opt.label}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        opt.state ? 'bg-[#5E228B] dark:bg-[#FED65B] border-transparent text-white dark:text-black' : 'border-neutral-300 dark:border-neutral-600'
                      }`}>
                        {opt.state && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quote Summary Sidebar (Right 5 cols) */}
            <div className="lg:col-span-5 bg-[#140824] text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-white/[0.1] sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.1] pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FED65B]" />
                  <h3 className="font-bold font-manrope text-sm sm:text-base text-white tracking-tight">
                    Order Estimate
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-white/60">
                  Rongai & Ngong
                </span>
              </div>

              {/* Selected Items List */}
              <div className="space-y-2 text-xs font-worksans max-h-52 overflow-y-auto pr-1">
                {selectedItems.length === 0 ? (
                  <p className="text-white/40 italic text-center py-6">
                    No garments added. Use the controls on the left.
                  </p>
                ) : (
                  selectedItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/[0.06]">
                      <div className="truncate pr-2">
                        <span className="font-semibold text-white truncate">{item.service.name}</span>
                        <span className="text-white/50 ml-1.5 tabular-nums">×{item.quantity}</span>
                      </div>
                      <span className="font-bold text-[#FED65B] tabular-nums shrink-0">
                        Ksh {item.total.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Calculations Breakdown */}
              <div className="space-y-2 text-xs pt-3 border-t border-white/[0.08] font-worksans">
                <div className="flex justify-between text-white/70">
                  <span>Items Subtotal</span>
                  <span className="tabular-nums font-semibold text-white">Ksh {itemsSubtotal.toLocaleString()}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-white/70">
                    <span>Care Treatments</span>
                    <span className="tabular-nums font-semibold text-white">Ksh {addOnsTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/70">
                  <span>Doorstep Rider Transit</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
              </div>

              {/* Net Total Display */}
              <div className="bg-white/[0.06] p-4 rounded-xl border border-white/[0.08] flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider block">
                    Calculated Total
                  </span>
                  <motion.span 
                    key={finalTotal}
                    initial={{ scale: 0.96 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="text-2xl sm:text-3xl font-extrabold font-manrope text-[#FED65B] tabular-nums"
                  >
                    Ksh {finalTotal.toLocaleString()}
                  </motion.span>
                </div>
                <Truck className="w-6 h-6 text-[#FED65B]/60" />
              </div>

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={finalTotal === 0}
                onClick={handleBookQuote}
                className={`w-full py-3.5 rounded-full font-bold font-manrope text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  finalTotal === 0
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-[#FED65B] hover:bg-[#ffe180] text-[#140824] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_16px_rgba(254,214,91,0.25)]'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Book Collection with this Estimate</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}

        {/* View 2: Official Price List Tables */}
        {activeView === 'pricelist' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Normal Laundry Table (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#130722] rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.1] shadow-xs">
              <div className="p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.08] flex justify-between items-center">
                <h3 className="font-bold font-manrope text-base text-neutral-900 dark:text-white">
                  Wash, Dry & Steam Iron
                </h3>
                <span className="text-[11px] font-semibold text-neutral-500">Weight Tiers</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-worksans">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-white/[0.03] text-neutral-500 border-b border-black/[0.06] dark:border-white/[0.08]">
                      <th className="px-4 py-2.5 font-semibold">Service</th>
                      <th className="px-4 py-2.5 font-semibold">Load</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                    {normalLaundryTiers.map((group, gIdx) => (
                      <React.Fragment key={gIdx}>
                        <tr className="bg-[#5E228B]/[0.05] dark:bg-white/[0.04]">
                          <td colSpan={3} className="px-4 py-2 font-bold font-manrope text-[11px] uppercase tracking-wider text-[#5E228B] dark:text-[#FED65B]">
                            {group.tier}
                          </td>
                        </tr>
                        {group.items.map((item, i) => (
                          <tr key={i} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02]">
                            <td className="px-4 py-2 font-medium text-neutral-900 dark:text-white pl-6">{item.name}</td>
                            <td className="px-4 py-2 text-neutral-500">{item.unit}</td>
                            <td className="px-4 py-2 text-right font-bold font-manrope text-[#5E228B] dark:text-[#FED65B] tabular-nums">
                              Ksh {item.price.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dry Cleaning Rates (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#130722] rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.1] shadow-xs">
              <div className="p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.08] flex justify-between items-center">
                <h3 className="font-bold font-manrope text-base text-neutral-900 dark:text-white">
                  Executive Dry Cleaning Rates
                </h3>
                <span className="text-[11px] font-semibold text-neutral-500">Formal & Delicate Garments</span>
              </div>

              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs font-worksans">
                  <thead className="sticky top-0 bg-neutral-50 dark:bg-[#1c0d2e] text-neutral-500 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Garment Type</th>
                      <th className="px-4 py-2.5 font-semibold">Unit</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                    {dryCleaningList.map((item, i) => (
                      <tr key={i} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-2.5 font-medium text-neutral-900 dark:text-white">{item.name}</td>
                        <td className="px-4 py-2.5 text-neutral-500">{item.unit}</td>
                        <td className="px-4 py-2.5 text-right font-bold font-manrope text-[#5E228B] dark:text-[#FED65B] tabular-nums">
                          Ksh {item.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
