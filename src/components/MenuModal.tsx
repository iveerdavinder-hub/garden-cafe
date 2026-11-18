import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, Plus, Check, ShoppingBag, Utensils } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose }) => {
  const { menuItems, cart, addToCart, setIsCartOpen } = useCafe();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'starters', label: 'Tandoor & Starters' },
    { id: 'mains', label: 'Pizzas & Mains' },
    { id: 'coffee', label: 'Coffee & Brews' },
    { id: 'beverages', label: 'Beverages & Shakes' },
    { id: 'bakery', label: 'Baked & Desserts' },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesDietary =
      dietaryFilter === 'all' ||
      (dietaryFilter === 'veg' && item.isVegetarian === true) ||
      (dietaryFilter === 'non-veg' && item.isVegetarian === false);
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDietary && matchesSearch;
  });

  const totalCartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalCartPrice = cart.reduce((sum, ci) => {
    const priceNum = parseInt(ci.item.price.replace(/[^\d]/g, ''), 10) || 0;
    return sum + priceNum * ci.quantity;
  }, 0);

  const handleOpenCart = () => {
    onClose();
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-espresso-deep/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-4xl bg-cream sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border/70 z-10"
          >
            {/* Modal Header */}
            <div className="bg-surface px-6 py-5 border-b border-border/80 flex-shrink-0">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-warm/15 flex items-center justify-center text-amber-warm">
                    <Utensils className="w-4 h-4 text-amber-warm" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-espresso tracking-tight">
                      Garden Cafe Menu
                    </h3>
                    <p className="font-sans text-xs text-muted-foreground">
                      Authentic food & specialty beverages · 74-D, Sarabha Nagar, Ludhiana
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-muted-foreground hover:text-espresso hover:bg-cream transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Dietary Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tandoor, pizzas, pastas, coffee, shakes..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-cream/70 border border-border text-xs font-sans text-espresso placeholder:text-muted-foreground/70 focus:outline-none focus:border-amber-warm focus:bg-cream transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-espresso text-xs p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dietary Filter Buttons */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-cream/80 border border-border/70 self-start sm:self-auto">
                  <button
                    onClick={() => setDietaryFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      dietaryFilter === 'all'
                        ? 'bg-espresso text-cream shadow-warm-xs'
                        : 'text-muted-foreground hover:text-espresso'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setDietaryFilter('veg')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      dietaryFilter === 'veg'
                        ? 'bg-emerald-700 text-cream shadow-warm-xs'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Veg</span>
                  </button>
                  <button
                    onClick={() => setDietaryFilter('non-veg')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      dietaryFilter === 'non-veg'
                        ? 'bg-rose-700 text-cream shadow-warm-xs'
                        : 'text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Non-Veg</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-3 pb-1 -mb-1">
                {categories.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      activeCategory === tab.id
                        ? 'bg-espresso text-cream shadow-warm-xs'
                        : 'bg-cream text-foreground/75 hover:text-espresso hover:bg-surface border border-border/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Dish List with Minimized Thumbnails */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
              {filteredItems.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                  <p className="font-serif italic text-lg text-espresso mb-1">No dishes found</p>
                  <p className="text-xs">Try adjusting your search query or dietary filter</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                      setDietaryFilter('all');
                    }}
                    className="mt-4 px-4 py-1.5 rounded-full bg-espresso text-cream text-xs font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {filteredItems.map((item) => {
                    const inCartItem = cart.find((ci) => ci.item.id === item.id);
                    const inCartCount = inCartItem ? inCartItem.quantity : 0;
                    return (
                      <div
                        key={item.id}
                        className="group bg-surface rounded-xl overflow-hidden border border-border/80 hover:border-espresso/60 transition-all p-3 sm:p-3.5 flex items-center gap-3 shadow-warm-xs hover:shadow-warm-sm"
                      >
                        {/* Minimized Compact Thumbnail Image (~88px to ~96px) */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-oat border border-border/60">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />

                          {/* Out of Stock Overlay */}
                          {item.stockStatus === 'out_of_stock' && (
                            <div className="absolute inset-0 bg-espresso-deep/70 backdrop-blur-[1px] flex items-center justify-center p-1 text-center">
                              <span className="px-1 py-0.5 rounded bg-rose-600 text-cream text-[8px] font-mono uppercase font-bold">
                                Sold Out
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Dish Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                          <div>
                            {/* Meta row: Veg/Non-Veg dot + category label + tag + price */}
                            <div className="flex items-center justify-between gap-1.5 mb-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {item.isVegetarian !== undefined && (
                                  <span
                                    title={item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                                    className={`inline-flex items-center justify-center w-3 h-3 border rounded-xs flex-shrink-0 ${
                                      item.isVegetarian ? 'border-emerald-600' : 'border-rose-600'
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        item.isVegetarian ? 'bg-emerald-600' : 'bg-rose-600'
                                      }`}
                                    />
                                  </span>
                                )}
                                <span className="label-caps text-amber-warm/90 text-[8px] tracking-wider">
                                  {item.categoryLabel}
                                </span>
                                {item.tag && (
                                  <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-cream border border-border/70 text-[8px] font-medium text-espresso/80">
                                    <Sparkles className="w-2 h-2 text-amber-warm" />
                                    {item.tag}
                                  </span>
                                )}
                              </div>
                              <span className="font-sans font-bold text-xs sm:text-sm text-espresso flex-shrink-0">
                                {item.price}
                              </span>
                            </div>

                            {/* Dish Name */}
                            <h4 className="font-serif font-semibold text-sm sm:text-base text-espresso group-hover:text-amber-warm transition-colors line-clamp-1">
                              {item.name}
                            </h4>

                            {/* Description */}
                            <p className="font-sans font-light text-muted-foreground text-[11px] leading-tight line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          </div>

                          {/* Action Row */}
                          <div className="mt-2 pt-1.5 border-t border-border/40 flex items-center justify-between gap-2">
                            <span className="italic font-serif text-muted-foreground/60 text-[10px] hidden sm:inline">
                              {item.stockStatus === 'out_of_stock'
                                ? 'Unavailable'
                                : 'Prepared fresh to order'}
                            </span>

                            <button
                              onClick={() => addToCart(item)}
                              disabled={item.stockStatus === 'out_of_stock'}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-medium transition-all active:scale-[0.96] ml-auto ${
                                item.stockStatus === 'out_of_stock'
                                  ? 'bg-border text-muted-foreground/60 cursor-not-allowed'
                                  : inCartCount > 0
                                  ? 'bg-amber-warm text-espresso font-semibold shadow-warm-xs hover:bg-amber-gold'
                                  : 'bg-espresso text-cream hover:bg-espresso-brown shadow-warm-xs'
                              }`}
                            >
                              {inCartCount > 0 ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Added ({inCartCount})</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Sticky Bottom Bar */}
            <div className="bg-surface px-6 py-3.5 border-t border-border/80 flex items-center justify-between gap-4 flex-shrink-0">
              <div className="text-xs font-sans">
                {totalCartCount > 0 ? (
                  <div>
                    <span className="font-bold text-espresso">{totalCartCount} item(s) in bag</span>
                    <span className="text-muted-foreground mx-1.5">·</span>
                    <span className="font-serif font-bold text-amber-warm text-sm">₹{totalCartPrice}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select dishes to start your order</span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {totalCartCount > 0 && (
                  <button
                    onClick={handleOpenCart}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-warm text-espresso font-semibold text-xs uppercase tracking-label hover:bg-amber-gold transition-all active:scale-[0.98] shadow-warm-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>View Bag & Order</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-full bg-cream border border-border text-xs font-medium text-foreground hover:bg-surface transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
