"use client";

import { m, useScroll, useSpring, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useIntro } from "@/components/motion/IntroProvider";
import { CanvasGate } from "@/components/three/CanvasGate";
import { Arc } from "@/components/ui/Arc";
import { Container } from "@/components/ui/Container";
import { CtaGroup } from "@/components/ui/CtaGroup";
import { Emphasis } from "@/components/ui/Emphasis";
import { SocialPill } from "@/components/ui/SocialPill";
import { profile, socials } from "@/content/profile";
import { EASE_OUT, SPRING_SCROLL } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const ConstellationScene = dynamic(() => import("@/components/three/ConstellationScene"), { ssr: false });

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1, ease: EASE_OUT, delay: 0.1 + i * 0.12 } }),
};
const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT, delay: 0.45 + i * 0.08 } }),
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, SPRING_SCROLL);
  const contentY = useTransform(progress, [0, 0.22], [0, -90]);
  const contentOpacity = useTransform(progress, [0, 0.18], [1, 0]);
  const hintOpacity = useTransform(progress, [0, 0.05], [1, 0]);
  const arcRotate = useTransform(progress, [0, 1], [0, 40]);
  const state = done ? "show" : "hidden";

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative h-[210svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <CanvasGate allowMobile>
          {({ tier, active }) => <ConstellationScene progress={progress} visible={done} tier={tier} active={active} />}
        </CanvasGate>

        <m.div aria-hidden className="pointer-events-none absolute inset-0" style={{ rotate: reduced ? 0 : arcRotate }}>
          <Arc size={900} className="-top-[260px] -right-[340px]" />
          <Arc size={560} className="top-[18%] -right-[120px]" sweep={0.4} rotate={200} accent />
        </m.div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent"
        />

        <m.div
          className="relative z-10 flex h-full items-end pb-[max(96px,14svh)]"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <Container>
            <m.p
              className="type-label mb-6 flex items-center gap-3 text-muted"
              variants={fade}
              custom={0}
              initial="hidden"
              animate={state}
            >
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {profile.role}
            </m.p>

            <h1 className="type-display" aria-label={profile.displayName.join(" ")}>
              {profile.displayName.map((word, i) => (
                <span
                  key={word}
                  aria-hidden
                  className={
                    i === 1
                      ? "-mb-[0.16em] block overflow-hidden pb-[0.16em] pl-[10vw] sm:pl-[14vw]"
                      : "-mb-[0.16em] block overflow-hidden pb-[0.16em]"
                  }
                >
                  <m.span className="block" variants={line} custom={i} initial="hidden" animate={state}>
                    {word}
                    {i === 1 && <span className="text-accent">.</span>}
                  </m.span>
                </span>
              ))}
            </h1>

            <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[minmax(0,34rem)_auto] lg:items-end lg:justify-between">
              <m.p
                className="max-w-[34rem] text-[17px] leading-relaxed text-muted sm:text-lg"
                variants={fade}
                custom={1}
                initial="hidden"
                animate={state}
              >
                <Emphasis text={profile.tagline} />
              </m.p>
              <m.div
                className="flex flex-col gap-5 lg:items-end"
                variants={fade}
                custom={2}
                initial="hidden"
                animate={state}
              >
                <CtaGroup label="View Work" href="#work" />
                <ul className="flex flex-wrap gap-2" aria-label="Links">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <SocialPill link={s} />
                    </li>
                  ))}
                </ul>
              </m.div>
            </div>
          </Container>
        </m.div>

        <m.div
          aria-hidden
          className="type-label absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted"
          style={{ opacity: hintOpacity }}
        >
          <span>scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-line-strong">
            <m.span
              className="absolute inset-x-0 top-0 h-1/2 bg-accent"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </m.div>
      </div>
    </section>
  );
}
