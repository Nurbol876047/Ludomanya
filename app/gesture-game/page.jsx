"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, MousePointer2 } from "lucide-react";
import StageShell from "@/components/StageShell";
import MetricCard from "@/components/MetricCard";
import { saveSanalyData, useSanalyData } from "@/lib/storage";

const TASKS_VERSION = "0.10.34";
const labels = ["ставка", "казино", "қайта ойна"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function GestureGamePage() {
  const { data } = useSanalyData();
  const areaRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const frameRef = useRef(null);
  const lastFrameRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const objectsRef = useRef([]);
  const shieldRef = useRef({ x: 50, y: 78 });
  const scoreRef = useRef(0);
  const riskRef = useRef(0);

  const [status, setStatus] = useState("Камераны қосуға дайын");
  const [started, setStarted] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [objects, setObjects] = useState([]);
  const [shield, setShield] = useState({ x: 50, y: 78 });
  const [score, setScore] = useState(0);
  const [risk, setRisk] = useState(0);

  useEffect(() => {
    setScore(data.gesture.score);
    setRisk(data.gesture.risk);
    scoreRef.current = data.gesture.score;
    riskRef.current = data.gesture.risk;
  }, [data.gesture.risk, data.gesture.score]);

  const persistGesture = useCallback(() => {
    saveSanalyData({
      gesture: {
        score: scoreRef.current,
        risk: riskRef.current
      }
    });
  }, []);

  const setShieldPosition = useCallback((next) => {
    shieldRef.current = next;
    setShield(next);
  }, []);

  const updateGame = useCallback(
    (now) => {
      const last = lastFrameRef.current || now;
      const dt = Math.min(0.06, (now - last) / 1000);
      lastFrameRef.current = now;

      if (now - lastSpawnRef.current > 900) {
        lastSpawnRef.current = now;
        objectsRef.current = [
          ...objectsRef.current,
          {
            id: `${now}-${Math.random()}`,
            label: labels[Math.floor(Math.random() * labels.length)],
            x: 10 + Math.random() * 80,
            y: -8,
            speed: 18 + Math.random() * 17
          }
        ];
      }

      const shieldNow = shieldRef.current;
      let scoreChanged = false;
      let riskChanged = false;
      const nextObjects = [];

      objectsRef.current.forEach((object) => {
        const nextY = object.y + object.speed * dt;
        const hit =
          Math.abs(object.x - shieldNow.x) < 13 &&
          Math.abs(nextY - shieldNow.y) < 8;

        if (hit) {
          scoreRef.current += 1;
          scoreChanged = true;
          return;
        }

        if (nextY > 108) {
          riskRef.current += 1;
          riskChanged = true;
          return;
        }

        nextObjects.push({ ...object, y: nextY });
      });

      objectsRef.current = nextObjects;
      setObjects(nextObjects);

      if (scoreChanged) {
        setScore(scoreRef.current);
      }

      if (riskChanged) {
        setRisk(riskRef.current);
      }

      if (scoreChanged || riskChanged) {
        persistGesture();
      }
    },
    [persistGesture]
  );

  const detectHand = useCallback(() => {
    const landmarker = landmarkerRef.current;
    const video = videoRef.current;
    if (!landmarker || !video || video.readyState < 2) {
      return;
    }

    const result = landmarker.detectForVideo(video, performance.now());
    const hand = result.landmarks?.[0];
    const palm = hand?.[9] || hand?.[0];

    if (palm) {
      setShieldPosition({
        x: clamp((1 - palm.x) * 100, 8, 92),
        y: clamp(palm.y * 100, 42, 92)
      });
    }
  }, [setShieldPosition]);

  const loop = useCallback(
    (now) => {
      detectHand();
      updateGame(now);
      frameRef.current = requestAnimationFrame(loop);
    },
    [detectHand, updateGame]
  );

  const restartLoop = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    lastFrameRef.current = 0;
    lastSpawnRef.current = 0;
    frameRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const startFallback = useCallback(() => {
    setFallback(true);
    setStarted(true);
    setStatus("Сенсорлық режим қосылды");
    restartLoop();
  }, [restartLoop]);

  async function createLandmarker(delegate) {
    const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
    const vision = await FilesetResolver.forVisionTasks(
      `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VERSION}/wasm`
    );

    return HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate
      },
      numHands: 1,
      runningMode: "VIDEO"
    });
  }

  async function startCamera() {
    setLoading(true);
    setStatus("MediaPipe жүктеліп жатыр");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 960, height: 720, facingMode: "user" },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      try {
        landmarkerRef.current = await createLandmarker("GPU");
      } catch {
        landmarkerRef.current = await createLandmarker("CPU");
      }

      setFallback(false);
      setStarted(true);
      setStatus("Қол анықталды: shield қолмен қозғалады");
      restartLoop();
    } catch {
      setStatus("Камера қосылмады. Сенсорлық режим ашылды");
      startFallback();
    } finally {
      setLoading(false);
    }
  }

  function resetGame() {
    scoreRef.current = 0;
    riskRef.current = 0;
    objectsRef.current = [];
    setScore(0);
    setRisk(0);
    setObjects([]);
    persistGesture();
  }

  function handlePointerMove(event) {
    if (!fallback) {
      return;
    }

    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    setShieldPosition({
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 42, 92)
    });
  }

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      landmarkerRef.current?.close?.();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <StageShell eyebrow="Идея 3" title="MediaPipe Hands ойыны">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          ref={areaRef}
          onPointerMove={handlePointerMove}
          className="panel relative min-h-[520px] overflow-hidden rounded-3xl sm:min-h-[600px] lg:min-h-[620px]"
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full scale-x-[-1] object-cover opacity-28"
            playsInline
            muted
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:42px_42px]" />

          {objects.map((object) => (
            <div
              key={object.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-red-300/45 bg-red-400/20 px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-red-50 shadow-danger"
              style={{ left: `${object.x}%`, top: `${object.y}%` }}
            >
              {object.label}
            </div>
          ))}

          <div
            className="absolute h-14 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/70 bg-cyan-300/20 shadow-cyan transition-[left,top] duration-75 sm:h-16 sm:w-36"
            style={{ left: `${shield.x}%`, top: `${shield.y}%` }}
          >
            <div className="absolute inset-2 rounded-full border border-white/20" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-[0.18em] text-cyan-50">
              shield
            </span>
          </div>

          {!started ? (
            <div className="absolute inset-0 grid place-items-center bg-black/60 p-6">
              <button
                type="button"
                onClick={startCamera}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-cyan-300/45 bg-cyan-300/15 px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-cyan-50 shadow-cyan transition hover:border-cyan-100 disabled:cursor-wait disabled:opacity-55 sm:w-auto sm:tracking-[0.18em]"
              >
                <Camera className="h-5 w-5" aria-hidden="true" />
                Камераны қосу
              </button>
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <div className="panel rounded-3xl p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200/70">
              Сенсорный қолмен
            </p>
            <h2 className="mt-4 text-3xl font-black leading-none tracking-normal text-white sm:text-4xl">
              Shield қол бағытымен қозғалады
            </h2>
            <p className="mt-5 text-base leading-7 text-white/60">{status}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startCamera}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/35 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100 disabled:opacity-55"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                MediaPipe
              </button>
              <button
                type="button"
                onClick={startFallback}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
              >
                <MousePointer2 className="h-4 w-4" aria-hidden="true" />
                Touch
              </button>
              <button
                type="button"
                onClick={resetGame}
                className="rounded-xl border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:border-red-100"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <MetricCard label="Score" value={score} tone="lime">
              Сбил объект: +score.
            </MetricCard>
            <MetricCard label="Risk" value={risk} tone="red">
              Пропустил объект: risk++.
            </MetricCard>
          </div>
        </div>
      </div>
    </StageShell>
  );
}
