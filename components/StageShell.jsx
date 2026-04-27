"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNextStage, getStageIndex } from "@/lib/stages";
import NextStageButton from "@/components/NextStageButton";
import ProgressRail from "@/components/ProgressRail";

export default function StageShell({ eyebrow, title, children }) {
  const pathname = usePathname();
  const activeIndex = Math.max(0, getStageIndex(pathname));
  const nextStage = getNextStage(pathname);

  return (
    <main className="stage-bg min-h-dvh h-full w-full">
      <div className="flex min-h-dvh h-full w-full flex-col px-6 py-6 md:px-12 lg:px-20 xl:px-24">
        <ProgressRail activeIndex={activeIndex} />

        <header className="grid gap-4 py-7 sm:gap-5 sm:py-10 md:grid-cols-[1fr_1fr] md:items-end w-full">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:border-blue-300 hover:text-blue-600 sm:mb-6 sm:px-4 sm:text-xs sm:tracking-[0.24em] shadow-sm"
            >
              Sanaly Bet
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm sm:tracking-[0.28em]">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-[clamp(2.05rem,10vw,4.5rem)] font-black leading-[0.95] tracking-tight text-slate-900 lg:text-7xl">
              {title}
            </h1>
          </div>
          <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 md:justify-self-end w-full max-w-none md:text-right">
            Математика — ақиқаттың тілі. Біз ықтималдық теориясы мен 
            нейробиология заңдылықтарын қолдана отырып, құмар ойынның 
            математикалық қақпанын ашамыз. E[X] &lt; 0 болған жерде жеңіс мүмкін емес.
          </p>
        </header>

        <section className="flex-1 w-full">{children}</section>

        <footer className="flex flex-col-reverse items-stretch justify-between gap-3 py-6 sm:flex-row sm:items-center sm:gap-4 sm:py-8 border-t border-slate-200 mt-12">
          <Link
            href="/"
            className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto shadow-sm"
          >
            Басты бет
          </Link>
          {nextStage ? (
            <NextStageButton href={nextStage.href} />
          ) : (
            <Link
              href="/time-loss"
              className="inline-flex justify-center rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100 sm:w-auto shadow-sm"
            >
              Қайта бастау
            </Link>
          )}
        </footer>
      </div>
    </main>
  );
}
