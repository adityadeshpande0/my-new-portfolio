"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, summary";

/** Desktop-only amber glow + ring cursor that grows over interactive elements. */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const glowX = useSpring(x, { stiffness: 80, damping: 20, mass: 0.8 });
  const glowY = useSpring(y, { stiffness: 80, damping: 20, mass: 0.8 });
  const ringX = useSpring(x, { stiffness: 500, damping: 35, mass: 0.3 });
  const ringY = useSpring(y, { stiffness: 500, damping: 35, mass: 0.3 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- enable only after capability check
    setEnabled(true);
    document.documentElement.dataset.cursor = "on";

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setHovering(!!target?.closest?.(INTERACTIVE));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => {
      x.set(-400);
      y.set(-400);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      delete document.documentElement.dataset.cursor;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <m.div
        className="absolute top-0 left-0 h-[300px] w-[300px] rounded-full mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, var(--accent-soft) 0%, transparent 65%)",
        }}
      />
      <m.div
        className="absolute top-0 left-0 h-8 w-8 rounded-full border border-accent"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: pressed ? 0.8 : hovering ? 1.8 : 1, opacity: hovering ? 0.9 : 0.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
      <m.div
        className="absolute top-0 left-0 h-1 w-1 rounded-full bg-accent"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hovering ? 0 : 1 }}
      />
    </div>
  );
}
