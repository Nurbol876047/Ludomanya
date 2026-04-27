"use client";

import { useEffect, useMemo, useState } from "react";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { formatCurrency, formatNumber } from "@/lib/format";
import { probabilityHeroMath } from "@/lib/heroMath";
import { saveSanalyData, useSanalyData } from "@/lib/storage";

function ProbabilityVisualizer({ probability }) {
  return (
    <div className="panel rounded-3xl p-6 relative overflow-hidden group">
      <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-200 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        Визуалды ықтималдық
      </h3>
      <div className="grid grid-cols-10 gap-1.5 aspect-square sm:aspect-video lg:aspect-square">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-sm transition-all duration-500 ${
              i < probability 
                ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] scale-100" 
                : "bg-white/5 scale-90"
            }`}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] font-mono uppercase tracking-tighter text-white/40">
        <span>0% (Ешқашан)</span>
        <span>{probability}% (Қазіргі)</span>
        <span>100% (Әрқашан)</span>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-white/50 italic">
        * Әрбір шаршы бір мүмкіндікті білдіреді. Көгілдір түс — сіздің ұту мүмкіндігіңіз.
      </p>
    </div>
  );
}

function MathFormula({ formula, label }) {
  return (
    <div className="group relative rounded-2xl bg-white/[0.03] border border-white/5 p-4 transition-all hover:bg-white/[0.05] hover:border-white/10">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 block mb-2">{label}</span>
      <div className="flex items-center justify-center py-2">
        {formula}
      </div>
    </div>
  );
}

function ExpectedGraph({ expectedValue, loss }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const maxDrop = Math.max(1, Math.abs(expectedValue) * 18, loss * 3);
  const points = Array.from({ length: 18 }).map((_, index) => {
    const x = (index / 17) * 100;
    const cumulative = expectedValue * index;
    const y = 25 + Math.max(-28, Math.min(62, (-cumulative / maxDrop) * 62));
    return `${x},${y}`;
  });

  const lastY = points[points.length - 1].split(",")[1];

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientY - top) / height - 0.5) * -10;
    const y = ((clientX - left) / width - 0.5) * 10;
    setRotate({ x, y });
  };

  return (
    <div
      className="relative cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      style={{
        perspective: "1000px",
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.1s ease-out"
      }}
    >
      <svg viewBox="0 0 100 100" className="h-56 w-full overflow-visible sm:h-72">
        <defs>
          <linearGradient id="probabilityLine" x1="0" x2="1">
            <stop offset="0%" stopColor="#19f6ff" />
            <stop offset="50%" stopColor="#ffb020" />
            <stop offset="100%" stopColor="#ff3d57" />
          </linearGradient>
        </defs>
        {Array.from({ length: 6 }).map((_, index) => (
          <line
            key={index}
            x1="0"
            x2="100"
            y1={18 + index * 13}
            y2={18 + index * 13}
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="0.35"
          />
        ))}
        <line x1="0" x2="100" y1="25" y2="25" stroke="rgba(183,255,57,0.45)" strokeWidth="0.7" />
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="url(#probabilityLine)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ transform: "translateZ(30px)" }}
        />
        <circle cx="100" cy={lastY} r="2.7" fill="#ff3d57" style={{ transform: "translateZ(40px)" }} />
        <text x="2" y="18" fill="rgba(255,255,255,0.5)" fontSize="4">
          E = 0
        </text>
        <text x="62" y="92" fill="rgba(255,61,87,0.82)" fontSize="4">
          ұзақ ойындағы құлдырау
        </text>
      </svg>
    </div>
  );
}

export default function ProbabilityPage() {
  const { data, hydrated } = useSanalyData();
  const [probability, setProbability] = useState(42);
  const [win, setWin] = useState(1200);
  const [loss, setLoss] = useState(1000);
  const [calcRotate, setCalcRotate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (hydrated) {
      setProbability(data.probability.probability);
      setWin(data.probability.win);
      setLoss(data.probability.loss);
    }
  }, [data.probability.loss, data.probability.probability, data.probability.win, hydrated]);

  const expectedValue = useMemo(() => {
    const p = probability / 100;
    return p * win - (1 - p) * loss;
  }, [loss, probability, win]);

  const houseEdge = useMemo(() => {
    if (loss === 0) return 0;
    return (-expectedValue / loss) * 100;
  }, [expectedValue, loss]);

  const expectedLoss = Math.max(0, -expectedValue);

  function persistProbability(nextProbability, nextWin, nextLoss) {
    const p = nextProbability / 100;
    const nextExpectedValue = p * nextWin - (1 - p) * nextLoss;
    const nextExpectedLoss = Math.max(0, -nextExpectedValue);

    saveSanalyData({
      probability: {
        probability: nextProbability,
        win: nextWin,
        loss: nextLoss,
        expectedValue: nextExpectedValue,
        expectedLoss: nextExpectedLoss
      }
    });
  }

  function applyProbability(value) {
    setProbability(value);
    persistProbability(value, win, loss);
  }

  function applyWin(value) {
    setWin(value);
    persistProbability(probability, value, loss);
  }

  function applyLoss(value) {
    setLoss(value);
    persistProbability(probability, win, value);
  }

  const handleCalcMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientY - top) / height - 0.5) * -8;
    const y = ((clientX - left) / width - 0.5) * 8;
    setCalcRotate({ x, y });
  };

  return (
    <StageShell
      eyebrow="Ықтималдық теориясы"
      title="Математикалық шындық"
      compactHero
      heroMath={probabilityHeroMath}
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          {/* Theory Section */}
          <div className="panel rounded-3xl p-6 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-4">Теория негіздері</h3>
            <div className="grid gap-3">
              <MathFormula 
                label="Қосу ережесі"
                formula={
                  <div className="flex flex-wrap items-center justify-center gap-3 text-lg font-serif sm:text-xl">
                    <span className="text-cyan-400">P(A ∪ B)</span>
                    <span className="text-white/40">=</span>
                    <span className="text-white/80">P(A) + P(B) − P(A ∩ B)</span>
                  </div>
                }
              />
              <MathFormula 
                label="Шартты ықтималдық"
                formula={
                  <div className="flex flex-wrap items-center justify-center gap-3 text-lg font-serif italic text-white/80 sm:text-xl">
                    <span className="text-cyan-400">P(A | B)</span>
                    <span>=</span>
                    <span>P(A ∩ B) / P(B)</span>
                  </div>
                }
              />
            </div>
            <div className="mt-5 space-y-3 text-sm leading-6 text-white/55">
              <p>
                <b className="text-indigo-200/80">P(A ∪ B)</b> — екі оқиғаның кемі біреуі орындалу ықтималдығы.<br />
                <b className="text-indigo-200/80">P(A | B)</b> — B оқиғасы болғаннан кейін A ықтималдығы.
              </p>
              <p className="p-3 rounded-xl bg-white/[0.03] border border-white/5 italic">
                "Ықтималдықтың түрлері оқиғаны бөлек емес, шартпен және байланыспен есептеуге мүмкіндік береді."
              </p>
            </div>
          </div>

          <div 
            className="panel rounded-3xl p-6 sm:p-8 transition-transform duration-200 ease-out"
            onMouseMove={handleCalcMove}
            onMouseLeave={() => setCalcRotate({ x: 0, y: 0 })}
            style={{
              perspective: "1000px",
              transform: `rotateX(${calcRotate.x}deg) rotateY(${calcRotate.y}deg)`,
              transformStyle: "preserve-3d"
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p 
                className="text-xs font-bold uppercase tracking-[0.25em] text-lime-200/70"
                style={{ transform: "translateZ(20px)" }}
              >
                Практикалық есептеу
              </p>
              <span className="text-[10px] font-mono text-white/20">CALC_V2</span>
            </div>
            <div className="mt-7 grid gap-5" style={{ transform: "translateZ(40px)" }}>
              <label>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-white/70">Ұту ықтималдығы</span>
                  <span className="text-sm font-mono text-cyan-400">{formatNumber(probability, 1)}%</span>
                </div>
                <input
                  className="range"
                  type="range"
                  min="1"
                  max="99"
                  step="0.1"
                  value={probability}
                  onChange={(event) => applyProbability(Number(event.target.value))}
                />
              </label>
              <label>
                <span className="text-sm font-semibold text-white/70 block mb-2">Ұтыс көлемі (W)</span>
                <div className="relative group">
                  <input
                    className="control w-full bg-white/5 border-white/10 focus:border-cyan-500/50 transition-colors"
                    type="number"
                    min="0"
                    step="100"
                    value={win}
                    onChange={(event) => applyWin(Number(event.target.value))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20 font-bold tracking-widest">₸</span>
                </div>
              </label>
              <label>
                <span className="text-sm font-semibold text-white/70 block mb-2">Тігіс көлемі (L)</span>
                <div className="relative group">
                  <input
                    className="control w-full bg-white/5 border-white/10 focus:border-red-500/50 transition-colors"
                    type="number"
                    min="0"
                    step="100"
                    value={loss}
                    onChange={(event) => applyLoss(Number(event.target.value))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20 font-bold tracking-widest">₸</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <ProbabilityVisualizer probability={probability} />
            
            <div className="panel rounded-3xl p-6 bg-cyan-900/10 border-cyan-500/20">
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-200 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                Мысал: Рулетка (Еуропалық)
              </h3>
              <p className="text-xs leading-6 text-white/60">
                Рулеткада 37 ұяшық бар (0-ден 36-ға дейін). Егер сіз нақты бір санға тіксеңіз:
              </p>
              <div className="my-4 py-3 border-y border-white/5 font-mono text-[11px] space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/40 italic">Ықтималдық (p):</span>
                  <span className="text-cyan-400">1 / 37 ≈ 2.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 italic">Ұтыс төлемі:</span>
                  <span className="text-lime-400">35 : 1</span>
                </div>
                <div className="pt-2 mt-2 border-t border-white/5 flex justify-between font-bold">
                  <span className="text-white/60 uppercase tracking-tighter">Математикалық күту:</span>
                  <span className="text-red-400">-2.7%</span>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-white/40 italic">
                Бұл дегеніміз, орта есеппен әрбір 1000 теңге тігіс үшін казино сізден 27 теңге "салық" алып отырады.
              </p>
            </div>
          </div>

          <div className="panel rounded-3xl p-4 sm:p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="mb-4 flex justify-between items-end">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Прогрессия графигі</h4>
                <div className="text-xs text-white/50 mt-1">Күтілетін нәтиже динамикасы</div>
              </div>
              <div className="text-[10px] font-mono text-lime-400/50 animate-pulse">LIVE_COMPUTE</div>
            </div>
            <ExpectedGraph expectedValue={expectedValue} loss={loss} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Күтілетін мән (E)"
              value={formatCurrency(expectedValue)}
              tone={expectedValue < 0 ? "red" : "lime"}
            />
            <MetricCard
              label="House Edge"
              value={`${formatNumber(houseEdge, 1)}%`}
              tone="red"
            >
              Казиноның математикалық басымдығы.
            </MetricCard>
            <MetricCard
              label="Банкроттық қаупі"
              value={expectedValue < 0 ? "100%" : "0%"}
              tone={expectedValue < 0 ? "red" : "lime"}
            >
              Шексіз ойында баланс нөлге жетеді.
            </MetricCard>
          </div>
        </div>
      </div>
    </StageShell>
  );
}
