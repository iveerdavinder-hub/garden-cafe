import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GalleryItem } from '../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso-deep/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 text-cream/70 hover:text-cream transition-colors"
              aria-label="Close image viewer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-espresso">
              <img
                src={item.image}
                alt={item.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="text-center mt-4 text-cream">
              <h3 className="font-serif italic text-lg sm:text-xl text-amber-warm">{item.title}</h3>
              <p className="font-sans font-light text-xs sm:text-sm text-cream/70 mt-1 max-w-md">{item.caption}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
