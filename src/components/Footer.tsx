import React from 'react';
import { Coffee, Heart, HelpCircle, Cookie, Instagram, Facebook, MessageCircle, MapPin } from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeData';
import { LOCALE } from '../locales';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenMenu?: () => void;
  onNavigateHome?: (sectionId?: string) => void;
  onOpenFAQs?: () => void;
  onOpenCookiePolicy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenMenu,
  onNavigateHome,
  onOpenFAQs,
  onOpenCookiePolicy,
}) => {
  const t = LOCALE.footer;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome(sectionId);
    }
  };

  return (
    <footer className="w-full bg-[#1c110b] text-cream/70 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-4 flex flex-col items-start space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-warm/20 flex items-center justify-center text-amber-warm">
                <Coffee className="w-4 h-4 text-amber-warm" />
              </div>
              <span className="font-serif italic font-bold text-2xl text-amber-warm tracking-tight">
                {CAFE_CONFIG.name}
              </span>
            </div>

            <p className="font-sans font-light text-xs text-cream/70 max-w-sm leading-relaxed">
              {t.description}
            </p>

            <span className="label-caps text-[9px] text-amber-light/80 block">
              {CAFE_CONFIG.subBrand}
            </span>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="label-caps text-cream/60 text-[9px] block mb-2">{t.connectWithUs}</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={CAFE_CONFIG.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-amber-warm/20 text-cream/80 hover:text-amber-warm border border-white/10 flex items-center justify-center transition-all hover:scale-105"
                  title="Follow Garden Cafe on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={CAFE_CONFIG.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-amber-warm/20 text-cream/80 hover:text-amber-warm border border-white/10 flex items-center justify-center transition-all hover:scale-105"
                  title="Like Garden Cafe on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={CAFE_CONFIG.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-emerald-500/20 text-cream/80 hover:text-emerald-400 border border-white/10 flex items-center justify-center transition-all hover:scale-105"
                  title="Connect on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={CAFE_CONFIG.socialLinks.googleReviews}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-amber-warm/20 text-cream/80 hover:text-amber-warm border border-white/10 flex items-center justify-center transition-all hover:scale-105"
                  title="Google Maps Location & Reviews"
                >
                  <MapPin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-3 space-y-3">
            <div className="label-caps text-cream text-[10px]">{t.sections.explore}</div>
            <ul className="space-y-2 text-xs font-sans font-light">
              <li>
                <a href="#hero" onClick={(e) => handleLinkClick(e, 'hero')} className="hover:text-amber-warm transition-colors">
                  {t.links.home}
                </a>
              </li>
              <li>
                <a href="#coffee" onClick={(e) => handleLinkClick(e, 'coffee')} className="hover:text-amber-warm transition-colors">
                  {t.links.coffee}
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  onClick={(e) => {
                    if (onOpenMenu) {
                      e.preventDefault();
                      onOpenMenu();
                    }
                  }}
                  className="hover:text-amber-warm transition-colors"
                >
                  {t.links.menu}
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-amber-warm transition-colors">
                  {t.links.about}
                </a>
              </li>
              <li>
                <a href="#gallery" onClick={(e) => handleLinkClick(e, 'gallery')} className="hover:text-amber-warm transition-colors">
                  {t.links.gallery}
                </a>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div className="md:col-span-2 space-y-3">
            <div className="label-caps text-cream text-[10px]">{t.sections.helpAndPolicies}</div>
            <ul className="space-y-2 text-xs font-sans font-light">
              <li>
                <a
                  href="#faqs"
                  onClick={(e) => {
                    if (onOpenFAQs) {
                      e.preventDefault();
                      onOpenFAQs();
                    } else {
                      handleLinkClick(e, 'faqs');
                    }
                  }}
                  className="hover:text-amber-warm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-warm/80" />
                  <span>{t.links.faqs}</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCookiePolicy}
                  className="hover:text-amber-warm transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Cookie className="w-3.5 h-3.5 text-amber-warm/80" />
                  <span>{t.links.cookiesPolicy}</span>
                </button>
              </li>
              <li>
                <a href="#events" onClick={(e) => handleLinkClick(e, 'events')} className="hover:text-amber-warm transition-colors">
                  {t.links.privateBookings}
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenAdmin) onOpenAdmin();
                  }}
                  className="text-amber-warm hover:underline flex items-center gap-1.5 font-medium"
                >
                  <span>{t.links.managerPortal}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Visiting & Contact */}
          <div className="md:col-span-3 space-y-3">
            <div className="label-caps text-cream text-[10px]">{t.sections.visitingAndContact}</div>
            <p className="text-xs font-sans font-light text-cream/80 leading-relaxed">
              {CAFE_CONFIG.fullAddress}
            </p>
            <div className="text-xs font-sans font-light space-y-1 text-cream/80 pt-1">
              <p>{t.dailyHours}</p>
              <p>
                {t.phoneLabel}{' '}
                <a href={`tel:${CAFE_CONFIG.phone}`} className="text-amber-warm hover:underline">
                  {CAFE_CONFIG.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans font-light text-cream/50">
          <p>
            &copy; 2026 {CAFE_CONFIG.name} &middot; {CAFE_CONFIG.fullAddress}
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={onOpenCookiePolicy}
              className="hover:text-amber-warm transition-colors underline underline-offset-4 cursor-pointer"
            >
              {t.links.cookiesAndStorage}
            </button>
            <span>&middot;</span>
            <a
              href="#faqs"
              onClick={(e) => {
                if (onOpenFAQs) {
                  e.preventDefault();
                  onOpenFAQs();
                } else {
                  handleLinkClick(e, 'faqs');
                }
              }}
              className="hover:text-amber-warm transition-colors underline underline-offset-4 cursor-pointer"
            >
              {t.links.faqs}
            </a>
            <span>&middot;</span>
            <p className="flex items-center gap-1 text-[11px]">
              <span>{t.craftedWith}</span>
              <Heart className="w-3 h-3 text-amber-warm fill-amber-warm" />
              <span>{t.forCommunity}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
