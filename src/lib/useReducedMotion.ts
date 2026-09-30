"use client";

import { useReducedMotion as useFmReducedMotion } from "framer-motion";

/** True when the user asked the OS for reduced motion. */
export function useReducedMotion(): boolean {
  return useFmReducedMotion() ?? false;
}
