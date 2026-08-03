import React, { useState } from 'react';
import { Calculator, Plus, Minus, Check, ArrowRight, Truck, Sparkles, RefreshCw, Table, ShieldCheck, Tag } from 'lucide-react';
import { INITIAL_SERVICES } from '../data/initialData';

interface PriceCalculatorProps {
  onProceedToBookingWithItems: (items: { serviceName: string; quantity: number; unitPrice: number }[], total: number) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  onProceedToBookingWithItems
}) => {
  const [activeView, setActiveView] = useState<'calculator' | 'pricelist'>('pricelist');

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

  // Delivery fee logic (Free pickup for orders within 1km)
  const deliveryFee = 0;

  const finalTotal = itemsSubtotal + addOnsTotal + deliveryFee;

  const handleBookQuote = () => {
    const formattedItems = selectedItems.map(item => ({
      serviceName: `${item.service.name} (${item.service.priceUnit})`,
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
    { name: 'Mattress Cover', unit: '3kg', price: 500 },
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

  const normalLaundryList = [
    { name: 'Clothes Wash', unit: '1-7kg', price: 450 },
    { name: 'Clothes Dry', unit: '1-7kg', price: 450 },
    { name: 'Clothes Iron', unit: '1-7kg', price: 450 },
    { name: 'Clothes Wash', unit: '12kg', price: 750 },
    { name: 'Clothes Dry', unit: '12kg', price: 750 },
    { name: 'Clothes Iron', unit: '12kg', price: 750 },
    { name: 'Curtains Dry', unit: '3kg', price: 500 },
    { name: 'Curtains Iron', unit: '3kg', price: 500 },
    { name: 'Duvet Cleaning', unit: '1 piece', price: 850 },
    { name: 'Duvet Cleaning', unit: '2 piece', price: 1400 },
    { name: 'Pillow Wash', unit: '1 pair', price: 450 },
    { name: 'Pillow Dry', unit: '1 pair', price: 450 },
    { name: 'Towels Wash', unit: '1-7kg', price: 600 },
    { name: 'Towels Dry', unit: '1-7kg', price: 600 },
  ];

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-[#fcf9f8] dark:bg-[#0f0717] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header & View Switcher */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fed65b]/30 dark:bg-[#FED65B]/10 text-[#745c00] dark:text-[#FED65B] font-bold text-xs uppercase font-manrope">
            <Calculator className="w-3.5 h-3.5 text-[#341168] dark:text-[#FED65B]" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-[#341168] dark:text-white">
            Laundromat Pricing & Estimator
          </h2>
          <p className="text-sm font-worksans text-[#4a4550] dark:text-gray-300">
            Premium care for your garments with transparent, fixed pricing. Choose between our interactive quote calculator or complete rate list.
          </p>

          {/* View Toggle */}
          <div className="inline-flex p-1.5 bg-white dark:bg-[#1a0c2a] rounded-full border border-[#e5e2e1] dark:border-white/10 shadow-xs">
            <button
              onClick={() => setActiveView('calculator')}
              className={`px-5 py-2 rounded-full text-xs font-bold font-manrope transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'calculator' 
                  ? 'bg-[#341168] dark:bg-[#FED65B] text-white dark:text-[#2F2F2F] shadow-sm font-black' 
                  : 'text-[#4a4550] dark:text-gray-300 hover:text-[#341168] dark:hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Calculator</span>
            </button>
            <button
              onClick={() => setActiveView('pricelist')}
              className={`px-5 py-2 rounded-full text-xs font-bold font-manrope transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'pricelist' 
                  ? 'bg-[#341168] dark:bg-[#FED65B] text-white dark:text-[#2F2F2F] shadow-sm font-black' 
                  : 'text-[#4a4550] dark:text-gray-300 hover:text-[#341168] dark:hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Official Price List Tables</span>
            </button>
          </div>
        </div>

        {/* View 1: Calculator */}
        {activeView === 'calculator' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Items Selector (Left 7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2e1] shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-[#e5e2e1] pb-4">
                <h3 className="font-bold font-manrope text-lg text-[#341168]">Select Garments & Services</h3>
                <button 
                  onClick={handleReset}
                  className="text-xs font-bold text-[#7b7581] hover:text-[#341168] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>

              <div className="space-y-4">
                {INITIAL_SERVICES.map((s) => {
                  const qty = quantities[s.id] || 0;

                  return (
                    <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#f6f3f2] hover:bg-[#f0eded] transition-colors gap-3">
                      <div className="flex-1">
                        <div className="font-bold font-manrope text-sm text-[#1c1b1b]">{s.name}</div>
                        <div className="text-xs text-[#735c00] font-bold font-worksans">
                          Ksh {s.price.toLocaleString()} <span className="text-[#7b7581] font-normal">/ {s.priceUnit}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#e5e2e1] bg-white rounded-full p-1">
                          <button
                            onClick={() => updateQuantity(s.id, -1)}
                            className="w-7 h-7 rounded-full bg-[#f6f3f2] hover:bg-[#e5e2e1] flex items-center justify-center text-[#1c1b1b] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-bold font-manrope text-sm text-[#341168]">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(s.id, 1)}
                            className="w-7 h-7 rounded-full bg-[#341168] text-white hover:bg-[#4b2c7f] flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="w-20 text-right font-bold font-manrope text-sm text-[#341168]">
                          Ksh {(qty * s.price).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Care Add-ons */}
              <div className="pt-4 border-t border-[#e5e2e1]">
                <h4 className="font-bold font-manrope text-sm text-[#341168] mb-3">Custom Treatment Add-ons</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    expressDelivery ? 'bg-[#fed65b]/20 border-[#fed65b] text-[#341168]' : 'bg-white border-[#e5e2e1] text-[#4a4550]'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={expressDelivery} 
                        onChange={(e) => setExpressDelivery(e.target.checked)}
                        className="rounded text-[#341168] focus:ring-[#341168]"
                      />
                      <span className="text-xs font-bold font-manrope">Same-Day Express (+Ksh 300)</span>
                    </div>
                  </label>

                  <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    extraSoftener ? 'bg-[#fed65b]/20 border-[#fed65b] text-[#341168]' : 'bg-white border-[#e5e2e1] text-[#4a4550]'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={extraSoftener} 
                        onChange={(e) => setExtraSoftener(e.target.checked)}
                        className="rounded text-[#341168] focus:ring-[#341168]"
                      />
                      <span className="text-xs font-bold font-manrope">Lavender Scent Rinse (+Ksh 100)</span>
                    </div>
                  </label>

                  <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    stainTreatment ? 'bg-[#fed65b]/20 border-[#fed65b] text-[#341168]' : 'bg-white border-[#e5e2e1] text-[#4a4550]'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={stainTreatment} 
                        onChange={(e) => setStainTreatment(e.target.checked)}
                        className="rounded text-[#341168] focus:ring-[#341168]"
                      />
                      <span className="text-xs font-bold font-manrope">Stain Pre-Treatment (+Ksh 200)</span>
                    </div>
                  </label>

                  <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    hangers ? 'bg-[#fed65b]/20 border-[#fed65b] text-[#341168]' : 'bg-white border-[#e5e2e1] text-[#4a4550]'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={hangers} 
                        onChange={(e) => setHangers(e.target.checked)}
                        className="rounded text-[#341168] focus:ring-[#341168]"
                      />
                      <span className="text-xs font-bold font-manrope">Hanger Packaging (+Ksh 150)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Quote Summary Sidebar (Right 5 cols) */}
            <div className="lg:col-span-5 bg-[#341168] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#4b2c7f] sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <h3 className="font-bold font-manrope text-lg text-[#fed65b] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#fed65b]" />
                  Estimate Breakdown
                </h3>
                <span className="text-xs font-bold bg-[#fed65b] text-[#745c00] px-2.5 py-1 rounded-full uppercase">
                  Rongai & Ngong
                </span>
              </div>

              {/* Selected Items List */}
              <div className="space-y-3 text-xs font-worksans max-h-56 overflow-y-auto pr-1">
                {selectedItems.length === 0 ? (
                  <p className="text-white/60 italic text-center py-6">
                    No garments selected yet. Adjust the counters on the left!
                  </p>
                ) : (
                  selectedItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-white/10">
                      <div>
                        <span className="font-bold text-white">{item.service.name}</span>
                        <span className="text-white/60 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-bold text-[#fed65b]">Ksh {item.total.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Calculations Breakdown */}
              <div className="space-y-2 text-xs pt-3 border-t border-white/20 font-worksans">
                <div className="flex justify-between text-white/80">
                  <span>Items Subtotal</span>
                  <span>Ksh {itemsSubtotal.toLocaleString()}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span>Custom Care Add-ons</span>
                    <span>Ksh {addOnsTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span>Doorstep Pickup & Return</span>
                  <span className="text-[#fed65b] font-bold">FREE (within 1km)</span>
                </div>
              </div>

              {/* Net Total Display */}
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20 flex justify-between items-center">
                <div>
                  <span className="text-xs text-white/70 block uppercase font-bold">Estimated Total</span>
                  <span className="text-2xl sm:text-3xl font-extrabold font-manrope text-[#fed65b]">
                    Ksh {finalTotal.toLocaleString()}
                  </span>
                </div>
                <Truck className="w-8 h-8 text-[#fed65b] opacity-80" />
              </div>

              {/* Action Button */}
              <button
                disabled={finalTotal === 0}
                onClick={handleBookQuote}
                className={`w-full py-4 rounded-full font-extrabold font-manrope text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  finalTotal === 0
                    ? 'bg-white/20 text-white/50 cursor-not-allowed'
                    : 'bg-[#fed65b] text-[#341168] hover:bg-white hover:scale-[1.02] active:scale-95'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Book Collection with this Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-white/60 text-center italic">
                * Final weight and item count will be confirmed by Goldtribe rider upon pickup at your doorstep.
              </p>
            </div>
          </div>
        )}

        {/* View 2: Official Price List Tables */}
        {activeView === 'pricelist' && (
          <div className="space-y-12 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Normal Laundry Table (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e5e2e1]">
                  <div className="bg-[#341168] text-white p-5 flex justify-between items-center">
                    <h3 className="font-bold font-manrope text-lg text-[#fed65b]">Normal Laundry</h3>
                    <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-white">Weight / Package</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-worksans">
                      <thead>
                        <tr className="bg-[#f0eded] text-[#341168] border-b border-[#e5e2e1] font-bold">
                          <th className="px-4 py-3">Details</th>
                          <th className="px-4 py-3">Weight</th>
                          <th className="px-4 py-3 text-right">Kshs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e2e1]">
                        {normalLaundryList.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 1 ? 'bg-[#f6f3f2]' : 'bg-white'}>
                            <td className="px-4 py-2.5 font-semibold text-[#1c1b1b]">{item.name}</td>
                            <td className="px-4 py-2.5 text-[#4a4550]">{item.unit}</td>
                            <td className="px-4 py-2.5 text-right font-bold text-[#341168]">{item.price.toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="bg-[#fed65b]/20 font-bold border-t-2 border-[#fed65b]">
                          <td className="px-4 py-3 text-[#341168]">Super package</td>
                          <td className="px-4 py-3 text-[#745c00]">1-7kg</td>
                          <td className="px-4 py-3 text-right text-[#341168] text-sm">1,300.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3.5 bg-[#f6f3f2] text-[#4a4550] italic text-[11px] border-t border-[#e5e2e1]">
                    * Super package includes wash, dry, ironing, and folding.
                  </div>
                </div>
              </div>

              {/* Dry Cleaning Price List Table (7 cols) */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e5e2e1] h-full flex flex-col">
                  <div className="bg-[#735c00] text-white p-5 flex justify-between items-center">
                    <h3 className="font-bold font-manrope text-lg text-[#fed65b]">Dry Cleaning Price List</h3>
                    <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-white">Per Piece Rates</span>
                  </div>

                  <div className="overflow-y-auto max-h-[520px]">
                    <table className="w-full text-left text-xs font-worksans">
                      <thead className="sticky top-0 bg-[#f0eded] text-[#341168] border-b border-[#e5e2e1] font-bold z-10">
                        <tr>
                          <th className="px-5 py-3">Details</th>
                          <th className="px-5 py-3">Pieces / Weight</th>
                          <th className="px-5 py-3 text-right">Kshs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e2e1]">
                        {dryCleaningList.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 1 ? 'bg-[#f6f3f2]' : 'bg-white'}>
                            <td className="px-5 py-2.5 font-semibold text-[#1c1b1b]">{item.name}</td>
                            <td className="px-5 py-2.5 text-[#4a4550]">{item.unit}</td>
                            <td className="px-5 py-2.5 text-right font-bold text-[#341168]">{item.price.toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="bg-[#f0eded] font-bold">
                          <td className="px-5 py-2.5 text-[#1c1b1b]">Hanger per piece</td>
                          <td className="px-5 py-2.5 text-[#4a4550]">Extra</td>
                          <td className="px-5 py-2.5 text-right text-[#341168]">50.00</td>
                        </tr>
                        <tr className="bg-[#f0eded] font-bold">
                          <td className="px-5 py-2.5 text-[#1c1b1b]">Laundry bag per piece</td>
                          <td className="px-5 py-2.5 text-[#4a4550]">Reusable</td>
                          <td className="px-5 py-2.5 text-right text-[#341168]">80.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-[#f6f3f2] border-t border-[#e5e2e1] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                        M
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#7b7581] block">Accepted Payment Terms</span>
                        <span className="text-sm font-extrabold font-manrope text-[#341168]">MPESA</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onProceedToBookingWithItems([], 0)}
                      className="bg-[#341168] text-white px-4 py-2 rounded-full font-bold text-xs font-manrope hover:bg-[#4b2c7f] transition-colors cursor-pointer"
                    >
                      Book Collection Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Guidelines & T&Cs */}
            <div className="pt-6 border-t border-[#e5e2e1]">
              <h3 className="text-2xl font-extrabold font-manrope text-[#341168] mb-6">
                Service Guidelines & T&Cs
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-[#e5e2e1] shadow-xs space-y-3">
                  <div className="w-8 h-8 rounded-full bg-[#341168]/10 text-[#341168] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#735c00]" />
                  </div>
                  <h4 className="font-bold font-manrope text-sm text-[#341168]">Maximum Economy</h4>
                  <p className="text-xs text-[#4a4550] leading-relaxed">
                    It's encouraged to have clothes in a load as it's more economical. Where a load is not enough for the minimum load, we charge per piece.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#e5e2e1] shadow-xs space-y-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-700" />
                  </div>
                  <h4 className="font-bold font-manrope text-sm text-[#341168]">Efficiency Guarantee</h4>
                  <p className="text-xs text-[#4a4550] leading-relaxed">
                    We offer pick and drop services. This is part of our efficiency guarantee. We remove temporary stains to ensure premium quality.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#e5e2e1] shadow-xs space-y-3">
                  <div className="w-8 h-8 rounded-full bg-[#fed65b]/30 text-[#745c00] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#341168]" />
                  </div>
                  <h4 className="font-bold font-manrope text-sm text-[#341168]">Fabric Sorting</h4>
                  <p className="text-xs text-[#4a4550] leading-relaxed">
                    Clothes are sorted according to colors to prevent bleeding and preserve the life of your precious garments.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom CTA Banner matching Image 1 */}
            <div className="bg-[#341168] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-manrope text-white">
                  Ready to Refresh Your Wardrobe?
                </h3>
                <p className="text-sm font-worksans text-white/80">
                  Call us today for a free pickup from your home or office.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-[#fed65b] uppercase tracking-wider block mb-1 font-manrope">CALL US NOW</span>
                  <a
                    href="tel:0777349743"
                    className="bg-[#fed65b] text-[#341168] px-6 py-3 rounded-full font-bold font-manrope text-sm hover:bg-white transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>📞 0777 349 743</span>
                  </a>
                </div>

                <div className="text-center">
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block mb-1 font-manrope">BOOK & TRACK</span>
                  <button
                    onClick={() => onProceedToBookingWithItems([], 0)}
                    className="bg-white text-[#341168] px-6 py-3 rounded-full font-bold font-manrope text-sm hover:bg-[#fed65b] transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>🌐 Book Online</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

