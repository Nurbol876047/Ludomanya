"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { formatNumber } from "@/lib/format";
import { particlesHeroMath } from "@/lib/heroMath";
import { saveSanalyData, useSanalyData } from "@/lib/storage";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function ParticlesInteractionPage() {
  const { data, hydrated } = useSanalyData();
  const fieldRef = useRef(null);
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const interactedRef = useRef(false);
  const [impulse, setImpulse] = useState(0);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (hydrated && !interactedRef.current) {
      setImpulse(data.particles.impulse);
    }
  }, [data.particles.impulse, hydrated]);

  useEffect(() => {
    if (!interactedRef.current) {
      return undefined;
    }

    const id = window.setTimeout(() => {
      saveSanalyData({ particles: { impulse } });
    }, 180);

    return () => window.clearTimeout(id);
  }, [impulse]);

  function spawnParticle(x, y, velocity) {
    const field = fieldRef.current;
    if (!field) {
      return;
    }

    const particle = document.createElement("span");
    particle.className =
      "pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-cyan";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    field.appendChild(particle);

    gsap.fromTo(
      particle,
      {
        scale: velocity > 1.2 ? 1.25 : 0.8,
        opacity: 0.95
      },
      {
        x: (Math.random() - 0.5) * (70 + velocity * 32),
        y: (Math.random() - 0.5) * (70 + velocity * 32),
        scale: 0,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        onComplete: () => particle.remove()
      }
    );
  }

  function handlePointerMove(event) {
    const field = fieldRef.current;
    if (!field) {
      return;
    }

    const rect = field.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const now = performance.now();
    const previous = lastPointer.current;
    const dt = Math.max(16, now - previous.t);
    const distance = Math.hypot(x - previous.x, y - previous.y);
    const velocity = distance / dt;

    lastPointer.current = { x, y, t: now };
    interactedRef.current = true;
    setSpeed(velocity);
    setImpulse((value) => clamp(value + (velocity > 1.18 ? 4.4 : -0.85), 0, 100));

    const count = velocity > 1.18 ? 5 : 2;
    for (let index = 0; index < count; index += 1) {
      spawnParticle(x, y, velocity);
    }
  }

  return (
    <StageShell
      eyebrow="GSAP interaction"
      title="Жылдам шешім"
      compactHero
      heroMath={particlesHeroMath}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          ref={fieldRef}
          onPointerMove={handlePointerMove}
          className="panel relative min-h-[440px] overflow-hidden rounded-3xl sm:min-h-[520px] lg:min-h-[560px]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(25,246,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(183,255,57,0.07)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="absolute left-8 top-8 rounded-2xl border border-white/15 bg-black/45 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
              Жылдам шешім — қауіпті
            </p>
          </div>
          <div
            className="absolute bottom-0 left-0 h-1 bg-red-300 transition-all"
            style={{ width: `${impulse}%` }}
          />
          {impulse > 54 ? (
            <div className="absolute inset-x-4 bottom-6 rounded-2xl border border-red-300/35 bg-red-400/15 px-4 py-3 text-center text-base font-black text-red-100 shadow-danger sm:inset-x-auto sm:right-8 sm:px-5 sm:py-4 sm:text-lg">
              импульсивное поведение ↑
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <div className="panel rounded-3xl p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200/70">
              Поведенческий сигнал
            </p>
            <h2 className="mt-4 text-3xl font-black leading-none tracking-normal text-white sm:text-4xl">
              Қозғалыс жылдамдығы шешім импульсін көрсетеді
            </h2>
            <p className="mt-5 text-base leading-7 text-white/60">
              Курсор неғұрлым тез қозғалса, жүйе импульсивті әрекетті жоғары
              бағалайды және оны қорытынды risk score ішіне қосады.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <MetricCard label="Импульс" value={`${formatNumber(impulse, 0)}%`} tone="red" />
            <MetricCard label="Жылдамдық" value={formatNumber(speed, 2)} tone="amber" />
          </div>
        </div>
      </div>
    </StageShell>
  );
}
