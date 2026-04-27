"use client";

import Link from "next/link";
import { flowStages } from "@/lib/stages";

export default function ProgressRail({ activeIndex }) {
  const progress = ((activeIndex + 1) / flowStages.length) * 100;

  return (
    <div className="panel rounded-2xl p-2.5 sm:p-3">
      <div className="mb-3 flex min-w-0 items-center justify-between gap-3 text-[10px] uppercase tracking-[0.12em] text-white/60 sm:text-xs sm:tracking-[0.18em]">
        <span className="shrink-0">
          Кезең {activeIndex + 1}/{flowStages.length}
        </span>
        <span className="min-w-0 truncate">{flowStages[activeIndex]?.title}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-lime-300 to-red-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="no-scrollbar mt-3 flex snap-x gap-2 overflow-x-auto pb-0.5">
        {flowStages.map((stage, index) => (
          <Link
            key={stage.href}
            href={stage.href}
            className={`snap-start shrink-0 rounded-lg border px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] transition sm:px-3 sm:text-[11px] sm:tracking-[0.12em] ${index <= activeIndex
                ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-100"
                : "border-white/10 bg-white/[0.03] text-white/40"
              }`}
          >
            {stage.short}
          </Link>
        ))}
      </div>
    </div>
  );
}
