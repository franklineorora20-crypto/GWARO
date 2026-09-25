import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, OrderItem, PageType } from './types';
import { SAMPLE_ORDERS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { PageHeader } from './components/PageHeader';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PriceCalculator } from './components/PriceCalculator';
import { OrderTracker } from './components/OrderTracker';
import TrackOrder from './components/TrackOrder';
import { BookingModal } from './components/BookingModal';
import { GoldPassMemberships } from './components/GoldPassMemberships';
import { BranchesSection } from './components/BranchesSection';
import { GarmentCareFAQ } from './components/GarmentCareFAQ';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { 
  Truck, Shirt, Calculator, Search, Crown, MapPin, HelpCircle, 
  ArrowRight, Sparkles, LayoutGrid, CheckCircle2 
} from 'lucide-react';
import { TrustBanner } from './components/TrustBanner';
import { QuickHub } from './components/QuickHub';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomBar } from './components/MobileBottomBar';
import { CommandMenu } from './components/CommandMenu';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { getOrders, mapDbOrderToOrder } from './lib/orders';
import { 
  isFirebaseConfigured, 
  saveOrderToFirebase, 
  updateFirebaseOrderStatus, 
  subscribeToFirebaseOrders 
} from './lib/firebaseOrders';

const pathToPage = (pathname: string): PageType => {
  const normalized = pathname.replace(/\/+$|\/$/, '') || '/';
  const map: Record<string, PageType> = {
    '/': 'home',
    '/home': 'home',
    '/services': 'services',
    '/calculator': 'calculator',
    '/track': 'track',
    '/memberships': 'memberships',
    '/branches': 'branches',
    '/locations': 'branches',
    '/faq': 'faq',
    '/all': 'all',
  };
  return map[normalized.toLowerCase()] || 'home';
};

const pageToPath = (page: PageType) => {
  const map: Record<PageType, string> = {
    home: '/',
    services: '/services',
    calculator: '/calculator',
    track: '/track',
    memberships: '/memberships',
    branches: '/branches',
    faq: '/faq',
    all: '/all',
  };
  return map[page];
};


