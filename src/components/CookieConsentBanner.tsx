import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, SlidersHorizontal } from 'lucide-react';
import { LOCALE } from '../locales';

interface CookieConsentBannerProps {
  onOpenPolicyModal: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenPolicyModal,
}) => {
  const t = LOCALE.cookies;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('gc_cookie_consent_v1');
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      const all = {
        necessary: true,
        preferences: true,
        analytics: true,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('gc_cookie_consent_v1', JSON.stringify(all));
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      const essential = {
        necessary: true,
        preferences: false,
        analytics: false,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('gc_cookie_consent_v1', JSON.stringify(essential));
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40"
        >
          <div className="bg-[#1c110b]/95 backdrop-blur-md text-cream rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/15 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-warm/20 border border-amber-warm/30 flex items-center justify-center text-amber-warm flex-shrink-0">
                  <Cookie className="w-5 h-5 text-amber-warm" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-cream tracking-tight">
                    {t.bannerTitle}
                  </h4>
                  <p className="text-[11px] font-mono text-amber-warm/90">
                    {t.bannerSubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEssentialOnly}
                className="text-cream/50 hover:text-cream transition-colors p-1"
                title="Dismiss with essential cookies only"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-sans font-light text-cream/75 leading-relaxed">
              {t.bannerDescription}
            </p>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10 flex-wrap">
              <button
                type="button"
                onClick={onOpenPolicyModal}
                className="text-xs font-sans text-amber-warm hover:text-amber-light underline underline-offset-4 flex items-center gap-1 cursor-pointer py-1"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{t.bannerOptions}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-cream text-xs font-sans transition-colors cursor-pointer"
                >
                  {t.bannerEssential}
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-1.5 rounded-full bg-amber-warm hover:bg-amber-gold text-espresso font-semibold text-xs font-sans transition-colors shadow-warm-xs active:scale-[0.98] cursor-pointer"
                >
                  {t.bannerAcceptAll}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
