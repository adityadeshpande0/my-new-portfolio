"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface IntroState {
  done: boolean;
  finish: () => void;
}

const IntroContext = createContext<IntroState>({ done: true, finish: () => {} });

export const useIntro = () => useContext(IntroContext);

export const INTRO_STORAGE_KEY = "ad-intro-seen";

/** Coordinates the preloader with the hero reveal. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => setDone(true), []);
  return <IntroContext.Provider value={{ done, finish }}>{children}</IntroContext.Provider>;
}

/** Runs before first paint: marks repeat visits / reduced motion so CSS hides the preloader. */
export const introBootScript = `try{if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="seen"}}catch(e){}`;
