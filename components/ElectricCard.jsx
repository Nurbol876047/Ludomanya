"use client";

import { useRef } from "react";

export function ElectricNoiseFilter() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
      <filter id="electric-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.86"
          numOctaves="3"
          seed="7"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" />
      </filter>
    </svg>
  );
}

export default function ElectricCard({ title, label, text, accent = "#19f6ff" }) {
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
    const ry = (px - 0.5) * 30; // Increased tilt
    const rx = (0.5 - py) * 30; // Increased tilt

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
      className="electric-card rounded-2xl border border-white/15 p-6 transition-all duration-150 ease-out hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      style={{
        "--accent": accent,
        transformStyle: "preserve-3d"
      }}
    >
      <div className="flex h-full flex-col justify-between" style={{ transformStyle: "preserve-3d" }}>
        <div className="flex items-start justify-between gap-5" style={{ transform: "translateZ(20px)" }}>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
            {label}
          </span>
          <span className="h-3 w-3 rounded-full shadow-[0_0_15px_var(--accent)]" style={{ background: accent }} />
        </div>
        <div style={{ transform: "translateZ(40px)" }}>
          <h2 className="text-3xl font-black tracking-normal text-white drop-shadow-lg">{title}</h2>
          <p className="mt-4 text-sm leading-6 text-white/85 drop-shadow-md">{text}</p>
        </div>
      </div>
    </article>
  );
}
