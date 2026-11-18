import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { DashboardOverview } from './DashboardOverview';
import { OrdersManager } from './OrdersManager';
import { MenuManager } from './MenuManager';
import { ReservationsManager } from './ReservationsManager';
import { SettingsManager } from './SettingsManager';
import {
  Menu as MenuIcon,
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Utensils,
  Settings,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import { LOCALE } from '../../locales';

interface AdminLayoutProps {
  onExitAdmin: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onExitAdmin }) => {
  const t = LOCALE.admin;
  const { orders, reservations, menuItems, settings } = useCafe();
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'menu' | 'reservations' | 'settings'>('all');
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const outOfStockCount = menuItems.filter((i) => i.stockStatus === 'out_of_stock').length;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleTabChange = (tab: 'all' | 'orders' | 'reservations' | 'menu' | 'settings') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFromOverview = (tab: 'orders' | 'menu' | 'reservations' | 'settings') => {
    if (activeTab === 'all') {
      scrollToSection(`admin-${tab}`);
    } else {
      setActiveTab(tab);
    }
  };

  const getPageTitle = () => t.pageTitles[activeTab];

  return (
    <div className="min-h-screen bg-surface/50 text-foreground font-sans flex selection:bg-amber-warm/20">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onExitAdmin={onExitAdmin}
        onOpenNewDishModal={() => setIsAddDishOpen(true)}
        onOpenNewBookingModal={() => setIsAddBookingOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        scrollToSection={scrollToSection}
      />

      <div className="flex-1 md:pl-72 flex flex-col min-h-screen w-full min-w-0 transition-all duration-300">
        {/* Top Sticky Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border/80 px-4 sm:px-8 py-3 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-espresso hover:bg-surface border border-border cursor-pointer"
                title="Open Navigation"
              >
                <MenuIcon className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <span>{t.portalBreadcrumb}</span>
                  <span>/</span>
                  <span className="text-amber-warm font-semibold truncate">
                    {activeTab === 'all' ? t.allSections : activeTab.toUpperCase()}
                  </span>
                </div>
                <h1 className="font-serif font-bold text-lg sm:text-xl text-espresso tracking-tight truncate">
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
                  settings.storeStatus !== 'closed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    settings.storeStatus !== 'closed' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span className="font-semibold uppercase">
                  {settings.storeStatus !== 'closed' ? t.storeChipOpen : t.storeChipClosed}
                </span>
              </div>

              {activeTab !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-colors cursor-pointer shadow-xs"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-warm" />
                  <span className="hidden sm:inline">{t.unifiedMasterView}</span>
                  <span className="sm:hidden">All</span>
                </button>
              ) : (
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface text-espresso text-xs font-mono border border-border">
                  <span className="w-2 h-2 rounded-full bg-amber-warm animate-pulse" />
                  {t.unifiedMode}
                </span>
              )}

              <button
                type="button"
                onClick={onExitAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-border/60 text-espresso text-xs font-sans font-medium border border-border transition-colors cursor-pointer"
                title="Return to customer storefront"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-warm" />
                <span className="hidden sm:inline">{t.storefront}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Sticky Sub-Anchor Bar */}
        {activeTab === 'all' && (
          <div className="sticky top-[61px] z-20 bg-surface/90 backdrop-blur-md border-b border-border/80 px-4 sm:px-8 py-2 shadow-xs">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-warm" />
                {t.quickJump}
              </span>

              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => scrollToSection('admin-overview')}
                  className="px-2.5 py-1 rounded-md text-xs font-sans text-espresso hover:bg-white border border-transparent hover:border-border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <LayoutDashboard className="w-3 h-3 text-amber-warm" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('admin-orders')}
                  className="px-2.5 py-1 rounded-md text-xs font-sans text-espresso hover:bg-white border border-transparent hover:border-border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <ShoppingBag className="w-3 h-3 text-amber-warm" />
                  <span>{t.nav.ordersTitle}</span>
                  {newOrdersCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-warm text-espresso font-bold">
                      {newOrdersCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('admin-reservations')}
                  className="px-2.5 py-1 rounded-md text-xs font-sans text-espresso hover:bg-white border border-transparent hover:border-border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Calendar className="w-3 h-3 text-amber-warm" />
                  <span>{t.nav.reservationsTitle}</span>
                  {pendingCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-warm text-espresso font-bold">
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('admin-menu')}
                  className="px-2.5 py-1 rounded-md text-xs font-sans text-espresso hover:bg-white border border-transparent hover:border-border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Utensils className="w-3 h-3 text-amber-warm" />
                  <span>{t.nav.menuTitle}</span>
                  {outOfStockCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-100 text-rose-700">
                      {outOfStockCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('admin-settings')}
                  className="px-2.5 py-1 rounded-md text-xs font-sans text-espresso hover:bg-white border border-transparent hover:border-border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Settings className="w-3 h-3 text-amber-warm" />
                  <span>{t.nav.settingsTitle}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Admin Viewport */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 space-y-14">
          {activeTab === 'all' ? (
            <>
              <section id="admin-overview" className="scroll-mt-28">
                <DashboardOverview
                  onNavigateTab={handleNavigateFromOverview}
                  onOpenNewBookingModal={() => {
                    setIsAddBookingOpen(true);
                    scrollToSection('admin-reservations');
                  }}
                  onOpenNewDishModal={() => {
                    setIsAddDishOpen(true);
                    scrollToSection('admin-menu');
                  }}
                />
              </section>

              <section id="admin-orders" className="scroll-mt-28 pt-8 border-t border-border/80">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-warm/20 text-amber-warm flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-amber-warm" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-espresso">
                        {t.pageTitles.orders}
                      </h3>
                      <p className="text-xs font-sans text-muted-foreground">
                        {t.nav.ordersDesc}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToSection('admin-overview')}
                    className="text-xs font-mono text-muted-foreground hover:text-espresso cursor-pointer"
                  >
                    {t.backToTop}
                  </button>
                </div>
                <OrdersManager />
              </section>

              <section id="admin-reservations" className="scroll-mt-28 pt-8 border-t border-border/80">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-espresso">
                        {t.pageTitles.reservations}
                      </h3>
                      <p className="text-xs font-sans text-muted-foreground">
                        {t.nav.reservationsDesc}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToSection('admin-overview')}
                    className="text-xs font-mono text-muted-foreground hover:text-espresso cursor-pointer"
                  >
                    {t.backToTop}
                  </button>
                </div>
                <ReservationsManager
                  isAddModalOpen={isAddBookingOpen}
                  setIsAddModalOpen={setIsAddBookingOpen}
                />
              </section>

              <section id="admin-menu" className="scroll-mt-28 pt-8 border-t border-border/80">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-espresso">
                        {t.pageTitles.menu}
                      </h3>
                      <p className="text-xs font-sans text-muted-foreground">
                        {t.nav.menuDesc}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToSection('admin-overview')}
                    className="text-xs font-mono text-muted-foreground hover:text-espresso cursor-pointer"
                  >
                    {t.backToTop}
                  </button>
                </div>
                <MenuManager
                  isAddModalOpen={isAddDishOpen}
                  setIsAddModalOpen={setIsAddDishOpen}
                />
              </section>

              <section id="admin-settings" className="scroll-mt-28 pt-8 border-t border-border/80">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-200 text-zinc-700 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-zinc-700" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-espresso">
                        {t.pageTitles.settings}
                      </h3>
                      <p className="text-xs font-sans text-muted-foreground">
                        {t.nav.settingsDesc}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToSection('admin-overview')}
                    className="text-xs font-mono text-muted-foreground hover:text-espresso cursor-pointer"
                  >
                    {t.backToTop}
                  </button>
                </div>
                <SettingsManager />
              </section>
            </>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-white border border-border/80 shadow-sm flex items-center justify-between">
                <span className="text-xs font-mono text-espresso">
                  {t.viewingFocused} <strong className="uppercase">{activeTab}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-warm" />
                  <span>{t.returnToUnified}</span>
                </button>
              </div>

              {activeTab === 'orders' && <OrdersManager />}
              {activeTab === 'menu' && (
                <MenuManager
                  isAddModalOpen={isAddDishOpen}
                  setIsAddModalOpen={setIsAddDishOpen}
                />
              )}
              {activeTab === 'reservations' && (
                <ReservationsManager
                  isAddModalOpen={isAddBookingOpen}
                  setIsAddModalOpen={setIsAddBookingOpen}
                />
              )}
              {activeTab === 'settings' && <SettingsManager />}
            </div>
          )}
        </main>

        <footer className="border-t border-border/80 bg-white py-4 px-6 text-center text-xs font-mono text-muted-foreground mt-auto">
          {t.footer}
        </footer>
      </div>
    </div>
  );
};
