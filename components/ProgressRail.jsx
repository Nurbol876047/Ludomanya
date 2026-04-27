"use client";

import Link from "next/link";
import { flowStages } from "@/lib/stages";

export default function ProgressRail({ activeIndex }) {
  const progress = ((activeIndex + 1) / flowStages.length) * 100;

  return (
    <div className="panel rounded-3xl p-3 sm:p-4">
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold sm:text-xs">
        <span className="shrink-0 text-blue-600">
          Кезең {activeIndex + 1}/{flowStages.length}
        </span>
        <span className="min-w-0 truncate text-slate-400">{flowStages[activeIndex]?.title}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="no-scrollbar mt-5 flex snap-x gap-2 overflow-x-auto pb-1">
        {flowStages.map((stage, index) => (
          <Link
            key={stage.href}
            href={stage.href}
            className={`snap-start shrink-0 rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition-all sm:px-4 sm:text-[11px] ${
              index <= activeIndex
                ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
            }`}
          >
            {stage.short}
          </Link>
        ))}
      </div>
    </div>
  );
}
