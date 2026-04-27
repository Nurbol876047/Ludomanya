export default function MetricCard({ label, value, tone = "blue", children }) {
  const toneClass = {
    blue: "text-blue-700 border-blue-100 bg-blue-50/50",
    green: "text-green-700 border-green-100 bg-green-50/50",
    red: "text-red-700 border-red-100 bg-red-50/50",
    amber: "text-amber-700 border-amber-100 bg-amber-50/50",
    violet: "text-violet-700 border-violet-100 bg-violet-50/50",
    cyan: "text-cyan-700 border-cyan-100 bg-cyan-50/50",
    lime: "text-green-700 border-green-100 bg-green-50/50",
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 shadow-sm transition-all hover:shadow-md ${toneClass}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-80">
        {label}
      </p>
      <div className="mt-2 break-words text-2xl font-black tracking-tight sm:text-3xl">
        {value}
      </div>
      {children ? <div className="mt-3 text-[13px] font-medium leading-relaxed opacity-90">{children}</div> : null}
    </div>
  );
}
