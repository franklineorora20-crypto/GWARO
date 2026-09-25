import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, OrderStatus } from '../types';
import { 
  Search, Package, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, 
  Download, Sparkles, RefreshCw, FileText, History, ExternalLink, ArrowRight,
  UserCheck, ShieldAlert, Edit3, ArrowUpRight, Filter, ChevronRight, Tag, AlertCircle, Calendar
} from 'lucide-react';
import { openPrintableReceipt } from '../lib/receiptGenerator';
import { formatDateSafe } from '../lib/dateUtils';

interface OrderTrackerProps {
  orders: Order[];
  initialSearchId?: string;
  onRefreshOrders?: () => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus, note?: string) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  initialSearchId = 'GL-1234',
  onRefreshOrders,
  onUpdateOrderStatus
}) => {
  // Mode state: Customer view vs Staff Attendant view
  const [viewMode, setViewMode] = useState<'customer' | 'attendant'>('customer');

const [searchId, setSearchId] = useState(initialSearchId || '');
const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
  if (!orders || orders.length === 0) return null;

  return (
    orders.find(
      (o) =>
        String(o.id ?? '').toLowerCase() ===
        String(initialSearchId ?? '').toLowerCase()
    ) ||
    orders[0] ||
    null
  );
});
  const [receiptModalOrder, setReceiptModalOrder] = useState<Order | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Attendant portal filter
  const [attendantBranchFilter, setAttendantBranchFilter] = useState<'All' | 'Rongai Branch' | 'Ngong Branch'>('All');
  const [attendantSearch, setAttendantSearch] = useState('');
  const [editingNotesOrderId, setEditingNotesOrderId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

 const handleSearch = (e?: React.FormEvent) => {
  e?.preventDefault();

  const query = searchId.trim().toLowerCase();

  if (!query) {
    setActiveOrder(null);
    return;
  }

  const found = orders.find((o) =>
    String(o.id ?? '').toLowerCase() === query ||
    String(o.phone ?? '').includes(query)
  );

  setActiveOrder(found ?? null);
};

  useEffect(() => {
    if (!searchId.trim()) return;
    const query = searchId.trim().toLowerCase();
    const found = orders.find((o) =>
      String(o.id ?? '').toLowerCase() === query ||
      String(o.phone ?? '').includes(query)
    );
    if (found) {
      setActiveOrder(found);
    }
  }, [orders, searchId]);

  const handleSelectDemo = (id: string) => {
    setSearchId(id);
    const found = orders.find(o => String(o.id ?? '').toLowerCase() === id.toLowerCase());
    if (found) {
      setActiveOrder(found);
    }
  };

  const handleSelectHistoryOrder = (order: Order) => {
    setSearchId(order.id);
    setActiveOrder(order);
    setViewMode('customer');
  };
  const statusSteps: OrderStatus[] = [
    'Order Received',
    'Pickup Scheduled',
    'Picked Up',
    'Washing',
    'Drying',
    'Ironing',
    'Quality Check',
    'Ready for Delivery',
    'Out for Delivery',
    'Delivered'
  ];

  const normalizeStatus = (status: OrderStatus): OrderStatus => {
    switch (status) {
      case 'Inspection & Sorting':
        return 'Pickup Scheduled';
      case 'In Wash & Revitalizing':
        return 'Washing';
      case 'Ready for Pickup / Out for Delivery':
        return 'Out for Delivery';
      case 'Completed':
        return 'Delivered';
      default:
        return status;
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return statusSteps.indexOf(normalizeStatus(status));
  };

  const handleAdvanceStatus = (order: Order) => {
    const currentIdx = getStepIndex(order.status);
    if (currentIdx < statusSteps.length - 1) {
      const nextStatus = statusSteps[currentIdx + 1];
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      order.status = nextStatus;
      order.trackingNotes.unshift({
        time: `Today, ${timestamp}`,
        note: `Status updated by Attendant to "${nextStatus}".`,
        status: nextStatus
      });

      if (onUpdateOrderStatus) {
        onUpdateOrderStatus(order.id, nextStatus);
      }
      if (onRefreshOrders) {
        onRefreshOrders();
      }
    }
  };

  const handleAddAttendantNote = (orderId: string) => {
    if (!newNoteText.trim()) return;
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      targetOrder.trackingNotes.unshift({
        time: `Today, ${timestamp}`,
        note: `Attendant Note: ${newNoteText.trim()}`,
        status: targetOrder.status
      });
      setNewNoteText('');
      setEditingNotesOrderId(null);
      if (onRefreshOrders) onRefreshOrders();
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(normalizeStatus(activeOrder.status)) : 0;

  return (
    <section id="track" className="py-16 sm:py-24 bg-[#341168] text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 hero-pattern pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#fed65b]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header with Interface Mode Switcher */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Mode Switcher Pills */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold font-manrope shadow-lg">
            <button
              onClick={() => setViewMode('customer')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'customer'
                  ? 'bg-[#fed65b] text-[#341168] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Customer Order Interface</span>
            </button>
            <button
              onClick={() => setViewMode('attendant')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'attendant'
                  ? 'bg-[#fed65b] text-[#341168] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Laundry Attendant Portal</span>
            </button>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-manrope text-white">
            {viewMode === 'customer' ? 'Track Your Freshness' : 'Laundry Attendant Operations Portal'}
          </h2>
          <p className="text-sm sm:text-base font-worksans text-white/80">
            {viewMode === 'customer'
              ? 'Enter your order number or phone to see live progress, itemized details, and digital receipts.'
              : 'Staff management interface to process orders, advance cleaning steps, and log care notes for Rongai & Ngong branches.'}
          </p>

          {/* Customer Search Bar (Only in Customer View) */}
          {viewMode === 'customer' && (
            <>
              <form onSubmit={handleSearch} className="max-w-xl mx-auto pt-2">
                <div className="bg-white/10 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 shadow-2xl">
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter Order ID (e.g. GL-1234)"
                    className="flex-1 bg-transparent border-none text-white placeholder-white/50 px-4 sm:px-5 py-2.5 sm:py-0 focus:outline-none font-worksans text-sm sm:text-base"
                  />
                  <button
                    type="submit"
                    className="bg-[#fed65b] text-[#341168] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full font-bold font-manrope text-xs sm:text-sm hover:bg-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Search className="w-4 h-4" />
                    <span>Track Now</span>
                  </button>
                </div>
              </form>

              <p className="text-xs text-[#fed65b]/90 font-worksans italic pt-1">
                "monthly memberships available" - Ask about our Gold Pass
              </p>

              {/* Quick Demo Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-white/70">
                <span>Try sample orders:</span>
                {orders.slice(0, 3).map(o => (
                  <button
                    key={o.id}
                    onClick={() => handleSelectDemo(o.id)}
                    className={`px-3 py-1 rounded-full border text-xs font-bold font-manrope transition-all cursor-pointer ${
                      activeOrder?.id === o.id
                        ? 'bg-[#fed65b] text-[#341168] border-[#fed65b]'
                        : 'border-white/30 text-white hover:bg-white/10'
                    }`}
                  >
                    {o.id} ({(o.customerName ?? 'Customer').split(" ")[0]})
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ATTENDANT PORTAL VIEW */}
        {viewMode === 'attendant' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Attendant Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-1">
                <span className="text-xs text-white/70 uppercase font-bold font-manrope">Total Active Queue</span>
                <span className="text-3xl font-extrabold font-manrope text-[#fed65b] block">
                  {orders.length} Orders
                </span>
                <span className="text-[11px] text-white/60">Rongai & Ngong branches combined</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-1">
                <span className="text-xs text-white/70 uppercase font-bold font-manrope">Currently in Wash</span>
                <span className="text-3xl font-extrabold font-manrope text-amber-300 block">
                  {orders.filter(o => o.status === 'In Wash & Revitalizing' || o.status === 'Inspection & Sorting').length} Orders
                </span>
                <span className="text-[11px] text-white/60">Active machine cycles running</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-1">
                <span className="text-xs text-white/70 uppercase font-bold font-manrope">Quality Checked</span>
                <span className="text-3xl font-extrabold font-manrope text-emerald-300 block">
                  {orders.filter(o => o.status === 'Quality Check' || (o.status ?? '').toString().includes('Ready')).length} Orders
                </span>
                <span className="text-[11px] text-white/60">Passed stain & press audit</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-1">
                <span className="text-xs text-white/70 uppercase font-bold font-manrope">Dispatched / Done</span>
                <span className="text-3xl font-extrabold font-manrope text-purple-200 block">
                  {orders.filter(o => o.status === 'Completed').length} Orders
                </span>
                <span className="text-[11px] text-white/60">Delivered to door or picked up</span>
              </div>
            </div>

            {/* Attendant Controls: Branch Filter & Search */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-white/70 uppercase font-manrope mr-2">Filter Hub:</span>
                {(['All', 'Rongai Branch', 'Ngong Branch'] as const).map(branch => (
                  <button
                    key={branch}
                    onClick={() => setAttendantBranchFilter(branch)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-manrope transition-all cursor-pointer ${
                      attendantBranchFilter === branch
                        ? 'bg-[#fed65b] text-[#341168]'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {branch}
                  </button>
                ))}
              </div>

              <div className="w-full md:w-72 relative">
                <input
                  type="text"
                  value={attendantSearch}
                  onChange={(e) => setAttendantSearch(e.target.value)}
                  placeholder="Filter by Order # or Customer..."
                  className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-white/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Attendant Queue Table / Card List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-manrope text-[#fed65b] flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                <span>Live Attendant Garment Workstation</span>
              </h3>

              <div className="space-y-4">
                {orders
                  .filter(o => {
                    if (attendantBranchFilter !== 'All' && o.branch !== attendantBranchFilter) return false;
                    if (attendantSearch.trim()) {
                      const query = attendantSearch.toLowerCase();
                     return (
  String(o.id ?? '').toLowerCase().includes(query) ||
  String(o.customerName || '')
  .toLowerCase()
  .includes(query)
);
                    }
                    return true;
                  })
                  .map(order => {
                    const stepIdx = getStepIndex(order.status);
                    const isCompleted = stepIdx === statusSteps.length - 1;

                    return (
                      <div
                        key={order.id}
                        className="bg-white text-[#1c1b1b] rounded-2xl p-5 border border-[#e5e2e1] shadow-xl space-y-4 font-worksans"
                      >
                        {/* Top Bar */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#e5e2e1] pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-extrabold font-manrope text-[#341168]">
                              Order #{order.id}
                            </span>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#341168]/10 text-[#341168]">
                              {order.branch}
                            </span>
                            <span className="text-xs text-[#7b7581]">{formatDateSafe(order.createdAt)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#735c00] bg-[#fed65b] px-3 py-1 rounded-full font-manrope">
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Body Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#4a4550]">
                          <div className="space-y-1 bg-[#f6f3f2] p-3 rounded-xl">
                            <span className="font-bold text-[#341168] block font-manrope">Customer Info</span>
                            <p className="font-bold text-[#1c1b1b]">{order.customerName}</p>
                            <p>Phone: {order.phone}</p>
                            <p className="truncate">Address: {order.address}</p>
                          </div>

                          <div className="space-y-1 bg-[#f6f3f2] p-3 rounded-xl">
                            <span className="font-bold text-[#341168] block font-manrope">Garments Breakdown</span>
                            <p>{(order.items ?? []).map(i => `${i.serviceName} (x${i.quantity})`).join(', ')}</p>
                            <p className="font-bold text-[#341168] pt-1">Total Ksh {order.totalPrice.toLocaleString()}</p>
                          </div>

                          <div className="space-y-1 bg-[#f6f3f2] p-3 rounded-xl">
                            <span className="font-bold text-[#341168] block font-manrope">Payment & Delivery</span>
                            <p className="font-bold text-emerald-700">{order.paymentStatus}</p>
                            {order.mpesaRef && (
                              <p className="text-[#341168]">Receipt: {order.mpesaRef}</p>
                            )}
                            {order.transactionDate && (
                              <p className="text-[#7b7581] text-xs">Paid on: {order.transactionDate}</p>
                            )}
                            <p>Type: {order.deliveryType}</p>
                            <p className="text-[#735c00] font-bold">Est: {order.estimatedDelivery}</p>
                          </div>
                        </div>

                        {/* Attendant Workflow Action Controls */}
                        <div className="pt-2 border-t border-[#e5e2e1] flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold font-manrope text-[#341168]">Current Step:</span>
                            <span className="text-[#7b7581]">Step {stepIdx + 1} of {statusSteps.length} ({order.status})</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingNotesOrderId(editingNotesOrderId === order.id ? null : order.id);
                                setNewNoteText('');
                              }}
                              className="px-3 py-1.5 rounded-full border border-[#341168] text-[#341168] hover:bg-[#341168]/5 text-xs font-bold font-manrope flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Log Attendant Note</span>
                            </button>

                            <button
                              onClick={() => handleSelectHistoryOrder(order)}
                              className="px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold font-manrope flex items-center gap-1 cursor-pointer"
                            >
                              <Search className="w-3.5 h-3.5" />
                              <span>View Customer Screen</span>
                            </button>

                            {!isCompleted && (
                              <button
                                onClick={() => handleAdvanceStatus(order)}
                                className="px-4 py-1.5 rounded-full bg-[#341168] hover:bg-[#4b2c7f] text-[#fed65b] text-xs font-bold font-manrope flex items-center gap-1.5 shadow-md cursor-pointer"
                              >
                                <span>Advance to Next Step</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Attendant Note Form Drawer */}
                        {editingNotesOrderId === order.id && (
                          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-xs">
                            <label className="font-bold text-amber-900 font-manrope block">
                              Add Internal Garment Care / Washing Note
                            </label>
                            <input
                              type="text"
                              value={newNoteText}
                              onChange={(e) => setNewNoteText(e.target.value)}
                              placeholder="e.g. Verified delicate silk fabric, stain treated on pocket..."
                              className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-amber-900 focus:outline-none"
                            />
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                onClick={() => setEditingNotesOrderId(null)}
                                className="px-3 py-1 rounded-md text-amber-800 hover:bg-amber-100 font-manrope"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleAddAttendantNote(order.id)}
                                className="px-4 py-1 rounded-md bg-[#341168] text-[#fed65b] font-bold font-manrope shadow-xs"
                              >
                                Save Note to Customer Log
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Order Details Card */}
        <AnimatePresence mode="wait">
          {!activeOrder ? (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-4"
            >
              <Package className="w-12 h-12 text-[#fed65b] mx-auto opacity-60" />
              <h3 className="text-xl font-bold font-manrope">Order Not Found</h3>
              <p className="text-sm text-white/70 font-worksans">
                We couldn't find an order matching "{searchId}". Please verify your order receipt ID or try clicking one of the sample orders above.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeOrder.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="bg-white text-[#1c1b1b] rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20 space-y-8"
            >
              {/* Top Order Summary Bar */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-6 border-b border-[#e5e2e1]">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold font-manrope text-[#341168]">
                      Order #{activeOrder.id}
                    </span>
                    <span className="bg-[#fed65b] text-[#745c00] text-xs font-bold px-3 py-1 rounded-full uppercase font-manrope">
                      {activeOrder.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4a4550] font-worksans flex items-center gap-2">
                    <span>Customer: <strong className="text-[#1c1b1b]">{activeOrder.customerName}</strong></span>
                    <span>•</span>
                    <span>Branch: <strong className="text-[#341168]">{activeOrder.branch}</strong></span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold font-manrope ${
                    activeOrder.paymentStatus.includes('Paid')
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {activeOrder.paymentStatus} {activeOrder.mpesaRef ? `(${activeOrder.mpesaRef})` : ''}
                  </span>

                  <button
                    onClick={() => openPrintableReceipt(activeOrder)}
                    className="px-4 py-2 rounded-full bg-[#341168] text-white hover:bg-[#4a1c8f] text-xs font-bold font-manrope flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#fed65b]" />
                    <span>Print PDF Receipt</span>
                  </button>

                  <button
                    onClick={() => setReceiptModalOrder(activeOrder)}
                    className="px-4 py-2 rounded-full border border-[#341168] text-[#341168] hover:bg-[#341168]/5 text-xs font-bold font-manrope flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Digital Receipt</span>
                  </button>
                </div>
              </div>

              {/* Visual Status Step Bar */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs uppercase font-bold text-[#7b7581] font-manrope tracking-wider">
                    Live Garment Progress Timeline
                  </h4>
                  <span className="text-xs font-bold font-manrope text-[#341168] bg-[#341168]/5 px-2.5 py-1 rounded-full">
                    Step {currentStepIdx + 1} of {statusSteps.length}
                  </span>
                </div>

                <div className="relative pt-2">
                  {/* Desktop Background & Animated Progress Connector Line */}
                  <div className="absolute top-5 left-[8%] right-[8%] h-1 bg-[#e5e2e1] hidden md:block rounded-full" />
                  <motion.div
                    key={`progress-line-${activeOrder.id}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: Math.min(1, Math.max(0, currentStepIdx / (statusSteps.length - 1))) }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                    className="absolute top-5 left-[8%] right-[8%] h-1 bg-[#fed65b] origin-left hidden md:block rounded-full shadow-xs z-0"
                  />

                  {/* Desktop Step Bar */}
                  <motion.div
                    key={`timeline-desktop-${activeOrder.id}`}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.08,
                          delayChildren: 0.1,
                        },
                      },
                    }}
                    className="hidden md:grid grid-cols-6 gap-2 text-center relative z-10"
                  >
                    {statusSteps.map((step, idx) => {
                      const isPassed = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <motion.div
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, y: 14, scale: 0.88 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                type: 'spring',
                                stiffness: 350,
                                damping: 25,
                              },
                            },
                          }}
                          className="flex flex-col items-center space-y-2"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                            isCurrent
                              ? 'bg-[#341168] text-[#fed65b] ring-4 ring-[#fed65b]/50 scale-110 shadow-lg'
                              : isPassed
                              ? 'bg-[#fed65b] text-[#745c00]'
                              : 'bg-[#f6f3f2] text-[#7b7581] border border-[#e5e2e1]'
                          }`}>
                            {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <span className={`text-[11px] font-manrope font-semibold leading-tight ${
                            isCurrent ? 'text-[#341168] font-extrabold' : isPassed ? 'text-[#1c1b1b]' : 'text-[#7b7581]'
                          }`}>
                            {step}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Mobile Vertical Step Bar */}
                  <motion.div
                    key={`timeline-mobile-${activeOrder.id}`}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.07,
                          delayChildren: 0.08,
                        },
                      },
                    }}
                    className="md:hidden space-y-3 pl-4 border-l-2 border-[#341168]/20"
                  >
                    {statusSteps.map((step, idx) => {
                      const isPassed = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <motion.div
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, x: -12 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              transition: {
                                type: 'spring',
                                stiffness: 300,
                                damping: 24,
                              },
                            },
                          }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                            isCurrent
                              ? 'bg-[#341168] text-[#fed65b] ring-2 ring-[#fed65b]'
                              : isPassed
                              ? 'bg-[#fed65b] text-[#745c00]'
                              : 'bg-[#e5e2e1] text-[#7b7581]'
                          }`}>
                            {isPassed ? '✓' : idx + 1}
                          </div>
                          <span className={`text-xs font-manrope ${
                            isCurrent ? 'font-extrabold text-[#341168]' : isPassed ? 'font-bold text-[#1c1b1b]' : 'text-[#7b7581]'
                          }`}>
                            {step}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>

              {/* Grid of Garments & Activity Log */}
              <div className="grid md:grid-cols-12 gap-8 pt-4">
                {/* Itemized Garments List (7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  <h4 className="text-sm font-bold font-manrope text-[#341168] uppercase tracking-wider border-b border-[#e5e2e1] pb-2">
                    Itemized Garment Breakdown
                  </h4>
                  <div className="space-y-2">
                    {activeOrder.items.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                        className="flex justify-between items-center p-3 rounded-2xl bg-[#f6f3f2] text-xs font-worksans"
                      >
                        <div>
                          <span className="font-bold text-[#1c1b1b]">{item.serviceName}</span>
                          <span className="text-[#7b7581] ml-2">Qty: {item.quantity}</span>
                        </div>
                        <span className="font-bold text-[#341168]">Ksh {(item.quantity * item.unitPrice).toLocaleString()}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-[#f0eded] p-4 rounded-2xl flex justify-between items-center text-sm font-manrope font-bold text-[#341168]">
                    <span>Total Order Amount</span>
                    <span className="text-lg text-[#735c00]">Ksh {activeOrder.totalPrice.toLocaleString()}</span>
                  </div>

                  {activeOrder.specialNotes && (
                    <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-worksans text-amber-900">
                      <strong className="font-manrope">Garment Care Notes:</strong> {activeOrder.specialNotes}
                    </div>
                  )}
                </div>

                {/* Delivery & Activity Timestamp Log (5 cols) */}
                <div className="md:col-span-5 space-y-4 bg-[#f6f3f2] p-5 rounded-3xl border border-[#e5e2e1]">
                  <h4 className="text-sm font-bold font-manrope text-[#341168] uppercase tracking-wider border-b border-[#e5e2e1] pb-2">
                    Delivery & Logistics
                  </h4>

                  <div className="space-y-2.5 text-xs font-worksans text-[#4a4550]">
                    <div className="flex items-start gap-2.5 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                      <Calendar className="w-4 h-4 text-[#341168] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#341168] block font-manrope">Requested Pickup Date & Window</span>
                        <span className="text-[#1c1b1b] font-extrabold">
                          {activeOrder.pickupDate ? activeOrder.pickupDate : 'Standard Pickup Schedule'} 
                          {activeOrder.timeSlot ? ` · ${activeOrder.timeSlot}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#341168] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#1c1b1b] block">Delivery Location</span>
                        <span>{activeOrder.address}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#341168] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#1c1b1b] block">Est. Completion / Return</span>
                        <span className="text-[#341168] font-bold">{activeOrder.estimatedDelivery}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#1c1b1b] block">Assigned Logistics Hub</span>
                        <span>{activeOrder.branch}</span>
                      </div>
                    </div>
                  </div>

                  {/* Audit Timestamp Log */}
                  <div className="pt-3 border-t border-[#e5e2e1] space-y-2">
                    <h5 className="text-[11px] font-bold uppercase text-[#7b7581] font-manrope">Activity Log</h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {activeOrder.trackingNotes.map((log, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          className="text-[11px] bg-white p-2.5 rounded-xl border border-[#e5e2e1] font-worksans"
                        >
                          <div className="flex justify-between text-[#7b7581] font-bold">
                            <span>{log.time}</span>
                            <span className="text-[#341168]">{log.status}</span>
                          </div>
                          <p className="text-[#1c1b1b] mt-1">{log.note}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order History Section */}
        <div className="pt-10 border-t border-white/20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[#fed65b] font-bold text-xs uppercase tracking-wider font-manrope">
                <History className="w-4 h-4" />
                <span>Device Storage History</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-manrope text-white">
                Order History
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-worksans">
                Recent orders saved in local device storage ({orders.length} total)
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 bg-white/10 p-1 rounded-full border border-white/20 self-start sm:self-auto">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-manrope transition-all cursor-pointer ${
                  historyFilter === 'all'
                    ? 'bg-[#fed65b] text-[#341168]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setHistoryFilter('in_progress')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-manrope transition-all cursor-pointer ${
                  historyFilter === 'in_progress'
                    ? 'bg-[#fed65b] text-[#341168]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                In Progress ({orders.filter(o => o.status !== 'Delivered' && o.status !== 'Completed').length})
              </button>
              <button
                onClick={() => setHistoryFilter('completed')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-manrope transition-all cursor-pointer ${
                  historyFilter === 'completed'
                    ? 'bg-[#fed65b] text-[#341168]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Delivered ({orders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length})
              </button>
            </div>
          </div>

          {/* Orders Cards Grid */}
          {orders.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-2">
              <p className="text-sm text-white/70 font-worksans">
                No orders saved in device history. Book your first collection to start tracking!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders
                .filter(o => {
                  if (historyFilter === 'in_progress') return o.status !== 'Delivered' && o.status !== 'Completed';
                  if (historyFilter === 'completed') return o.status === 'Delivered' || o.status === 'Completed';
                  return true;
                })
                .map((order, idx) => {
                  const isSelected = activeOrder?.id === order.id;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: idx * 0.04 }}
                      whileHover={{ y: -2 }}
                      className={`bg-white text-[#1c1b1b] rounded-2xl p-5 border shadow-lg transition-all flex flex-col justify-between space-y-4 ${
                        isSelected ? 'ring-4 ring-[#fed65b] border-[#fed65b]' : 'border-[#e5e2e1] hover:shadow-xl'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Card Header */}
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-lg font-extrabold font-manrope text-[#341168] block">
                              #{order.id}
                            </span>
                            <span className="text-[11px] text-[#7b7581] font-worksans">
                              {formatDateSafe(order.createdAt)}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full font-manrope shrink-0 ${
                            order.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-[#fed65b]/30 text-[#745c00] border border-[#fed65b]/50'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Customer & Branch */}
                        <div className="text-xs space-y-1 font-worksans text-[#4a4550] bg-[#f6f3f2] p-2.5 rounded-xl">
                          <p><strong className="text-[#1c1b1b]">Customer:</strong> {order.customerName} ({order.phone})</p>
                          <p><strong className="text-[#341168]">Hub:</strong> {order.branch}</p>
                          <p><strong className="text-[#1c1b1b]">Items:</strong> {order.items.map(i => `${i.serviceName} (${i.quantity})`).join(', ')}</p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-[#e5e2e1] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-[#7b7581] uppercase font-bold block">Total Amount</span>
                          <span className="text-sm font-extrabold font-manrope text-[#341168]">
                            Ksh {order.totalPrice.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setReceiptModalOrder(order)}
                            className="p-2 rounded-xl border border-[#e5e2e1] text-[#341168] hover:bg-[#f6f3f2] transition-colors cursor-pointer"
                            title="View Receipt"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSelectHistoryOrder(order)}
                            className="px-3 py-2 rounded-xl bg-[#341168] text-white font-bold text-xs font-manrope hover:bg-[#4b2c7f] transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>Track</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Digital Receipt Modal */}
      <AnimatePresence>
        {receiptModalOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white text-[#1c1b1b] rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl font-worksans"
            >
              <div className="text-center border-b border-[#e5e2e1] pb-4 space-y-1">
                <h3 className="text-xl font-extrabold font-manrope text-[#341168]">
                  Goldtribe Link Laundromat
                </h3>
                <p className="text-xs text-[#735c00] font-bold font-manrope">Usafi: Kazi Yetu</p>
                <p className="text-[11px] text-[#7b7581]">Official Garment Receipt #{receiptModalOrder.id}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#7b7581]">Customer:</span>
                  <span className="font-bold text-[#1c1b1b]">{receiptModalOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7b7581]">Phone:</span>
                  <span className="font-bold text-[#1c1b1b]">{receiptModalOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7b7581]">Branch:</span>
                  <span className="font-bold text-[#341168]">{receiptModalOrder.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7b7581]">Date Created:</span>
                  <span className="font-bold text-[#1c1b1b]">{formatDateSafe(receiptModalOrder.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7b7581]">Scheduled Pickup:</span>
                  <span className="font-bold text-[#341168]">
                    {receiptModalOrder.pickupDate || 'Standard Schedule'} {receiptModalOrder.timeSlot ? `(${receiptModalOrder.timeSlot})` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7b7581]">Payment Status:</span>
                  <span className="font-bold text-emerald-700">{receiptModalOrder.paymentStatus}</span>
                </div>
                {(receiptModalOrder.mpesaRef || receiptModalOrder.mpesaReceiptNumber) && (
                  <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[#7b7581] text-xs font-bold">M-Pesa Receipt Ref:</span>
                    <span className="font-mono font-extrabold text-emerald-800 dark:text-emerald-300 text-xs tracking-wider">
                      {receiptModalOrder.mpesaRef || receiptModalOrder.mpesaReceiptNumber}
                    </span>
                  </div>
                )}
                {receiptModalOrder.transactionDate && (
                  <div className="flex justify-between">
                    <span className="text-[#7b7581]">Transaction Date:</span>
                    <span className="font-bold text-[#1c1b1b]">{receiptModalOrder.transactionDate}</span>
                  </div>
                )}
                {receiptModalOrder.mpesaPhone && (
                  <div className="flex justify-between">
                    <span className="text-[#7b7581]">Paid From:</span>
                    <span className="font-bold text-[#1c1b1b]">{receiptModalOrder.mpesaPhone}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-b border-[#e5e2e1] py-3 space-y-2">
                <span className="text-xs font-bold text-[#341168] block font-manrope">Garments Cleaned:</span>
                {receiptModalOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span>{item.serviceName} x{item.quantity}</span>
                    <span className="font-bold">Ksh {(item.quantity * item.unitPrice).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm font-bold font-manrope">
                <span>Total Paid / Payable</span>
                <span className="text-[#341168] text-lg">Ksh {receiptModalOrder.totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setReceiptModalOrder(null)}
                  className="flex-1 py-2.5 rounded-full border border-[#e5e2e1] text-xs font-bold font-manrope hover:bg-[#f6f3f2] cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    openPrintableReceipt(receiptModalOrder);
                    setReceiptModalOrder(null);
                  }}
                  className="flex-1 py-2.5 rounded-full bg-[#341168] text-white text-xs font-bold font-manrope hover:bg-[#4b2c7f] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#fed65b]" />
                  <span>Print PDF Receipt</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
