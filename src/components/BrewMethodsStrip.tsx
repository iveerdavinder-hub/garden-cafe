import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Flame, Droplets, Snowflake } from 'lucide-react';
import { BREW_METHODS } from '../data/cafeData';

export const BrewMethodsStrip: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-warm" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-warm" />;
      case 'Droplet':
        return <Droplets className="w-5 h-5 text-amber-warm" />;
      case 'Snowflake':
        return <Snowflake className="w-5 h-5 text-amber-warm" />;
      default:
        return <Coffee className="w-5 h-5 text-amber-warm" />;
    }
  };

  return (
    <section className="w-full bg-[#c9833a]/15 py-12 sm:py-16 border-y border-amber-warm/25 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {BREW_METHODS.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start space-y-2 border-l border-amber-warm/30 pl-5 sm:pl-6"
            >
              <div className="w-9 h-9 rounded-full bg-amber-warm/20 flex items-center justify-center mb-1">
                {getIcon(method.iconName)}
              </div>

              {/* DM Sans 500 Name */}
              <span className="font-sans font-medium text-xs uppercase tracking-label text-espresso">
                {method.name}
              </span>

              {/* Playfair italic below each: short description (1 line) */}
              <p className="font-serif italic font-normal text-sm sm:text-base text-espresso-deep leading-snug">
                "{method.subtitle}"
              </p>

              <span className="text-xs font-sans font-light text-muted-foreground line-clamp-2">
                {method.description}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
