"use client";

import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function SiteNav() {
  return (
    <header className="glass-card flex flex-wrap items-center justify-between gap-4 px-8 py-5">
      <Link href="/" className="group flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="relative flex size-12 items-center justify-center rounded-2xl bg-slate-900 shadow-xl transition-all group-hover:rotate-3">
          <Image src="/triplock-logo.svg" alt="TripLock logo" width={28} height={28} priority />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">TripLock</p>
          <p className="text-lg font-bold tracking-tight text-slate-900">Sealed Memories</p>
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <ConnectButton
          label="Launch control"
          accountStatus="avatar"
          chainStatus="icon"
          showBalance={false}
        />
      </div>
    </header>
  );
}

