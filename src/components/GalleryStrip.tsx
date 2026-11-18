import React from 'react';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/cafeData';
import { GalleryItem } from '../types';
import { LOCALE } from '../locales';

interface GalleryStripProps {
  onSelectImage: (item: GalleryItem) => void;
}

export const GalleryStrip: React.FC<GalleryStripProps> = ({ onSelectImage }) => {
  const t = LOCALE.gallery;

  return (
    <section id="gallery" className="scroll-mt-20 sm:scroll-mt-24 py-20 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="label-caps text-amber-warm mb-2 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-amber-warm" />
            {t.eyebrow}
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-espresso">
            {t.heading}
          </h2>
        </div>
        <p className="font-sans font-light text-muted-foreground text-xs sm:text-sm max-w-xs">
          {t.subtitle}
        </p>
      </div>

      <div className="w-full overflow-x-auto scrollbar-none pb-4">
        <div className="flex w-max min-w-full">
          {GALLERY_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => onSelectImage(item)}
              className="relative group cursor-pointer w-[280px] sm:w-[320px] md:w-[360px] h-[280px] flex-shrink-0 overflow-hidden bg-oat"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-espresso-deep/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-cream">
                <div className="self-end p-2 rounded-full bg-cream/20 backdrop-blur-sm">
                  <ZoomIn className="w-4 h-4 text-cream" />
                </div>
                <div>
                  <h4 className="font-serif italic text-base sm:text-lg text-cream">{item.title}</h4>
                  <p className="font-sans text-[11px] text-cream/80 line-clamp-1">{item.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
