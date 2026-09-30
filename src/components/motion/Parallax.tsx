"use client";

import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { SPRING_SCROLL } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

export interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Total travel in px across the element's pass through the viewport. */
  offset?: number;
}

export function Parallax({ children, className, offset = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, SPRING_SCROLL);
  const y = useTransform(smooth, [0, 1], [offset, -offset]);

  return (
    <m.div ref={ref} className={className} style={{ y: reduced ? 0 : y }}>
      {children}
    </m.div>
  );
}
