import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  User,
  Phone,
  Utensils,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Trash2,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import { Order } from '../../types';
import { CAFE_CONFIG } from '../../data/cafeData';

export const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, addOrder } = useCafe();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      (order.tableNumber && order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesType = selectedType === 'all' || order.orderType === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const countByStatus = {
    all: orders.length,
    new: orders.filter((o) => o.status === 'new').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            New Order
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
            In Kitchen
          </span>
        );
      case 'ready':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Ready to Serve
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-medium bg-zinc-100 text-zinc-700">
            Fulfilled
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-medium bg-rose-100 text-rose-700">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getCleanPhone = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const getWhatsAppMessage = (order: Order) => {
    let msg = `Hello ${order.customerName}! Garden Cafe here regarding your order ${order.orderNumber}. `;
    if (order.status === 'new') {
      msg += `We have accepted your order for ₹${order.totalAmount} and our kitchen is preparing it fresh!`;
    } else if (order.status === 'preparing') {
      msg += `Your dishes are sizzling in the kitchen and will be ready shortly.`;
    } else if (order.status === 'ready') {
      msg +=
        order.orderType === 'dine_in'
          ? `Your order is hot and ready at ${order.tableNumber || 'your table'}! Enjoy your meal.`
          : order.orderType === 'takeaway'
          ? `Your takeaway order is packaged and waiting at the counter!`
          : `Your delivery order is packaged and out for delivery!`;
    } else {
      msg += `Thank you for dining with Garden Cafe! Have a great day.`;
    }
    return encodeURIComponent(msg);
  };

  const handleCreateTestOrder = () => {
    addOrder({
      customerName: 'Amanpreet Kaur',
      phone: '+91 98765 43210',
      orderType: 'dine_in',
      tableNumber: 'Table 4',
      items: [
        {
          id: 'dish-artisan-pizza',
          name: 'Wood-Fired Truffle Margherita',
          price: '₹480',
          priceNum: 480,
          quantity: 1,
        },
        {
          id: 'dish-smoothie-bowl',
          name: 'Wild Berry Açaí Bowl',
          price: '₹340',
          priceNum: 340,
          quantity: 1,
        },
      ],
      totalAmount: 820,
      specialInstructions: 'Extra basil leaves and served with chili flakes please.',
      status: 'new',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border/80 shadow-warm-sm">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-espresso">
              Live Food Orders
            </h2>
            {countByStatus.new > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-warm text-espresso">
                {countByStatus.new} New
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-sans text-muted-foreground mt-1">
            Real-time feed of food & drink orders placed by customers from the website menu.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCreateTestOrder}
            className="px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-surface/80 text-espresso text-xs font-sans font-medium transition-all flex items-center gap-1.5 active:scale-[0.98]"
            title="Push a quick test order to verify real-time incoming orders"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-warm" />
            <span>+ Simulate Customer Order</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border/80 shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders', count: countByStatus.all },
            { id: 'new', label: 'New', count: countByStatus.new, color: 'text-amber-800 bg-amber-100' },
            { id: 'preparing', label: 'In Kitchen', count: countByStatus.preparing, color: 'text-blue-800 bg-blue-100' },
            { id: 'ready', label: 'Ready', count: countByStatus.ready, color: 'text-emerald-800 bg-emerald-100' },
            { id: 'completed', label: 'Fulfilled', count: countByStatus.completed },
            { id: 'cancelled', label: 'Cancelled', count: countByStatus.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-espresso text-cream font-semibold'
                  : 'text-muted-foreground hover:bg-surface hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  selectedStatus === tab.id ? 'bg-white/20 text-cream' : tab.color || 'bg-surface text-muted-foreground'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right Search & Dining Type Filter */}
        <div className="flex items-center gap-2">
          {/* Service Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-white text-xs font-sans text-foreground focus:outline-none focus:border-amber-warm"
          >
            <option value="all">All Services</option>
            <option value="dine_in">Dine-In Tables</option>
            <option value="takeaway">Takeaway Pickups</option>
            <option value="delivery">Deliveries</option>
          </select>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search order #, customer, dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border bg-white text-xs font-sans text-foreground focus:outline-none focus:border-amber-warm"
            />
          </div>
        </div>
      </div>

      {/* Orders Grid / List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-border shadow-warm-sm">
          <div className="w-12 h-12 rounded-full bg-amber-warm/15 text-amber-warm flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-espresso">No Orders Found</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4 font-sans">
            {orders.length === 0
              ? 'Order queue is currently empty. When customers browse the menu and click "Place Order & Send to WhatsApp", their orders will appear here immediately.'
              : 'No orders match your current filter or search criteria.'}
          </p>
          {orders.length === 0 && (
            <button
              onClick={handleCreateTestOrder}
              className="px-4 py-2 rounded-full bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-colors inline-flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-warm" />
              <span>Simulate Customer Order</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`p-5 rounded-2xl bg-white border transition-all duration-200 shadow-warm-sm flex flex-col justify-between ${
                order.status === 'new'
                  ? 'border-amber-400/80 ring-1 ring-amber-400/30'
                  : 'border-border/80'
              }`}
            >
              <div>
                {/* Order Top Bar */}
                <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-border/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-espresso">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{order.createdAt}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="p-1 rounded text-muted-foreground hover:text-rose-600 transition-colors"
                    title="Remove order record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Customer & Dining Service Badge */}
                <div className="mb-4 space-y-1.5 bg-surface/40 p-3 rounded-xl border border-border/50 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-espresso flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      {order.customerName}
                    </span>
                    <a
                      href={`https://wa.me/${getCleanPhone(order.phone)}?text=${getWhatsAppMessage(
                        order
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 hover:text-emerald-800 font-semibold"
                      title="Direct WhatsApp response"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{order.phone}</span>
                    </a>
                  </div>

                  <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-espresso-deep">
                    {order.orderType === 'dine_in' && (
                      <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                        <Utensils className="w-3 h-3 text-amber-700" />
                        Dine-In &middot; {order.tableNumber || 'Table'}
                      </span>
                    )}
                    {order.orderType === 'takeaway' && (
                      <span className="inline-flex items-center gap-1 text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                        <ShoppingBag className="w-3 h-3 text-indigo-700" />
                        Takeaway Pickup
                      </span>
                    )}
                    {order.orderType === 'delivery' && (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        Delivery: {order.deliveryAddress || 'Address specified'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <div className="space-y-1.5 divide-y divide-border/30">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-surface border border-border text-[10px] font-mono font-bold text-espresso flex items-center justify-center">
                            {item.quantity}×
                          </span>
                          <span className="font-medium text-foreground line-clamp-1">{item.name}</span>
                        </div>
                        <span className="font-mono text-muted-foreground text-[11px]">
                          ₹{(item.priceNum || 0) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="mt-2.5 p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 font-sans">
                      <span className="font-semibold font-mono text-[10px] uppercase block">
                        Chef Note:
                      </span>
                      {order.specialInstructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Action Footer */}
              <div className="pt-3 border-t border-border/60">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs font-sans text-muted-foreground">Order Total</span>
                  <span className="text-base font-mono font-bold text-espresso">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Workflow Action Buttons */}
                <div className="flex items-center gap-2">
                  {order.status === 'new' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="flex-1 py-2 rounded-xl bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-all text-center active:scale-[0.98] shadow-warm-xs"
                    >
                      Accept & Send to Kitchen
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-sans font-medium hover:bg-blue-700 transition-all text-center active:scale-[0.98]"
                    >
                      Mark as Ready to Serve
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-sans font-medium hover:bg-emerald-700 transition-all text-center active:scale-[0.98]"
                    >
                      Complete & Settle
                    </button>
                  )}

                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="px-2.5 py-2 rounded-xl border border-border text-muted-foreground hover:text-rose-600 hover:bg-rose-50 text-xs transition-colors"
                      title="Cancel Order"
                    >
                      Cancel
                    </button>
                  )}

                  <a
                    href={`https://wa.me/${getCleanPhone(order.phone)}?text=${getWhatsAppMessage(
                      order
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-border bg-surface hover:bg-surface/80 text-emerald-700 transition-colors"
                    title="Send status update to customer on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
