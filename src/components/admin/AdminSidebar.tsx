import React from 'react';
import {
  Coffee,
  ShoppingBag,
  Calendar,
  Utensils,
  Settings,
  ArrowLeft,
  Trash2,
  X,
  PlusCircle,
  Layers,
} from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import { CAFE_CONFIG } from '../../data/cafeData';
import { LOCALE } from '../../locales';

interface AdminSidebarProps {
  activeTab: 'all' | 'orders' | 'reservations' | 'menu' | 'settings';
  setActiveTab: (tab: 'all' | 'orders' | 'reservations' | 'menu' | 'settings') => void;
  onExitAdmin: () => void;
  onOpenNewDishModal: () => void;
  onOpenNewBookingModal: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  scrollToSection: (id: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onExitAdmin,
  onOpenNewDishModal,
  onOpenNewBookingModal,
  isMobileOpen,
  setIsMobileOpen,
  scrollToSection,
}) => {
  const t = LOCALE.admin;
  const { settings, reservations, menuItems, orders, clearAllData, updateSettings } = useCafe();

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const outOfStockCount = menuItems.filter((i) => i.stockStatus === 'out_of_stock').length;

  const navItems = [
    {
      id: 'all' as const,
      label: t.nav.allTitle,
      description: t.nav.allDesc,
      icon: Layers,
      badge: null,
      badgeColor: '',
    },
    {
      id: 'orders' as const,
      label: t.nav.ordersTitle,
      description: t.nav.ordersDesc,
      icon: ShoppingBag,
      badge: newOrdersCount > 0 ? `${newOrdersCount} new` : (orders.length > 0 ? orders.length : null),
      badgeColor: newOrdersCount > 0 ? 'bg-amber-warm text-espresso font-bold' : 'bg-white/10 text-cream/80',
    },
    {
      id: 'reservations' as const,
      label: t.nav.reservationsTitle,
      description: t.nav.reservationsDesc,
      icon: Calendar,
      badge: pendingCount > 0 ? `${pendingCount} pending` : null,
      badgeColor: 'bg-amber-warm text-espresso font-bold',
    },
    {
      id: 'menu' as const,
      label: t.nav.menuTitle,
      description: t.nav.menuDesc,
      icon: Utensils,
      badge: outOfStockCount > 0 ? `${outOfStockCount} 86'd` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 font-mono border border-rose-500/30',
    },
    {
      id: 'settings' as const,
      label: t.nav.settingsTitle,
      description: t.nav.settingsDesc,
      icon: Settings,
      badge: null,
      badgeColor: '',
    },
  ];

  const handleNavClick = (tabId: 'all' | 'orders' | 'reservations' | 'menu' | 'settings') => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#170e09] text-cream flex flex-col border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-warm/20 border border-amber-warm/30 flex items-center justify-center text-amber-warm shadow-inner">
              <Coffee className="w-5 h-5 text-amber-warm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base tracking-tight text-cream">
                  {CAFE_CONFIG.name}
                </span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-amber-warm/80">
                {t.consoleSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-cream/60 hover:text-cream hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Switches */}
        <div className="px-4 py-3.5 border-b border-white/10 bg-black/20 space-y-2.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-cream/50 px-1">
            {t.liveSwitches}
          </div>

          <button
            type="button"
            onClick={() => {
              const willBeOpen = settings.storeStatus === 'closed';
              updateSettings({
                storeStatus: willBeOpen ? 'open' : 'closed',
                isOpen: willBeOpen,
              });
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all border active:scale-[0.98] cursor-pointer ${
              settings.storeStatus !== 'closed'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.storeStatus !== 'closed' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {settings.storeStatus !== 'closed' ? t.storeStatusOpen : t.storeStatusClosed}
              </span>
            </div>
            <div
              className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center ${
                settings.storeStatus !== 'closed' ? 'bg-emerald-500 justify-end' : 'bg-zinc-600 justify-start'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm inline-block" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              updateSettings({
                autoOpenWhatsApp: !settings.autoOpenWhatsApp,
              });
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all border active:scale-[0.98] cursor-pointer ${
              settings.autoOpenWhatsApp
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-white/5 border-white/10 text-cream/70 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans">{t.whatsappAuto}</span>
              <span className="font-semibold text-[11px] uppercase">
                {settings.autoOpenWhatsApp ? t.on : t.off}
              </span>
            </div>
            <div
              className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center ${
                settings.autoOpenWhatsApp ? 'bg-emerald-500 justify-end' : 'bg-zinc-600 justify-start'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm inline-block" />
            </div>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          <div className="text-[10px] font-mono uppercase tracking-wider text-cream/50 px-3 mb-2">
            {t.navigationMenu}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-150 group cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? 'bg-amber-warm text-espresso font-semibold shadow-warm-sm'
                    : 'text-cream/80 hover:text-cream hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-espresso/15 text-espresso'
                        : 'bg-white/5 text-amber-warm group-hover:bg-amber-warm/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-sans font-medium tracking-tight truncate">
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] font-mono truncate ${
                        isActive ? 'text-espresso/70' : 'text-cream/50'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] leading-tight flex-shrink-0 ${
                      item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Actions */}
          <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-cream/50 px-3 mb-1">
              {t.quickActions}
            </div>

            <button
              type="button"
              onClick={() => {
                if (activeTab === 'all') {
                  scrollToSection('admin-menu');
                } else {
                  setActiveTab('menu');
                }
                onOpenNewDishModal();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-sans text-cream/80 hover:text-cream bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-warm" />
              <span>{t.addNewDish}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeTab === 'all') {
                  scrollToSection('admin-reservations');
                } else {
                  setActiveTab('reservations');
                }
                onOpenNewBookingModal();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-sans text-cream/80 hover:text-cream bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-warm" />
              <span>{t.newReservation}</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/30 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-cream/60 px-1">
            <span>{t.locationLabel}</span>
            <span className="text-amber-warm/90">{t.locationValue}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(t.resetConfirm)) {
                  clearAllData();
                }
              }}
              className="px-2.5 py-2 rounded-lg text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Reset orders and reservations"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.reset}</span>
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-cream text-xs font-sans font-medium flex items-center justify-center gap-1.5 border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-warm" />
              <span>{t.storefront}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
