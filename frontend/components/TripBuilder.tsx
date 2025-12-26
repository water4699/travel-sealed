"use client";

import { useMemo, useState } from "react";
import { TRAVEL_STYLES } from "@/lib/travelStyles";
import { calculateNights } from "@/lib/encryption";
import { motion } from "framer-motion";

export type TripFormValues = {
  title: string;
  style: number;
  startDate: string;
  endDate: string;
  destinations: string;
  plan: string;
};

type Props = {
  disabled: boolean;
  pending: boolean;
  onSubmit: (values: TripFormValues) => Promise<void>;
};

const initialState: TripFormValues = {
  title: "",
  style: 0,
  startDate: "",
  endDate: "",
  destinations: "",
  plan: "",
};

export function TripBuilder({ disabled, pending, onSubmit }: Props) {
  const [form, setForm] = useState<TripFormValues>(initialState);

  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const nights = useMemo(
    () => calculateNights(form.startDate, form.endDate),
    [form.startDate, form.endDate],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "style" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.destinations.trim() || !form.plan.trim()) {
      return;
    }

    await onSubmit(form);
    setForm(initialState);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 md:p-12 relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1.1.1-1.5.5l-.3.3c-.4.4-.5 1-.1 1.4L10 12l-4 4H4l-2 2v2l2-1h2v-2l4-4 3.6 7.1c.4.4 1 .3 1.4-.1l.3-.3c.4-.4.6-1 .5-1.5Z"/>
        </svg>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 ring-1 ring-inset ring-blue-600/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Step 1: Planning
          </div>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
            Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Private Journey</span>
          </h2>
          <p className="mt-3 text-slate-500 leading-relaxed">
            Your itinerary is encrypted on-chain. Not even the protocol can read your destinations without your authorization.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Trip Duration</span>
          <div className="text-5xl font-black text-slate-900 tabular-nums">
            {nights || "0"}<span className="ml-1 text-sm font-bold text-slate-400 uppercase tracking-wide">Nights</span>
          </div>
        </div>
      </div>

      <form className="mt-12 grid gap-10" onSubmit={handleSubmit}>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Trip Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Secret Alps Recon"
              className="glass-input"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Travel Style</label>
            <select
              name="style"
              value={form.style}
              onChange={handleChange}
              className="glass-input appearance-none"
            >
              {TRAVEL_STYLES.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 border-y border-slate-100 py-10">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Departure Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              min={todayStr}
              required
              className="glass-input"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Return Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              min={form.startDate || todayStr}
              required
              className="glass-input"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 ml-1 text-indigo-600">Encrypted Destinations & Logistics</label>
          <textarea
            name="destinations"
            value={form.destinations}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Hidden gems, transport links, sensitive stay info..."
            className="glass-input resize-none"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 ml-1 text-indigo-600">Activity Timeline (Encrypted)</label>
          <textarea
            name="plan"
            value={form.plan}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Day-by-day operations, fallback locations..."
            className="glass-input resize-none"
          />
        </div>

        <div className="flex items-center justify-between gap-6 pt-4">
          <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed">
            By clicking publish, your data is homomorphically encrypted before leaving your browser.
          </p>
          <button
            type="submit"
            disabled={disabled || pending}
            className="btn-primary min-w-[240px] group"
          >
            {pending ? (
              <span className="flex items-center gap-3">
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Encrypting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Publish Encrypted Itinerary
                <svg className="size-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </form>
    </motion.section>
  );
}
