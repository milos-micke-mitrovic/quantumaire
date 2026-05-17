"use client";

import { useCallback, useSyncExternalStore } from "react";

export type UnitSystem = "metric" | "imperial";

const STORAGE_KEY = "quantumaire.units";
const EVENT_NAME = "quantumaire:units-changed";
const DEFAULT: UnitSystem = "metric";

function read(): UnitSystem {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "metric" || raw === "imperial") return raw;
  } catch {
    /* ignore — quota / private mode */
  }
  return DEFAULT;
}

function write(value: UnitSystem) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    /* ignore — quota / private mode */
  }
}

function getSnapshot(): UnitSystem {
  return read();
}

function getServerSnapshot(): UnitSystem {
  return DEFAULT;
}

function subscribe(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

/**
 * Reactive hook exposing the user's chosen unit system.
 *
 * SSR-safe: server always sees `metric` (the journey ships sensible defaults
 * for crawlers and first paint), and the actual stored choice swaps in on
 * the client after hydration.
 */
export function useUnits(): {
  units: UnitSystem;
  setUnits: (value: UnitSystem) => void;
  toggleUnits: () => void;
} {
  const units = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setUnits = useCallback((value: UnitSystem) => write(value), []);
  const toggleUnits = useCallback(
    () => write(units === "metric" ? "imperial" : "metric"),
    [units]
  );
  return { units, setUnits, toggleUnits };
}
