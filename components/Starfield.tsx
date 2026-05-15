"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  twinkle: number;
}

/**
 * Single canvas-based starfield. Cheap, GPU-friendly, parallax-aware.
 * One layer, requestAnimationFrame, pauses while the tab is hidden.
 */
export function Starfield({
  density = 0.00006,
  maxStars = 140,
}: {
  density?: number;
  maxStars?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let lastT = performance.now();

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(maxStars, Math.floor(width * height * density));
      stars = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.3 + Math.random() * 0.7,
        r: 0.3 + Math.random() * 1.2,
        twinkle: Math.random() * Math.PI * 2,
      }));
    }

    // Throttle to ~30fps — eye can't tell the difference for a starfield and
    // it halves the GPU load on long-scrolling pages.
    const frameInterval = 1000 / 30;
    let acc = 0;

    function draw(t: number) {
      if (!ctx) return;
      const dt = Math.min(64, t - lastT);
      lastT = t;
      acc += dt;
      if (acc < frameInterval) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      acc = 0;

      ctx.clearRect(0, 0, width, height);

      // No shadowBlur — it's the single biggest cost on canvas. Stars look
      // nearly identical with simple opacity twinkle.
      for (const s of stars) {
        s.twinkle += dt * 0.0018 * s.z;
        s.y += dt * 0.003 * s.z;
        if (s.y > height + 4) {
          s.y = -4;
          s.x = Math.random() * width;
        }

        const alpha = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function start() {
      if (rafRef.current !== null) return;
      lastT = performance.now();
      rafRef.current = requestAnimationFrame(draw);
    }
    function stop() {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, maxStars]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
