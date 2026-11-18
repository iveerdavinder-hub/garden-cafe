import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Sparkles, Star } from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeData';
import { LOCALE } from '../locales';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenMenu?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenMenu }) => {
  const t = LOCALE.hero;

  return (
    <section id="hero" className="relative w-full bg-cream min-h-[100dvh] flex flex-col justify-between pt-20">
      {/* 1. Full-bleed Café Image (68% viewport height, no border radius, gradient bottom fade) */}
      <div className="relative w-full h-[58vh] sm:h-[64vh] lg:h-[68vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2400&q=90"
          alt={t.heroImageAlt}
          className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
        />
        {/* Exact gradient bottom fade */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(250,246,239,1) 0%, rgba(250,246,239,0.7) 18%, transparent 50%), linear-gradient(to bottom, rgba(250,246,239,0.3) 0%, transparent 25%)',
          }}
        />
      </div>

      {/* 2. Content z-10 below image in page flow */}
      <div className="relative z-10 -mt-24 sm:-mt-32 lg:-mt-36 max-w-5xl mx-auto px-6 text-center pb-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/90 backdrop-blur-md border border-border/80 mb-5 shadow-warm-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-warm animate-pulse" />
            <span className="label-caps text-muted-foreground tracking-label">
              {t.eyebrowPrefix} {CAFE_CONFIG.locationShort}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif font-bold text-espresso leading-[0.96] tracking-tight mb-6 max-w-4xl text-[clamp(44px,7vw,98px)]">
            {t.headlineLine1}
            <br />
            {t.headlineLine2}
            <br />
            <span className="italic font-normal text-amber-warm">{t.headlineAccent}</span>
          </h1>

          {/* Subheading */}
          <p className="font-sans font-light text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            {t.subheading}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <button
              onClick={onOpenMenu}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-espresso text-cream text-xs uppercase tracking-label font-medium hover:bg-espresso-brown transition-all duration-200 shadow-warm-md hover:shadow-warm-lg active:scale-[0.98]"
            >
              <span>{t.ctaMenu}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-warm" />
            </button>

            <a
              href="#find-us"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface/70 hover:bg-surface text-espresso border border-border/80 text-xs uppercase tracking-label font-medium transition-all duration-200 active:scale-[0.98]"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-warm" />
              <span>{t.ctaFindUs}</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber-warm/15 hover:bg-amber-warm/25 text-espresso-deep border border-amber-warm/30 text-xs uppercase tracking-label font-medium transition-all duration-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-warm" />
              <span>{t.ctaReserve}</span>
            </button>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface/60 border border-border/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-warm" />
              {t.trustChips.roaster}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface/60 border border-border/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-warm" />
              {t.trustChips.milk}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface/60 border border-border/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-warm" />
              {t.trustChips.dogFriendly}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface/60 border border-border/60">
              <Star className="w-3 h-3 fill-amber-warm text-amber-warm" />
              {CAFE_CONFIG.googleRating}★ ({CAFE_CONFIG.reviewCount} {t.trustChips.reviewsSuffix})
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
