import React, { useState } from 'react';
import {
  Store,
  Clock,
  Bell,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  MessageSquare,
  Power,
} from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import { CAFE_CONFIG } from '../../data/cafeData';

export const SettingsManager: React.FC = () => {
  const { settings, updateSettings } = useCafe();

  const [form, setForm] = useState({
    storeStatus: settings.storeStatus,
    isOpen: settings.isOpen,
    announcement: settings.announcement,
    announcementActive: settings.announcementActive,
    closingTime: settings.closingTime,
    kitchenCloseTime: settings.kitchenCloseTime,
    phone: settings.phone,
    autoOpenWhatsApp: settings.autoOpenWhatsApp,
  });

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...form,
      isOpen: form.storeStatus !== 'closed',
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border border-border/80 shadow-warm-sm">
        <h2 className="text-lg font-sans font-semibold text-espresso">
          Cafe Operations & Announcement Settings
        </h2>
        <p className="text-xs font-sans text-muted-foreground">
          Control live customer notifications, operational status, kitchen hours, and store routing
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Operational Status */}
        <div className="p-6 rounded-2xl bg-white border border-border/80 shadow-warm-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div className="flex items-center gap-2.5">
              <Store className="w-5 h-5 text-amber-warm" />
              <h3 className="text-sm font-sans font-semibold text-espresso">
                Store Operational Status
              </h3>
            </div>

            {/* Quick Store ON/OFF Button */}
            <button
              type="button"
              onClick={() => {
                const nextStatus = form.storeStatus === 'closed' ? 'open' : 'closed';
                setForm({
                  ...form,
                  storeStatus: nextStatus,
                  isOpen: nextStatus !== 'closed',
                });
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono transition-all border cursor-pointer ${
                form.storeStatus !== 'closed'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                  : 'bg-rose-50 border-rose-400 text-rose-800'
              }`}
            >
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Store: {form.storeStatus !== 'closed' ? 'ON' : 'OFF'}
              </span>
              <div
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center ${
                  form.storeStatus !== 'closed' ? 'bg-emerald-600 justify-end' : 'bg-zinc-400 justify-start'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
              </div>
            </button>
          </div>

          <p className="text-xs font-sans text-muted-foreground">
            Sets the live indicator visible to customers on the storefront and manager console.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'open',
                title: 'Open for Orders',
                desc: 'Normal operations & seating',
                color: 'border-emerald-500 bg-emerald-50/50 text-emerald-950',
                dot: 'bg-emerald-500',
              },
              {
                id: 'busy',
                title: 'High Demand',
                desc: 'Wait times may be 15-20m',
                color: 'border-amber-500 bg-amber-50/50 text-amber-950',
                dot: 'bg-amber-500',
              },
              {
                id: 'closed',
                title: 'Closed',
                desc: 'Kitchen & espresso bar shut',
                color: 'border-rose-500 bg-rose-50/50 text-rose-950',
                dot: 'bg-rose-500',
              },
            ].map((status) => (
              <label
                key={status.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  form.storeStatus === status.id
                    ? status.color
                    : 'border-border/70 bg-white hover:bg-surface text-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-xs font-sans font-semibold">
                    <span className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
                    {status.title}
                  </span>
                  <input
                    type="radio"
                    name="storeStatus"
                    value={status.id}
                    checked={form.storeStatus === status.id}
                    onChange={(e) =>
                      setForm({ ...form, storeStatus: e.target.value as any })
                    }
                    className="accent-amber-warm"
                  />
                </div>
                <span className="text-[11px] font-sans opacity-80">{status.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Live Announcement Banner */}
        <div className="p-6 rounded-2xl bg-white border border-border/80 shadow-warm-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-amber-warm" />
              <h3 className="text-sm font-sans font-semibold text-espresso">
                Storefront Top Announcement Banner
              </h3>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-sans text-muted-foreground">Banner Active</span>
              <input
                type="checkbox"
                checked={form.announcementActive}
                onChange={(e) =>
                  setForm({ ...form, announcementActive: e.target.checked })
                }
                className="w-4 h-4 rounded text-amber-warm accent-amber-warm cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="text-[11px] font-mono text-muted-foreground block mb-1">
              Banner Message (Displayed at the very top of the customer website)
            </label>
            <textarea
              rows={2}
              value={form.announcement}
              onChange={(e) => setForm({ ...form, announcement: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs font-sans focus:outline-none focus:border-amber-warm resize-none"
              placeholder="e.g. Fresh batch of Single-Origin Chikmagalur Estate filter on tap today!"
            />
          </div>

          {/* Banner Preview */}
          <div className="p-3 rounded-xl bg-surface border border-border/60">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              Customer Live Preview:
            </span>
            <div className="py-2 px-3 rounded-lg bg-[#26160e] text-cream text-xs font-sans flex items-center justify-center gap-2 text-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-warm flex-shrink-0" />
              <span>{form.announcement || 'No announcement set.'}</span>
            </div>
          </div>
        </div>

        {/* Operating Timings & Routing */}
        <div className="p-6 rounded-2xl bg-white border border-border/80 shadow-warm-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/70">
            <Clock className="w-5 h-5 text-amber-warm" />
            <h3 className="text-sm font-sans font-semibold text-espresso">
              Operating Schedule & Contact
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                Cafe Daily Closing Time
              </label>
              <input
                type="text"
                value={form.closingTime}
                onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono focus:outline-none focus:border-amber-warm"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                Kitchen Last Order Cutoff
              </label>
              <input
                type="text"
                value={form.kitchenCloseTime}
                onChange={(e) =>
                  setForm({ ...form, kitchenCloseTime: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono focus:outline-none focus:border-amber-warm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono text-muted-foreground block mb-1">
                Customer Phone & WhatsApp Line
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono focus:outline-none focus:border-amber-warm"
              />
              <span className="text-[11px] text-muted-foreground mt-1 block font-sans">
                Calls and WhatsApp reservations are routed to this number (+91 62396 04749)
              </span>
            </div>
          </div>
        </div>

        {/* WhatsApp Integration & Auto-Redirect Settings */}
        <div className="p-6 rounded-2xl bg-white border border-border/80 shadow-warm-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-amber-warm" />
              <div>
                <h3 className="text-sm font-sans font-semibold text-espresso">
                  WhatsApp Confirmation Auto-Redirect
                </h3>
                <p className="text-xs font-sans text-muted-foreground">
                  Control whether WhatsApp opens automatically after booking a table or ordering food
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm({ ...form, autoOpenWhatsApp: !form.autoOpenWhatsApp })
              }
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all border cursor-pointer ${
                form.autoOpenWhatsApp
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-700'
              }`}
            >
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {form.autoOpenWhatsApp ? 'ON' : 'OFF'}
              </span>
              <div
                className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                  form.autoOpenWhatsApp ? 'bg-emerald-600 justify-end' : 'bg-zinc-400 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div
              onClick={() => setForm({ ...form, autoOpenWhatsApp: false })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                !form.autoOpenWhatsApp
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 shadow-sm'
                  : 'border-border/70 bg-white hover:bg-surface text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-sans font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  OFF — In-App Confirmation (Recommended)
                </span>
                <input
                  type="radio"
                  name="autoOpenWhatsApp"
                  checked={!form.autoOpenWhatsApp}
                  onChange={() => setForm({ ...form, autoOpenWhatsApp: false })}
                  className="accent-amber-warm"
                />
              </div>
              <p className="text-[11px] font-sans opacity-80 leading-relaxed">
                Guest sees the confirmation receipt inside the website. Provides an optional manual button if they wish to open WhatsApp.
              </p>
            </div>

            <div
              onClick={() => setForm({ ...form, autoOpenWhatsApp: true })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                form.autoOpenWhatsApp
                  ? 'border-amber-500 bg-amber-50/50 text-amber-950 shadow-sm'
                  : 'border-border/70 bg-white hover:bg-surface text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-sans font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  ON — Auto-Launch WhatsApp
                </span>
                <input
                  type="radio"
                  name="autoOpenWhatsApp"
                  checked={form.autoOpenWhatsApp}
                  onChange={() => setForm({ ...form, autoOpenWhatsApp: true })}
                  className="accent-amber-warm"
                />
              </div>
              <p className="text-[11px] font-sans opacity-80 leading-relaxed">
                Automatically opens a new WhatsApp chat tab with prefilled details 1 second after booking or placing an order.
              </p>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedToast ? (
            <span className="text-xs font-sans text-emerald-700 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Settings updated live on storefront!
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Click save to sync all changes
            </span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-espresso text-cream text-xs font-sans font-medium hover:bg-espresso-brown transition-all shadow-warm-sm active:scale-[0.98]"
          >
            <Save className="w-4 h-4 text-amber-warm" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
