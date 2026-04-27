"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NextStageButton({ href, label = "Келесі кезең" }) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300 sm:w-auto"
    >
      <span>{label}</span>
      <ArrowRight className="h-5 w-5" aria-hidden="true" />
    </Link>
  );
}
