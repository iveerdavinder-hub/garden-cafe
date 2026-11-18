import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Sun } from 'lucide-react';
import { LOCALE } from '../locales';

interface OurCoffeeProps {
  onOpenBooking: () => void;
}

export const OurCoffee: React.FC<OurCoffeeProps> = ({ onOpenBooking }) => {
  const t = LOCALE.ourCoffee;

  return (
    <section id="coffee" className="scroll-mt-20 sm:scroll-mt-24 py-24 sm:py-32 bg-cream overflow-hidden relative">
      <div id="craft" className="absolute -top-24" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
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

            <blockquote className="font-serif italic font-light text-xl sm:text-2xl text-amber-warm/95 mb-6 border-l-2 border-amber-warm pl-4 leading-snug">
              {t.quote}
            </blockquote>

            <div className="space-y-4 font-sans font-light text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
              <p>{t.paragraph1}</p>
              <p>{t.paragraph2}</p>
            </div>

            <div className="flex flex-wrap gap-2.5 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-espresso text-cream text-[11px] font-sans font-medium uppercase tracking-label">
                <Leaf className="w-3 h-3 text-amber-warm" />
                {t.chips.directTrade}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-espresso text-cream text-[11px] font-sans font-medium uppercase tracking-label">
                <Sun className="w-3 h-3 text-amber-warm" />
                {t.chips.singleOrigin}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-espresso text-cream text-[11px] font-sans font-medium uppercase tracking-label">
                <ShieldCheck className="w-3 h-3 text-amber-warm" />
                {t.chips.seasonalRotating}
              </span>
            </div>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-espresso text-espresso text-xs uppercase tracking-label font-medium hover:bg-espresso hover:text-cream transition-all duration-200 active:scale-[0.98]"
            >
              <span>{t.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Right Stacked Image Pair */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-8 rounded-2xl overflow-hidden shadow-warm-lg border border-border/80 aspect-[4/5]">
                <img
                  src="/images/sections/coffee-beans-burlap.jpg"
                  alt="Specialty coffee beans being poured from burlap sack with warm rustic lighting"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="col-span-6 -ml-16 sm:-ml-20 -mt-24 sm:-mt-28 z-10 rounded-2xl overflow-hidden shadow-warm-lg border-4 border-cream aspect-square">
                <img
                  src="/images/sections/coffee-v60-pourover.jpg"
                  alt="Ceramic V60 pour over extraction with rising steam"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

            <div className="absolute -bottom-4 right-6 bg-surface/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border/80 shadow-warm-md hidden sm:block">
              <span className="label-caps text-espresso text-[10px] block">
                {t.floatingBadgeTitle}
              </span>
              <span className="font-serif italic text-xs text-amber-warm">
                {t.floatingBadgeSubtitle}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
