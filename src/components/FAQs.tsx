import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Search,
  Coffee,
  Calendar,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { FAQ_DATA, FAQItem } from '../data/faqData';
import { LOCALE, formatText } from '../locales';
export type { FAQItem };

interface FAQsProps {
  onOpenBooking?: () => void;
  onOpenContact?: () => void;
}

export const FAQs: React.FC<FAQsProps> = () => {
  const t = LOCALE.faqs;
  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'reservations' | 'food' | 'space'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['reservations-walkins', 'coffee-sourcing']);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all' as const, label: t.categories.all, icon: HelpCircle },
    { id: 'coffee' as const, label: t.categories.coffee, icon: Coffee },
    { id: 'reservations' as const, label: t.categories.reservations, icon: Calendar },
    { id: 'food' as const, label: t.categories.food, icon: Utensils },
    { id: 'space' as const, label: t.categories.space, icon: Sparkles },
  ];

  return (
    <section id="faqs" className="w-full py-20 bg-cream-light/60 border-t border-border/60 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-warm/15 text-espresso border border-amber-warm/30 text-xs font-mono uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-warm" />
            <span>{t.badge}</span>
          </div>

          <h2 className="font-serif italic font-bold text-3xl sm:text-4xl text-espresso-deep tracking-tight">
            {t.heading}
          </h2>

          <p className="font-sans font-light text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-border shadow-warm-xs text-sm font-sans focus:outline-none focus:border-amber-warm focus:ring-1 focus:ring-amber-warm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-espresso"
              >
                {t.clear}
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-150 whitespace-nowrap active:scale-[0.98] cursor-pointer ${
                    isSelected
                      ? 'bg-espresso text-cream shadow-warm-xs font-semibold'
                      : 'bg-white border border-border text-foreground/75 hover:bg-surface hover:text-espresso'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-warm' : 'text-muted-foreground'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-border/80 bg-white shadow-warm-xs overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left px-5 sm:px-6 py-4.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-surface/40 transition-colors"
                  >
                    <span className="font-serif font-bold text-base sm:text-lg text-espresso tracking-tight">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'bg-amber-warm text-espresso rotate-180' : 'bg-surface text-muted-foreground'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-sm font-sans font-light text-muted-foreground leading-relaxed border-t border-border/40">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-border p-6 space-y-3">
              <HelpCircle className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-sans text-muted-foreground">
                {formatText(t.emptyTitle, { query: searchQuery })}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-xs font-mono text-amber-warm font-semibold underline cursor-pointer"
              >
                {t.resetFilters}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
