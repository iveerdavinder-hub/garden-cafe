import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Users } from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeData';
import { LOCALE } from '../locales';

export const About: React.FC = () => {
  const t = LOCALE.about;

  return (
    <section id="about" className="scroll-mt-20 sm:scroll-mt-24 py-24 sm:py-32 bg-surface/40 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <div className="label-caps text-amber-warm mb-3 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-amber-warm" />
              {t.eyebrow}
            </div>

            <h2 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-espresso tracking-tight mb-6">
              {t.heading}
            </h2>

            <div className="space-y-4 font-sans font-light text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
              <p>{t.paragraph1}</p>
              <p>{t.paragraph2}</p>
            </div>

            <div className="flex flex-wrap gap-2.5 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-warm/15 text-espresso-deep border border-amber-warm/30 text-[11px] font-sans font-medium uppercase tracking-label">
                <Clock className="w-3 h-3 text-amber-warm" />
                {t.chips.established}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-warm/15 text-espresso-deep border border-amber-warm/30 text-[11px] font-sans font-medium uppercase tracking-label">
                <Award className="w-3 h-3 text-amber-warm" />
                {t.chips.craft}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-warm/15 text-espresso-deep border border-amber-warm/30 text-[11px] font-sans font-medium uppercase tracking-label">
                <Users className="w-3 h-3 text-amber-warm" />
                {t.chips.community}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80 w-full text-left">
              <div>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-espresso block">
                  {CAFE_CONFIG.googleRating}
                </span>
                <span className="label-caps text-muted-foreground text-[9px]">{t.stats.googleRating}</span>
              </div>
              <div>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-espresso block">
                  {CAFE_CONFIG.reviewCount}+
                </span>
                <span className="label-caps text-muted-foreground text-[9px]">{t.stats.customerReviews}</span>
              </div>
              <div>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-espresso block">
                  {CAFE_CONFIG.closingTime}
                </span>
                <span className="label-caps text-muted-foreground text-[9px]">{t.stats.dailyClose}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Café Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-warm-lg border border-border/80 aspect-[4/5] bg-oat">
              <img
                src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=85"
                alt="Smiling barista crafting drinks behind the wooden counter in warm natural light"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-cream">
                <p className="font-serif italic text-base sm:text-lg mb-1">
                  {t.imageQuote}
                </p>
                <span className="label-caps text-amber-light text-[10px]">
                  {t.imageCaption}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
