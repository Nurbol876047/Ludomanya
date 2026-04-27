"use client";

import { useEffect, useMemo, useState } from "react";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { formatCurrency, formatNumber } from "@/lib/format";
import { saveSanalyData, useSanalyData } from "@/lib/storage";

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

  return (
    <StageShell eyebrow="Ықтималдық теориясы" title="Математикалық шындық">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <div className="panel rounded-3xl p-6 sm:p-8 transition-all hover:shadow-[0_0_40px_rgba(25,246,255,0.1)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-200/70">
              $E = p \cdot W - (1-p) \cdot L$
            </p>
            <div className="mt-7 grid gap-5">
              <label>
                <span className="text-sm font-semibold text-white/70">
                  Ұту ықтималдығы: {formatNumber(probability, 1)}%
                </span>
                <input
                  className="range mt-3"
                  type="range"
                  min="1"
                  max="99"
                  step="1"
                  value={probability}
                  onChange={(event) => applyProbability(Number(event.target.value))}
                />
              </label>
              <label>
                <span className="text-sm font-semibold text-white/70">Ұтыс көлемі (W)</span>
                <input
                  className="control mt-3"
                  type="number"
                  min="0"
                  step="100"
                  value={win}
                  onChange={(event) => applyWin(Number(event.target.value))}
                />
              </label>
              <label>
                <span className="text-sm font-semibold text-white/70">Тігіс көлемі (L)</span>
                <input
                  className="control mt-3"
                  type="number"
                  min="0"
                  step="100"
                  value={loss}
                  onChange={(event) => applyLoss(Number(event.target.value))}
                />
              </label>
            </div>
          </div>

          <div className="panel rounded-3xl p-5 bg-cyan-900/10 border-cyan-500/20">
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-200">Мысал: Еуропалық рулетка</h3>
            <p className="mt-2 text-xs leading-5 text-white/50">
              Рулеткада 37 сан бар. Егер сіз бір санға тіксеңіз: <br/>
              $p = 1/37 \approx 2.7\%$. Ұтыс — 35:1. <br/>
              $E = (1/37) \cdot 35 - (36/37) \cdot 1 = -0.027$. <br/>
              Бұл дегеніміз, әрбір тігілген 1000 теңгеден сіз <b>27 теңге</b> жоғалтасыз.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="panel rounded-3xl p-4 sm:p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <ExpectedGraph expectedValue={expectedValue} loss={loss} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Күтілетін мән"
              value={formatCurrency(expectedValue)}
              tone={expectedValue < 0 ? "red" : "lime"}
            />
            <MetricCard
              label="House Edge"
              value={`${formatNumber(houseEdge, 1)}%`}
              tone="red"
            >
              Казиноның математикалық басымдығы. Бұл көрсеткіш әрқашан сізге қарсы.
            </MetricCard>
            <MetricCard
              label="Банкроттық қаупі"
              value={expectedValue < 0 ? "100%" : "0%"}
              tone={expectedValue < 0 ? "red" : "lime"}
            >
              Шексіз ойын сериясында сіздің балансыңыз міндетті түрде нөлге жетеді.
            </MetricCard>
          </div>
        </div>
      </div>
    </StageShell>
  );
}
