import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Users,
  Search,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Filter,
  X,
} from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import { Reservation } from '../../types';
import { CAFE_CONFIG } from '../../data/cafeData';

interface ReservationsManagerProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const ReservationsManager: React.FC<ReservationsManagerProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { reservations, updateReservationStatus, deleteReservation, addReservation } = useCafe();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  // Walk-in form state
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    phone: '',
    date: new Date().toISOString().slice(0, 10),
    time: '19:00',
    guests: '2',
    occasion: 'Walk-in Guest',
    notes: '',
    status: 'confirmed' as Reservation['status'],
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  const filteredReservations = reservations.filter((res) => {
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    const matchesSearch =
      res.customerName.toLowerCase().includes(search.toLowerCase()) ||
      res.phone.includes(search) ||
      (res.notes && res.notes.toLowerCase().includes(search.toLowerCase()));

    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = res.date === todayStr;
    } else if (dateFilter === 'upcoming') {
      matchesDate = res.date >= todayStr;
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  const getCleanPhone = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.customerName.trim() || !newBooking.phone.trim()) return;

    addReservation(newBooking);
    setNewBooking({
      customerName: '',
      phone: '',
      date: new Date().toISOString().slice(0, 10),
      time: '19:00',
      guests: '2',
      occasion: 'Walk-in Guest',
      notes: '',
      status: 'confirmed',
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-border/80 shadow-warm-sm">
        <div>
          <h2 className="text-lg font-sans font-semibold text-espresso">
            Table Reservations & Enquiries
          </h2>
          <p className="text-xs font-sans text-muted-foreground">
            Manage incoming guest bookings, seating statuses, and direct WhatsApp communication
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-all active:scale-[0.98] shadow-warm-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-warm" />
          <span>New Reservation / Walk-in</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search customer name, phone, or note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/80 bg-white text-xs font-sans focus:outline-none focus:border-amber-warm"
          />
        </div>

        {/* Status and Date Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <div className="flex items-center bg-white border border-border/80 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'all' ? 'bg-espresso text-cream font-medium' : 'text-muted-foreground'
              }`}
            >
              All Dates
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'today' ? 'bg-espresso text-cream font-medium' : 'text-muted-foreground'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'upcoming'
                  ? 'bg-espresso text-cream font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Upcoming
            </button>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['all', 'pending', 'confirmed', 'seated', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
                  statusFilter === status
                    ? 'bg-amber-warm text-espresso font-semibold'
                    : 'bg-white text-muted-foreground hover:bg-surface border border-border/60'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-3.5">
        {filteredReservations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-border/80">
            <Calendar className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
            <p className="text-sm font-sans font-medium text-espresso">No reservations found</p>
            <p className="text-xs font-sans text-muted-foreground mt-1">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          filteredReservations.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-white border border-border/80 shadow-warm-sm hover:border-espresso/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left: Customer Info */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-espresso font-mono font-bold flex-shrink-0">
                  {res.customerName.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-semibold text-base text-espresso">
                      {res.customerName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                        res.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : res.status === 'pending'
                          ? 'bg-amber-100 text-amber-900'
                          : res.status === 'seated'
                          ? 'bg-blue-100 text-blue-800'
                          : res.status === 'completed'
                          ? 'bg-zinc-100 text-zinc-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1.5 font-sans">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      {res.phone}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {res.date} at {res.time}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      {res.guests} Guests
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-border/60 text-[11px] text-espresso">
                      {res.occasion}
                    </span>
                  </div>

                  {res.notes && (
                    <p className="text-xs text-espresso-deep/80 mt-2 italic bg-oat/50 px-3 py-1.5 rounded-lg border border-border/50 max-w-xl">
                      “{res.notes}”
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-border/60 w-full md:w-auto justify-between md:justify-end">
                {/* Status buttons */}
                {res.status === 'pending' && (
                  <button
                    onClick={() => updateReservationStatus(res.id, 'confirmed')}
                    className="px-3 py-1.5 rounded-lg bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-colors"
                  >
                    Confirm Table
                  </button>
                )}

                {res.status === 'confirmed' && (
                  <button
                    onClick={() => updateReservationStatus(res.id, 'seated')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-cream text-xs font-sans font-medium hover:bg-blue-700 transition-colors"
                  >
                    Mark Seated
                  </button>
                )}

                {res.status === 'seated' && (
                  <button
                    onClick={() => updateReservationStatus(res.id, 'completed')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-cream text-xs font-sans font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Complete
                  </button>
                )}

                {/* WhatsApp Direct Chat */}
                <a
                  href={`https://wa.me/${getCleanPhone(res.phone)}?text=${encodeURIComponent(
                    `Hello ${res.customerName}! This is Garden Cafe, Sarabha Nagar. Your table reservation for ${res.guests} guest(s) on ${res.date} at ${res.time} is ${res.status === 'confirmed' ? 'confirmed' : 'being processed'}. We look forward to seeing you!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-medium transition-colors"
                  title="Open WhatsApp message with customer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>

                {/* Cancel / Delete */}
                <button
                  onClick={() => {
                    if (window.confirm(`Cancel reservation for ${res.customerName}?`)) {
                      updateReservationStatus(res.id, 'cancelled');
                    }
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Cancel reservation"
                >
                  <XCircle className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete record for ${res.customerName}?`)) {
                      deleteReservation(res.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete record permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Reservation / Walk-in Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-deep/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-warm-lg border border-border p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-5">
              <h3 className="font-sans font-semibold text-lg text-espresso">
                Record Reservation / Walk-in
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-muted-foreground hover:text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkin} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Gill"
                  value={newBooking.customerName}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, customerName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  value={newBooking.phone}
                  onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={newBooking.time}
                    onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                    Guests
                  </label>
                  <select
                    value={newBooking.guests}
                    onChange={(e) => setNewBooking({ ...newBooking, guests: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5-8">5–8 People</option>
                    <option value="8+">8+ Group</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                    Occasion
                  </label>
                  <input
                    type="text"
                    value={newBooking.occasion}
                    onChange={(e) => setNewBooking({ ...newBooking, occasion: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                  Seating / Dietary Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Indoor AC table, high chair, birthday..."
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-amber-warm resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-sans text-muted-foreground hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-colors"
                >
                  Save Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
