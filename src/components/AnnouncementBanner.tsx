import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

export const AnnouncementBanner: React.FC = () => {
  const { settings, updateSettings } = useCafe();

  if (!settings.announcementActive || !settings.announcement.trim()) {
    return null;
  }

  return (
    <div className="relative bg-[#26160e] text-cream border-b border-amber-warm/30 py-2.5 px-4 text-xs font-sans z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center pr-6">
        <Sparkles className="w-3.5 h-3.5 text-amber-warm flex-shrink-0 animate-pulse" />
        <span className="font-light tracking-wide text-cream/90">
          {settings.announcement}
        </span>
      </div>

      <button
        onClick={() => updateSettings({ announcementActive: false })}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-cream/60 hover:text-cream transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
