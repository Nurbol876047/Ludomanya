"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { formatCurrency } from "@/lib/format";
import { saveSanalyData } from "@/lib/storage";

const illusionSeries = [
  { round: "1", result: 800, balance: 800 },
  { round: "2", result: 900, balance: 1700 },
  { round: "3", result: 700, balance: 2400 },
  { round: "4", result: 1100, balance: 3500 },
  { round: "5", result: 1200, balance: 4700 },
  { round: "6", result: -1800, balance: 2900 },
  { round: "7", result: -2400, balance: 500 },
  { round: "8", result: -4300, balance: -3800 }
];

export default function IllusionPage() {
  const [visibleCount, setVisibleCount] = useState(5);
  const [running, setRunning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const visibleData = illusionSeries.slice(0, visibleCount);
  const finalBalance = visibleData[visibleData.length - 1]?.balance ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const id = window.setInterval(() => {
      setVisibleCount((count) => {
        if (count >= illusionSeries.length) {
          window.clearInterval(id);
          setRunning(false);
          saveSanalyData({
            illusion: {
              completed: true,
              finalBalance: illusionSeries[illusionSeries.length - 1].balance
            }
          });
          return count;
        }

        return count + 1;
      });
    }, 820);

    return () => window.clearInterval(id);
  }, [running]);

  function playDrop() {
    setVisibleCount(5);
    setRunning(true);
  }

  return (
    <StageShell eyebrow="Когнитивті қате" title="Жеңіс иллюзиясы">
      <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="panel h-[360px] rounded-3xl p-3 sm:h-[440px] sm:p-6 lg:h-[520px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={visibleData} margin={{ top: 20, right: 18, left: 8, bottom: 12 }}>
                <defs>
                  <linearGradient id="illusionBars" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#b7ff39" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#ff3d57" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="round" stroke="rgba(255,255,255,0.52)" tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.52)" tickLine={false} width={74} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    background: "rgba(5,5,5,0.92)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 12,
                    color: "#fff"
                  }}
                  formatter={(value, name) => [formatCurrency(value), name]}
                />
                <Bar dataKey="result" fill="url(#illusionBars)" radius={[8, 8, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#19f6ff"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#050505", stroke: "#19f6ff", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
              chart loading
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="panel rounded-3xl p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-200/70">
              5 побед подряд
            </p>
            <h2 className="mt-4 text-3xl font-black leading-none tracking-normal text-white sm:text-4xl">
              Бұл жеңіс емес — кездейсоқтық
            </h2>
            <p className="mt-5 text-base leading-7 text-white/60">
              Қысқа серия миға бақылау бар сияқты сезім береді, бірақ ұзақ
              тізбекте математикалық күтілім қайтадан минусқа тартады.
            </p>
            <button
              type="button"
              onClick={playDrop}
              disabled={running}
              className="mt-7 w-full rounded-xl border border-red-300/40 bg-red-300/10 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-red-50 transition hover:border-red-100 disabled:cursor-wait disabled:opacity-55"
            >
              Құлдырауды көру
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Қатар ұтыс" value="5" tone="lime" />
            <MetricCard
              label="Соңғы баланс"
              value={formatCurrency(finalBalance)}
              tone={finalBalance < 0 ? "red" : "amber"}
            />
          </div>
        </div>
      </div>
    </StageShell>
  );
}
