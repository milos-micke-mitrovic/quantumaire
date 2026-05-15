"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Thin progress bar pinned to the top of the viewport that fills as the
 * user scrolls. Costs almost nothing — one transform per frame.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, opacity, transformOrigin: "0% 50%" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-aurora-gradient"
    />
  );
}
