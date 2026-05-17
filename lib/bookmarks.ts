"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "quantumaire.bookmarks";
const EVENT_NAME = "quantumaire:bookmarks-changed";

function readSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((x): x is string => typeof x === "string"));
    }
  } catch {
    /* ignore — bad storage */
  }
  return new Set();
}

function writeSet(set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    /* ignore — quota / private mode */
  }
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
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

/** Reactive hook returning the set of bookmarked stop IDs and toggle/reset. */
export function useBookmarks() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");

  const bookmarks = useMemo<Set<string>>(() => {
    try {
      const parsed = JSON.parse(snapshot);
      if (Array.isArray(parsed)) {
        return new Set(parsed.filter((x): x is string => typeof x === "string"));
      }
    } catch {
      /* fall through to empty set */
    }
    return new Set();
  }, [snapshot]);

  const toggle = useCallback((id: string) => {
    const next = new Set(readSet());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeSet(next);
  }, []);

  const reset = useCallback(() => {
    writeSet(new Set());
  }, []);

  return { bookmarks, toggle, reset };
}
