import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Send,
  Utensils,
  MapPin,
  Clock,
  CheckCircle2,
  Coffee,
  AlertCircle,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { CAFE_CONFIG } from '../data/cafeData';
import { LOCALE, formatText } from '../locales';

export const CartDrawer: React.FC = () => {
  const t = LOCALE.cart;
  const { cart, isCartOpen, setIsCartOpen, updateCartQuantity, removeFromCart, clearCart, addOrder, settings } = useCafe();

  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in');
  const [tableNumber, setTableNumber] = useState('Table 3');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [lastOrderMsg, setLastOrderMsg] = useState<string>('');
  const [customerPhoneTarget, setCustomerPhoneTarget] = useState<string>('');

  const getCleanPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const subtotal = cart.reduce((sum, ci) => {
    const priceNum = parseInt(ci.item.price.replace(/[^0-9]/g, ''), 10) || 0;
    return sum + priceNum * ci.quantity;
  }, 0);

  const totalItemsCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName.trim() || !phone.trim()) return;

    const orderItems = cart.map((ci) => ({
      id: ci.item.id,
      name: ci.item.name,
      price: ci.item.price,
      priceNum: parseInt(ci.item.price.replace(/[^0-9]/g, ''), 10) || 0,
      quantity: ci.quantity,
      image: ci.item.image,
    }));

    // 1. PUSH DIRECTLY TO ADMIN PANEL (Instant synchronous update)
    const newOrder = addOrder({
      customerName,
      phone,
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      items: orderItems,
      totalAmount: subtotal,
      specialInstructions,
      status: 'new',
    });

    const cleanCustomerNum = getCleanPhone(phone);
    setCustomerPhoneTarget(cleanCustomerNum);

    // 2. Format Order Confirmation Receipt for the Customer's Number
    const itemsList = cart
      .map((ci) => `• ${ci.quantity}x ${ci.item.name} (${ci.item.price})`)
      .join('\n');

    const customerMsg = [
      `*Order Confirmation — Garden Cafe* 🌿`,
      `Hi ${customerName}! Thank you for your order.`,
      `• Order Number: ${newOrder.orderNumber}`,
      `• Service: ${
        orderType === 'dine_in'
          ? `Dine-In (${tableNumber})`
          : orderType === 'takeaway'
          ? 'Takeaway Pickup'
          : `Delivery (${deliveryAddress})`
      }`,
      `• Status: Confirmed & Pushed Live to Kitchen`,
      ``,
      `*Items Ordered:*`,
      itemsList,
      ``,
      `*Total Amount:* ₹${subtotal}`,
      specialInstructions ? `*Instructions:* ${specialInstructions}` : '',
      ``,
      `📍 Garden Cafe, 74-D, Sarabha Nagar, Ludhiana`,
      `📞 Helpline: ${CAFE_CONFIG.phone}`,
    ]
      .filter(Boolean)
      .join('\n');

    setOrderSuccess(newOrder.orderNumber);
    setLastOrderMsg(customerMsg);
    clearCart();

    // 3. Send confirmation directly to customer's given number if autoOpenWhatsApp is ON
    if (settings.autoOpenWhatsApp && cleanCustomerNum) {
      setTimeout(() => {
        window.open(
          `https://wa.me/${cleanCustomerNum}?text=${encodeURIComponent(customerMsg)}`,
          '_blank',
          'noopener,noreferrer'
        );
      }, 1000);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setOrderSuccess(null);
      setLastOrderMsg('');
      setCustomerPhoneTarget('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-espresso-deep/70 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-cream border-l border-border shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-border/80 flex items-center justify-between bg-surface/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-warm/20 flex items-center justify-center text-amber-warm">
                    <ShoppingBag className="w-4 h-4 text-amber-warm" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-espresso">{t.title}</h3>
                    <p className="text-xs font-sans text-muted-foreground">
                      {formatText(totalItemsCount === 1 ? t.subtitleSingle : t.subtitlePlural, { count: totalItemsCount })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-border/60 text-muted-foreground hover:text-espresso transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {orderSuccess ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-warm-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-serif font-bold text-2xl text-espresso">{t.receivedTitle}</h4>
                    <p className="text-xs font-mono text-amber-warm font-semibold text-sm">
                      {formatText(t.receivedNumber, { number: orderSuccess })}
                    </p>
                    <p className="text-xs font-sans text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      {t.receivedDesc}
                    </p>
                    <div className="pt-2 space-y-2.5 max-w-xs mx-auto">
                      {customerPhoneTarget && lastOrderMsg && (
                        <a
                          href={`https://wa.me/${customerPhoneTarget}?text=${encodeURIComponent(lastOrderMsg)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-warm-xs transition-all active:scale-[0.98]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{formatText(t.sendCustomerConfirmation, { phone: customerPhoneTarget })}</span>
                        </a>
                      )}

                      <a
                        href={`https://wa.me/${CAFE_CONFIG.whatsappNumber}?text=${encodeURIComponent(lastOrderMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-white hover:bg-surface text-espresso text-xs font-medium border border-border/80 transition-colors"
                      >
                        <Coffee className="w-3.5 h-3.5 text-amber-warm" />
                        <span>{t.notifyKitchen}</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-espresso text-cream text-xs uppercase tracking-label font-medium hover:bg-espresso-brown transition-colors shadow-warm-sm cursor-pointer"
                      >
                        {t.continueBrowsing}
                      </button>
                    </div>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <Coffee className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                    <p className="font-serif italic text-lg text-espresso">{t.emptyTitle}</p>
                    <p className="text-xs font-sans text-muted-foreground max-w-xs mx-auto">
                      {t.emptyDesc}
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-2 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-espresso text-cream text-xs uppercase tracking-label font-medium"
                    >
                      {t.browseMenu}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Item List */}
                    <div className="space-y-3">
                      {cart.map((ci) => (
                        <div
                          key={ci.item.id}
                          className="p-3 rounded-xl bg-white border border-border/80 flex items-center gap-3 shadow-warm-sm"
                        >
                          <img
                            src={ci.item.image}
                            alt={ci.item.name}
                            className="w-14 h-14 rounded-lg object-cover bg-oat flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-semibold text-sm text-espresso truncate">
                              {ci.item.name}
                            </h4>
                            <p className="font-mono text-xs text-amber-warm font-semibold">
                              {ci.item.price}
                            </p>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center gap-1.5 bg-surface rounded-lg p-1 border border-border/60">
                            <button
                              onClick={() => updateCartQuantity(ci.item.id, ci.quantity - 1)}
                              className="p-1 rounded hover:bg-white text-muted-foreground hover:text-espresso"
                              title="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs font-semibold px-1 min-w-[1.2rem] text-center">
                              {ci.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(ci.item.id, ci.quantity + 1)}
                              className="p-1 rounded hover:bg-white text-muted-foreground hover:text-espresso"
                              title="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(ci.item.id)}
                            className="p-1 text-muted-foreground/60 hover:text-rose-600"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Order Details Form */}
                    <form onSubmit={handlePlaceOrder} id="cart-order-form" className="space-y-4 pt-2">
                      {/* Operational Status Notice */}
                      {settings.storeStatus === 'closed' && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span>The kitchen is currently closed. Orders will be queued for reopening.</span>
                        </div>
                      )}
                      {settings.storeStatus === 'busy' && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>High demand in the courtyard! Current wait time is approx. 15-20m.</span>
                        </div>
                      )}

                      {/* Dining Option Toggle */}
                      <div>
                        <label className="label-caps text-espresso text-[9px] block mb-1.5">
                          Dining Option *
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface border border-border">
                          {[
                            { id: 'dine_in', label: 'Dine-In' },
                            { id: 'takeaway', label: 'Takeaway' },
                            { id: 'delivery', label: 'Delivery' },
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setOrderType(opt.id as any)}
                              className={`py-1.5 text-xs font-sans rounded-lg font-medium transition-colors ${
                                orderType === opt.id
                                  ? 'bg-espresso text-cream shadow-sm'
                                  : 'text-muted-foreground hover:text-espresso'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {orderType === 'dine_in' && (
                        <div>
                          <label className="label-caps text-espresso text-[9px] block mb-1">
                            Table Number / Location
                          </label>
                          <select
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs font-sans focus:outline-none focus:border-amber-warm"
                          >
                            <option value="Table 1 (Indoor)">Table 1 (Indoor)</option>
                            <option value="Table 2 (Indoor)">Table 2 (Indoor)</option>
                            <option value="Table 3 (Courtyard)">Table 3 (Courtyard Garden)</option>
                            <option value="Table 4 (Courtyard)">Table 4 (Courtyard Garden)</option>
                            <option value="Table 5 (Corner Oasis)">Table 5 (Corner Oasis)</option>
                            <option value="Table 6 (Bar Counter)">Table 6 (Bar Counter)</option>
                          </select>
                        </div>
                      )}

                      {orderType === 'delivery' && (
                        <div>
                          <label className="label-caps text-espresso text-[9px] block mb-1">
                            Delivery Address in Ludhiana *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="House #, Street, Sarabha Nagar / nearby"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs font-sans focus:outline-none focus:border-amber-warm"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label-caps text-espresso text-[9px] block mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Jaspreet Singh"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs font-sans focus:outline-none focus:border-amber-warm"
                          />
                        </div>

                        <div>
                          <label className="label-caps text-espresso text-[9px] block mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs font-sans focus:outline-none focus:border-amber-warm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label-caps text-espresso text-[9px] block mb-1">
                          Special Kitchen Instructions
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Extra hot, low sugar, crisp bread..."
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs font-sans focus:outline-none focus:border-amber-warm"
                        />
                      </div>
                    </form>
                  </>
                )}
              </div>

              {/* Footer Checkout Bar */}
              {cart.length > 0 && !orderSuccess && (
                <div className="p-6 border-t border-border/80 bg-white space-y-4">
                  <div className="space-y-1.5 text-xs font-sans">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-mono text-espresso font-medium">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST & Kitchen Service</span>
                      <span className="font-mono text-emerald-700">Included</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-espresso pt-2 border-t border-border/60">
                      <span>Total Amount</span>
                      <span className="font-mono text-lg text-amber-warm">₹{subtotal}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    form="cart-order-form"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-espresso hover:bg-espresso-brown text-cream text-xs uppercase tracking-label font-medium transition-all shadow-warm-md active:scale-[0.98]"
                  >
                    <Utensils className="w-3.5 h-3.5 text-amber-warm" />
                    <span>Confirm & Send Order to Kitchen</span>
                  </button>

                  <p className="text-[10px] font-sans text-center text-muted-foreground">
                    Order is instantly recorded in the kitchen and manager console.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
