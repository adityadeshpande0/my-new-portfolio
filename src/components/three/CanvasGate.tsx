"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useDeviceTier, type DeviceTier } from "@/lib/useDeviceTier";
import { cn } from "@/lib/utils";

export interface CanvasGateProps {
  /** Render prop receives the device tier and whether the canvas is on screen. */
  children: (ctx: { tier: Exclude<DeviceTier, "none">; active: boolean }) => ReactNode;
  fallback?: ReactNode;
  className?: string;
  /** Mount on mobile ("low" tier) too. Only the hero should set this. */
  allowMobile?: boolean;
  interactive?: boolean;
}

const DefaultFallback = () => <div className="glow-fallback absolute inset-0" />;

/**
 * Decides whether a 3D scene should mount at all, shows a static fallback
 * otherwise, and pauses rendering while the canvas is off-screen.
 */
export function CanvasGate({
  children,
  fallback,
  className,
  allowMobile = false,
  interactive = false,
}: CanvasGateProps) {
  const { tier } = useDeviceTier();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const sceneTier = tier === "none" ? null : tier;
  const enabled = sceneTier === "high" || (sceneTier === "low" && allowMobile);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  const fb = fallback ?? <DefaultFallback />;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("absolute inset-0", interactive ? "pointer-events-auto" : "pointer-events-none", className)}
    >
      {enabled && sceneTier ? <Suspense fallback={fb}>{children({ tier: sceneTier, active })}</Suspense> : fb}
    </div>
  );
}
