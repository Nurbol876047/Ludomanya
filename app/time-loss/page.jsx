"use client";

import { useEffect, useMemo, useState } from "react";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { formatNumber } from "@/lib/format";
import { saveSanalyData, useSanalyData } from "@/lib/storage";

function AnalogClock({ hoursPerDay }) {
  const [angles, setAngles] = useState({ second: 0, minute: 0, hour: 0 });
  const speed = 1 + hoursPerDay * 7;

  useEffect(() => {
    let frameId;
    let last = performance.now();
    let acceleratedSeconds = 0;

    function tick(now) {
      const delta = (now - last) / 1000;
      last = now;
      acceleratedSeconds += delta * speed;

      setAngles({
        second: (acceleratedSeconds * 6) % 360,
        minute: (acceleratedSeconds * 0.1) % 360,
        hour: (acceleratedSeconds / 120) % 360
      });

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [speed]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px] rounded-full border border-cyan-200/30 bg-black/55 shadow-cyan sm:max-w-[420px]">
      <div className="absolute inset-5 rounded-full border border-white/15" />
      {Array.from({ length: 12 }).map((_, index) => (
        <span
          key={index}
          className="absolute left-1/2 top-1/2 h-[46%] w-px origin-bottom"
          style={{ transform: `translate(-50%, -100%) rotate(${index * 30}deg)` }}
        >
          <span className="block h-4 w-px rounded-full bg-white/35" />
        </span>
      ))}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(25,246,255,0.16),transparent_42%)]" />
      <div
        className="absolute left-1/2 top-1/2 h-[28%] w-2 origin-bottom rounded-full bg-lime-300"
        style={{ transform: `translate(-50%, -100%) rotate(${angles.hour}deg)` }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[36%] w-1.5 origin-bottom rounded-full bg-cyan-200"
        style={{ transform: `translate(-50%, -100%) rotate(${angles.minute}deg)` }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[43%] w-px origin-bottom rounded-full bg-red-300 shadow-danger"
        style={{ transform: `translate(-50%, -100%) rotate(${angles.second}deg)` }}
      />
      <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white" />
      <div className="absolute inset-x-0 bottom-16 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
        x{formatNumber(speed, 1)}
      </div>
    </div>
  );
}

export default function TimeLossPage() {
  const { data, hydrated } = useSanalyData();
  const [hoursPerDay, setHoursPerDay] = useState(2);

  useEffect(() => {
    if (hydrated) {
      setHoursPerDay(data.timeLoss.hoursPerDay);
    }
  }, [data.timeLoss.hoursPerDay, hydrated]);

  const annualHours = useMemo(() => hoursPerDay * 365, [hoursPerDay]);
  const annualDays = annualHours / 24;

  function applyHours(value) {
    const next = Math.max(0, Math.min(24, value));
    setHoursPerDay(next);
    saveSanalyData({
      timeLoss: {
        hoursPerDay: next,
        annualHours: next * 365
      }
    });
  }

  return (
    <StageShell eyebrow="Идея 1" title="Уақыт кетіп жатыр">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="panel rounded-3xl p-4 sm:p-8">
          <AnalogClock hoursPerDay={hoursPerDay} />
        </div>

        <div className="space-y-5">
          <div className="panel rounded-3xl p-4 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-200/70">
              Сен уақыт жоғалтып жатырсың
            </p>
            <div className="mt-6">
              <label className="text-sm font-semibold text-white/70" htmlFor="hours">
                Күніне ойынға кететін уақыт
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_130px]">
                <input
                  id="hours"
                  className="range"
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={hoursPerDay}
                  onChange={(event) => applyHours(Number(event.target.value))}
                />
                <input
                  className="control text-center"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={hoursPerDay}
                  onChange={(event) => applyHours(Number(event.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="Күніне" value={`${formatNumber(hoursPerDay, 1)} сағ`} />
            <MetricCard
              label="Жылына"
              value={`${formatNumber(annualHours)} сағ`}
              tone="amber"
            />
            <MetricCard
              label="Өмірден"
              value={`${formatNumber(annualDays, 1)} күн`}
              tone="red"
            />
          </div>
        </div>
      </div>
    </StageShell>
  );
}
