"use client";

import { m } from "framer-motion";
import { EASE_OUT, STAGGER, viewportOnce } from "@/lib/motion";

export interface RevealTextProps {
  text: string;
  as?: "div" | "section" | "article" | "li" | "span" | "p" | "h1" | "h2" | "h3" | "aside";
  className?: string;
  delay?: number;
  /** Reveal immediately on mount rather than when scrolled into view. */
  immediate?: boolean;
  id?: string;
}

/** Splits a heading into words, each rising from behind an overflow mask. */
export function RevealText({ text, as: Tag = "span", className, delay = 0, immediate, id }: RevealTextProps) {
  const words = text.split(" ");
  const trigger = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: viewportOnce };

  return (
    <Tag id={id} className={className} aria-label={text}>
      <m.span
        aria-hidden
        className="inline"
        variants={{ hidden: {}, show: { transition: { staggerChildren: STAGGER, delayChildren: delay } } }}
        {...trigger}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom">
            <m.span
              className="inline-block"
              variants={{
                hidden: { y: "110%" },
                show: { y: "0%", transition: { duration: 0.9, ease: EASE_OUT } },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </m.span>
          </span>
        ))}
      </m.span>
    </Tag>
  );
}
