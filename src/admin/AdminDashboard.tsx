import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Search,
  Download,
  Trash2,
  ChevronRight,
  X,
  Menu,
  Filter,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Building2,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { signOutAdmin } from "../lib/auth";
import {
  type AdminOrder,
  fetchAdminOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
  deleteOrderById,
  updateOrderDetails,
} from "../lib/adminOrders";
import type { OrderStatus, PaymentStatus } from "../types";
import { computeAdminKpis, exportOrdersToCsv } from "./adminMetrics";
import { Toast, ToastMessage } from "../components/Toast";
import { Logo } from "../components/Logo";
import { openPrintableReceipt } from "../lib/receiptGenerator";
import type { Order } from "../types";
import { useDarkMode } from "../lib/useDarkMode";

const STATUS_OPTIONS: OrderStatus[] = [
  "Order Received",
  "Pickup Scheduled",
  "Picked Up",
  "Washing",
  "Drying",
  "Ironing",
  "Quality Check",
  "Ready for Delivery",
  "Out for Delivery",
  "Delivered",
];

const PAYMENT_OPTIONS: PaymentStatus[] = [
  "Paid via M-Pesa",
  "Pending M-Pesa",
  "Failed M-Pesa",
  "Cancelled M-Pesa",
  "Pay on Delivery",
];

function normalizeAdminStatus(status: OrderStatus): OrderStatus {
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
}

function nextStatus(current: OrderStatus): OrderStatus | null {
  const normalizedCurrent = normalizeAdminStatus(current);
  const i = STATUS_OPTIONS.indexOf(normalizedCurrent);
  if (i < 0 || i >= STATUS_OPTIONS.length - 1) return null;
  return STATUS_OPTIONS[i + 1];
}

