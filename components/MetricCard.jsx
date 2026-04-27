import { useState } from "react";

export default function MetricCard({ label, value, tone = "cyan", children }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const toneClass = {
    cyan: "text-cyan-100 border-cyan-300/30 bg-cyan-300/10",
    lime: "text-lime-100 border-lime-300/30 bg-lime-300/10",
    red: "text-red-100 border-red-300/30 bg-red-300/10",
    amber: "text-amber-100 border-amber-300/30 bg-amber-300/10",
    violet: "text-violet-100 border-violet-300/30 bg-violet-300/10"
  }[tone];

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientY - top) / height - 0.5) * -10;
    const y = ((clientX - left) / width - 0.5) * 10;
    setRotate({ x, y });
  };

  return (
    <div 
      className={`rounded-2xl border p-4 sm:p-5 transition-transform duration-150 ease-out ${toneClass}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      style={{
        perspective: "1000px",
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transformStyle: "preserve-3d"
      }}
    >
      <p 
        className="text-xs font-semibold uppercase tracking-[0.2em] opacity-65"
        style={{ transform: "translateZ(10px)" }}
      >
        {label}
      </p>
      <div 
        className="mt-3 break-words text-2xl font-black tracking-normal sm:text-3xl"
        style={{ transform: "translateZ(30px)" }}
      >
        {value}
      </div>
      {children ? (
        <div 
          className="mt-3 text-sm leading-6 opacity-70"
          style={{ transform: "translateZ(20px)" }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
