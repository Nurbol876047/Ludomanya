"use client";

import { RotateCcw } from "lucide-react";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { formatCurrency, formatNumber } from "@/lib/format";
import { computeRiskScore, useSanalyData } from "@/lib/storage";

export default function FinalPage() {
  const { data, resetData } = useSanalyData();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const riskScore = computeRiskScore(data);
  const annualDays = data.timeLoss.annualHours / 24;
  const monteLoss = Math.max(0, -data.monteCarlo.finalBalance);
  const observedLoss = data.lossTimer.simulatedLoss + monteLoss;

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientY - top) / height - 0.5) * -15;
    const y = ((clientX - left) / width - 0.5) * 15;
    setRotate({ x, y });
  };

  return (
    <StageShell eyebrow="Қорытынды" title="Сенің шешімің — сенің болашағың">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div 
          className="panel rounded-3xl p-6 sm:p-8 transition-transform duration-200 ease-out"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setRotate({ x: 0, y: 0 })}
          style={{
            perspective: "1000px",
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transformStyle: "preserve-3d"
          }}
        >
          <p 
            className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200/70"
            style={{ transform: "translateZ(20px)" }}
          >
            Risk score
          </p>
          <div 
            className="relative mx-auto mt-8 aspect-square w-full max-w-[340px] rounded-full border border-white/15 bg-black/55 sm:max-w-[420px]"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}
          >
            <div
              className="absolute inset-5 rounded-full"
              style={{
                background: `conic-gradient(#ff3d57 ${riskScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                transform: "translateZ(10px)"
              }}
            />
            <div 
              className="absolute inset-14 grid place-items-center rounded-full border border-white/15 bg-[#050505]"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="text-center" style={{ transform: "translateZ(40px)" }}>
                <div className="text-6xl font-black tracking-normal text-white sm:text-7xl">
                  {riskScore}
                </div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                  / 100
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={resetData}
            className="mt-12 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
            style={{ transform: "translateZ(20px)" }}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Деректерді тазалау
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Уақыт жоғалту"
              value={`${formatNumber(annualDays, 1)} күн/жыл`}
              tone="amber"
            />
            <MetricCard
              label="Потери"
              value={formatCurrency(observedLoss)}
              tone="red"
            />
            <MetricCard
              label="E убыток"
              value={formatCurrency(data.probability.expectedLoss)}
              tone="red"
            />
            <MetricCard
              label="MediaPipe ойын"
              value={`${data.gesture.score} / ${data.gesture.risk}`}
              tone={data.gesture.risk > data.gesture.score ? "red" : "lime"}
            >
              score / risk
            </MetricCard>
            <MetricCard
              label="Monte Carlo"
              value={formatCurrency(data.monteCarlo.finalBalance)}
              tone={data.monteCarlo.finalBalance < 0 ? "red" : "lime"}
            />
            <MetricCard
              label="Импульс"
              value={`${formatNumber(data.particles.impulse, 0)}%`}
              tone="amber"
            />
          </div>

          <div className="panel rounded-3xl p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-200/70">
              Математикалық қорытынды
            </p>
            <p className="mt-5 text-lg font-black leading-7 text-white sm:text-xl sm:leading-8">
              Ойын қысқа сәтте қызық көрінуі мүмкін, бірақ уақыт, күтілетін
              мән және симуляция ұзақ перспективада бір бағытты көрсетеді:
              бақылауды өзіңе қайтару керек.
            </p>
          </div>
        </div>
      </div>
    </StageShell>
  );
}
