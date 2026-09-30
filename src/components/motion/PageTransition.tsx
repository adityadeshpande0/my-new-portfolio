"use client";

import { m } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { EASE_OUT } from "@/lib/motion";

let hasMounted = false;

/**
 * Amber-edged curtain that wipes off the screen when a route mounts.
 * Skipped on the very first load, where the preloader owns the entrance.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const [curtain] = useState(() => hasMounted);

  useEffect(() => {
    hasMounted = true;
  }, []);

  return (
    <>
      {curtain && (
        <m.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[95] bg-bg"
          style={{ boxShadow: "0 2px 0 0 var(--accent), 0 12px 60px 0 var(--accent-soft)" }}
          initial={{ y: "0%" }}
          animate={{ y: "-102%" }}
          transition={{ duration: 0.75, ease: EASE_OUT, delay: 0.05 }}
        />
      )}
      <m.div
        initial={curtain ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 }}
      >
        {children}
      </m.div>
    </>
  );
}
