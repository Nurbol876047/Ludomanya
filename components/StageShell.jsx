"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNextStage, getStageIndex } from "@/lib/stages";
import NextStageButton from "@/components/NextStageButton";
import ProgressRail from "@/components/ProgressRail";

const defaultHeroMath = {
  leftFormula: (
    <div className="text-[clamp(3.5rem,8vw,5.5rem)] font-serif italic text-white leading-none tracking-tighter">
      P(A) = <span className="inline-flex flex-col items-center align-middle mx-4">
        <span className="border-b-4 border-white/40 px-4 leading-tight text-3xl">m</span>
        <span className="leading-tight text-3xl">n</span>
      </span>
    </div>
  ),
  leftLabel: "Классикалық ықтималдық анықтамасы",
  rightFormula: "E[X] < 0",
  rightLabel: "Теріс математикалық күту",
  symbolsTitle: "Математикалық символдар:",
  symbols: [
    ["m", "сіздің ұту мүмкіндіктеріңіздің саны"],
    ["n", "ойынның барлық ықтимал нәтижелері"]
  ],
  verdictTitle: "Математикалық Үкім:",
  verdict: (
    <>
      Егер <b className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-8">E[X] &lt; 0</b> болса, онда ұзақ уақыт ойнаған сайын сіздің жеңілуіңіз <span className="text-white font-black uppercase tracking-tighter">абсолютті шындыққа</span> айналады.
    </>
  ),
  statementTitle: "Математика — ақиқаттың тілі",
  statement:
    "Біз ықтималдық теориясы мен нейробиология заңдылықтарын қолдана отырып, құмар ойынның математикалық қақпанын ашамыз. Шексіз ойын сериясында жеңіске жету мүмкін емес екенін ғылыми түрде дәлелдейміз.",
  watermark: "Σxᵢpᵢ"
};

export default function StageShell({ eyebrow, title, children, compactHero = false, heroMath = {} }) {
  const pathname = usePathname();
  const activeIndex = Math.max(0, getStageIndex(pathname));
  const nextStage = getNextStage(pathname);
  const math = { ...defaultHeroMath, ...heroMath };

  const headerSpacing = compactHero
    ? "gap-5 py-5 sm:py-7"
    : "gap-10 py-10 sm:py-16";
  const titleSize = compactHero
    ? "text-[clamp(2rem,5.5vw,3.9rem)]"
    : "text-[clamp(2.5rem,12vw,6rem)]";
  const heroPanelShape = compactHero
    ? "p-5 sm:p-7 rounded-[1.5rem]"
    : "p-10 sm:p-14 rounded-[3rem]";
  const heroFormulaGap = compactHero ? "gap-5 sm:gap-6" : "gap-12";
  const heroGridGap = compactHero ? "gap-5 pt-5 mt-0" : "gap-12 pt-12 mt-4";
  const symbolsTextSize = compactHero
    ? "text-sm sm:text-base"
    : "text-lg sm:text-xl";
  const verdictTextSize = compactHero
    ? "text-sm sm:text-base"
    : "text-xl sm:text-2xl";
  const statementTitleSize = compactHero ? "text-xs" : "text-lg";
  const statementTextSize = compactHero
    ? "text-sm sm:text-base"
    : "text-xl sm:text-2xl";
  const watermarkSize = compactHero ? "text-[110px]" : "text-[200px]";
  const symbolsTextClassName = math.symbolsTextClassName || symbolsTextSize;
  const verdictTextClassName = math.verdictTextClassName || verdictTextSize;
  const statementTextClassName = math.statementTextClassName || statementTextSize;

  return (
    <main className="stage-bg min-h-dvh h-full w-full">
      <div className="flex min-h-dvh h-full w-full flex-col px-6 py-6 md:px-12 lg:px-20 xl:px-24">
        <ProgressRail activeIndex={activeIndex} />

        <header className={`flex flex-col ${headerSpacing} w-full relative`}>
          <div className="max-w-4xl">
            <Link
              href="/"
              className="mb-5 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60 transition hover:border-cyan-200/40 hover:text-cyan-100 sm:mb-6"
            >
              Sanaly Bet
            </Link>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-200/70 sm:text-base">
              {eyebrow}
            </p>
            <h1 className={`mt-3 ${titleSize} font-black leading-[0.92] tracking-tight text-white`}>
              {title}
            </h1>
          </div>

          <div className="w-full">
            <div className={`relative ${heroPanelShape} bg-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden group shadow-2xl`}>
              <div className={`absolute top-0 right-0 ${compactHero ? "p-4" : "p-8"}`}>
                <div className="flex items-center gap-3">
                  <div className={`${compactHero ? "h-2 w-2" : "h-3 w-3"} rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]`} />
                  <div className={`${compactHero ? "text-[10px]" : "text-xs"} font-black uppercase tracking-[0.4em] text-red-400`}>Критикалық қауіп деңгейі</div>
                </div>
              </div>

              <div className={`flex flex-col ${heroFormulaGap}`}>
                <div className={`flex flex-wrap items-center justify-between ${heroFormulaGap}`}>
                  <div className="space-y-4">
                    {math.leftFormula}
                    <div className={`${compactHero ? "text-[10px]" : "text-xs"} font-black uppercase tracking-[0.5em] text-white/30`}>{math.leftLabel}</div>
                  </div>

                  <div className={`${compactHero ? "h-16" : "h-32"} hidden lg:block w-px bg-white/10`} />

                  <div className="text-right">
                    <div className={`${compactHero ? "text-[clamp(2.35rem,5.5vw,4.4rem)]" : "text-[clamp(5rem,15vw,10rem)]"} font-serif italic text-cyan-400 leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(34,211,238,0.5)]`}>
                      {math.rightFormula}
                    </div>
                    <div className={`${compactHero ? "mt-3 text-[10px]" : "mt-4 text-xs"} font-black uppercase tracking-[0.5em] text-cyan-400/40`}>{math.rightLabel}</div>
                  </div>
                </div>

                <div className={`grid ${heroGridGap} lg:grid-cols-2 border-t border-white/10`}>
                  <div className="space-y-4">
                    <p className="text-xs font-black text-white/40 uppercase tracking-[0.4em]">{math.symbolsTitle}</p>
                    <div className={`${symbolsTextClassName} text-white/80 leading-relaxed font-medium`}>
                      {math.symbols.map(([symbol, description]) => (
                        <div key={symbol}>
                          <b className={`${compactHero ? "text-xl" : "text-2xl"} text-white mr-2`}>{symbol}</b> — {description}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:text-right space-y-4">
                    <p className="text-xs font-black text-cyan-400/60 uppercase tracking-[0.4em]">{math.verdictTitle}</p>
                    <p className={`${verdictTextClassName} text-cyan-100 leading-relaxed italic font-medium`}>
                      {math.verdict}
                    </p>
                  </div>
                </div>

                <div className={`${compactHero ? "space-y-4 pt-3" : "space-y-6 pt-6"}`}>
                  <p className={`${statementTitleSize} font-black text-white uppercase tracking-[0.6em] border-b-2 border-white/10 pb-4 inline-block`}>
                    {math.statementTitle}
                  </p>
                  <p className={`${statementTextClassName} leading-relaxed text-white/50 w-full italic font-light`}>
                    {math.statement}
                  </p>
                </div>
              </div>

              <div className={`absolute -bottom-16 -left-16 ${watermarkSize} font-serif italic text-white/[0.03] pointer-events-none select-none`}>
                {math.watermark}
              </div>
            </div>
          </div>
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
