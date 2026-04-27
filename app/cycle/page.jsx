"use client";

import { useEffect, useMemo, useState } from "react";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { saveSanalyData, useSanalyData } from "@/lib/storage";

const cycleStages = [
  { title: "қызығушылық", tone: "border-cyan-300/45 text-cyan-100", x: 50, y: 4 },
  { title: "ойын", tone: "border-lime-300/45 text-lime-100", x: 82, y: 44 },
  { title: "ұтылу", tone: "border-red-300/45 text-red-100", x: 50, y: 84 },
  { title: "қайта ойнау", tone: "border-amber-300/45 text-amber-100", x: 12, y: 44 }
];

const cycleHeroMath = {
  leftFormula: (
    <div className="text-[clamp(2.25rem,5.5vw,4.2rem)] font-serif italic text-white leading-none tracking-tighter">
      S<sub className="text-[0.45em]">t+1</sub>
      <span className="mx-3 text-white/40">=</span>
      M · S<sub className="text-[0.45em]">t</sub>
    </div>
  ),
  leftLabel: "Марков тізбегіндегі күй ауысуы",
  rightFormula: (
    <span className="flex flex-col items-end gap-1 text-[clamp(2rem,4.4vw,3.9rem)] sm:block">
      <span>P(R<sub className="text-[0.45em]">k</sub>)</span>
      <span className="sm:ml-3">= 1 − (1 − r)<sup className="text-[0.45em]">k</sup></span>
    </span>
  ),
  rightLabel: "Циклге қайта оралу ықтималдығы",
  symbolsTitle: "Цикл айнымалылары:",
  symbols: [
    ["Sₜ", "қазіргі психологиялық күй векторы"],
    ["M", "қызығушылықтан қайта ойынға өтудің матрицасы"],
    ["r", "бір триггерден кейін қайту ықтималдығы"],
    ["k", "қайталанған триггерлер саны"]
  ],
  verdictTitle: "Циклдің математикалық мәні:",
  verdict: (
    <>
      Егер <b className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-8">r &gt; 0</b> болса, әр жаңа триггер <span className="text-white font-black">P(R<sub>k</sub>)</span> мәнін өсіреді.
    </>
  ),
  statementTitle: "Бір айналым келесісін күшейтеді",
  statement:
    "Тәуелділік циклі жеке шешім емес: қызығушылық, ойын, ұтылу және қайта ойнау бір-біріне ықтималдық арқылы өтетін қайталанатын жүйе.",
  symbolsTextClassName: "text-lg sm:text-xl",
  verdictTextClassName: "text-lg sm:text-xl",
  statementTextClassName: "text-xl sm:text-2xl",
  watermark: "M·Sₜ"
};

