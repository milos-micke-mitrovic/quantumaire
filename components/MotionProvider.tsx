"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Loads framer-motion's DOM animation features once, so components can use
 * the lightweight `m` element (imported as `motion`) instead of the full
 * `motion` bundle. `strict` makes an accidental full `motion` import throw
 * in development rather than silently re-adding the weight.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
