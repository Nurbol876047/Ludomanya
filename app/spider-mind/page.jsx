"use client";

import { useEffect, useRef, useState } from "react";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { formatNumber } from "@/lib/format";
import { saveSanalyData, useSanalyData } from "@/lib/storage";

function createNodes(count, width, height) {
  return Array.from({ length: count }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35
  }));
}

export default function SpiderMindPage() {
  const { data } = useSanalyData();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const targetRef = useRef({ x: 320, y: 220 });
  const spiderRef = useRef({ x: 320, y: 220 });
  const nodesRef = useRef([]);
  const focusRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    setFocus(data.spiderMind.focus);
    focusRef.current = data.spiderMind.focus;
  }, [data.spiderMind.focus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    let frameId;
    let lastPersist = 0;

    function resize() {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodesRef.current = createNodes(46, rect.width, rect.height);
      targetRef.current = { x: rect.width * 0.5, y: rect.height * 0.5 };
      spiderRef.current = { x: rect.width * 0.5, y: rect.height * 0.5 };
    }

    function drawSpider(x, y) {
      context.save();
      context.translate(x, y);
      context.strokeStyle = "rgba(25,246,255,0.8)";
      context.lineWidth = 2;

      for (let index = 0; index < 8; index += 1) {
        const angle = (Math.PI * 2 * index) / 8;
        context.beginPath();
        context.moveTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
        context.lineTo(Math.cos(angle) * 28, Math.sin(angle) * 20);
        context.stroke();
      }

      context.fillStyle = "rgba(5,5,5,0.9)";
      context.strokeStyle = "rgba(183,255,57,0.95)";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(0, 0, 15, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(0, -18, 9, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.restore();
    }

    function render(now) {
      const rect = wrap.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);
      context.fillStyle = "rgba(5,5,5,0.38)";
      context.fillRect(0, 0, rect.width, rect.height);

      const target = targetRef.current;
      const spider = spiderRef.current;
      spider.x += (target.x - spider.x) * 0.075;
      spider.y += (target.y - spider.y) * 0.075;

      const nearby = [];
      nodesRef.current.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > rect.width) node.vx *= -1;
        if (node.y < 0 || node.y > rect.height) node.vy *= -1;

        const distance = Math.hypot(node.x - spider.x, node.y - spider.y);
        if (distance < 210) {
          nearby.push({ node, distance });
        }
      });

      nearby.forEach(({ node, distance }) => {
        const alpha = 1 - distance / 210;
        context.strokeStyle = `rgba(255,61,87,${0.1 + alpha * 0.46})`;
        context.lineWidth = 1 + alpha * 1.8;
        context.beginPath();
        context.moveTo(spider.x, spider.y);
        context.lineTo(node.x, node.y);
        context.stroke();
      });

      nodesRef.current.forEach((node) => {
        context.fillStyle = "rgba(255,255,255,0.42)";
        context.beginPath();
        context.arc(node.x, node.y, 2, 0, Math.PI * 2);
        context.fill();
      });

      drawSpider(spider.x, spider.y);
      if (hasMovedRef.current) {
        focusRef.current = Math.min(100, focusRef.current + nearby.length * 0.0018);
      }

      if (hasMovedRef.current && now - lastPersist > 900) {
        lastPersist = now;
        setFocus(focusRef.current);
        saveSanalyData({ spiderMind: { focus: focusRef.current } });
      }

      frameId = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  function handlePointerMove(event) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    targetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    hasMovedRef.current = true;
  }

  return (
    <StageShell eyebrow="Canvas effect" title="Ой паутинасы">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          ref={wrapRef}
          onPointerMove={handlePointerMove}
          className="panel relative min-h-[460px] overflow-hidden rounded-3xl sm:min-h-[560px] lg:min-h-[620px]"
        >
          <canvas ref={canvasRef} className="absolute inset-0" />
          <div className="absolute left-8 top-8 rounded-2xl border border-white/15 bg-black/55 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
              Ойың бір нүктеге байланып жатыр
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="panel rounded-3xl p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-200/70">
              Назар байланысы
            </p>
            <h2 className="mt-4 text-3xl font-black leading-none tracking-normal text-white sm:text-4xl">
              Бір нүкте көп ойды тартады
            </h2>
            <p className="mt-5 text-base leading-7 text-white/60">
              Курсорға ерген паук жақын түйіндерге сызық тартады. Бұл ойын
              туралы ойлардың бір орталыққа жиналуын визуалдайды.
            </p>
          </div>

          <MetricCard label="Байланыс индексі" value={`${formatNumber(focus, 0)}%`} tone="red" />
        </div>
      </div>
    </StageShell>
  );
}
