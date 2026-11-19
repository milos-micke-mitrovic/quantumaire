"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * Loads framer-motion's DOM animation features once, so components can use
 * the lightweight `m` element (imported as `motion`) instead of the full
 * `motion` bundle. `strict` makes an accidental full `motion` import throw
 * in development rather than silently re-adding the weight.
 * `reducedMotion="user"` honours the OS "reduce motion" setting.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
