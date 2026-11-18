import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles, Users } from 'lucide-react';
import { LOCALE } from '../locales';

interface EventsAndSpaceProps {
  onOpenBooking: () => void;
}

export const EventsAndSpace: React.FC<EventsAndSpaceProps> = ({ onOpenBooking }) => {
  const t = LOCALE.events;

  return (
    <section id="events" className="scroll-mt-20 sm:scroll-mt-24 py-24 sm:py-32 bg-surface border-y border-border/70">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="label-caps text-amber-warm mb-3 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-amber-warm" />
            {t.eyebrow}
          </div>

          <h2 className="font-serif font-bold text-4xl sm:text-5xl text-espresso tracking-tight mb-5">
            {t.heading}
          </h2>

          <p className="font-sans font-light text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {t.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream border border-border text-espresso text-xs font-sans font-medium uppercase tracking-label shadow-warm-sm">
              <Users className="w-3.5 h-3.5 text-amber-warm" />
              {t.chips.privateHire}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream border border-border text-espresso text-xs font-sans font-medium uppercase tracking-label shadow-warm-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-warm" />
              {t.chips.cuppings}
            </span>
          </div>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-espresso text-cream text-xs uppercase tracking-label font-medium hover:bg-espresso-brown transition-all duration-200 active:scale-[0.98] shadow-warm-md hover:shadow-warm-lg"
          >
            <Calendar className="w-4 h-4 text-amber-warm" />
            <span>{t.cta}</span>
            <ArrowRight className="w-3.5 h-3.5 text-cream/80" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
