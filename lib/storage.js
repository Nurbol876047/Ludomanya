"use client";

import { useCallback, useEffect, useState } from "react";

export const STORAGE_KEY = "sanaly-bet-progress-v1";

export const defaultSanalyData = {
  timeLoss: {
    hoursPerDay: 2,
    annualHours: 730
  },
  lossTimer: {
    bet: 1000,
    frequency: 4,
    initialBalance: 100000,
    balance: 100000,
    simulatedLoss: 0
  },
  cycle: {
    count: 0
  },
  probability: {
    probability: 42,
    win: 1200,
    loss: 1000,
    expectedValue: -76,
    expectedLoss: 76
  },
  monteCarlo: {
    finalBalance: 0,
    minBalance: 0,
    lossRatio: 0,
    runs: 0
  },
  illusion: {
    completed: false,
    finalBalance: -3800
  },
  particles: {
    impulse: 0
  },
  gesture: {
    score: 0,
    risk: 0
  },
  spiderMind: {
    focus: 0
  },
  updatedAt: null
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function deepMerge(base, patch) {
  const output = clone(base);

  Object.entries(patch || {}).forEach(([key, value]) => {
    if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = deepMerge(output[key], value);
      return;
    }

    output[key] = value;
  });

  return output;
}

export function readSanalyData() {
  if (typeof window === "undefined") {
    return clone(defaultSanalyData);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return clone(defaultSanalyData);
    }

    return deepMerge(defaultSanalyData, JSON.parse(raw));
  } catch {
    return clone(defaultSanalyData);
  }
}

export function saveSanalyData(patch) {
  if (typeof window === "undefined") {
    return clone(defaultSanalyData);
  }

  const next = deepMerge(readSanalyData(), {
    ...patch,
    updatedAt: new Date().toISOString()
  });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("sanaly-data-change", { detail: next }));

  return next;
}

export function resetSanalyData() {
  if (typeof window === "undefined") {
    return clone(defaultSanalyData);
  }

  const next = clone(defaultSanalyData);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("sanaly-data-change", { detail: next }));
  return next;
}

export function useSanalyData() {
  const [data, setData] = useState(defaultSanalyData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(readSanalyData());
    setHydrated(true);

    const handleChange = (event) => {
      setData(event.detail || readSanalyData());
      setHydrated(true);
    };

    window.addEventListener("sanaly-data-change", handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener("sanaly-data-change", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const updateData = useCallback((patch) => {
    setData(saveSanalyData(patch));
  }, []);

  const resetData = useCallback(() => {
    setData(resetSanalyData());
  }, []);

  return { data, updateData, resetData, hydrated };
}

export function computeRiskScore(data) {
  const annualDays = (data.timeLoss.annualHours || 0) / 24;
  const lossLoad = Math.min(1, (data.lossTimer.simulatedLoss || 0) / 180000);
  const timeLoad = Math.min(1, annualDays / 120);
  const probabilityLoad = Math.min(1, (data.probability.expectedLoss || 0) / 1200);
  const monteLoad = Math.min(1, Math.max(0, data.monteCarlo.lossRatio || 0));
  const impulseLoad = Math.min(1, (data.particles.impulse || 0) / 100);
  const gestureLoad = Math.min(1, (data.gesture.risk || 0) / 16);
  const cycleLoad = Math.min(1, (data.cycle.count || 0) / 6);
  const spiderLoad = Math.min(1, (data.spiderMind.focus || 0) / 90);

  return Math.round(
    (timeLoad * 0.18 +
      lossLoad * 0.2 +
      probabilityLoad * 0.16 +
      monteLoad * 0.12 +
      impulseLoad * 0.1 +
      gestureLoad * 0.1 +
      cycleLoad * 0.08 +
      spiderLoad * 0.06) *
      100
  );
}