export default function App() {
  // Page Routing State
  const [activePage, setActivePage] = useState<PageType>(pathToPage(window.location.pathname));

  // Saved Orders in LocalStorage
 const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);

  const loadOrders = useCallback(async () => {
    let dbOrdersLoaded = false;
    if (isSupabaseConfigured) {
      try {
        const data = await getOrders();
        if (data && data.length > 0) {
          setOrders(data.map((row) => mapDbOrderToOrder(row)));
          dbOrdersLoaded = true;
        }
      } catch (error) {
        console.warn('Supabase fetch notice, falling back to local storage');
      }
    }

    if (!dbOrdersLoaded) {
      try {
        const local = localStorage.getItem('goldtribe_orders');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
          }
        }
      } catch (e) {
        console.warn('Error reading local orders:', e);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('goldtribe_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  }, [orders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = subscribeToFirebaseOrders((fbOrders) => {
      if (fbOrders && fbOrders.length > 0) {
        setOrders(fbOrders);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    try {
      const channel = supabase
        .channel('orders-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'Orders' },
          () => {
            loadOrders();
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    } catch (e) {
      console.warn('Realtime subscription notice:', e);
    }
  }, [loadOrders]);

  // Booking Modal state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>();
  const [prefilledItems, setPrefilledItems] = useState<OrderItem[] | undefined>();
  const [prefilledTotal, setPrefilledTotal] = useState<number | undefined>();

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast State
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Active Order Search Target for tracking
  const [activeTrackingId, setActiveTrackingId] = useState<string>('GL-1234');

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: Order['status']) => {
    // Optimistic local state update
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      try {
        localStorage.setItem('goldtribe_orders', JSON.stringify(updated));
      } catch (e) {
        console.warn('Error saving local orders:', e);
      }
      return updated;
    });

    if (isFirebaseConfigured) {
      try {
        await updateFirebaseOrderStatus(orderId, newStatus);
      } catch (e) {
        console.warn('Failed to update order status in Firebase:', e);
      }
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("Orders")
          .update({
            status: newStatus
          })
          .eq("tracking_id", orderId)
          .select();

        if (error) {
          console.warn("STATUS UPDATE NOTICE:", error.message);
          return;
        }

        if (data && data.length > 0) {
          await loadOrders();
        }
      } catch (error) {
        console.warn('Failed to update order status in Supabase:', error);
      }
    }
  }, [loadOrders]);

  const showToast = (
    title: string, 
    message?: string, 
    type: 'success' | 'error' | 'info' = 'success',
    options?: { copyText?: string; actionLabel?: string; onAction?: () => void }
  ) => {
    setToast({ 
      id: `${Date.now()}`, 
      title, 
      message, 
      type,
      copyText: options?.copyText,
      actionLabel: options?.actionLabel,
      onAction: options?.onAction
    });
  };

  const handleSelectPage = (page: PageType) => {
    setActivePage(page);
    window.history.pushState({ page }, '', pageToPath(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (serviceName?: string) => {
    setPreselectedService(serviceName);
    setPrefilledItems(undefined);
    setPrefilledTotal(undefined);
    setBookingOpen(true);
  };

  const handleProceedWithQuote = (items: OrderItem[], total: number) => {
    setPrefilledItems(items);
    setPrefilledTotal(total);
    setPreselectedService(undefined);
    setBookingOpen(true);
  };

  const handleOrderCreated = async (newOrder: Order) => {
    try {
      const stored = localStorage.getItem('goldtribe_orders');
      const list: Order[] = stored ? JSON.parse(stored) : [];
      const updated = [newOrder, ...list.filter((o) => o.id !== newOrder.id)];
      localStorage.setItem('goldtribe_orders', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error persisting created order locally:', e);
    }

    if (isFirebaseConfigured) {
      try {
        await saveOrderToFirebase(newOrder);
      } catch (e) {
        console.warn('Error saving order to Firebase:', e);
      }
    }

    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
    setBookingOpen(false);
    setActiveTrackingId(newOrder.id);

    showToast(
      'Order Booked Successfully!',
      `Order #${newOrder.id} generated! Goldtribe rider scheduled for ${newOrder.address}.`
    );

    setTimeout(() => {
      handleSelectPage('track');
    }, 400);
  };

  const handleNavigateToSection = (sectionId: string) => {
    const pageMap: Record<string, PageType> = {
      hero: 'home',
      home: 'home',
      services: 'services',
      calculator: 'calculator',
      track: 'track',
      memberships: 'memberships',
      locations: 'branches',
      branches: 'branches',
      faq: 'faq',
      all: 'all',
    };
    handleSelectPage(pageMap[sectionId] || 'home');
  };

  useEffect(() => {
    const initialPage = pathToPage(window.location.pathname);
    window.history.replaceState({ page: initialPage }, '', window.location.pathname);

    const onPopState = (event: PopStateEvent) => {
      const page = event.state?.page || pathToPage(window.location.pathname);
      setActivePage(page);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#fcf9f8] dark:bg-[#0f0717] text-[#1c1b1b] dark:text-gray-100 font-worksans selection:bg-[#fed65b] selection:text-[#745c00] relative transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onNavigateToSection={handleNavigateToSection}
        activeOrdersCount={orders.length}
        orders={orders}
        onSelectOrderToTrack={(orderId) => {
          setActiveTrackingId(orderId);
          handleSelectPage('track');
        }}
        activePage={activePage}
        onSelectPage={handleSelectPage}
      />

      {/* Dynamic Multi-Page Screen Views */}
      <main className="min-h-[80vh] pt-16 sm:pt-20 pb-28 sm:pb-20 lg:pb-12 w-full max-w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activePage === 'home' && (
            <motion.div
              key="page-home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-12 pb-8 sm:pb-12 w-full max-w-full overflow-x-hidden"
            >
              {/* Hero Banner */}
              <Hero
                onOpenBooking={() => handleOpenBooking()}
                onNavigateToTrack={() => handleSelectPage('track')}
                onNavigateToCalculator={() => handleSelectPage('calculator')}
              />

              {/* Proof + Trust Section */}
              <TrustBanner />

              {/* Social Proof & Local Testimonials */}
              <Testimonials onShowToast={(t, m) => showToast(t, m)} />

              {/* Interactive Action-Driven Quick Hub Section */}
              <QuickHub
                ordersCount={orders.length}
                onOpenBooking={() => handleOpenBooking()}
                onNavigateToPage={(page) => handleSelectPage(page)}
              />

              {/* Featured Services Preview */}
              <ServicesSection
                onSelectServiceForBooking={(name) => handleOpenBooking(name)}
                onOpenBooking={() => handleOpenBooking()}
              />

              {/* Branch Hub Preview */}
              <BranchesSection
                onOpenBooking={() => handleOpenBooking()}
              />
            </motion.div>
          )}

          {activePage === 'services' && (
            <motion.div
              key="page-services"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 pb-16"
            >
              <PageHeader
                title="Garment Care Services & Rates"
                subtitle="Explore complete washing, dry cleaning, duvet revitalizing, carpet washing & janitorial services for Rongai & Ngong"
                icon={Shirt}
                badge="Goldtribe Garment Care"
                onBackToHome={() => handleSelectPage('home')}
                onOpenBooking={() => handleOpenBooking()}
                activePage={activePage}
                onSelectPage={handleSelectPage}
              />
              <ServicesSection
                onSelectServiceForBooking={(name) => handleOpenBooking(name)}
                onOpenBooking={() => handleOpenBooking()}
              />
            </motion.div>
          )}

          {activePage === 'calculator' && (
            <motion.div
              key="page-calculator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 pb-16"
            >
              <PageHeader
                title="Instant Price Quote Estimator"
                subtitle="Select your clothes, duvets, suits or carpets to calculate exact Ksh pricing with transparent rates"
                icon={Calculator}
                badge="Rate Calculator"
                onBackToHome={() => handleSelectPage('home')}
                onOpenBooking={() => handleOpenBooking()}
                activePage={activePage}
                onSelectPage={handleSelectPage}
              />
              <PriceCalculator
                onProceedToBookingWithItems={handleProceedWithQuote}
              />
            </motion.div>
          )}

          {activePage === 'track' && (
            <motion.div
              key="page-track"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 pb-16"
            >
              <PageHeader
                title="Garment Order Tracker"
                subtitle="Follow washing and finishing progress in real-time, inspect past bookings & download official receipts"
                icon={Search}
                badge="Order Tracking & Receipts"
                onBackToHome={() => handleSelectPage('home')}
                onOpenBooking={() => handleOpenBooking()}
                activePage={activePage}
                onSelectPage={handleSelectPage}
              />
              <TrackOrder initialTrackingId={activeTrackingId} orders={orders} />
            </motion.div>
          )}

          {activePage === 'memberships' && (
            <motion.div
              key="page-memberships"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 pb-16"
            >
              <PageHeader
                title="Gold Pass VIP Memberships"
                subtitle="Monthly laundry packages tailored for individuals, families, and high-frequency washing in Rongai & Ngong"
                icon={Crown}
                badge="VIP Subscriptions"
                onBackToHome={() => handleSelectPage('home')}
                onOpenBooking={() => handleOpenBooking()}
                activePage={activePage}
                onSelectPage={handleSelectPage}
              />
              <GoldPassMemberships
                onShowToast={showToast}
              />
            </motion.div>
          )}

          {activePage === 'branches' && (
            <motion.div
              key="page-branches"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 pb-16"
            >
              <PageHeader
                title="Operating Branches & Service Hubs"
                subtitle="Rongai (Magadi Rd) & Ngong (Country Arcade) - Visit us or request doorstep rider pickup"
                icon={MapPin}
                badge="Rongai & Ngong Branches"
                onBackToHome={() => handleSelectPage('home')}
                onOpenBooking={() => handleOpenBooking()}
                activePage={activePage}
                onSelectPage={handleSelectPage}
              />
              <BranchesSection
                onOpenBooking={() => handleOpenBooking()}
              />
            </motion.div>
          )}

          {activePage === 'faq' && (
            <motion.div
              key="page-faq"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 pb-16"
            >
              <PageHeader
                title="Garment Care Guide & Customer Reviews"
                subtitle="Answers to common washing questions, fabric care advice, and verified customer testimonials"
                icon={HelpCircle}
                badge="Care Guide & FAQ"
                onBackToHome={() => handleSelectPage('home')}
                onOpenBooking={() => handleOpenBooking()}
                activePage={activePage}
                onSelectPage={handleSelectPage}
              />
              <Testimonials
                onShowToast={showToast}
              />
              <GarmentCareFAQ />
            </motion.div>
          )}

          {activePage === 'all' && (
            <motion.div
              key="page-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-0"
            >
              <Hero
                onOpenBooking={() => handleOpenBooking()}
                onNavigateToTrack={() => handleNavigateToSection('track')}
                onNavigateToCalculator={() => handleNavigateToSection('calculator')}
              />
              <ServicesSection
                onSelectServiceForBooking={(name) => handleOpenBooking(name)}
                onOpenBooking={() => handleOpenBooking()}
              />
              <PriceCalculator
                onProceedToBookingWithItems={handleProceedWithQuote}
              />
              <OrderTracker
                orders={orders}
                initialSearchId={activeTrackingId}
                onRefreshOrders={loadOrders}
                onUpdateOrderStatus={updateOrderStatus}
              />
              <GoldPassMemberships
                onShowToast={showToast}
              />
              <BranchesSection
                onOpenBooking={() => handleOpenBooking()}
              />
              <Testimonials
                onShowToast={showToast}
              />
              <GarmentCareFAQ />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onNavigateToSection={handleNavigateToSection}
      />

      {/* Sticky Bottom Action Bar for Mobile Screens */}
      <MobileBottomBar onOpenBooking={() => handleOpenBooking()} />

      {/* Floating 1-Click WhatsApp Button */}
      <FloatingWhatsApp />

      
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedServiceName={preselectedService}
        prefilledItems={prefilledItems}
        prefilledTotal={prefilledTotal}
        onOrderCreated={handleOrderCreated}
      />

      {/* Toast Notification */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

