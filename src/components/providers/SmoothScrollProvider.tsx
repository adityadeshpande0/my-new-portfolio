"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Lenis drives the native window scroll, so Framer Motion's `useScroll`
 * keeps working untouched. Disabled entirely under reduced motion.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({
      autoRaf: true,
      anchors: { offset: -64 },
      lerp: 0.1,
      smoothWheel: true,
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- expose the instance once it exists
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
