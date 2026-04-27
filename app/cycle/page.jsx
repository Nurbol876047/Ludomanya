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

export default function CyclePage() {
  const { data } = useSanalyData();
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const angle = useMemo(() => step * 90, [step]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientY - top) / height - 0.5) * -15;
    const y = ((clientX - left) / width - 0.5) * 15;
    setRotate({ x, y });
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
    <StageShell eyebrow="Идея 4" title="Тәуелділік циклі">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div 
          className="panel rounded-3xl p-4 sm:p-8 transition-transform duration-200 ease-out border-none bg-slate-50"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setRotate({ x: 0, y: 0 })}
          style={{ 
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transformStyle: "preserve-3d"
          }}
        >
          <div className="relative mx-auto aspect-square w-full max-w-[420px] rounded-full border border-slate-200 bg-white sm:max-w-[560px]" style={{ transformStyle: "preserve-3d" }}>
            <div className="absolute inset-[13%] rounded-full border border-dashed border-blue-200/50" style={{ transform: "translateZ(20px)" }} />
            <div className="absolute inset-[28%] rounded-full border border-slate-100 bg-slate-50/50" style={{ transform: "translateZ(40px)" }} />

            {cycleStages.map((item, index) => (
              <div
                key={item.title}
                className={`absolute w-[5.4rem] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white px-2 py-2 text-center text-[10px] font-bold uppercase tracking-normal shadow-md sm:w-32 sm:rounded-2xl sm:px-3 sm:py-3 sm:text-sm sm:tracking-[0.08em] ${index === step ? 'border-blue-400 text-blue-600' : 'border-slate-100 text-slate-400'}`}
                style={{ 
                  left: `${item.x}%`, 
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) translateZ(${index === step ? '90px' : '60px'}) scale(${index === step ? 1.1 : 1})`,
                  transition: "all 0.3s ease-out"
                }}
              >
                <span className="block text-[11px] opacity-40">0{index + 1}</span>
                {item.title}
              </div>
            ))}

            <div
              className="absolute left-1/2 top-1/2 h-[35%] w-1 origin-bottom rounded-full bg-blue-500 transition-transform duration-300"
              style={{ 
                transform: `translate(-50%, -100%) rotate(${angle}deg) translateZ(100px)`,
              }}
            >
              <span className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-white border-4 border-blue-500 shadow-sm" />
            </div>
            <div 
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100 bg-blue-50 shadow-sm"
              style={{ transform: "translate(-50%, -50%) translateZ(50px)" }}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="panel rounded-3xl p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-200/70">
              Марков тізбегі
            </p>
            <h2 className="mt-4 text-2xl font-black tracking-normal text-white sm:text-3xl">
              Бір айналым тағы бір айналымды шақырады
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              {"Математикалық тұрғыда бұл - қайтымды процесс. Әрбір жеңіліс дофаминдік тепе-теңдікті бұзып, сізді бастапқы нүктеге қайтарады. $P(\\text{қайту}) \\to 1$."}
            </p>
            <button
              type="button"
              onClick={simulate}
              disabled={running}
              className="mt-7 w-full rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-cyan-50 transition hover:border-cyan-100 disabled:cursor-wait disabled:opacity-55"
            >
              Симуляциялау
            </button>
            {message ? (
              <div className="mt-6 rounded-2xl bg-red-50 p-5 text-lg font-bold text-red-700 border border-red-100 shadow-sm">
                Сен осы циклде қалып отырсың
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Цикл саны" value={data.cycle?.count || 0} tone="amber" />
            <MetricCard
              label="Ағымдағы кезең"
              value={cycleStages[step].title}
              tone={step === 2 ? "red" : "blue"}
            />
          </div>
        </div>
      </div>
    </StageShell>
  );
}
