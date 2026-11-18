import React, { useEffect } from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { useCafe } from '../../context/CafeContext';

interface AdminFloatingToggleProps {
  onOpenAuth: () => void;
}

export const AdminFloatingToggle: React.FC<AdminFloatingToggleProps> = ({ onOpenAuth }) => {
  const { isAdmin, setIsAdmin, reservations } = useCafe();
  const pendingCount = reservations.filter((r) => r.status === 'pending').length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdmin(!isAdmin);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, setIsAdmin]);

  if (isAdmin) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        onClick={onOpenAuth}
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1c110b] text-cream hover:bg-espresso-brown text-xs font-sans font-medium shadow-warm-lg border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
        title="Open Garden Cafe Admin & Kitchen Console (Ctrl+Shift+A)"
      >
        <div className="w-5 h-5 rounded-full bg-amber-warm/20 text-amber-warm flex items-center justify-center">
          <Shield className="w-3 h-3 text-amber-warm" />
        </div>
        <span>Admin Panel</span>

        {pendingCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-amber-warm text-espresso font-mono font-bold text-[10px] flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>
    </div>
  );
};
