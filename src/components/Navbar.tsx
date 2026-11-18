import React, { useState, useEffect } from 'react';
import { Coffee, Menu as MenuIcon, X, ArrowRight, Calendar, ShoppingBag, Instagram, MessageCircle } from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeData';
import { useCafe } from '../context/CafeContext';
import { LOCALE, formatText } from '../locales';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenMenu: () => void;
  currentView?: 'home' | 'menu';
  onNavigateHome?: (sectionId?: string) => void;
}

const NAV_ITEMS = [
  { id: 'coffee', label: LOCALE.navbar.items.coffee, altId: 'craft' },
  { id: 'menu', label: LOCALE.navbar.items.menu },
  { id: 'about', label: LOCALE.navbar.items.about },
  { id: 'gallery', label: LOCALE.navbar.items.gallery },
  { id: 'events', label: LOCALE.navbar.items.events },
  { id: 'faqs', label: LOCALE.navbar.items.faqs },
  { id: 'find-us', label: LOCALE.navbar.items.findUs },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenMenu,
  currentView = 'home',
  onNavigateHome,
}) => {
  const t = LOCALE.navbar;
  const { cart, setIsCartOpen } = useCafe();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(currentView === 'menu' ? 'menu' : '');

  const totalItemsCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  useEffect(() => {
    if (currentView === 'menu') {
      setActiveSection('menu');
      return;
    }

    const sectionIds = ['hero', 'coffee', 'about', 'gallery', 'events', 'faqs', 'find-us'];

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const scrollPos = window.scrollY + 160;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id) || (id === 'coffee' ? document.getElementById('craft') : null);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id);
            return;
          }
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'menu') {
      onOpenMenu();
      return;
    }

    if (currentView === 'menu' && onNavigateHome) {
      onNavigateHome(id);
      return;
    }

    const target = document.getElementById(id) || (id === 'coffee' ? document.getElementById('craft') : null);
    if (target) {
      const yOffset = -75;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
      if (window.history.pushState) {
        window.history.pushState(null, '', `#${id}`);
      }
    }
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (currentView === 'menu' && onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#faf6ef]/90 backdrop-blur-md py-3.5 shadow-warm-sm border-b border-[#faf6ef]/60'
          : 'bg-[#faf6ef]/70 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#hero"
          onClick={handleBrandClick}
          className="flex items-center gap-2.5 group text-foreground"
        >
          <div className="w-8 h-8 rounded-full bg-amber-warm/15 flex items-center justify-center text-amber-warm transition-transform group-hover:scale-105">
            <Coffee className="w-4 h-4 text-amber-warm" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif italic font-bold text-xl sm:text-2xl tracking-tight text-espresso-deep group-hover:text-amber-warm transition-colors">
              {CAFE_CONFIG.name}
            </span>
            <span className="label-caps text-[9px] text-muted-foreground/80 -mt-1 hidden sm:block">
              {CAFE_CONFIG.locationShort}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-surface/70 border border-border/70 backdrop-blur-sm shadow-warm-xs">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id || (item.altId && activeSection === item.altId);
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 flex items-center gap-1.5 active:scale-[0.98] ${
                  isActive
                    ? 'bg-cream text-espresso font-semibold shadow-warm-xs border border-border/80'
                    : 'text-foreground/75 hover:text-espresso hover:bg-cream/50'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-warm animate-pulse flex-shrink-0" />
                )}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-surface/80 text-espresso text-xs uppercase tracking-label font-medium hover:border-espresso hover:bg-surface transition-all duration-200 active:scale-[0.98] shadow-warm-xs"
            title={t.orderBagTitle}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-warm" />
            <span>{t.orderBag}</span>
            {totalItemsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-warm text-cream text-[10px] font-bold flex items-center justify-center -mr-1">
                {totalItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-espresso text-cream text-xs uppercase tracking-label font-medium hover:bg-espresso-brown transition-all duration-200 active:scale-[0.98] shadow-warm-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-warm" />
            <span>{t.bookTable}</span>
            <ArrowRight className="w-3 h-3 text-cream/70" />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full bg-surface text-espresso hover:text-amber-warm focus:outline-none"
            aria-label={t.orderBagTitle}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-warm text-cream text-[9px] font-bold flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-espresso hover:text-amber-warm focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-border/80 px-6 py-6 shadow-warm-lg animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id || (item.altId && activeSection === item.altId);
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, item.id);
                  }}
                  className={`text-base font-serif py-2.5 px-3 rounded-xl border-b border-border/30 flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-surface/90 text-espresso font-bold border-l-4 border-l-amber-warm'
                      : 'text-foreground/80 hover:text-amber-warm'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-warm" />}
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono uppercase text-amber-warm font-semibold">
                      {t.current}
                    </span>
                  )}
                </a>
              );
            })}

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border bg-surface text-espresso text-xs uppercase tracking-label font-medium"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-warm" />
                <span>{formatText(t.viewOrderBagCount, { count: totalItemsCount })}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-espresso text-cream text-xs uppercase tracking-label font-medium cursor-pointer"
              >
                <span>{t.bookTable}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-warm" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-4 text-xs font-sans text-muted-foreground border-t border-border/50">
                <a
                  href={CAFE_CONFIG.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-espresso"
                >
                  <Instagram className="w-4 h-4 text-amber-warm" />
                  <span>{t.social.instagram}</span>
                </a>
                <span>&middot;</span>
                <a
                  href={CAFE_CONFIG.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-espresso"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t.social.whatsapp}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
