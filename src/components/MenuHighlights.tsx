import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Check } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

export const MenuHighlights: React.FC = () => {
  const { menuItems, cart, addToCart } = useCafe();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'starters', label: 'Tandoor & Starters' },
    { id: 'mains', label: 'Pizzas & Mains' },
    { id: 'coffee', label: 'Coffee & Brews' },
    { id: 'beverages', label: 'Beverages & Shakes' },
    { id: 'bakery', label: 'Baked & Desserts' },
  ];

  const filteredItems = activeFilter === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === activeFilter);

  return (
    <section id="menu" className="scroll-mt-20 sm:scroll-mt-24 py-20 sm:py-28 bg-cream border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="label-caps text-amber-warm mb-2 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-amber-warm" />
              Handcrafted Menu · Sarabha Nagar
            </div>
            
            <div className="inline-block relative">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-espresso tracking-tight">
                What’s On The Table.
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="amber-rule w-full mt-2"
              />
            </div>
            <p className="font-sans font-light text-muted-foreground text-xs sm:text-sm mt-3 max-w-lg">
              Authentic tandoori starters, oven-baked pizzas, freshly pulled single-origins, and signature courtyard dessert shakes.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 tracking-wide font-medium ${
                  activeFilter === tab.id
                    ? 'bg-espresso text-cream shadow-warm-sm'
                    : 'bg-surface/90 text-foreground/75 hover:bg-surface hover:text-espresso border border-border/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Dish Grid with Minimized Images */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const inCartItem = cart.find((ci) => ci.item.id === item.id);
              const inCartCount = inCartItem ? inCartItem.quantity : 0;
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-surface rounded-xl overflow-hidden border border-border/80 hover:border-espresso transition-all duration-300 shadow-warm-sm hover:shadow-warm-md flex flex-row p-3.5 sm:p-4 gap-3.5 sm:gap-4 items-center"
                >
                  {/* Minimized Thumbnail Image (compact ~110px square) */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-oat border border-border/60">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Stock Overlays */}
                    {item.stockStatus === 'out_of_stock' && (
                      <div className="absolute inset-0 bg-espresso-deep/60 backdrop-blur-[1px] flex items-center justify-center p-1 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-rose-600 text-cream text-[9px] font-mono uppercase font-semibold">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dish Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                    <div>
                      {/* Top meta row: Veg indicator + category + badge tag + price */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Authentic Veg / Non-Veg dot */}
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

                          <span className="label-caps text-amber-warm/90 text-[9px] tracking-wider">
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

                      {/* Dish Name */}
                      <h3 className="font-serif font-semibold text-base sm:text-lg text-espresso group-hover:text-amber-warm transition-colors duration-200 line-clamp-1">
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className="font-sans font-light text-muted-foreground text-xs mt-1 leading-snug line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                      <span className="italic font-serif text-muted-foreground/70 text-[11px] hidden sm:inline">
                        {item.stockStatus === 'out_of_stock'
                          ? 'Unavailable today'
                          : item.stockStatus === 'low_stock'
                          ? 'Limited portions'
                          : 'Prepared fresh'}
                      </span>

                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.stockStatus === 'out_of_stock'}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all active:scale-[0.96] ml-auto ${
                          item.stockStatus === 'out_of_stock'
                            ? 'bg-border text-muted-foreground/60 cursor-not-allowed'
                            : inCartCount > 0
                            ? 'bg-amber-warm text-espresso font-semibold shadow-warm-sm hover:bg-amber-gold'
                            : 'bg-espresso text-cream hover:bg-espresso-brown shadow-warm-sm'
                        }`}
                      >
                        {inCartCount > 0 ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added ({inCartCount}) +</span>
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
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <div className="mt-10 p-4 rounded-xl bg-surface/50 border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
          <p>
            Authentic menu items from Garden Cafe, Sarabha Nagar, Ludhiana. Available for dine-in, courtyard seating, and takeaway.
          </p>
          <a
            href="https://wa.me/916239604749?text=Hi%20Garden%20Cafe%2C%20can%20you%20share%20the%20full%20current%20menu%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="text-espresso hover:text-amber-warm font-medium underline flex-shrink-0"
          >
            Order directly via WhatsApp &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
