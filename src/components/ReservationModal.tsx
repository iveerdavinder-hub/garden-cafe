import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calendar, Clock, User, Phone, Users, MessageSquare, Sparkles, CheckCircle2, Coffee } from 'lucide-react';
import { CAFE_CONFIG } from '../data/cafeData';
import { useCafe } from '../context/CafeContext';
import { LOCALE, formatText } from '../locales';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const t = LOCALE.reservation;
  const { addReservation, settings } = useCafe();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    occasion: 'Just a casual visit',
    notes: '',
  });

  const [confirmedReservation, setConfirmedReservation] = useState<{
    name: string;
    phone: string;
    customerPhone: string;
    date: string;
    time: string;
    guests: string;
    occasion: string;
    notes: string;
    whatsappMsg: string;
  } | null>(null);

  const getCleanPhone = (p: string) => {
    const digits = p.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const effectiveDate = formData.date || new Date().toISOString().slice(0, 10);
    const effectiveTime = formData.time || '19:00';

    // Record in local database/state for Admin panel
    addReservation({
      customerName: formData.name,
      phone: formData.phone,
      date: effectiveDate,
      time: effectiveTime,
      guests: formData.guests,
      occasion: formData.occasion,
      notes: formData.notes,
      status: 'pending',
    });

    const cleanCustomerNum = getCleanPhone(formData.phone);

    const customerMsg = [
      `*Table Reservation Confirmation — Garden Cafe* 🌿`,
      `Hi ${formData.name}! Your table reservation request has been received.`,
      ``,
      `• Date: ${effectiveDate}`,
      `• Time: ${effectiveTime}`,
      `• Party Size: ${formData.guests} ${parseInt(formData.guests) === 1 ? 'Guest' : 'Guests'}`,
      `• Occasion: ${formData.occasion}`,
      formData.notes ? `• Special Requests: ${formData.notes}` : '',
      `• Status: Pushed Live to Host Desk (Pending Approval)`,
      ``,
      `📍 Garden Cafe, 74-D, D-Block, Sarabha Nagar, Ludhiana`,
      `📞 Phone: ${CAFE_CONFIG.phone}`,
    ]
      .filter(Boolean)
      .join('\n');

    setConfirmedReservation({
      ...formData,
      date: effectiveDate,
      time: effectiveTime,
      customerPhone: cleanCustomerNum,
      whatsappMsg: customerMsg,
    });

    if (settings.autoOpenWhatsApp && cleanCustomerNum) {
      setTimeout(() => {
        window.open(
          `https://wa.me/${cleanCustomerNum}?text=${encodeURIComponent(customerMsg)}`,
          '_blank',
          'noopener,noreferrer'
        );
      }, 1000);
    }
  };

  const handleClose = () => {
    setConfirmedReservation(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso-deep/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-cream rounded-2xl shadow-warm-lg border border-border overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-6 sm:p-7 border-b border-border/70 flex items-start justify-between bg-surface/50">
              <div>
                <span className="label-caps text-amber-warm flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-warm" />
                  {t.eyebrow}
                </span>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-espresso">
                  {confirmedReservation ? t.titleConfirmed : t.titleDefault}
                </h3>
                <p className="font-sans font-light text-muted-foreground text-xs sm:text-sm mt-1">
                  {confirmedReservation
                    ? t.subtitleConfirmed
                    : formatText(t.subtitleDefault, { name: CAFE_CONFIG.name })}
                </p>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-border/60 text-muted-foreground hover:text-espresso transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {confirmedReservation ? (
              <div className="p-6 sm:p-7 space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-warm-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <h4 className="font-serif font-bold text-2xl text-espresso">
                    {t.reservedHeading}
                  </h4>
                  <p className="font-sans text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                    {formatText(t.reservedMessage, { name: confirmedReservation.name })}
                  </p>
                </div>

                {/* Reservation summary card */}
                <div className="bg-surface/80 rounded-xl p-4 border border-border/80 text-left text-xs font-sans space-y-2">
                  <div className="flex justify-between items-center text-muted-foreground pb-2 border-b border-border/60">
                    <span>{t.dateAndTime}</span>
                    <span className="font-medium text-espresso">{confirmedReservation.date} at {confirmedReservation.time}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground pb-2 border-b border-border/60">
                    <span>{t.partySize}</span>
                    <span className="font-medium text-espresso">{confirmedReservation.guests} {parseInt(confirmedReservation.guests) === 1 ? t.guestSingle : t.guestPlural}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground pb-2 border-b border-border/60">
                    <span>{t.contact}</span>
                    <span className="font-medium text-espresso">{confirmedReservation.phone}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{t.occasion}</span>
                    <span className="font-medium text-espresso">{confirmedReservation.occasion}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  {confirmedReservation.customerPhone && (
                    <a
                      href={`https://wa.me/${confirmedReservation.customerPhone}?text=${encodeURIComponent(confirmedReservation.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-warm-xs transition-all active:scale-[0.98]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{formatText(t.sendCustomerConfirmation, { phone: confirmedReservation.customerPhone })}</span>
                    </a>
                  )}

                  <a
                    href={`https://wa.me/${CAFE_CONFIG.whatsappNumber}?text=${encodeURIComponent(confirmedReservation.whatsappMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-white hover:bg-surface text-espresso text-xs font-medium border border-border/80 transition-colors"
                  >
                    <Coffee className="w-3.5 h-3.5 text-amber-warm" />
                    <span>{t.notifyHostDesk}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-3 px-6 rounded-full bg-espresso hover:bg-espresso-brown text-cream text-xs uppercase tracking-label font-medium transition-all shadow-warm-md cursor-pointer"
                  >
                    {t.done}
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
                {settings.storeStatus === 'closed' && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{t.closedBanner}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="label-caps text-espresso text-[9px] block mb-1">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jaspreet Singh"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-white/70 text-foreground text-sm focus:outline-none focus:border-amber-warm focus:ring-1 focus:ring-amber-warm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="label-caps text-espresso text-[9px] block mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-white/70 text-foreground text-sm focus:outline-none focus:border-amber-warm focus:ring-1 focus:ring-amber-warm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Date */}
                  <div>
                    <label className="label-caps text-espresso text-[9px] block mb-1">
                      Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-white/70 text-foreground text-sm focus:outline-none focus:border-amber-warm"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="label-caps text-espresso text-[9px] block mb-1">
                      Time *
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-white/70 text-foreground text-sm focus:outline-none focus:border-amber-warm"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="label-caps text-espresso text-[9px] block mb-1">
                      Guests
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-white/70 text-foreground text-sm focus:outline-none focus:border-amber-warm"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5-8">5–8 People (Group)</option>
                      <option value="8+">8+ (Private Event)</option>
                    </select>
                  </div>
                </div>

                {/* Occasion */}
                <div>
                  <label className="label-caps text-espresso text-[9px] block mb-1">
                    Occasion
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white/70 text-foreground text-sm focus:outline-none focus:border-amber-warm"
                  >
                    <option value="Just a casual visit">Just a casual visit / coffee date</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Work / Study Session">Work / Study Session</option>
                    <option value="Private Event Hire">Private Event Hire</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="label-caps text-espresso text-[9px] block mb-1">
                    Special Notes or Seating Preferences
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Garden corner table preferred, high chair needed, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white/70 text-foreground text-sm focus:outline-none focus:border-amber-warm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-espresso hover:bg-espresso-brown text-cream text-xs uppercase tracking-label font-medium transition-all duration-200 shadow-warm-md"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-warm" />
                    <span>Confirm Table Reservation</span>
                  </button>
                  <p className="font-sans text-[11px] text-muted-foreground text-center mt-2.5">
                    Your reservation request is sent directly to the cafe team. We will confirm your table shortly.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
