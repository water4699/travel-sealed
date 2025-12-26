"use client";

import { TRAVEL_STYLES } from "@/lib/travelStyles";
import { motion, AnimatePresence } from "framer-motion";

export type TripSummary = {
  id: number;
  title: string;
  style: number;
  createdAt: string;
};

export type DecryptedTrip = {
  id: number;
  title: string;
  style: number;
  route: string;
  schedule: string;
  createdAt: string;
};

type Props = {
  trips: TripSummary[];
  decryptedTrip?: DecryptedTrip | null;
  onDecrypt: (tripId: number) => Promise<void>;
  pending: boolean;
  disabled: boolean;
};

export function TripVault({ trips, decryptedTrip, onDecrypt, pending, disabled }: Props) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-8 md:p-12 mt-12"
    >
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 ring-1 ring-inset ring-slate-200">
            Step 2: Accessing
          </div>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
            Confidential <span className="text-blue-600">Vault</span>
          </h2>
          <p className="mt-3 text-slate-500 leading-relaxed max-w-md">
            All data below is homomorphically sealed. Decryption happens purely in your browser's secure memory space.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
          <div className="size-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
            <svg className="size-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage Status</p>
            <p className="text-lg font-black text-slate-900 leading-none">{trips.length} <span className="text-sm font-medium">Encrypted Files</span></p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {trips.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-slate-100 p-12 text-center">
            <div className="mx-auto size-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <svg className="size-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No journeys secured yet</h3>
            <p className="text-slate-400 mt-1">Submit your first trip above to see it appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map((trip) => {
              const style = TRAVEL_STYLES.find((s) => s.id === trip.style);
              const isDecrypted = decryptedTrip?.id === trip.id;
              
              return (
                <motion.div
                  key={trip.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-6 rounded-3xl border transition-all duration-300 ${
                    isDecrypted 
                      ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-200" 
                      : "bg-white border-slate-100 hover:border-blue-200 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ${
                        isDecrypted ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {style?.label ?? "Travel"}
                      </span>
                      <span className={`text-[10px] font-medium ${isDecrypted ? "text-blue-100" : "text-slate-400"}`}>
                        {trip.createdAt}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className={`text-xl font-bold truncate ${isDecrypted ? "text-white" : "text-slate-900"}`}>
                        {trip.title}
                      </h3>
                    </div>

                    <button
                      disabled={disabled || pending}
                      onClick={() => onDecrypt(trip.id)}
                      className={`w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isDecrypted
                          ? "bg-white text-blue-600 shadow-lg"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      } disabled:opacity-50`}
                    >
                      {pending && !isDecrypted ? (
                        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      )}
                      {isDecrypted ? "Decrypted & Viewed" : "Local Decrypt"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {decryptedTrip && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-12 overflow-hidden"
          >
            <div className="rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white relative shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h7" /><path d="m16 19 2 2 4-4" /><path d="M3 10h18" /><path d="M10 14h2" /><path d="M10 18h2" />
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Decryption Success</p>
                  <h3 className="text-4xl font-extrabold tracking-tight">{decryptedTrip.title}</h3>
                  <p className="mt-2 text-slate-400 text-sm font-medium">{decryptedTrip.createdAt}</p>
                </div>
                <div className="size-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <svg className="size-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-500">
                    <span className="size-1.5 rounded-full bg-blue-500" />
                    Route Briefing
                  </h4>
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {decryptedTrip.route}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-500">
                    <span className="size-1.5 rounded-full bg-purple-500" />
                    Timeline & Plan
                  </h4>
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {decryptedTrip.schedule}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