export default function CyclePage() {
  const { data } = useSanalyData();
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [infoRotate, setInfoRotate] = useState({ x: 0, y: 0 });

  const angle = useMemo(() => step * 90, [step]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientY - top) / height - 0.5) * -15;
    const y = ((clientX - left) / width - 0.5) * 15;
    setRotate({ x, y });
  };

  const handleInfoMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientY - top) / height - 0.5) * -8;
    const y = ((clientX - left) / width - 0.5) * 8;
    setInfoRotate({ x, y });
  };

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    let ticks = 0;
    const id = window.setInterval(() => {
      ticks += 1;
      setStep((value) => (value + 1) % cycleStages.length);

      if (ticks >= 12) {
        window.clearInterval(id);
        setRunning(false);
        setMessage(true);
      }
    }, 420);

    return () => window.clearInterval(id);
  }, [running]);

  function simulate() {
    setMessage(false);
    setRunning(true);
    saveSanalyData({
      cycle: {
        count: (data.cycle?.count || 0) + 1
      }
    });
  }

  return (
    <StageShell
      eyebrow="Идея 4"
      title="Тәуелділік циклі"
      compactHero
      heroMath={cycleHeroMath}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div
          className="panel rounded-3xl p-4 sm:p-8 transition-transform duration-200 ease-out"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setRotate({ x: 0, y: 0 })}
          style={{
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transformStyle: "preserve-3d"
          }}
        >
          <div className="relative mx-auto aspect-square w-full max-w-[420px] rounded-full border border-white/15 bg-black/40 sm:max-w-[560px]" style={{ transformStyle: "preserve-3d" }}>
            <div className="absolute inset-[13%] rounded-full border border-dashed border-cyan-200/30" style={{ transform: "translateZ(20px)" }} />
            <div className="absolute inset-[28%] rounded-full border border-white/10 bg-white/[0.03]" style={{ transform: "translateZ(40px)" }} />

            {cycleStages.map((item, index) => (
              <div
                key={item.title}
                className={`absolute w-[5.4rem] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-black/70 px-2 py-2 text-center text-[10px] font-black uppercase tracking-normal shadow-lg sm:w-32 sm:rounded-2xl sm:px-3 sm:py-3 sm:text-sm sm:tracking-[0.08em] ${item.tone}`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) translateZ(${index === step ? '90px' : '60px'}) scale(${index === step ? 1.1 : 1})`,
                  transition: "all 0.3s ease-out"
                }}
              >
                <span className="block text-[11px] opacity-55">0{index + 1}</span>
                {item.title}
              </div>
            ))}

            <div
              className="absolute left-1/2 top-1/2 h-[35%] w-1 origin-bottom rounded-full bg-cyan-200 transition-transform duration-300"
              style={{
                transform: `translate(-50%, -100%) rotate(${angle}deg) translateZ(100px)`,
              }}
            >
              <span className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-cyan-100 shadow-[0_0_20px_#19f6ff]" />
            </div>
            <div
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/45 bg-cyan-300/10 shadow-cyan"
              style={{ transform: "translate(-50%, -50%) translateZ(50px)" }}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div 
            className="panel rounded-3xl p-6 sm:p-8 transition-transform duration-200"
            onMouseMove={handleInfoMove}
            onMouseLeave={() => setInfoRotate({ x: 0, y: 0 })}
            style={{
              perspective: "1000px",
              transform: `rotateX(${infoRotate.x}deg) rotateY(${infoRotate.y}deg)`,
              transformStyle: "preserve-3d"
            }}
          >
            <p 
              className="text-sm font-semibold uppercase tracking-[0.25em] text-red-200/70"
              style={{ transform: "translateZ(20px)" }}
            >
              Марков тізбегі
            </p>
            <h2 
              className="mt-4 text-2xl font-black tracking-normal text-white sm:text-3xl"
              style={{ transform: "translateZ(40px)" }}
            >
              Бір айналым тағы бір айналымды шақырады
            </h2>
            <p 
              className="mt-4 text-base leading-7 text-white/65 sm:text-lg sm:leading-8"
              style={{ transform: "translateZ(30px)" }}
            >
              {"Математикалық тұрғыда бұл - Марков тізбегі: келесі күй көбіне қазіргі күйге тәуелді. Формула: S(t+1) = M · S(t), ал қайталанған триггерлерде P(Rk) = 1 - (1 - r)^k өседі."}
            </p>
            <button
              type="button"
              onClick={simulate}
              disabled={running}
              className="mt-7 w-full rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-cyan-50 transition hover:border-cyan-100 disabled:cursor-wait disabled:opacity-55"
              style={{ transform: "translateZ(50px)" }}
            >
              Симуляциялау
            </button>
            {message ? (
              <div 
                className="mt-5 rounded-2xl border border-red-300/30 bg-red-400/10 p-5 text-lg font-black text-red-100"
                style={{ transform: "translateZ(60px)" }}
              >
                Сен осы циклде қалып отырсың
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Цикл саны" value={data.cycle?.count || 0} tone="amber" />
            <MetricCard
              label="Ағымдағы кезең"
              value={cycleStages[step].title}
              tone={step === 2 ? "red" : "cyan"}
            />
          </div>
        </div>
      </div>
    </StageShell>
  );
}
