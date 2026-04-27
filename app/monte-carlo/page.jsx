"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { formatCurrency, formatNumber } from "@/lib/format";
import { saveSanalyData, useSanalyData } from "@/lib/storage";

function simulateGames({ probability, win, loss }) {
  let balance = 0;
  let minBalance = 0;
  let negativeTicks = 0;
  const chart = [{ game: 0, balance: 0 }];

  for (let game = 1; game <= 1000; game += 1) {
    balance += Math.random() < probability / 100 ? win : -loss;
    minBalance = Math.min(minBalance, balance);

    if (balance < 0) {
      negativeTicks += 1;
    }

    if (game % 10 === 0) {
      chart.push({ game, balance });
    }
  }

  return {
    chart,
    finalBalance: balance,
    minBalance,
    lossRatio: negativeTicks / 1000
  };
}

export default function MonteCarloPage() {
  const { data, hydrated } = useSanalyData();
  const [probability, setProbability] = useState(42);
  const [win, setWin] = useState(1200);
  const [loss, setLoss] = useState(1000);
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState(() =>
    simulateGames({ probability: 42, win: 1200, loss: 1000 })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const nextProbability = data.probability.probability;
    const nextWin = data.probability.win;
    const nextLoss = data.probability.loss;
    const next = simulateGames({
      probability: nextProbability,
      win: nextWin,
      loss: nextLoss
    });

    setProbability(nextProbability);
    setWin(nextWin);
    setLoss(nextLoss);
    setResult(next);
    saveSanalyData({
      monteCarlo: {
        finalBalance: next.finalBalance,
        minBalance: next.minBalance,
        lossRatio: next.lossRatio
      }
    });
  }, [data.probability.loss, data.probability.probability, data.probability.win, hydrated]);

  const runSimulation = useCallback(() => {
    const next = simulateGames({ probability, win, loss });
    setResult(next);
    saveSanalyData({
      monteCarlo: {
        finalBalance: next.finalBalance,
        minBalance: next.minBalance,
        lossRatio: next.lossRatio,
        runs: data.monteCarlo.runs + 1
      }
    });
  }, [data.monteCarlo.runs, loss, probability, win]);

  const expectedValue = useMemo(() => {
    const p = probability / 100;
    return p * win - (1 - p) * loss;
  }, [loss, probability, win]);

  return (
    <StageShell eyebrow="Monte Carlo" title="1000 ойын симуляциясы">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-5">
          <div className="panel rounded-3xl p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200/70">
              Кездейсоқ процесс
            </p>
            <div className="mt-7 grid gap-5">
              <label>
                <span className="text-sm font-semibold text-white/70">
                  p: {formatNumber(probability, 1)}%
                </span>
                <input
                  className="range mt-3"
                  type="range"
                  min="1"
                  max="99"
                  value={probability}
                  onChange={(event) => setProbability(Number(event.target.value))}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-semibold text-white/70">win</span>
                  <input
                    className="control mt-3"
                    type="number"
                    min="0"
                    step="100"
                    value={win}
                    onChange={(event) => setWin(Number(event.target.value))}
                  />
                </label>
                <label>
                  <span className="text-sm font-semibold text-white/70">loss</span>
                  <input
                    className="control mt-3"
                    type="number"
                    min="0"
                    step="100"
                    value={loss}
                    onChange={(event) => setLoss(Number(event.target.value))}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={runSimulation}
                className="rounded-xl border border-lime-300/40 bg-lime-300/10 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-lime-50 transition hover:border-lime-100"
              >
                1000 ойынды қайта есептеу
              </button>
            </div>
          </div>

          <MetricCard
            label="E бір ойынға"
            value={formatCurrency(expectedValue)}
            tone={expectedValue < 0 ? "red" : "lime"}
          />
        </div>

        <div className="space-y-5">
          <div className="panel h-[360px] rounded-3xl p-3 sm:h-[440px] sm:p-6 lg:h-[520px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.chart} margin={{ top: 20, right: 18, left: 8, bottom: 12 }}>
                  <defs>
                    <linearGradient id="monteArea" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#19f6ff" stopOpacity={0.55} />
                      <stop offset="55%" stopColor="#ffb020" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#ff3d57" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="game" stroke="rgba(255,255,255,0.48)" tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.48)" tickLine={false} width={74} />
                  <Tooltip
                    cursor={{ stroke: "rgba(25,246,255,0.35)", strokeWidth: 1 }}
                    contentStyle={{
                      background: "rgba(5,5,5,0.92)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      borderRadius: 12,
                      color: "#fff"
                    }}
                    formatter={(value) => [formatCurrency(value), "баланс"]}
                  />
                  <ReferenceLine y={0} stroke="rgba(183,255,57,0.55)" strokeDasharray="5 5" />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#19f6ff"
                    strokeWidth={3}
                    fill="url(#monteArea)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#ff3d57" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
                chart loading
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="1000 ойыннан кейін"
              value={formatCurrency(result.finalBalance)}
              tone={result.finalBalance < 0 ? "red" : "lime"}
            />
            <MetricCard label="Ең төмен нүкте" value={formatCurrency(result.minBalance)} tone="red" />
            <MetricCard
              label="Минус аймағы"
              value={`${formatNumber(result.lossRatio * 100, 1)}%`}
              tone="amber"
            />
          </div>
        </div>
      </div>
    </StageShell>
  );
}
