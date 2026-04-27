"use client";

import { useRef } from "react";

export function ElectricNoiseFilter() {
  // Empty as we want a clean style, but keeping it to avoid breaking imports
  return null;
}

export default function ElectricCard({ title, label, text, accent = "#3b82f6" }) {
  const cardRef = useRef(null);

  function handlePointerMove(event) {
    const node = cardRef.current;
    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const ry = (px - 0.5) * 15;
    const rx = (0.5 - py) * 15;

    node.style.setProperty("--x", `${px * 100}%`);
    node.style.setProperty("--y", `${py * 100}%`);
    node.style.setProperty("--rx", `${rx}deg`);
    node.style.setProperty("--ry", `${ry}deg`);
  }

  function handlePointerLeave() {
    const node = cardRef.current;
    if (!node) {
      return;
    }

    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
  }

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="electric-card p-8 transition-all duration-300 ease-out hover:shadow-xl bg-white border border-slate-100"
      style={{ 
        "--accent": accent,
        transformStyle: "preserve-3d"
      }}
    >
      <div className="flex h-full flex-col justify-between" style={{ transformStyle: "preserve-3d" }}>
        <div className="flex items-start justify-between gap-5" style={{ transform: "translateZ(10px)" }}>
          <span className="rounded-full bg-slate-100 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {label}
          </span>
          <span className="h-4 w-4 rounded-full border-4 border-white shadow-sm" style={{ background: accent }} />
        </div>
        <div className="mt-12" style={{ transform: "translateZ(30px)" }}>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">{title}</h2>
          <p className="mt-5 text-sm leading-7 text-slate-600 font-medium">{text}</p>
        </div>
      </div>
    </article>
  );
}
