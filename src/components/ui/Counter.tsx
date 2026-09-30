"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE_OUT } from "@/lib/motion";

export interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Counts up from zero the first time it enters the viewport. */
export function Counter({ value, suffix = "", duration = 1.6, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  // Once hydrated, park at zero until the count-up runs (SSR keeps the real value).
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top > window.innerHeight) el.textContent = `0${suffix}`;
  }, [suffix]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration]);

  // Server-render the final value so no-JS and crawlers see real numbers.
  return (
    <span ref={ref} className={className}>
      {`${value}${suffix}`}
    </span>
  );
}
