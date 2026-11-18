import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Phone, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeData';
import { LOCALE } from '../locales';

export const FindUsCTA: React.FC = () => {
  const t = LOCALE.findUs;

  return (
    <section id="find-us" className="scroll-mt-20 sm:scroll-mt-24 w-full bg-[#26160e] text-cream py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-warm/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-espresso-brown/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            <div className="label-caps text-amber-warm mb-3 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-amber-warm" />
              {t.eyebrow}
            </div>

            <h2 className="font-serif italic font-bold text-4xl sm:text-6xl text-cream tracking-tight mb-6">
              {t.heading}
            </h2>

            <p className="font-sans font-light text-cream/80 text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
              {t.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 w-full max-w-xl">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <MapPin className="w-5 h-5 text-amber-warm flex-shrink-0 mt-0.5" />
                <div>
                  <span className="label-caps text-amber-light text-[9px] block mb-1">{t.ourLocation}</span>
                  <p className="text-sm font-sans font-light text-cream/90 leading-snug">
                    {CAFE_CONFIG.fullAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <Clock className="w-5 h-5 text-amber-warm flex-shrink-0 mt-0.5" />
                <div>
                  <span className="label-caps text-amber-light text-[9px] block mb-1">{t.openingHours}</span>
                  <p className="text-sm font-sans font-light text-cream/90 leading-snug">
                    {CAFE_CONFIG.hoursWeekday}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={CAFE_CONFIG.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-cream text-espresso text-xs uppercase tracking-label font-medium hover:bg-cream-light transition-all duration-200 active:scale-[0.98] shadow-warm-md"
              >
                <span>{t.getDirections}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-warm" />
              </a>

              <a
                href={`tel:${CAFE_CONFIG.phone}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-cream/30 text-cream text-xs uppercase tracking-label font-medium hover:bg-white/10 transition-all duration-200"
              >
                <Phone className="w-3.5 h-3.5 text-amber-warm" />
                <span>{t.callPrefix} {CAFE_CONFIG.phone}</span>
              </a>
            </div>

            {/* Social Media Connect Row */}
            <div className="pt-6 mt-6 border-t border-white/10 w-full max-w-xl">
              <span className="label-caps text-amber-light text-[9px] block mb-3">{t.socialLabel}</span>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={CAFE_CONFIG.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-cream text-xs border border-white/10 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-amber-warm" />
                  <span>{t.social.instagram}</span>
                </a>
                <a
                  href={CAFE_CONFIG.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-cream text-xs border border-white/10 transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5 text-amber-warm" />
                  <span>{t.social.facebook}</span>
                </a>
                <a
                  href={CAFE_CONFIG.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs border border-emerald-500/30 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.social.whatsapp}</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-espresso-deep relative aspect-square sm:aspect-[4/3] lg:aspect-square"
          >
            <iframe
              className="w-full h-full border-0 grayscale-[40%] contrast-125 opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
              title="Google Maps Location for Garden Cafe in Sarabha Nagar, Ludhiana"
              loading="lazy"
              src="https://maps.google.com/maps?q=Garden%20Cafe%2074-D%20Sarabha%20Nagar%20Ludhiana&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />
            <div className="absolute top-4 left-4 pointer-events-none">
              <span className="label-caps px-3 py-1 rounded-full bg-espresso-deep/90 text-amber-warm border border-white/10 text-[9px]">
                {t.mapBadge}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
