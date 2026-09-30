import type { Transition, Variants } from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const DURATION = 0.8;
export const STAGGER = 0.06;

export const SPRING_UI = { stiffness: 120, damping: 20, mass: 0.6 } as const;
export const SPRING_SCROLL = { stiffness: 60, damping: 22, mass: 0.8, restDelta: 0.0005 } as const;

export const baseTransition: Transition = { duration: DURATION, ease: EASE_OUT };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: baseTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: baseTransition },
};

export const stagger = (delayChildren = 0, staggerChildren = STAGGER): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

export const maskReveal: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: DURATION, ease: EASE_OUT } },
};

export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Delay (s) after which hero content starts, allowing the preloader to wipe. */
export const INTRO_DELAY = 0.15;