function formatMoney(n: number) {
  return `Ksh ${n.toLocaleString()}`;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function getStatusBadgeStyle(status: OrderStatus) {
  switch (status) {
    case 'Order Received':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
    case 'Pickup Scheduled':
    case 'Picked Up':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    case 'Washing':
    case 'Drying':
    case 'Ironing':
    case 'Quality Check':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
    case 'Ready for Delivery':
    case 'Out for Delivery':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800';
    case 'Delivered':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-gray-700';
  }
}

function getPaymentBadgeStyle(paymentStatus: PaymentStatus) {
  switch (paymentStatus) {
    case 'Paid via M-Pesa':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700';
    case 'Pending M-Pesa':
      return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700';
    case 'Failed M-Pesa':
    case 'Cancelled M-Pesa':
      return 'bg-rose-100 text-rose-800 border-rose-300 font-semibold dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700';
    case 'Pay on Delivery':
      return 'bg-sky-100 text-sky-800 border-sky-300 font-semibold dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-700';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-slate-800 dark:text-gray-300 dark:border-gray-700';
  }
}

interface AdminDashboardProps {
  session: Session;
  onSignedOut: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  session,
  onSignedOut,
}) => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminOrder | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  // Editable Date, Time Slot & Receipt Code state
  const [editingDate, setEditingDate] = useState<string>('');
  const [editingSlot, setEditingSlot] = useState<string>('');
  const [editingReceiptCode, setEditingReceiptCode] = useState<string>('');
  const [editingMpesaPhone, setEditingMpesaPhone] = useState<string>('');

  useEffect(() => {
    if (selected) {
      setEditingDate(selected.pickupDate || new Date().toISOString().split('T')[0]);
      setEditingSlot(selected.timeSlot || 'Morning (8:00 AM - 12:00 PM)');
      setEditingReceiptCode(selected.mpesaReceiptNumber || selected.mpesaRef || '');
      setEditingMpesaPhone(selected.mpesaPhone || selected.phone || '254708374149');
    }
  }, [selected]);

  const showToast = (
    title: string,
    message?: string,
    type: "success" | "error" | "info" = "success"
  ) => setToast({ id: `${Date.now()}`, title, message, type });

  const handleSaveDateTime = async () => {
    if (!selected) return;
    setActionId(selected.dbId);
    try {
      await updateOrderDetails(
        selected.dbId,
        { pickupDate: editingDate, timeSlot: editingSlot },
        selected.id
      );
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.dbId === selected.dbId || o.id === selected.id
            ? { ...o, pickupDate: editingDate, timeSlot: editingSlot }
            : o
        );
        try {
          localStorage.setItem('goldtribe_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setSelected((s) => (s ? { ...s, pickupDate: editingDate, timeSlot: editingSlot } : null));
      showToast('Date & Time Updated', `Order ${selected.id} schedule updated to ${editingDate} (${editingSlot})`);
    } catch (e) {
      console.warn('Save Date & Time error:', e);
      showToast('Error', 'Failed to update order date & time', 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleSaveReceiptCode = async () => {
    if (!selected) return;
    const code = editingReceiptCode.trim().toUpperCase();
    if (!code) {
      showToast('Notice', 'Please enter a valid M-Pesa payment receipt code (e.g. QKH839201X)', 'error');
      return;
    }
    setActionId(selected.dbId);
    try {
      const updates: Partial<AdminOrder> = {
        mpesaReceiptNumber: code,
        mpesaRef: code,
        mpesaPhone: editingMpesaPhone,
        paymentStatus: 'Paid via M-Pesa',
      };
      await updateOrderDetails(selected.dbId, updates, selected.id);
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.dbId === selected.dbId || o.id === selected.id
            ? { ...o, ...updates }
            : o
        );
        try {
          localStorage.setItem('goldtribe_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setSelected((s) => (s ? { ...s, ...updates } : null));
      showToast('Receipt Verified', `Attached M-Pesa Code ${code} to ${selected.id}`);
    } catch (e) {
      console.warn('Save Receipt Code error:', e);
      showToast('Error', 'Failed to save M-Pesa receipt details', 'error');
    } finally {
      setActionId(null);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch (e) {
      console.warn("load admin orders notice:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const kpis = useMemo(() => computeAdminKpis(orders), [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...orders];

    if (q) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.trackingId ?? "").toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.address.toLowerCase().includes(q) ||
          (o.mpesaReceiptNumber ?? "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }
    if (branchFilter !== "all") {
      list = list.filter((o) => o.branch === branchFilter);
    }
    if (paymentFilter !== "all") {
      list = list.filter((o) => o.paymentStatus === paymentFilter);
    }

    list.sort((a, b) => {
      const ta = new Date(a.rawCreatedAt).getTime();
      const tb = new Date(b.rawCreatedAt).getTime();
      return sortAsc ? ta - tb : tb - ta;
    });

    return list;
  }, [orders, search, statusFilter, branchFilter, paymentFilter, sortAsc]);

  const handleSignOut = async () => {
    await signOutAdmin();
    onSignedOut();
  };

  const handleAdvanceStatus = async (order: AdminOrder) => {
    const next = nextStatus(order.status);
    if (!next) return;
    setActionId(order.dbId);
    try {
      await updateOrderStatus(order.dbId, next);
    } catch (e) {
      console.warn("Advance status notice:", e);
    } finally {
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.dbId === order.dbId || o.id === order.id ? { ...o, status: next } : o
        );
        try {
          localStorage.setItem('goldtribe_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast("Status updated", `${order.id} → ${next}`);
      if (selected?.dbId === order.dbId) {
        setSelected((s) => (s ? { ...s, status: next } : null));
      }
      setActionId(null);
    }
  };

  const handleSetStatus = async (
    order: AdminOrder,
    status: OrderStatus
  ) => {
    setActionId(order.dbId);
    try {
      await updateOrderStatus(order.dbId, status);
    } catch (e) {
      console.warn("Update status notice:", e);
    } finally {
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.dbId === order.dbId || o.id === order.id ? { ...o, status } : o
        );
        try {
          localStorage.setItem('goldtribe_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast("Status updated", `${order.id} → ${status}`);
      if (selected?.dbId === order.dbId) {
        setSelected((s) => (s ? { ...s, status } : null));
      }
      setActionId(null);
    }
  };

  const handlePaymentChange = async (
    order: AdminOrder,
    paymentStatus: PaymentStatus
  ) => {
    setActionId(order.dbId);
    try {
      await updateOrderPaymentStatus(order.dbId, paymentStatus);
    } catch (e) {
      console.warn("Update payment notice:", e);
    } finally {
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.dbId === order.dbId || o.id === order.id ? { ...o, paymentStatus } : o
        );
        try {
          localStorage.setItem('goldtribe_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast("Payment updated", `${order.id}: ${paymentStatus}`);
      if (selected?.dbId === order.dbId) {
        setSelected((s) => (s ? { ...s, paymentStatus } : null));
      }
      setActionId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionId(deleteTarget.dbId);
    try {
      await deleteOrderById(deleteTarget.dbId);
    } catch (e) {
      console.warn("Delete order notice:", e);
    } finally {
      setOrders((prev) => {
        const updated = prev.filter(
          (o) => o.dbId !== deleteTarget.dbId && o.id !== deleteTarget.id
        );
        try {
          localStorage.setItem('goldtribe_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast("Order deleted", deleteTarget.id);
      if (selected?.dbId === deleteTarget.dbId) setSelected(null);
      setDeleteTarget(null);
      setActionId(null);
    }
  };

  const kpiCards = [
    { label: "Total Orders", value: kpis.totalOrders, icon: Package, accent: "border-l-[#5E228B]", bg: "bg-purple-50/50" },
    { label: "Orders Today", value: kpis.ordersToday, icon: Calendar, accent: "border-l-[#FED65B]", bg: "bg-amber-50/50" },
    { label: "Pending", value: kpis.pendingOrders, icon: Clock, accent: "border-l-amber-500", bg: "bg-amber-50/50" },
    { label: "Active", value: kpis.activeOrders, icon: Sparkles, accent: "border-l-sky-500", bg: "bg-sky-50/50" },
    { label: "Completed", value: kpis.completedOrders, icon: CheckCircle2, accent: "border-l-emerald-500", bg: "bg-emerald-50/50" },
    {
      label: "Revenue Today",
      value: formatMoney(kpis.revenueToday),
      icon: DollarSign,
      accent: "border-l-[#5E228B]",
      bg: "bg-purple-50/50",
      isMoney: true,
    },
    {
      label: "Revenue Month",
      value: formatMoney(kpis.revenueThisMonth),
      icon: TrendingUp,
      accent: "border-l-[#FED65B]",
      bg: "bg-amber-50/50",
      isMoney: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f6f5] dark:bg-[#0f0717] text-[#2F2F2F] dark:text-[#E8E3F0] font-worksans flex transition-colors duration-200">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#1d0b2e] text-white flex flex-col shrink-0 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-xl`}
      >
        <div className="p-6 border-b border-white/10 space-y-4">
          <Logo size="sm" variant="dark" showMotto={true} />
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs border border-white/10">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#FED65B] font-manrope">Authenticated Admin</p>
            <p className="text-xs font-bold text-white/90 truncate mt-0.5">{session.user.email}</p>
          </div>
        </div>

        <nav className="p-4 flex-1 space-y-2">
          <div className="px-4 py-3 rounded-2xl bg-[#5E228B] text-white text-sm font-black font-manrope flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-[#FED65B]" />
              <span>Operations Hub</span>
            </div>
            <span className="bg-[#FED65B] text-[#2F2F2F] text-[10px] font-black px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </div>

          <div className="pt-4 space-y-1">
            <p className="px-4 text-[10px] font-extrabold text-white/40 uppercase tracking-widest font-manrope mb-2">Branch Views</p>
            <button
              onClick={() => { setBranchFilter('all'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${branchFilter === 'all' ? 'bg-white/15 text-[#FED65B]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>All Branches</span>
              </div>
            </button>
            <button
              onClick={() => { setBranchFilter('Rongai Branch'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${branchFilter === 'Rongai Branch' ? 'bg-white/15 text-[#FED65B]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Rongai Branch</span>
              </div>
            </button>
            <button
              onClick={() => { setBranchFilter('Ngong Branch'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${branchFilter === 'Ngong Branch' ? 'bg-white/15 text-[#FED65B]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Ngong Branch</span>
              </div>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-manrope transition-all cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#FED65B]" /> : <Moon className="w-4 h-4 text-[#FED65B]" />}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold font-manrope transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#1a0c2a]/90 backdrop-blur-md border-b border-[#e5e2e1] dark:border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl hover:bg-[#f6f3f2] dark:hover:bg-white/10 cursor-pointer text-[#5E228B] dark:text-[#FED65B]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-manrope font-extrabold text-[#5E228B] dark:text-[#FED65B] text-lg sm:text-xl truncate flex items-center gap-2">
                <span>Goldtribe Operations Hub</span>
              </h1>
              <p className="text-xs text-[#6F6F6F] dark:text-gray-400 hidden sm:block font-medium">
                Real-time tracking for Rongai & Ngong Laundry Bookings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode Switcher */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e5e2e1] dark:border-white/20 text-xs font-bold text-[#5E228B] dark:text-[#FED65B] hover:bg-[#f6f3f2] dark:hover:bg-white/10 transition-colors cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FED65B]" /> : <Moon className="w-4 h-4 text-[#5E228B]" />}
              <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
            </button>

            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e5e2e1] dark:border-white/20 text-xs font-bold text-[#5E228B] dark:text-white hover:bg-[#f6f3f2] dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
              title="Reload live orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FED65B] ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              type="button"
              onClick={() => exportOrdersToCsv(filtered)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5E228B] hover:bg-[#4A1772] text-white text-xs font-bold font-manrope shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#FED65B]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-auto max-w-7xl w-full mx-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {kpiCards.map((k) => {
              const IconComp = k.icon;
              return (
                <div
                  key={k.label}
                  className={`bg-white dark:bg-[#1a0c2a] rounded-2xl border border-[#e5e2e1] dark:border-white/10 p-3.5 shadow-2xs hover:shadow-md transition-shadow border-l-4 ${k.accent} ${k.bg} dark:bg-opacity-20 flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[10px] font-extrabold text-[#6F6F6F] dark:text-gray-400 uppercase tracking-wider font-manrope truncate">
                      {k.label}
                    </p>
                    <IconComp className="w-3.5 h-3.5 text-[#5E228B] dark:text-[#FED65B] shrink-0 opacity-80" />
                  </div>
                  <p
                    className={`mt-1.5 font-extrabold font-manrope text-[#2F2F2F] dark:text-white ${
                      k.isMoney ? "text-sm sm:text-base text-[#5E228B] dark:text-[#FED65B]" : "text-xl sm:text-2xl"
                    }`}
                  >
                    {k.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-xs font-extrabold text-[#6F6F6F] dark:text-gray-400 uppercase tracking-wider font-manrope shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#5E228B] dark:text-[#FED65B]" /> Quick Filters:
            </span>
            {[
              { id: 'all', label: `All (${orders.length})` },
              { id: 'Order Received', label: 'Received' },
              { id: 'Washing', label: 'In Washing' },
              { id: 'Ready for Delivery', label: 'Ready' },
              { id: 'Delivered', label: 'Completed' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setStatusFilter(chip.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === chip.id
                    ? 'bg-[#5E228B] text-white shadow-xs'
                    : 'bg-white dark:bg-[#1a0c2a] border border-[#e5e2e1] dark:border-white/10 text-[#2F2F2F] dark:text-gray-200 hover:bg-[#f6f3f2] dark:hover:bg-white/10'
                }`}
              >
                {chip.label}
              </button>
            ))}
            {(statusFilter !== 'all' || branchFilter !== 'all' || paymentFilter !== 'all' || search) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setBranchFilter('all');
                  setPaymentFilter('all');
                  setSearch('');
                }}
                className="px-2.5 py-1.5 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 underline whitespace-nowrap ml-auto"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <div className="bg-white dark:bg-[#1a0c2a] rounded-2xl border border-[#e5e2e1] dark:border-white/10 p-4 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F6F6F] dark:text-gray-400" />
                <input
                  type="search"
                  placeholder="Search ID, name, phone, M-Pesa receipt..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e5e2e1] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#25123a] text-xs font-medium dark:text-white focus:bg-white dark:focus:bg-[#2e1747] focus:ring-2 focus:ring-[#5E228B] outline-none"
                />
              </div>

              {/* Status Select */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-[#e5e2e1] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#25123a] text-xs font-bold text-[#2F2F2F] dark:text-white outline-none cursor-pointer"
              >
                <option value="all" className="dark:bg-[#1a0c2a]">Filter by Status (All)</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="dark:bg-[#1a0c2a]">
                    {s}
                  </option>
                ))}
              </select>

              {/* Payment Filter */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-[#e5e2e1] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#25123a] text-xs font-bold text-[#2F2F2F] dark:text-white outline-none cursor-pointer"
              >
                <option value="all" className="dark:bg-[#1a0c2a]">Filter by Payment (All)</option>
                {PAYMENT_OPTIONS.map((p) => (
                  <option key={p} value={p} className="dark:bg-[#1a0c2a]">
                    {p}
                  </option>
                ))}
              </select>

              {/* Branch & Sort */}
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="py-2.5 px-2 rounded-xl border border-[#e5e2e1] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#25123a] text-xs font-bold text-[#2F2F2F] dark:text-white outline-none cursor-pointer"
                >
                  <option value="all" className="dark:bg-[#1a0c2a]">All Branches</option>
                  <option value="Rongai Branch" className="dark:bg-[#1a0c2a]">Rongai Branch</option>
                  <option value="Ngong Branch" className="dark:bg-[#1a0c2a]">Ngong Branch</option>
                </select>

                <select
                  value={sortAsc ? "asc" : "desc"}
                  onChange={(e) => setSortAsc(e.target.value === "asc")}
                  className="py-2.5 px-2 rounded-xl border border-[#e5e2e1] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#25123a] text-xs font-bold text-[#2F2F2F] dark:text-white outline-none cursor-pointer"
                >
                  <option value="desc" className="dark:bg-[#1a0c2a]">Newest First</option>
                  <option value="asc" className="dark:bg-[#1a0c2a]">Oldest First</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-[#6F6F6F] dark:text-gray-400 pt-1">
              <span className="font-bold">
                Displaying {filtered.length} of {orders.length} total orders
              </span>
              {loading && <span className="text-[#5E228B] dark:text-[#FED65B] font-bold animate-pulse">Syncing orders...</span>}
            </div>
          </div>

          {/* Desktop Orders Table */}
          <div className="hidden md:block bg-white dark:bg-[#1a0c2a] rounded-2xl border border-[#e5e2e1] dark:border-white/10 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#f6f3f2] dark:bg-[#25123a] text-left text-[11px] font-extrabold font-manrope text-[#5E228B] dark:text-[#FED65B] uppercase tracking-wider border-b border-[#e5e2e1] dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3.5">Order ID</th>
                    <th className="px-4 py-3.5">Customer & Contact</th>
                    <th className="px-4 py-3.5">Branch</th>
                    <th className="px-4 py-3.5">Live Status</th>
                    <th className="px-4 py-3.5">Payment</th>
                    <th className="px-4 py-3.5">Total</th>
                    <th className="px-4 py-3.5">Date & Time</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e2e1]/70 dark:divide-white/10">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-[#6F6F6F] dark:text-gray-400">
                        {loading ? "Loading live orders from system..." : "No orders match your filter criteria."}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => (
                      <tr key={order.dbId} className="hover:bg-[#FAFAFA] dark:hover:bg-[#220e36] transition-colors">
                        <td className="px-4 py-3.5 font-extrabold text-[#5E228B] dark:text-[#FED65B] font-manrope whitespace-nowrap">
                          {order.id}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-[#2F2F2F] dark:text-white">{order.customerName}</div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#6F6F6F] dark:text-gray-400 mt-0.5">
                            <a href={`tel:${order.phone}`} className="hover:text-[#5E228B] dark:hover:text-[#FED65B] flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-[#FED65B]" />
                              {order.phone}
                            </a>
                            <a
                              href={`https://wa.me/254${order.phone.replace(/^0/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-[10px]"
                              title="Chat on WhatsApp"
                            >
                              WA
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[11px] font-bold text-[#5F5F5F] dark:text-gray-300 whitespace-nowrap">
                          {order.branch}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={order.status}
                            disabled={actionId === order.dbId}
                            onChange={(e) =>
                              handleSetStatus(order, e.target.value as OrderStatus)
                            }
                            className={`text-xs py-1.5 px-2.5 rounded-xl border font-bold outline-none cursor-pointer ${getStatusBadgeStyle(
                              order.status
                            )}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} className="bg-white dark:bg-[#1a0c2a] text-[#2F2F2F] dark:text-white">
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={order.paymentStatus}
                            disabled={actionId === order.dbId}
                            onChange={(e) =>
                              handlePaymentChange(order, e.target.value as PaymentStatus)
                            }
                            className={`text-xs py-1.5 px-2.5 rounded-xl border outline-none cursor-pointer ${getPaymentBadgeStyle(
                              order.paymentStatus
                            )}`}
                          >
                            {PAYMENT_OPTIONS.map((p) => (
                              <option key={p} value={p} className="bg-white dark:bg-[#1a0c2a] text-[#2F2F2F] dark:text-white">
                                {p}
                              </option>
                            ))}
                          </select>
                          {(order.mpesaReceiptNumber || order.mpesaRef) && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-mono font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{order.mpesaReceiptNumber || order.mpesaRef}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-black text-[#5E228B] dark:text-[#FED65B] whitespace-nowrap font-manrope">
                          {formatMoney(order.totalPrice)}
                        </td>
                        <td className="px-4 py-3.5 text-[11px] text-[#6F6F6F] dark:text-gray-400 whitespace-nowrap">
                          <div className="font-mono text-[#2F2F2F] dark:text-gray-200 font-bold">
                            {formatDate(order.rawCreatedAt)}
                          </div>
                          {(order.pickupDate || order.timeSlot) && (
                            <div className="text-[10px] font-extrabold text-[#5E228B] dark:text-[#FED65B] mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#FED65B] shrink-0" />
                              <span>{order.pickupDate || 'Scheduled'} {order.timeSlot ? `(${order.timeSlot})` : ''}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {nextStatus(order.status) && (
                              <button
                                type="button"
                                title={`Advance status to ${nextStatus(order.status)}`}
                                disabled={actionId === order.dbId}
                                onClick={() => handleAdvanceStatus(order)}
                                className="px-2.5 py-1.5 rounded-xl bg-[#5E228B] text-white hover:bg-[#4A1772] text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1 shadow-2xs"
                              >
                                <span>Next</span>
                                <ChevronRight className="w-3.5 h-3.5 text-[#FED65B]" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelected(order)}
                              className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-[#e5e2e1] dark:border-white/10 hover:bg-[#f6f3f2] dark:hover:bg-white/10 text-[#2F2F2F] dark:text-gray-200 cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(order)}
                              className="p-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white dark:bg-[#1a0c2a] rounded-2xl p-8 text-center text-[#6F6F6F] dark:text-gray-400 border border-[#e5e2e1] dark:border-white/10">
                {loading ? "Loading live orders..." : "No orders match your filter criteria."}
              </div>
            ) : (
              filtered.map((order) => (
                <div
                  key={order.dbId}
                  className="bg-white dark:bg-[#1a0c2a] rounded-2xl border border-[#e5e2e1] dark:border-white/10 p-4 shadow-2xs space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-black font-manrope text-[#5E228B] dark:text-[#FED65B] text-sm">{order.id}</span>
                      <h3 className="font-bold text-sm text-[#2F2F2F] dark:text-white">{order.customerName}</h3>
                      <a href={`tel:${order.phone}`} className="text-xs text-[#6F6F6F] dark:text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#FED65B]" />
                        {order.phone}
                      </a>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-[#5E228B] dark:text-[#FED65B] font-manrope">{formatMoney(order.totalPrice)}</p>
                      <p className="text-[10px] text-[#6F6F6F] dark:text-gray-400 font-bold">{order.branch}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1 border-t border-[#e5e2e1] dark:border-white/10">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-extrabold uppercase text-[#6F6F6F] dark:text-gray-400">Order Status</label>
                      <select
                        value={order.status}
                        disabled={actionId === order.dbId}
                        onChange={(e) =>
                          handleSetStatus(order, e.target.value as OrderStatus)
                        }
                        className={`text-xs py-2 px-2.5 rounded-xl border font-bold ${getStatusBadgeStyle(order.status)}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-white dark:bg-[#1a0c2a] text-[#2F2F2F] dark:text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-extrabold uppercase text-[#6F6F6F] dark:text-gray-400">Payment Status</label>
                      <select
                        value={order.paymentStatus}
                        disabled={actionId === order.dbId}
                        onChange={(e) =>
                          handlePaymentChange(order, e.target.value as PaymentStatus)
                        }
                        className={`text-xs py-2 px-2.5 rounded-xl border font-bold ${getPaymentBadgeStyle(order.paymentStatus)}`}
                      >
                        {PAYMENT_OPTIONS.map((p) => (
                          <option key={p} value={p} className="bg-white dark:bg-[#1a0c2a] text-[#2F2F2F] dark:text-white">
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {nextStatus(order.status) && (
                      <button
                        type="button"
                        disabled={actionId === order.dbId}
                        onClick={() => handleAdvanceStatus(order)}
                        className="flex-1 py-2.5 rounded-xl bg-[#5E228B] text-white text-xs font-bold font-manrope cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <span>Advance Step</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#FED65B]" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelected(order)}
                      className="flex-1 py-2.5 rounded-xl border border-[#e5e2e1] dark:border-white/10 text-xs font-bold font-manrope text-[#2F2F2F] dark:text-gray-200 cursor-pointer"
                    >
                      Full Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(order)}
                      className="p-2.5 rounded-xl text-rose-600 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            aria-label="Close"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white dark:bg-[#1a0c2a] text-[#2F2F2F] dark:text-white w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-5 border border-transparent dark:border-white/10">
            <div className="flex justify-between items-start pb-3 border-b border-[#e5e2e1] dark:border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FED65B] bg-[#5E228B] px-2.5 py-0.5 rounded-md">
                  Order Record
                </span>
                <h2 className="text-xl font-black font-manrope text-[#5E228B] dark:text-[#FED65B] flex items-center gap-2 mt-1">
                  <Package className="w-5 h-5 text-[#FED65B]" />
                  {selected.id}
                </h2>
                <p className="text-xs text-[#6F6F6F] dark:text-gray-400 font-mono mt-0.5">{formatDate(selected.rawCreatedAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded-full hover:bg-[#f6f3f2] dark:hover:bg-white/10 text-[#2F2F2F] dark:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider font-manrope text-[#5E228B] dark:text-[#FED65B]">Customer & Delivery Information</h3>
              <div className="bg-[#FAFAFA] dark:bg-[#25123a] p-3.5 rounded-2xl border border-[#e5e2e1] dark:border-white/10 space-y-2 text-xs">
                <DetailRow icon={User} label="Customer Name" value={selected.customerName} />
                <DetailRow icon={Phone} label="Phone Number" value={selected.phone} />
                <DetailRow icon={MapPin} label="Delivery Address" value={selected.address} />
                <DetailRow icon={Building2} label="Assigned Branch" value={selected.branch} />
              </div>
            </div>

            {/* Editable Order Date & Time Options */}
            <div className="space-y-3 pt-2 border-t border-[#e5e2e1] dark:border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider font-manrope text-[#5E228B] dark:text-[#FED65B] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#FED65B]" />
                  Pickup & Delivery Schedule
                </h3>
                <span className="text-[10px] text-[#6F6F6F] dark:text-gray-400 font-mono">
                  Created: {formatDate(selected.rawCreatedAt)}
                </span>
              </div>
              
              <div className="bg-[#FAFAFA] dark:bg-[#25123a] p-3.5 rounded-2xl border border-[#e5e2e1] dark:border-white/10 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-[#6F6F6F] dark:text-gray-400 block mb-1">
                      Pickup / Fulfillment Date
                    </label>
                    <input
                      type="date"
                      value={editingDate}
                      onChange={(e) => setEditingDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#e5e2e1] dark:border-white/10 bg-white dark:bg-[#1a0c2a] text-xs font-bold dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-[#6F6F6F] dark:text-gray-400 block mb-1">
                      Time Slot Window
                    </label>
                    <select
                      value={editingSlot}
                      onChange={(e) => setEditingSlot(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#e5e2e1] dark:border-white/10 bg-white dark:bg-[#1a0c2a] text-xs font-bold dark:text-white"
                    >
                      <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                      <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
                      <option value="Express Pickup (Immediate)">Express Pickup (Immediate)</option>
                      <option value="Anytime">Anytime</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveDateTime}
                  disabled={actionId === selected.dbId}
                  className="w-full py-2.5 rounded-xl bg-[#5E228B] text-white text-xs font-bold font-manrope hover:bg-[#4A1772] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Clock className="w-3.5 h-3.5 text-[#FED65B]" />
                  <span>Save Schedule Changes</span>
                </button>
              </div>
            </div>

            {/* M-Pesa Receipt Details & Payment Verification Audit */}
            <div className="space-y-3 pt-2 border-t border-[#e5e2e1] dark:border-white/10">
              <h3 className="text-xs font-black uppercase tracking-wider font-manrope text-[#5E228B] dark:text-[#FED65B] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Payment Verification & Receipt Code
              </h3>
              <div className="bg-[#FAFAFA] dark:bg-[#25123a] p-3.5 rounded-2xl border border-[#e5e2e1] dark:border-white/10 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <DetailRow icon={CreditCard} label="Total Amount" value={formatMoney(selected.totalPrice)} />
                  <DetailRow icon={Phone} label="Payer Phone Number" value={selected.mpesaPhone || selected.phone || "—"} />
                  <DetailRow icon={CheckCircle2} label="M-Pesa Receipt Code" value={selected.mpesaReceiptNumber || selected.mpesaRef || "Not Attached"} />
                  {selected.checkoutRequestId && (
                    <DetailRow icon={Clock} label="Checkout Req ID" value={selected.checkoutRequestId} />
                  )}
                  {selected.paymentStatusReason && (
                    <DetailRow icon={AlertCircle} label="Callback Reason" value={selected.paymentStatusReason} />
                  )}
                  {selected.transactionDate && (
                    <DetailRow icon={Clock} label="Trans Date" value={formatDate(selected.transactionDate)} />
                  )}
                </div>

                {/* Attach / Edit Safaricom M-Pesa Receipt Code */}
                <div className="p-3 bg-white dark:bg-[#1a0c2a] rounded-xl border border-[#e5e2e1] dark:border-white/10 space-y-2">
                  <label className="text-[10px] font-extrabold uppercase text-[#5E228B] dark:text-[#FED65B] block font-manrope">
                    Attach M-Pesa Receipt Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingReceiptCode}
                      onChange={(e) => setEditingReceiptCode(e.target.value.toUpperCase())}
                      placeholder="e.g. QKH839201X"
                      className="flex-1 p-2.5 rounded-xl border border-[#e5e2e1] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#25123a] font-mono text-xs font-bold dark:text-white uppercase tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={handleSaveReceiptCode}
                      disabled={actionId === selected.dbId}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-manrope cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Confirm Code
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Workflow Editor */}
            <div className="pt-2 space-y-3 border-t border-[#e5e2e1] dark:border-white/10">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5E228B] dark:text-[#FED65B] font-manrope">Order Status</label>
                <select
                  value={selected.status}
                  disabled={actionId === selected.dbId}
                  onChange={(e) =>
                    handleSetStatus(selected, e.target.value as OrderStatus)
                  }
                  className="w-full py-2.5 px-3 rounded-xl border border-[#e5e2e1] dark:border-white/10 text-xs font-bold bg-[#FAFAFA] dark:bg-[#25123a] dark:text-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="dark:bg-[#1a0c2a]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5E228B] dark:text-[#FED65B] font-manrope">Payment Status</label>
                <select
                  value={selected.paymentStatus}
                  disabled={actionId === selected.dbId}
                  onChange={(e) =>
                    handlePaymentChange(selected, e.target.value as PaymentStatus)
                  }
                  className="w-full py-2.5 px-3 rounded-xl border border-[#e5e2e1] dark:border-white/10 text-xs font-bold bg-[#FAFAFA] dark:bg-[#25123a] dark:text-white"
                >
                  {PAYMENT_OPTIONS.map((p) => (
                    <option key={p} value={p} className="dark:bg-[#1a0c2a]">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap sm:flex-nowrap gap-2.5">
              <button
                type="button"
                onClick={() => openPrintableReceipt(selected as unknown as Order)}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#5E228B] hover:bg-[#4A1772] text-white font-bold text-xs font-manrope flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-[#FED65B]" />
                <span>Print / Download PDF Receipt</span>
              </button>
              <a
                href={`https://wa.me/254${selected.phone.replace(/^0/, '')}?text=${encodeURIComponent(`Hello ${selected.customerName}, this is Goldtribe Link Laundromat regarding your order ${selected.id}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-manrope flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-3 rounded-2xl border border-[#e5e2e1] dark:border-white/10 font-bold text-xs font-manrope hover:bg-[#f6f3f2] dark:hover:bg-white/10 text-[#2F2F2F] dark:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            aria-label="Cancel"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white dark:bg-[#1a0c2a] dark:text-white rounded-3xl shadow-2xl p-6 max-w-sm w-full space-y-4 border border-transparent dark:border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold font-manrope text-[#5E228B] dark:text-[#FED65B] text-lg">Delete order {deleteTarget.id}?</h3>
              <p className="text-xs text-[#6F6F6F] dark:text-gray-300 mt-1 leading-relaxed">
                Permanently remove order for <strong>{deleteTarget.customerName}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#e5e2e1] dark:border-white/10 font-bold text-xs font-manrope dark:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionId === deleteTarget.dbId}
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-manrope cursor-pointer disabled:opacity-50 shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-[#5E228B] dark:text-[#FED65B] shrink-0 mt-0.5" />
      <div>
        <dt className="text-[10px] font-extrabold uppercase text-[#6F6F6F] dark:text-gray-400 font-manrope tracking-wider">{label}</dt>
        <dd className="text-[#2F2F2F] dark:text-white font-medium leading-tight">{value}</dd>
      </div>
    </div>
  );
}