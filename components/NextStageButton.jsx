"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NextStageButton({ href, label = "Келесі кезең" }) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100 shadow-cyan transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-300/20 sm:w-auto sm:tracking-[0.18em]"
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
