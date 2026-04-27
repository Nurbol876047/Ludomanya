export default function MetricCard({ label, value, tone = "cyan", children }) {
  const toneClass = {
    cyan: "text-cyan-100 border-cyan-300/30 bg-cyan-300/10",
    lime: "text-lime-100 border-lime-300/30 bg-lime-300/10",
    red: "text-red-100 border-red-300/30 bg-red-300/10",
    amber: "text-amber-100 border-amber-300/30 bg-amber-300/10",
    violet: "text-violet-100 border-violet-300/30 bg-violet-300/10"
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-65">
        {label}
      </p>
      <div className="mt-3 break-words text-2xl font-black tracking-normal sm:text-3xl">
        {value}
      </div>
      {children ? <div className="mt-3 text-sm leading-6 opacity-70">{children}</div> : null}
    </div>
  );
}
