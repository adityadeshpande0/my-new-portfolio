"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT, viewportOnce } from "@/lib/motion";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
}

/** Fades and lifts a block into place the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 24, x = 0 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={viewportOnce}
      transition={{ duration: DURATION, ease: EASE_OUT, delay }}
    >
      {children}
    </m.div>
  );
}
