"use client";

import { SiteNav } from "@/components/SiteNav";

export default function DemoPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_#dbeafe,_transparent_45%)]" />
      <main className="relative mx-auto flex max-w-screen-2xl flex-col gap-10 px-4 pb-24 pt-10 md:px-10">
        <SiteNav />

        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-white/20 bg-white/70 p-8 shadow-xl shadow-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                TripLock Demo Video
              </h1>
              <p className="text-slate-600">
                Watch how TripLock encrypts and manages your travel plans with FHEVM
              </p>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
              <video
                controls
                className="w-full h-full object-cover"
                poster="/triplock-logo.svg"
              >
                <source src="/travel.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                If the video doesn't load, you can also{" "}
                <a
                  href="/travel.mp4"
                  download="triplock-demo.mp4"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  download it directly
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
