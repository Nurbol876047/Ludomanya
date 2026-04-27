"use client";

import { useEffect, useMemo, useState } from "react";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { formatCurrency, formatNumber } from "@/lib/format";
import { saveSanalyData, useSanalyData } from "@/lib/storage";

const lossTimerHeroMath = {
  leftFormula: (
    <div className="text-[clamp(2.25rem,5vw,4rem)] font-serif italic text-white leading-none tracking-tighter">
      P(L<sub className="text-[0.45em]">t</sub> ≥ 1)
      <span className="mx-3 text-white/40">=</span>
      1 − (1 − q)<sup className="text-[0.45em]">t</sup>
    </div>
  ),
  leftLabel: "t қадамда кемі бір ұтылыс ықтималдығы",
  rightFormula: (
    <span>
      E[L<sub className="text-[0.45em]">t</sub>] = t · q · b
    </span>
  ),
  rightLabel: "Күтілетін жинақталған шығын",
  symbolsTitle: "Формуладағы шамалар:",
  symbols: [
    ["q", "бір ставкадағы ұтылу ықтималдығы"],
    ["t", "уақыт ішіндегі ставкалар саны"],
    ["b", "бір ставканың құны"]
  ],
  verdictTitle: "Ықтималдық ережесі:",
  verdict: (
    <>
      Егер <b className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-8">q &gt; 0</b> болса, онда <span className="text-white font-black">1 − (1 − q)<sup>t</sup></span> уақыт өткен сайын 1-ге жақындайды.
    </>
  ),
  statementTitle: "Ықтималдық уақытқа көбейеді",
  statement:
    "Қаржылық таймер әр секундтағы ставканы ықтимал шығынмен байланыстырады: серия ұзара берген сайын кездейсоқтық емес, қайталанған тәуекел негізгі күшке айналады.",
  watermark: "1−(1−q)^t"
};

export default function LossTimerPage() {
  const { data, hydrated } = useSanalyData();
  const [bet, setBet] = useState(1000);
  const [frequency, setFrequency] = useState(4);
  const [balance, setBalance] = useState(100000);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (hydrated) {
      setBet(data.lossTimer.bet);
      setFrequency(data.lossTimer.frequency);
      setBalance(data.lossTimer.balance);
    }
  }, [data.lossTimer.bet, data.lossTimer.balance, data.lossTimer.frequency, hydrated]);

  const lossPerSecond = useMemo(() => (bet * frequency) / 60, [bet, frequency]);
  const simulatedLoss = Math.max(0, data.lossTimer.initialBalance - balance);
  const dangerLevel = Math.min(100, (simulatedLoss / data.lossTimer.initialBalance) * 100);

  useEffect(() => {
    if (!running || !hydrated) {
      return undefined;
    }

    const id = window.setInterval(() => {
      setBalance((current) => {
        const next = Math.max(0, current - lossPerSecond);
        saveSanalyData({
          lossTimer: {
            bet,
            frequency,
            balance: next,
            simulatedLoss: Math.max(0, data.lossTimer.initialBalance - next)
          }
        });
        return next;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [bet, data.lossTimer.initialBalance, frequency, hydrated, lossPerSecond, running]);

  function applyBet(value) {
    const next = Math.max(0, value);
    setBet(next);
    saveSanalyData({
      lossTimer: {
        bet: next,
        frequency,
        balance,
        simulatedLoss
      }
    });
  }

  function applyFrequency(value) {
    const next = Math.max(0, value);
    setFrequency(next);
    saveSanalyData({
      lossTimer: {
        bet,
        frequency: next,
        balance,
        simulatedLoss
      }
    });
  }

  function resetBalance() {
    setBalance(data.lossTimer.initialBalance);
    saveSanalyData({
      lossTimer: {
        bet,
        frequency,
        balance: data.lossTimer.initialBalance,
        simulatedLoss: 0
      }
    });
  }

  return (
    <StageShell
      eyebrow="Идея 2"
      title="Қаржылық таймер"
      compactHero
      heroMath={lossTimerHeroMath}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-200/70">
              Баланс азаюы
            </p>
            <button
              type="button"
              onClick={() => setRunning((value) => !value)}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-cyan-200/40 hover:text-cyan-100"
            >
              {running ? "Пауза" : "Жалғастыру"}
            </button>
          </div>

          <div className="danger-pulse mt-8 rounded-3xl border border-red-300/30 bg-red-400/10 p-7">
            <p className="text-sm uppercase tracking-[0.22em] text-red-100/60">
              Ағымдағы баланс
            </p>
            <div className="mt-4 break-words text-[clamp(2.15rem,11vw,3.75rem)] font-black tracking-normal text-red-50">
              {formatCurrency(balance)}
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lime-300 via-amber-300 to-red-400 transition-all duration-500"
                style={{ width: `${Math.max(0, 100 - dangerLevel)}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={resetBalance}
            className="mt-5 w-full rounded-xl border border-red-200/25 bg-red-300/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:border-red-100/50"
          >
            Қайта есептеу
          </button>
        </div>

        <div className="space-y-5">
          <div className="panel rounded-3xl p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-white/70">Ставка</span>
                <input
                  className="control mt-3"
                  type="number"
                  min="0"
                  step="100"
                  value={bet}
                  onChange={(event) => applyBet(Number(event.target.value))}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-white/70">
                  Жиілік, минутына
                </span>
                <input
                  className="control mt-3"
                  type="number"
                  min="0"
                  step="1"
                  value={frequency}
                  onChange={(event) => applyFrequency(Number(event.target.value))}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="Секундына" value={formatCurrency(lossPerSecond)} tone="red" />
            <MetricCard label="Минутына" value={formatCurrency(bet * frequency)} tone="amber" />
            <MetricCard
              label="Жоғалту"
              value={formatCurrency(simulatedLoss)}
              tone="red"
            >
              Формула: ставка × жиілік уақыт бойынша балансты азайтады.
            </MetricCard>
          </div>

          <div className="panel rounded-3xl p-4 sm:p-6">
            <div className="flex h-28 items-end gap-1 overflow-hidden sm:h-32">
              {Array.from({ length: 28 }).map((_, index) => {
                const height = Math.max(8, 88 - index * 2.8 - dangerLevel * 0.45);
                return (
                  <span
                    key={index}
                    className="block flex-1 rounded-t bg-red-300/70"
                    style={{ height: `${height}px`, opacity: 0.3 + index / 45 }}
                  />
                );
              })}
            </div>
            <p className="mt-4 text-sm text-white/55">
              Поток: {formatNumber(frequency)} шешім/мин × {formatCurrency(bet)}.
            </p>
          </div>
        </div>
      </div>
    </StageShell>
  );
}
