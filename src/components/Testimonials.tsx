import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { TESTIMONIALS, CAFE_CONFIG } from '../data/cafeData';
import { LOCALE, formatText } from '../locales';

export const Testimonials: React.FC = () => {
  const t = LOCALE.testimonials;

  return (
    <section className="py-24 sm:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="label-caps text-amber-warm mb-3 flex items-center justify-center gap-2">
            <span className="w-4 h-[1px] bg-amber-warm" />
            {t.eyebrow}
            <span className="w-4 h-[1px] bg-amber-warm" />
          </div>
          <h2 className="font-serif font-bold text-4xl sm:text-5xl text-espresso tracking-tight">
            {t.heading}
          </h2>
          <p className="font-sans font-light text-muted-foreground text-sm sm:text-base mt-3">
            {formatText(t.subtitle, {
              count: CAFE_CONFIG.reviewCount,
              rating: CAFE_CONFIG.googleRating,
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface rounded-2xl p-8 border border-border/70 shadow-warm-sm flex flex-col justify-between hover:shadow-warm-md transition-shadow duration-300"
            >
              <div>
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-warm text-amber-warm" />
                  ))}
                </div>

                <blockquote className="font-serif italic font-normal text-lg sm:text-xl text-espresso leading-relaxed mb-6">
                  “{testimonial.quote}”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-border/60">
                <div className="font-sans font-medium text-sm text-espresso">
                  {testimonial.author}
                </div>
                <div className="label-caps text-[10px] text-muted-foreground mt-0.5">
                  {testimonial.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={CAFE_CONFIG.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-label font-medium text-espresso hover:text-amber-warm transition-colors underline"
          >
            <span>{t.reviewsLink}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
