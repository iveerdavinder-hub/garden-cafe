import React, { useState, useEffect } from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuPage } from './components/MenuPage';
import { BrewMethodsStrip } from './components/BrewMethodsStrip';
import { OurCoffee } from './components/OurCoffee';
import { About } from './components/About';
import { GalleryStrip } from './components/GalleryStrip';
import { EventsAndSpace } from './components/EventsAndSpace';
import { Testimonials } from './components/Testimonials';
import { FAQs } from './components/FAQs';
import { FindUsCTA } from './components/FindUsCTA';
import { Footer } from './components/Footer';
import { ReservationModal } from './components/ReservationModal';
import { LightboxModal } from './components/LightboxModal';
import { FAQModal } from './components/FAQModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { CookiePolicyModal } from './components/CookiePolicyModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { GalleryItem } from './types';

interface StorefrontProps {
  onOpenBooking: () => void;
  onOpenMenu: () => void;
  onOpenAdmin: () => void;
  onOpenFAQs: () => void;
  onOpenCookiePolicy: () => void;
  onSelectGalleryItem: (item: GalleryItem) => void;
}

const Storefront: React.FC<StorefrontProps> = ({
  onOpenBooking,
  onOpenMenu,
  onOpenAdmin,
  onOpenFAQs,
  onOpenCookiePolicy,
  onSelectGalleryItem,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-amber-warm/20 selection:text-espresso flex flex-col">
      {/* Live Manager Announcement Banner */}
      <AnnouncementBanner />

      {/* 1. Navbar */}
      <Navbar onOpenBooking={onOpenBooking} onOpenMenu={onOpenMenu} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 2. Hero */}
        <Hero onOpenBooking={onOpenBooking} onOpenMenu={onOpenMenu} />

        {/* 3. Our Coffee & Craft */}
        <OurCoffee onOpenBooking={onOpenBooking} />

        {/* 4. Brew Methods Strip */}
        <BrewMethodsStrip />

        {/* 5. About */}
        <About />

        {/* 6. Gallery Strip */}
        <GalleryStrip onSelectImage={onSelectGalleryItem} />

        {/* 7. Events & Space */}
        <EventsAndSpace onOpenBooking={onOpenBooking} />

        {/* 8. Testimonials */}
        <Testimonials />

        {/* 9. FAQs Section */}
        <FAQs onOpenBooking={onOpenBooking} />

        {/* 10. Find Us CTA */}
        <FindUsCTA />
      </main>

      {/* 11. Footer */}
      <Footer
        onOpenAdmin={onOpenAdmin}
        onOpenMenu={onOpenMenu}
        onOpenFAQs={onOpenFAQs}
        onOpenCookiePolicy={onOpenCookiePolicy}
      />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAdmin, setIsAdmin } = useCafe();
  const [currentView, setCurrentView] = useState<'home' | 'menu'>('home');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [cookiePolicyOpen, setCookiePolicyOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  // Synchronize route with URL: /admin, /menu, #menu, or ?admin
  useEffect(() => {
    const checkRoute = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;

      const isPathAdmin =
        pathname === '/admin' ||
        pathname.startsWith('/admin/') ||
        hash === '#admin' ||
        search.includes('admin');

      if (isPathAdmin && !isAdmin) {
        setIsAdmin(true);
        return;
      }

      if (!isPathAdmin && isAdmin) {
        setIsAdmin(false);
      }

      if (
        pathname === '/menu' ||
        pathname.startsWith('/menu/') ||
        hash === '#menu' ||
        search.includes('menu')
      ) {
        setCurrentView('menu');
      } else {
        setCurrentView('home');
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, [isAdmin, setIsAdmin]);

  // Keyboard shortcut: Ctrl + Shift + A to toggle manager console
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdmin) {
          window.history.pushState({}, '', '/');
          setIsAdmin(false);
        } else {
          setAuthModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, setIsAdmin]);

  const handleOpenMenu = () => {
    window.history.pushState({}, '', '/menu');
    setCurrentView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = (sectionId?: string) => {
    window.history.pushState({}, '', sectionId ? `/#${sectionId}` : '/');
    setCurrentView('home');
    if (sectionId && sectionId !== 'hero') {
      setTimeout(() => {
        const el =
          document.getElementById(sectionId) ||
          (sectionId === 'coffee' ? document.getElementById('craft') : null);
        if (el) {
          const yOffset = -75;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExitAdmin = () => {
    window.history.pushState({}, '', '/');
    setIsAdmin(false);
  };

  const handleEnterAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdmin(true);
  };

  if (isAdmin) {
    return <AdminLayout onExitAdmin={handleExitAdmin} />;
  }

  return (
    <>
      {currentView === 'home' ? (
        <Storefront
          onOpenBooking={() => setBookingOpen(true)}
          onOpenMenu={handleOpenMenu}
          onOpenAdmin={() => setAuthModalOpen(true)}
          onOpenFAQs={() => setFaqModalOpen(true)}
          onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
          onSelectGalleryItem={(item) => setSelectedGalleryItem(item)}
        />
      ) : (
        <MenuPage
          onNavigateHome={handleNavigateHome}
          onOpenBooking={() => setBookingOpen(true)}
          onOpenAdmin={() => setAuthModalOpen(true)}
          onOpenFAQs={() => setFaqModalOpen(true)}
          onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
        />
      )}

      {/* Interactive Customer Modals */}
      <ReservationModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

      <LightboxModal
        item={selectedGalleryItem}
        onClose={() => setSelectedGalleryItem(null)}
      />

      <FAQModal
        isOpen={faqModalOpen}
        onClose={() => setFaqModalOpen(false)}
        onOpenBooking={() => setBookingOpen(true)}
      />

      <CookiePolicyModal
        isOpen={cookiePolicyOpen}
        onClose={() => setCookiePolicyOpen(false)}
      />

      {/* Floating Cookie Consent Notice */}
      <CookieConsentBanner
        onOpenPolicyModal={() => setCookiePolicyOpen(true)}
      />

      {/* Customer Food Ordering Drawer */}
      <CartDrawer />

      {/* Manager Authentication Modal */}
      <AdminAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          handleEnterAdmin();
        }}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <CafeProvider>
      <AppContent />
    </CafeProvider>
  );
};

export default App;
