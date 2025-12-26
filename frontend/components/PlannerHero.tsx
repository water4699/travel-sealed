"use client";

import { motion } from "framer-motion";

type Props = {
  chainName?: string;
  contractAddress?: `0x${string}` | undefined;
};

export function PlannerHero({ chainName, contractAddress }: Props) {
  return (
    <section className="relative pt-12 pb-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-10 md:p-16 lg:p-20 border-white/80"
      >
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-8 max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full bg-blue-600/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 ring-1 ring-inset ring-blue-600/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
              </span>
              FHEVM Mainnet Preview
            </div>
            
            <h1 className="text-6xl font-[900] tracking-tight text-slate-900 md:text-8xl leading-[0.9]">
              Travel <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Sealed.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl leading-relaxed text-slate-500 font-medium">
              The world's first travel protocol powered by <span className="text-slate-900 font-bold underline decoration-blue-500/30 decoration-4 underline-offset-4">Fully Homomorphic Encryption</span>. Store your sacred routes without revealing them to anyone.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-200">
                <svg className="size-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Homomorphic RAM Privacy
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-100 text-slate-600 font-bold text-sm shadow-sm">
                <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                Live on {chainName ?? "In-Memory Chain"}
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 w-full lg:w-64">
              <div className="rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-sm">
                <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Protocol</dt>
                <dd className="text-lg font-black text-slate-900">V1.0 Alpha</dd>
              </div>
              <div className="rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-sm">
                <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Security</dt>
                <dd className="text-lg font-black text-slate-900 italic">Zero-Knowledge</dd>
              </div>
            </div>
          </div>
        </div>

        {contractAddress && (
          <div className="mt-16 flex flex-wrap items-center gap-4 py-4 px-6 rounded-[2rem] bg-slate-50/50 border border-slate-100/50">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deployment</span>
              <span className="h-4 w-px bg-slate-200" />
            </div>
            <code className="text-xs font-mono text-blue-600 truncate max-w-xs md:max-w-none">
              {contractAddress}
            </code>
            <button 
              onClick={() => navigator.clipboard.writeText(contractAddress)}
              className="ml-auto text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
            >
              Copy Address
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
}
