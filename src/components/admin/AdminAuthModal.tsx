import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, KeyRound, X, ArrowRight, Lock } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 or any 4 digits
    if (pin === '1234' || pin.trim().length >= 4) {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('Please enter a valid 4-digit PIN (Default demo: 1234)');
    }
  };

  const handleQuickDemo = () => {
    setError('');
    setPin('');
    onSuccess();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso-deep/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-warm-lg border border-border p-6 z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-warm/15 text-amber-warm flex items-center justify-center">
                  <Lock className="w-4 h-4 text-amber-warm" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-base text-espresso">
                    Manager Access
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Garden Cafe Console
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-full text-muted-foreground hover:text-espresso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1.5">
                  Enter Manager PIN (Default: 1234)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="password"
                    maxLength={6}
                    autoFocus
                    placeholder="• • • •"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-center font-mono tracking-[0.3em] text-lg focus:outline-none focus:border-amber-warm"
                  />
                </div>
                {error && (
                  <p className="text-xs text-rose-600 mt-1.5 font-sans font-medium">{error}</p>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-colors shadow-warm-sm active:scale-[0.98]"
                >
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-warm" />
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full py-2 px-4 rounded-xl bg-surface hover:bg-surface/80 text-espresso text-xs font-sans font-medium border border-border/80 transition-colors"
                >
                  Instant 1-Click Demo Login &rarr;
                </button>
              </div>

              <p className="text-[10px] font-mono text-center text-muted-foreground">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-surface border">Ctrl+Shift+A</kbd> anytime to toggle
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
