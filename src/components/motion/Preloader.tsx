"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_OUT } from "@/lib/motion";
import { INTRO_STORAGE_KEY, useIntro } from "./IntroProvider";

// "A" and "D" drawn as single strokes on a 120×80 grid.
const PATH_A = "M8 72 L32 8 L56 72 M17 48 L47 48";
const PATH_D = "M70 8 L70 72 L88 72 C104 72 112 58 112 40 C112 22 104 8 88 8 Z";

export function Preloader() {
  const { finish } = useIntro();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const seen = document.documentElement.dataset.intro === "seen";
    if (seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip the intro on repeat visits
      setVisible(false);
      finish();
      return;
    }
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {}
    const t = window.setTimeout(() => {
      setVisible(false);
      finish();
    }, 1050);
    return () => window.clearTimeout(t);
  }, [finish]);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="preloader"
          className="preloader fixed inset-0 z-[100] grid place-items-center bg-bg"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          aria-hidden
        >
          <svg viewBox="0 0 120 80" className="w-28 text-accent sm:w-36" fill="none">
            {[PATH_A, PATH_D].map((d, i) => (
              <m.path
                key={d}
                d={d}
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.75, delay: i * 0.12, ease: EASE_OUT }}
              />
            ))}
          </svg>
          <m.span
            className="type-label absolute bottom-10 text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            …/loading…
          </m.span>
        </m.div>
      )}
    </AnimatePresence>
  );
}
