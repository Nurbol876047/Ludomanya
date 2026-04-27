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
              className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 transition hover:border-cyan-200/40 hover:text-cyan-100 sm:mb-6 sm:px-4 sm:text-xs sm:tracking-[0.24em]"
            >
              Sanaly Bet
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-200/70 sm:text-sm sm:tracking-[0.28em]">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-[clamp(2.05rem,10vw,4.5rem)] font-black leading-[0.95] tracking-normal text-white lg:text-7xl">
              {title}
            </h1>
          </div>
          <p className="text-sm leading-6 text-white/65 sm:text-base sm:leading-7 md:justify-self-end w-full max-w-none md:text-right">
            Математика — ақиқаттың тілі. Біз ықтималдық теориясы мен
            нейробиология заңдылықтарын қолдана отырып, құмар ойынның
            математикалық қақпанын ашамыз. E[X] &lt; 0 болған жерде жеңіс мүмкін емес.
          </p>
        </header>

        <section className="flex-1 w-full">{children}</section>

        <footer className="flex flex-col-reverse items-stretch justify-between gap-3 py-6 sm:flex-row sm:items-center sm:gap-4 sm:py-8">
          <Link
            href="/"
            className="inline-flex justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/60 transition hover:border-white/25 hover:text-white sm:w-auto"
          >
            Басты бет
          </Link>
          {nextStage ? (
            <NextStageButton href={nextStage.href} />
          ) : (
            <Link
              href="/time-loss"
              className="inline-flex justify-center rounded-xl border border-lime-300/35 bg-lime-300/10 px-4 py-3 text-sm font-semibold text-lime-100 transition hover:border-lime-200 sm:w-auto"
            >
              Қайта бастау
            </Link>
          )}
        </footer>
      </div>
    </main>
  );
}
