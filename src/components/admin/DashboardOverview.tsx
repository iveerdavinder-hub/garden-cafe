import React from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Utensils,
  MapPin,
  ArrowRight,
  Power,
  Bell,
} from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import { Order } from '../../types';

interface DashboardOverviewProps {
  onNavigateTab: (tab: 'orders' | 'menu' | 'reservations' | 'settings') => void;
  onOpenNewBookingModal: () => void;
  onOpenNewDishModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  onOpenNewBookingModal,
  onOpenNewDishModal,
}) => {
  const { menuItems, reservations, updateReservationStatus, orders, updateOrderStatus, settings, updateSettings } = useCafe();

  const pendingBookings = reservations.filter((r) => r.status === 'pending');
  const confirmedBookings = reservations.filter((r) => r.status === 'confirmed');
  const outOfStockItems = menuItems.filter((i) => i.stockStatus === 'out_of_stock');
  const lowStockItems = menuItems.filter((i) => i.stockStatus === 'low_stock');

  const newOrders = orders.filter((o) => o.status === 'new');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  // Dynamic calculations based on orders and table reservations
  const totalFoodSales = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.totalAmount : sum), 0);
  const totalGuests = reservations.reduce((sum, r) => sum + (parseInt(r.guests, 10) || 2), 0);
  const totalTableSales = totalGuests * 450;
  const totalSalesVal = totalFoodSales + totalTableSales;
  const totalSalesFormatted = totalSalesVal === 0 ? '₹0' : `₹${totalSalesVal.toLocaleString('en-IN')}`;

  const totalChecks = orders.length + reservations.length;
  const avgCheck = totalChecks === 0 ? '₹0' : `₹${Math.round(totalSalesVal / totalChecks)}`;

  // Hourly traffic representation
  const hourlyTraffic =
    reservations.length === 0 && orders.length === 0
      ? [
          { hour: '10 AM', percent: 0, guests: 0 },
          { hour: '12 PM', percent: 0, guests: 0 },
          { hour: '2 PM', percent: 0, guests: 0 },
          { hour: '4 PM', percent: 0, guests: 0 },
          { hour: '6 PM', percent: 0, guests: 0 },
          { hour: '8 PM', percent: 0, guests: 0 },
          { hour: '10 PM', percent: 0, guests: 0 },
        ]
      : [
          { hour: '10 AM', percent: 35, guests: 8 },
          { hour: '12 PM', percent: 85, guests: 22 },
          { hour: '2 PM', percent: 60, guests: 16 },
          { hour: '4 PM', percent: 45, guests: 12 },
          { hour: '6 PM', percent: 75, guests: 19 },
          { hour: '8 PM', percent: 95, guests: 26 },
          { hour: '10 PM', percent: 40, guests: 10 },
        ];

  const getCleanPhone = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const getOrderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            New
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-blue-100 text-blue-900">
            Kitchen
          </span>
        );
      case 'ready':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-emerald-100 text-emerald-900">
            Ready
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-medium bg-zinc-100 text-zinc-700">
            Done
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-medium bg-rose-100 text-rose-700">
            Void
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Alert if low or out of stock */}
      {(outOfStockItems.length > 0 || lowStockItems.length > 0) && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="text-xs font-sans">
              <span className="font-semibold">Kitchen Inventory Alert: </span>
              {outOfStockItems.length > 0 && (
                <span>{outOfStockItems.map((i) => i.name).join(', ')} marked Sold Out. </span>
              )}
              {lowStockItems.length > 0 && (
                <span>{lowStockItems.map((i) => i.name).join(', ')} running low.</span>
              )}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('menu')}
            className="text-xs font-mono font-medium text-amber-800 underline hover:text-amber-950 flex-shrink-0"
          >
            Manage stock &rarr;
          </button>
        </div>
      )}

      {/* Quick ON / OFF Control Hub */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-border/80 shadow-warm-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <Power className="w-4 h-4 text-amber-warm" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-espresso">
              Quick Live Controls (ON / OFF)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            Instant 1-click toggles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Store Operations ON/OFF */}
          <div
            onClick={() => {
              const willBeOpen = settings.storeStatus === 'closed';
              updateSettings({
                storeStatus: willBeOpen ? 'open' : 'closed',
                isOpen: willBeOpen,
              });
            }}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              settings.storeStatus !== 'closed'
                ? 'bg-emerald-50/60 border-emerald-500/30 hover:border-emerald-500/60'
                : 'bg-rose-50/60 border-rose-500/30 hover:border-rose-500/60'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    settings.storeStatus !== 'closed' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span className="font-sans font-semibold text-xs text-espresso">
                  Store Status
                </span>
              </div>
              <p className="text-[11px] font-sans text-muted-foreground mt-0.5 truncate">
                {settings.storeStatus !== 'closed' ? 'Open & accepting orders (ON)' : 'Store closed / orders paused (OFF)'}
              </p>
            </div>

            {/* Toggle switch */}
            <div
              className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center flex-shrink-0 ${
                settings.storeStatus !== 'closed' ? 'bg-emerald-600 justify-end' : 'bg-zinc-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </div>

          {/* 2. WhatsApp Auto-Redirect ON/OFF */}
          <div
            onClick={() => {
              updateSettings({
                autoOpenWhatsApp: !settings.autoOpenWhatsApp,
              });
            }}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              settings.autoOpenWhatsApp
                ? 'bg-emerald-50/60 border-emerald-500/30 hover:border-emerald-500/60'
                : 'bg-surface border-border/80 hover:border-border'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-warm" />
                <span className="font-sans font-semibold text-xs text-espresso">
                  WhatsApp Auto-Open
                </span>
              </div>
              <p className="text-[11px] font-sans text-muted-foreground mt-0.5 truncate">
                {settings.autoOpenWhatsApp ? 'Auto-redirects immediately (ON)' : 'Shows in-app receipt first (OFF)'}
              </p>
            </div>

            {/* Toggle switch */}
            <div
              className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center flex-shrink-0 ${
                settings.autoOpenWhatsApp ? 'bg-emerald-600 justify-end' : 'bg-zinc-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </div>

          {/* 3. Announcement Banner ON/OFF */}
          <div
            onClick={() => {
              updateSettings({
                announcementActive: !settings.announcementActive,
              });
            }}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              settings.announcementActive
                ? 'bg-amber-50/60 border-amber-500/30 hover:border-amber-500/60'
                : 'bg-surface border-border/80 hover:border-border'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-warm" />
                <span className="font-sans font-semibold text-xs text-espresso">
                  Top Announcement
                </span>
              </div>
              <p className="text-[11px] font-sans text-muted-foreground mt-0.5 truncate">
                {settings.announcementActive ? 'Banner visible on site (ON)' : 'Banner hidden (OFF)'}
              </p>
            </div>

            {/* Toggle switch */}
            <div
              className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center flex-shrink-0 ${
                settings.announcementActive ? 'bg-amber-600 justify-end' : 'bg-zinc-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Gross Sales */}
        <div className="p-5 rounded-2xl bg-white border border-border/80 shadow-warm-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-sans font-medium uppercase tracking-wider text-muted-foreground">
              Total Revenue Today
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-espresso">
              {totalSalesFormatted}
            </span>
            {totalSalesVal > 0 ? (
              <span className="text-xs font-mono text-emerald-600 font-semibold">+18.4%</span>
            ) : (
              <span className="text-xs font-mono text-muted-foreground">₹0</span>
            )}
          </div>
          <p className="text-[11px] font-sans text-muted-foreground mt-2">
            ₹{totalFoodSales.toLocaleString('en-IN')} food orders &middot; {totalGuests} table covers
          </p>
        </div>

        {/* Metric 2: Live Food Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-white border border-border/80 shadow-warm-sm cursor-pointer hover:border-amber-warm transition-all group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-sans font-medium uppercase tracking-wider text-muted-foreground group-hover:text-amber-warm transition-colors">
              Food Orders Placed
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-100 transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-espresso">
              {orders.length}
            </span>
            {newOrders.length > 0 ? (
              <span className="text-xs font-mono text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                {newOrders.length} New
              </span>
            ) : orders.length > 0 ? (
              <span className="text-xs font-mono text-emerald-600 font-semibold">Live</span>
            ) : (
              <span className="text-xs font-mono text-muted-foreground">0 in queue</span>
            )}
          </div>
          <p className="text-[11px] font-sans text-muted-foreground mt-2 flex items-center justify-between">
            <span>{preparingOrders.length} in kitchen &middot; {readyOrders.length} ready</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-amber-warm transition-colors" />
          </p>
        </div>

        {/* Metric 3: Table Bookings */}
        <div
          onClick={() => onNavigateTab('reservations')}
          className="p-5 rounded-2xl bg-white border border-border/80 shadow-warm-sm cursor-pointer hover:border-amber-warm transition-all group"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-sans font-medium uppercase tracking-wider text-muted-foreground group-hover:text-amber-warm transition-colors">
              Table Bookings
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700 group-hover:bg-rose-100 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-espresso">
              {reservations.length}
            </span>
            {pendingBookings.length > 0 && (
              <span className="text-xs font-mono text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded-full">
                {pendingBookings.length} Pending
              </span>
            )}
          </div>
          <p className="text-[11px] font-sans text-muted-foreground mt-2 flex items-center justify-between">
            <span>{confirmedBookings.length} confirmed bookings &middot; {totalGuests} guests</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-amber-warm transition-colors" />
          </p>
        </div>

        {/* Metric 4: Store Status */}
        <div className="p-5 rounded-2xl bg-white border border-border/80 shadow-warm-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-sans font-medium uppercase tracking-wider text-muted-foreground">
              Operations & Inventory
            </span>
            <button
              type="button"
              onClick={() => {
                const willBeOpen = settings.storeStatus === 'closed';
                updateSettings({
                  storeStatus: willBeOpen ? 'open' : 'closed',
                  isOpen: willBeOpen,
                });
              }}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase border transition-all cursor-pointer ${
                settings.storeStatus !== 'closed'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                  : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
              }`}
              title="Toggle Store ON / OFF"
            >
              Switch {settings.storeStatus !== 'closed' ? 'OFF' : 'ON'}
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-espresso">
              {settings.storeStatus === 'open' ? 'Open' : settings.storeStatus === 'busy' ? 'Busy' : 'Closed'}
            </span>
            <span className="text-xs font-mono text-muted-foreground">Closes {settings.closingTime}</span>
          </div>
          <p className="text-[11px] font-sans text-muted-foreground mt-2">
            {outOfStockItems.length === 0
              ? 'All 8 signature dishes in stock'
              : `${outOfStockItems.length} dishes temporarily 86'd`}
          </p>
        </div>
      </div>

      {/* Main Grid: Hourly Traffic Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Hourly Demand Heatmap (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-border/80 shadow-warm-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-sans font-semibold text-espresso">
                Courtyard Table Occupancy & Peak Rush
              </h3>
              <p className="text-xs font-sans text-muted-foreground">
                Live seating & dining volume throughout operational hours
              </p>
            </div>
            <span className="px-2.5 py-1 rounded text-[11px] font-mono bg-surface border border-border text-foreground">
              Peak: 8:00 PM – 9:30 PM
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="grid grid-cols-7 gap-3 sm:gap-4 items-end h-44 pt-4 border-b border-border/60 pb-3">
            {hourlyTraffic.map((item) => (
              <div key={item.hour} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.guests}p
                </span>
                <div className="w-full bg-surface rounded-t-lg overflow-hidden h-full flex items-end">
                  <div
                    style={{ height: `${item.percent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      item.percent > 80
                        ? 'bg-amber-warm'
                        : item.percent > 50
                        ? 'bg-espresso-brown'
                        : 'bg-espresso-brown/50'
                    } group-hover:brightness-110`}
                  />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">{item.hour}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-espresso-brown/50" /> Casual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-espresso-brown" /> Busy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-warm" /> Peak Rush
              </span>
            </div>
            <span className="font-mono text-[11px]">Sync Status: Live</span>
          </div>
        </div>

        {/* Right: Quick Action Hub (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-border/80 shadow-warm-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-sans font-semibold text-espresso mb-1">
              Quick Operations
            </h3>
            <p className="text-xs font-sans text-muted-foreground mb-5">
              Direct controls for floor staff and barista station
            </p>

            <div className="space-y-3">
              <button
                onClick={() => onNavigateTab('orders')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-surface hover:bg-surface/80 border border-border/80 text-espresso text-xs font-sans font-medium transition-colors active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-warm/15 text-amber-warm flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span>Manage Food Orders ({orders.length})</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                onClick={onOpenNewBookingModal}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-surface hover:bg-surface/80 border border-border/80 text-espresso text-xs font-sans font-medium transition-colors active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Record Table Booking</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                onClick={onOpenNewDishModal}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-surface hover:bg-surface/80 border border-border/80 text-espresso text-xs font-sans font-medium transition-colors active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-espresso-brown/15 text-espresso-brown flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>Add New Dish to Menu</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border/80">
            <span className="text-[11px] font-mono text-muted-foreground block mb-2">
              Garden Cafe WhatsApp Gateway:
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-oat text-xs font-mono text-espresso font-semibold">
              <span>+91 62396 04749</span>
              <span className="text-emerald-700 text-[10px]">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Real-Time Feeds: Live Food Orders + Table Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feed 1: Live Food Orders */}
        <div className="p-6 rounded-2xl bg-white border border-border/80 shadow-warm-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-warm" />
                <h3 className="text-base font-sans font-semibold text-espresso">
                  Live Food Orders Feed
                </h3>
                {newOrders.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-warm text-espresso">
                    {newOrders.length} New
                  </span>
                )}
              </div>
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-sans font-medium text-amber-warm hover:underline"
              >
                View all ({orders.length}) &rarr;
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center bg-surface/30 rounded-xl border border-dashed border-border/80">
                <CheckCircle2 className="w-6 h-6 text-emerald-600/70 mx-auto mb-2" />
                <p className="text-xs font-sans font-semibold text-espresso">No Orders In Queue</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  When customers order food from the website menu, their order items, table number, and phone number appear here immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-xl border border-border/60 bg-surface/20 hover:bg-surface/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-espresso">{order.orderNumber}</span>
                        {getOrderStatusBadge(order.status)}
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {order.createdAt}
                        </span>
                      </div>
                      <div className="mt-1 font-medium text-foreground">
                        {order.customerName} &middot;{' '}
                        <span className="text-muted-foreground font-normal">
                          {order.orderType === 'dine_in'
                            ? `Dine-In (${order.tableNumber || 'Table'})`
                            : order.orderType === 'takeaway'
                            ? 'Takeaway'
                            : 'Delivery'}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 flex-shrink-0">
                      <span className="font-mono font-bold text-espresso text-sm">
                        ₹{order.totalAmount}
                      </span>
                      {order.status === 'new' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-2.5 py-1 rounded-lg bg-espresso text-cream text-[10px] font-sans font-medium hover:bg-espresso-brown transition-colors"
                        >
                          Send to Kitchen
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-cream text-[10px] font-sans font-medium hover:bg-blue-700 transition-colors"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-cream text-[10px] font-sans font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feed 2: Live Table Bookings */}
        <div className="p-6 rounded-2xl bg-white border border-border/80 shadow-warm-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-warm" />
                <h3 className="text-base font-sans font-semibold text-espresso">
                  Table Bookings Queue
                </h3>
                {pendingBookings.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-warm text-espresso">
                    {pendingBookings.length} Pending
                  </span>
                )}
              </div>
              <button
                onClick={() => onNavigateTab('reservations')}
                className="text-xs font-sans font-medium text-amber-warm hover:underline"
              >
                View all ({reservations.length}) &rarr;
              </button>
            </div>

            {reservations.length === 0 ? (
              <div className="p-8 text-center bg-surface/30 rounded-xl border border-dashed border-border/80">
                <CheckCircle2 className="w-6 h-6 text-emerald-600/70 mx-auto mb-2" />
                <p className="text-xs font-sans font-semibold text-espresso">No Bookings In Queue</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  All table reservation requests have been cleared. New booking submissions from the website will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.slice(0, 4).map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl border border-border/60 bg-surface/20 hover:bg-surface/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-espresso">{res.customerName}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            res.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : res.status === 'pending'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                        {res.date} &middot; {res.time} &middot; {res.guests} Guests
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {res.occasion} {res.notes ? `• "${res.notes}"` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                      {res.status === 'pending' && (
                        <button
                          onClick={() => updateReservationStatus(res.id, 'confirmed')}
                          className="px-2.5 py-1 rounded-lg bg-espresso text-cream text-[10px] font-sans font-medium hover:bg-espresso-brown transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {res.status === 'confirmed' && (
                        <button
                          onClick={() => updateReservationStatus(res.id, 'seated')}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-cream text-[10px] font-sans font-medium hover:bg-blue-700 transition-colors"
                        >
                          Seat Table
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${getCleanPhone(res.phone)}?text=${encodeURIComponent(
                          `Hello ${res.customerName}! Garden Cafe here regarding your table reservation for ${res.time} on ${res.date}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-border bg-white text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
