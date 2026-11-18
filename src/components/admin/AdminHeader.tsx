import React from 'react';
import { Coffee, ArrowLeft, Trash2, Bell, Shield, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import { CAFE_CONFIG } from '../../data/cafeData';

interface AdminHeaderProps {
  activeTab: 'all' | 'orders' | 'reservations' | 'menu' | 'settings';
  setActiveTab: (tab: 'all' | 'orders' | 'reservations' | 'menu' | 'settings') => void;
  onExitAdmin: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  setActiveTab,
  onExitAdmin,
}) => {
  const { settings, reservations, menuItems, orders, clearAllData, updateSettings } = useCafe();

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const outOfStockCount = menuItems.filter((i) => i.stockStatus === 'out_of_stock').length;

  return (
    <header className="sticky top-0 z-40 bg-[#1c110b] text-cream border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-warm-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Brand & Store Status Toggle */}
        <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-warm/20 border border-amber-warm/30 flex items-center justify-center text-amber-warm">
              <Coffee className="w-5 h-5 text-amber-warm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-semibold text-base sm:text-lg tracking-tight text-cream">
                  {CAFE_CONFIG.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-warm/20 text-amber-warm border border-amber-warm/30">
                  Manager Portal
                </span>
              </div>
              <p className="text-[11px] font-mono text-cream/60">
                Sarabha Nagar, Ludhiana · Live Console
              </p>
            </div>
          </div>

          {/* Interactive Store ON / OFF Button */}
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <button
              type="button"
              onClick={() => {
                const willBeOpen = settings.storeStatus === 'closed';
                updateSettings({
                  storeStatus: willBeOpen ? 'open' : 'closed',
                  isOpen: willBeOpen,
                });
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all border shadow-sm active:scale-95 cursor-pointer ${
                settings.storeStatus !== 'closed'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30'
              }`}
              title="Click to toggle Store Operations ON / OFF"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.storeStatus !== 'closed' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Store: {settings.storeStatus !== 'closed' ? 'ON' : 'OFF'}
              </span>
              <div
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center ${
                  settings.storeStatus !== 'closed' ? 'bg-emerald-500 justify-end' : 'bg-zinc-600 justify-start'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm inline-block" />
              </div>
            </button>
          </div>

          {/* Interactive WhatsApp Auto-Open ON / OFF Button */}
          <div className="hidden xl:flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                updateSettings({
                  autoOpenWhatsApp: !settings.autoOpenWhatsApp,
                });
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all border shadow-sm active:scale-95 cursor-pointer ${
                settings.autoOpenWhatsApp
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-white/5 border-white/15 text-cream/70 hover:bg-white/10'
              }`}
              title="Click to toggle WhatsApp Auto-Redirect ON / OFF"
            >
              <span className="text-[11px] font-sans">WhatsApp Auto:</span>
              <span className="font-semibold text-[11px] uppercase">
                {settings.autoOpenWhatsApp ? 'ON' : 'OFF'}
              </span>
              <div
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center ${
                  settings.autoOpenWhatsApp ? 'bg-emerald-500 justify-end' : 'bg-zinc-600 justify-start'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm inline-block" />
              </div>
            </button>
          </div>
        </div>

        {/* Center: Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'Main Admin (All)', badge: null },
            {
              id: 'orders',
              label: 'Food Orders',
              badge: newOrdersCount > 0 ? `${newOrdersCount} new` : (orders.length > 0 ? orders.length : null),
              badgeColor: newOrdersCount > 0 ? 'bg-amber-warm text-espresso font-mono font-bold' : 'bg-white/20 text-cream',
            },
            {
              id: 'reservations',
              label: 'Bookings',
              badge: pendingCount > 0 ? pendingCount : null,
              badgeColor: 'bg-amber-warm text-espresso font-mono font-bold',
            },
            {
              id: 'menu',
              label: 'Menu & Stock',
              badge: outOfStockCount > 0 ? `${outOfStockCount} 86'd` : null,
              badgeColor: 'bg-rose-500/20 text-rose-300 font-mono text-[9px]',
            },
            { id: 'settings', label: 'Operations', badge: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-sans font-medium transition-all duration-150 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                activeTab === tab.id
                  ? 'bg-amber-warm text-espresso font-semibold shadow-warm-sm'
                  : 'text-cream/70 hover:text-cream hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none ${
                    tab.badgeColor || 'bg-white/20 text-cream'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 self-end md:self-auto">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset and clear all orders and reservations?')) {
                clearAllData();
              }
            }}
            title="Clear all orders and bookings data"
            className="px-2.5 py-1.5 rounded-lg text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all text-xs flex items-center gap-1.5 active:scale-[0.95] cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[11px] font-mono">Clear All Data</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-cream text-xs font-sans font-medium transition-colors active:scale-[0.98] border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-warm" />
            <span>Storefront</span>
          </button>
        </div>
      </div>
    </header>
  );
};
