import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cookie,
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  SlidersHorizontal,
  Info,
  Clock,
} from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeData';
import { LOCALE } from '../locales';

export interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  timestamp: string;
}

interface CookiePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences?: (prefs: CookiePreferences) => void;
}

export const CookiePolicyModal: React.FC<CookiePolicyModalProps> = ({
  isOpen,
  onClose,
  onSavePreferences,
}) => {
  const t = LOCALE.cookies;
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    preferences: true,
    analytics: true,
    timestamp: new Date().toISOString(),
  });
  const [activeTab, setActiveTab] = useState<'policy' | 'preferences'>('preferences');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gc_cookie_consent_v1');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSave = () => {
    const updated = {
      ...preferences,
      necessary: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('gc_cookie_consent_v1', JSON.stringify(updated));
    setPreferences(updated);
    setSaveSuccess(true);
    if (onSavePreferences) onSavePreferences(updated);

    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleAcceptAll = () => {
    const all = {
      necessary: true,
      preferences: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('gc_cookie_consent_v1', JSON.stringify(all));
    setPreferences(all);
    setSaveSuccess(true);
    if (onSavePreferences) onSavePreferences(all);

    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = {
      necessary: true,
      preferences: false,
      analytics: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('gc_cookie_consent_v1', JSON.stringify(essentialOnly));
    setPreferences(essentialOnly);
    setSaveSuccess(true);
    if (onSavePreferences) onSavePreferences(essentialOnly);

    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso-deep/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-2xl w-full bg-cream rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 sm:p-7 border-b border-border/80 bg-white/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-warm/15 text-espresso border border-amber-warm/30 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-amber-warm" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-espresso tracking-tight">
                    {t.modalTitle}
                  </h3>
                  <p className="text-xs font-sans text-muted-foreground">
                    {CAFE_CONFIG.name} &middot; {t.modalSubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:text-espresso hover:bg-surface border border-transparent hover:border-border transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Tabs */}
            <div className="px-6 sm:px-7 pt-3 pb-0 bg-white/40 border-b border-border/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('preferences')}
                className={`pb-2.5 px-3 text-xs font-sans font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preferences'
                    ? 'border-amber-warm text-espresso'
                    : 'border-transparent text-muted-foreground hover:text-espresso'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t.tabs.preferences}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('policy')}
                className={`pb-2.5 px-3 text-xs font-sans font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'policy'
                    ? 'border-amber-warm text-espresso'
                    : 'border-transparent text-muted-foreground hover:text-espresso'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>{t.tabs.policy}</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-sm font-sans leading-relaxed">
              {activeTab === 'preferences' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-warm/10 border border-amber-warm/20 text-xs text-espresso space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-warm" />
                      <span>{t.privacyHeading}</span>
                    </p>
                    <p className="text-muted-foreground font-light">
                      {t.privacyBody}
                    </p>
                  </div>

                  {/* Strictly Necessary */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-border shadow-warm-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-espresso/70" />
                        <span className="font-serif font-bold text-base text-espresso">
                          {t.categories.necessaryTitle}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-100 text-zinc-700 font-bold border border-zinc-200">
                          {t.categories.necessaryBadge}
                        </span>
                      </div>
                      <div className="w-8 h-4.5 rounded-full p-0.5 bg-emerald-600 flex items-center justify-end opacity-80 cursor-not-allowed">
                        <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm inline-block" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-light">
                      {t.categories.necessaryDesc}
                    </p>
                  </div>

                  {/* Preferences */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-border shadow-warm-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-amber-warm" />
                        <span className="font-serif font-bold text-base text-espresso">
                          {t.categories.preferencesTitle}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            preferences: !prev.preferences,
                          }))
                        }
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                          preferences.preferences
                            ? 'bg-amber-warm justify-end'
                            : 'bg-zinc-300 justify-start'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-white shadow-sm inline-block" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground font-light">
                      {t.categories.preferencesDesc}
                    </p>
                  </div>

                  {/* Analytics */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-border shadow-warm-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-serif font-bold text-base text-espresso">
                          {t.categories.analyticsTitle}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            analytics: !prev.analytics,
                          }))
                        }
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                          preferences.analytics
                            ? 'bg-amber-warm justify-end'
                            : 'bg-zinc-300 justify-start'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-white shadow-sm inline-block" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground font-light">
                      {t.categories.analyticsDesc}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs font-sans text-muted-foreground leading-relaxed">
                  <h4 className="font-serif font-bold text-sm text-espresso">
                    {t.policySections.s1Title}
                  </h4>
                  <p>{t.policySections.s1Body}</p>

                  <h4 className="font-serif font-bold text-sm text-espresso">
                    {t.policySections.s2Title}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>{t.policySections.s2Item1Label}</strong> {t.policySections.s2Item1Body}
                    </li>
                    <li>
                      <strong>{t.policySections.s2Item2Label}</strong> {t.policySections.s2Item2Body}
                    </li>
                    <li>
                      <strong>{t.policySections.s2Item3Label}</strong> {t.policySections.s2Item3Body}
                    </li>
                  </ul>

                  <h4 className="font-serif font-bold text-sm text-espresso">
                    {t.policySections.s3Title}
                  </h4>
                  <p>{t.policySections.s3Body}</p>

                  <h4 className="font-serif font-bold text-sm text-espresso">
                    {t.policySections.s4Title}
                  </h4>
                  <p>{t.policySections.s4Body}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-border bg-white/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-border text-espresso hover:bg-surface text-xs font-sans font-medium transition-colors cursor-pointer"
              >
                {t.buttons.essentialOnly}
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-surface text-espresso hover:bg-border/60 border border-border text-xs font-sans font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {saveSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{t.buttons.saveChoices}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-espresso text-cream hover:bg-espresso-brown text-xs font-sans font-medium transition-colors shadow-warm-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{t.buttons.acceptAll}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
