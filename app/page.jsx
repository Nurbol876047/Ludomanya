"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import ElectricCard, { ElectricNoiseFilter } from "@/components/ElectricCard";

const cards = [
  {
    label: "01",
    title: "Математикалық күтім",
    accent: "#19f6ff",
    text: "E[X] < 0 формуласы бойынша кез келген құмар ойын ұзақ мерзімде шығынға әкеледі. Математика алдамайды — казино әрқашан ұтады."
  },
  {
    label: "02",
    title: "Үлкен сандар заңы",
    accent: "#b7ff39",
    text: "Ойын саны артқан сайын, нақты нәтиже математикалық күтімге (теріс мәнге) жақындай түседі. 1000 симуляция — 1000 жеңіліс траекториясы."
  },
  {
    label: "03",
    title: "Ықтималдық теориясы",
    accent: "#ff3d57",
    text: "P(A) = m/n. Jackpot ұту ықтималдығы нөлге тең деуге болады, ал уақыт пен қаражатты жоғалту ықтималдығы — 100%."
  }
];

export default function HomePage() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientY - top) / height - 0.5) * -20;
    const y = ((clientX - left) / width - 0.5) * 20;
    setRotate({ x, y });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <main className="stage-bg min-h-dvh h-full w-full overflow-hidden relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover -z-10 opacity-70 pointer-events-none"
      >
        <source src="/bg-video.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-[#050505]/40 -z-[9] pointer-events-none" />
      <ElectricNoiseFilter />
      <section className="flex min-h-dvh h-full w-full flex-col px-6 py-6 md:px-12 lg:px-20 xl:px-24 relative z-10">
        <nav className="flex items-center justify-between w-full">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-white sm:text-sm sm:tracking-[0.28em]">
            Sanaly <span className="text-cyan-200">Bet</span>
          </div>
          <Link
            href="/time-loss"
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 transition hover:border-cyan-200/50 hover:text-cyan-100 sm:px-4 sm:text-xs sm:tracking-[0.18em]"
          >
            Бастау
          </Link>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-8 sm:py-12 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1.2fr] w-full">
          <div 
            className="relative w-full" 
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="will-change-transform w-full"
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transition: "transform 0.15s ease-out",
                transformStyle: "preserve-3d"
              }}
            >
              <p 
                className="text-sm font-bold uppercase tracking-[0.25em] text-lime-300 drop-shadow-md sm:text-base sm:tracking-[0.3em]"
                style={{ transform: "translateZ(30px)" }}
              >
                Математикалық анти-дот
              </p>
              <h1 
                className="mt-4 text-[clamp(4rem,15vw,9rem)] font-black leading-[0.9] tracking-normal text-white"
                style={{ 
                  transform: "translateZ(60px)",
                  textShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(25, 246, 255, 0.3)"
                }}
              >
                Sanaly Bet
              </h1>
              <p 
                className="mt-6 text-lg leading-8 text-white/90 drop-shadow-md sm:text-xl sm:leading-9 md:w-4/5 xl:w-3/4"
                style={{ transform: "translateZ(40px)" }}
              >
                Неліктен адамдар ұтыла береді? Бұл жоба құмар ойынның иллюзиясын 
                математикалық формулалар мен нақты деректер арқылы бұзады.
              </p>
              <div 
                className="mt-9 flex flex-col gap-5 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center w-full"
                style={{ transform: "translateZ(80px)", transformStyle: "preserve-3d" }}
              >
                <Link
                  href="/time-loss"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-xl border border-cyan-300/45 bg-cyan-300/15 px-8 py-5 text-base font-black uppercase tracking-[0.16em] text-cyan-50 shadow-[0_0_20px_rgba(25,246,255,0.15)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(25,246,255,0.4)] hover:border-cyan-100 sm:w-auto sm:tracking-[0.18em] active:scale-95"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <Play className="h-5 w-5 fill-current transition-transform group-hover:scale-110" aria-hidden="true" />
                  <span>Талдауды бастау</span>
                </Link>
                <span 
                  className="text-base leading-6 text-white/70 sm:w-2/3 lg:w-1/2"
                  style={{ transform: "translateZ(10px)" }}
                >
                  10 ғылыми кезең. Уақыт, ықтималдық және психологиялық цикл.
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 w-full">
            {cards.map((card) => (
              <ElectricCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
