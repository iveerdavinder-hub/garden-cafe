import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  X,
  Search,
  ChevronDown,
  Calendar,
  MessageCircle,
  Coffee,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { FAQ_DATA } from '../data/faqData';
import { CAFE_CONFIG } from '../data/cafeData';
import { LOCALE } from '../locales';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const t = LOCALE.faqs;
  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'reservations' | 'food' | 'space'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['reservations-walkins', 'coffee-sourcing']);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
    { id: 'all' as const, label: t.modalCategories.all, icon: HelpCircle },
    { id: 'coffee' as const, label: t.modalCategories.coffee, icon: Coffee },
    { id: 'reservations' as const, label: t.modalCategories.reservations, icon: Calendar },
    { id: 'food' as const, label: t.modalCategories.food, icon: Utensils },
    { id: 'space' as const, label: t.modalCategories.space, icon: Sparkles },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso-deep/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-2xl w-full bg-cream rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/80 bg-white/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-warm/15 text-espresso border border-amber-warm/30 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-amber-warm" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-espresso tracking-tight">
                    {t.heading}
                  </h3>
                  <p className="text-xs font-sans text-muted-foreground">
                    {CAFE_CONFIG.name} &middot; {t.modalSubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:text-espresso hover:bg-surface border border-transparent hover:border-border transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 sm:p-6 pb-2 bg-white/40 border-b border-border/60 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.modalSearchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border text-xs font-sans focus:outline-none focus:border-amber-warm transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans transition-all duration-150 whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-espresso text-cream font-medium'
                          : 'bg-white border border-border text-muted-foreground hover:text-espresso'
                      }`}
                    >
                      <Icon className={`w-3 h-3 ${isSelected ? 'text-amber-warm' : ''}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Questions List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 flex-1">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => {
                  const isOpen = openIds.includes(faq.id);
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-border/80 bg-white shadow-warm-xs overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-surface/30 transition-colors cursor-pointer"
                      >
                        <span className="font-serif font-bold text-sm text-espresso">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-amber-warm' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-4 pb-4 pt-1 text-xs font-sans text-muted-foreground leading-relaxed border-t border-border/40">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs font-sans text-muted-foreground">
                  No questions match your query.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-border bg-white/70 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs font-sans text-muted-foreground">
                {t.modalFooterNote}
              </span>

              <div className="flex items-center gap-2">
                {onOpenBooking && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenBooking();
                    }}
                    className="px-3.5 py-1.5 rounded-full border border-border text-espresso hover:bg-surface text-xs font-sans transition-colors cursor-pointer"
                  >
                    {t.reserveTable}
                  </button>
                )}

                <a
                  href={`https://wa.me/91${CAFE_CONFIG.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    'Hi Garden Cafe! I was reading the FAQs and wanted to ask a question.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-medium transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t.whatsapp}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
