import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Plus,
  Check,
  ShoppingBag,
  Filter,
  X,
  Phone,
  Clock,
  MapPin,
  Utensils
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { CAFE_CONFIG } from '../data/cafeData';
import { Navbar } from './Navbar';
import { AnnouncementBanner } from './AnnouncementBanner';
import { Footer } from './Footer';

interface MenuPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenFAQs?: () => void;
  onOpenCookiePolicy?: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onOpenAdmin,
  onOpenFAQs,
  onOpenCookiePolicy,
}) => {
  const { menuItems, cart, addToCart, setIsCartOpen } = useCafe();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Scroll to top upon mounting
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesDietary && matchesSearch;
  });

  const totalItemsCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartSubtotal = cart.reduce((sum, ci) => {
    const priceNum = parseInt(ci.item.price.replace(/[^\d]/g, ''), 10) || 0;
    return sum + priceNum * ci.quantity;
  }, 0);

  const handleAddToCart = (item: (typeof menuItems)[0]) => {
    addToCart(item);
    setJustAddedId(item.id);
    setTimeout(() => {
      setJustAddedId((current) => (current === item.id ? null : current));
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-amber-warm/20 selection:text-espresso flex flex-col">
      {/* 1. Top Announcement */}
      <AnnouncementBanner />

      {/* 2. Top Navigation (with currentView set to 'menu') */}
      <Navbar
        onOpenBooking={onOpenBooking}
        onOpenMenu={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        currentView="menu"
        onNavigateHome={onNavigateHome}
      />

      {/* 3. Main Full-Page Menu Body */}
      <main className="flex-grow pt-24 sm:pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back Navigation */}
          <div className="pt-2 sm:pt-4 mb-6">
            <button
              onClick={() => onNavigateHome()}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 hover:bg-surface text-espresso text-xs font-sans font-medium border border-border/80 transition-all hover:border-amber-warm/40 group active:scale-[0.98] shadow-warm-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-warm transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Hero Header of Full Menu Page */}
          <div className="bg-surface/60 rounded-3xl p-6 sm:p-10 border border-border/80 mb-8 sm:mb-10 shadow-warm-xs">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-border/70 mb-3 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-warm animate-pulse" />
                  <span className="label-caps text-espresso/90 text-[10px]">
                    Whole Menu · {CAFE_CONFIG.locationShort}
                  </span>
                </div>

                <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-espresso tracking-tight leading-tight">
                  Craft Kitchen & Specialty Coffee.
                </h1>

                <p className="font-sans font-light text-muted-foreground text-xs sm:text-sm mt-3 leading-relaxed">
                  Every dish is prepared fresh to order in our Sarabha Nagar kitchen. Explore our woodfired pizzas, clay tandoori starters, slow-steeped cold brews, and signature desserts.
                </p>
              </div>

              {/* Quick Info Badges */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3 text-xs text-muted-foreground font-sans">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream border border-border/80">
                  <Clock className="w-3.5 h-3.5 text-amber-warm" />
                  <span>Kitchen: 10 AM – 11 PM</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream border border-border/80">
                  <MapPin className="w-3.5 h-3.5 text-amber-warm" />
                  <span>Dine-In & Takeaway</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream border border-border/80">
                  <Phone className="w-3.5 h-3.5 text-amber-warm" />
                  <span>WhatsApp Ordering Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter & Search Toolbar (Sticky Bar) */}
          <div className="sticky top-[64px] sm:top-[72px] z-30 bg-[#faf6ef]/95 backdrop-blur-md py-4 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-y border-border/60 shadow-warm-xs">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
              {/* Instant Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search dishes, coffee, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-full bg-cream border border-border/80 focus:border-amber-warm focus:ring-1 focus:ring-amber-warm text-xs font-sans placeholder:text-muted-foreground/60 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-espresso"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Dietary Toggle Pills (Veg / Non-Veg / All) */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-surface border border-border/80 self-start md:self-auto">
                <button
                  onClick={() => setDietaryFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    dietaryFilter === 'all'
                      ? 'bg-cream text-espresso shadow-warm-xs font-semibold'
                      : 'text-muted-foreground hover:text-espresso'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDietaryFilter('veg')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    dietaryFilter === 'veg'
                      ? 'bg-cream text-emerald-700 shadow-warm-xs font-semibold'
                      : 'text-muted-foreground hover:text-emerald-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Veg</span>
                </button>
                <button
                  onClick={() => setDietaryFilter('non-veg')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    dietaryFilter === 'non-veg'
                      ? 'bg-cream text-rose-700 shadow-warm-xs font-semibold'
                      : 'text-muted-foreground hover:text-rose-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>Non-Veg</span>
                </button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3">
              {categories.map((cat) => {
                const count = menuItems.filter(
                  (i) =>
                    (cat.id === 'all' || i.category === cat.id) &&
                    (dietaryFilter === 'all' ||
                      (dietaryFilter === 'veg' && i.isVegetarian) ||
                      (dietaryFilter === 'non-veg' && !i.isVegetarian))
                ).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-sans transition-all flex items-center gap-2 flex-shrink-0 active:scale-[0.98] ${
                      activeCategory === cat.id
                        ? 'bg-espresso text-cream font-medium shadow-warm-sm'
                        : 'bg-cream text-foreground/75 hover:bg-surface border border-border/80'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        activeCategory === cat.id
                          ? 'bg-cream/20 text-cream'
                          : 'bg-surface text-muted-foreground'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-6 font-sans">
            <p>
              Showing <span className="font-semibold text-espresso">{filteredItems.length}</span>{' '}
              {filteredItems.length === 1 ? 'item' : 'items'}
              {activeCategory !== 'all' && (
                <span> in {categories.find((c) => c.id === activeCategory)?.label}</span>
              )}
            </p>

            {(searchQuery || dietaryFilter !== 'all' || activeCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDietaryFilter('all');
                  setActiveCategory('all');
                }}
                className="text-amber-warm hover:underline font-medium text-xs flex items-center gap-1"
              >
                <span>Reset filters</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-20 bg-surface/40 rounded-3xl border border-dashed border-border/80 p-8">
              <Utensils className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="font-serif font-semibold text-lg text-espresso mb-1">
                No menu items found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-5">
                We couldn't find any dishes matching "{searchQuery}" with the selected filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDietaryFilter('all');
                  setActiveCategory('all');
                }}
                className="px-5 py-2.5 rounded-full bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-all"
              >
                Show Complete Menu
              </button>
            </div>
          )}

          {/* Full-Page Dishes Responsive Grid with Minimized Imagery */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const inCartItem = cart.find((ci) => ci.item.id === item.id);
                const inCartCount = inCartItem ? inCartItem.quantity : 0;
                const isJustAdded = justAddedId === item.id;

                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.25) }}
                    className="group bg-surface rounded-2xl border border-border/80 hover:border-amber-warm/50 transition-all duration-200 hover:shadow-warm-md flex flex-row p-3.5 sm:p-4 gap-3.5 sm:gap-4 items-stretch"
                  >
                    {/* Minimized Thumbnail Image (compact ~100px square, clean & fast loading) */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-cream border border-border/60">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Stock Overlay if sold out */}
                      {item.stockStatus === 'out_of_stock' && (
                        <div className="absolute inset-0 bg-espresso-deep/70 backdrop-blur-[1px] flex items-center justify-center p-1 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-cream text-[9px] font-mono uppercase font-semibold">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dish Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        {/* Meta header: Veg icon + category + tag + price */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Veg / Non-Veg Indicator */}
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

                            <span className="label-caps text-amber-warm text-[9px] tracking-wider">
                              {item.categoryLabel}
                            </span>

                            {item.tag && (
                              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-cream border border-border/70 text-[9px] font-sans font-medium text-espresso/80">
                                <Sparkles className="w-2.5 h-2.5 text-amber-warm" />
                                {item.tag}
                              </span>
                            )}
                          </div>

                          {/* Price Tag */}
                          <span className="font-sans font-bold text-sm sm:text-base text-espresso flex-shrink-0">
                            {item.price}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-serif font-semibold text-base sm:text-lg text-espresso group-hover:text-amber-warm transition-colors duration-200 line-clamp-1">
                          {item.name}
                        </h2>

                        {/* Description */}
                        <p className="font-sans font-light text-muted-foreground text-xs mt-1 leading-snug line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Action Row: Kitchen badge & Add to Bag button */}
                      <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                        <span className="italic font-serif text-muted-foreground/75 text-[11px] truncate">
                          {item.stockStatus === 'out_of_stock'
                            ? 'Unavailable today'
                            : item.stockStatus === 'low_stock'
                            ? 'Limited portions'
                            : 'Freshly prepared'}
                        </span>

                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stockStatus === 'out_of_stock'}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all duration-150 active:scale-[0.96] flex-shrink-0 ${
                            item.stockStatus === 'out_of_stock'
                              ? 'bg-border text-muted-foreground/50 cursor-not-allowed'
                              : isJustAdded
                              ? 'bg-emerald-600 text-cream shadow-warm-xs'
                              : inCartCount > 0
                              ? 'bg-amber-warm text-espresso font-semibold shadow-warm-xs hover:bg-amber-gold'
                              : 'bg-espresso text-cream hover:bg-espresso-brown shadow-warm-xs'
                          }`}
                          title={`Add ${item.name} to order bag`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : inCartCount > 0 ? (
                            <>
                              <Plus className="w-3 h-3 text-espresso" />
                              <span>In Bag ({inCartCount})</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 text-amber-warm" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Kitchen & Dietary Footnote */}
          <div className="mt-16 p-6 rounded-2xl bg-surface/50 border border-border/80 text-center max-w-3xl mx-auto">
            <h4 className="font-serif italic font-semibold text-espresso text-sm mb-1">
              Freshly Prepared & Handcrafted Daily
            </h4>
            <p className="text-xs font-sans font-light text-muted-foreground leading-relaxed">
              All tandoor dishes, sourdough pizzas, artisanal filter coffees, and shakes are crafted to order. Have food allergies or dietary preferences? Let our staff know when placing your WhatsApp order.
            </p>
          </div>
        </div>
      </main>

      {/* 4. Sticky Floating Order Bag Bar if Customer has items in bag */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-espresso text-cream p-3 sm:p-3.5 rounded-full shadow-warm-xl border border-amber-warm/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 pl-3">
              <div className="w-8 h-8 rounded-full bg-amber-warm/20 flex items-center justify-center text-amber-warm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-sans font-medium text-cream leading-tight">
                  <span className="font-bold text-amber-warm">{totalItemsCount}</span>{' '}
                  {totalItemsCount === 1 ? 'item' : 'items'} in order bag
                </p>
                <p className="text-[11px] font-mono text-cream/70 font-semibold">
                  Subtotal: ₹{cartSubtotal}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2 rounded-full bg-amber-warm hover:bg-amber-gold text-espresso font-semibold text-xs uppercase tracking-label transition-all active:scale-[0.98] shadow-warm-sm flex items-center gap-1.5"
            >
              <span>View Bag & Order</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Footer */}
      <Footer
        onOpenAdmin={onOpenAdmin}
        onOpenMenu={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateHome={onNavigateHome}
        onOpenFAQs={onOpenFAQs}
        onOpenCookiePolicy={onOpenCookiePolicy}
      />
    </div>
  );
};
