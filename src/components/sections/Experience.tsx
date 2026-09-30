"use client";

import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Emphasis } from "@/components/ui/Emphasis";
import { experience, experienceSummary } from "@/content/experience";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="work" aria-labelledby="work-title" className="section overflow-x-clip">
      <Container>
        <SectionHeading id="work" index={2} label="Work" title="Where I've shipped." />

        <LayoutGroup>
          <ul className="flex flex-col gap-2">
            {experience.map((job, i) => {
              const open = openIndex === i;
              const inverse = !!job.current;
              const panelId = `job-panel-${i}`;
              return (
                <m.li key={job.company} layout transition={{ duration: 0.6, ease: EASE_OUT }}>
                  <Reveal x={i % 2 === 0 ? -32 : 32} y={0} delay={i * 0.06}>
                    <div
                      className={cn(
                        "overflow-hidden rounded-[22px] border transition-colors duration-500",
                        inverse
                          ? "border-transparent bg-bg-inverse text-text-inverse"
                          : "border-line bg-bg-elevated/40 hover:border-line-strong hover:bg-bg-elevated",
                      )}
                    >
                      <h3>
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-controls={panelId}
                          onClick={() => setOpenIndex(open ? null : i)}
                          className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 text-left sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:px-8 sm:py-6"
                        >
                          <span className={cn("type-label", inverse ? "text-inverse-muted" : "text-muted")}>
                            <span className="block">
                              {job.start} — {job.end}
                            </span>
                            <span className="mt-1 hidden sm:block">{job.duration}</span>
                          </span>
                          <span className="col-start-1 row-start-2 sm:col-start-2 sm:row-start-1">
                            <span className="block text-xl font-medium tracking-tight sm:text-2xl">
                              {job.company}
                              <span className={cn("ml-2 text-sm", inverse ? "text-inverse-muted" : "text-muted")}>
                                {job.location}
                              </span>
                            </span>
                            <span
                              className={cn("type-label mt-1 block", inverse ? "text-inverse-muted" : "text-muted")}
                            >
                              {job.role} <span aria-hidden>|</span> {job.stack.slice(0, 3).join(" · ")}
                            </span>
                          </span>
                          <span
                            aria-hidden
                            className={cn(
                              "row-span-2 grid h-10 w-10 place-items-center rounded-full border transition-[transform,background-color] duration-500 ease-out-expo sm:row-span-1",
                              inverse ? "border-text-inverse/20" : "border-line-strong group-hover:border-accent",
                              open && "rotate-45",
                            )}
                          >
                            <Plus size={16} strokeWidth={1.75} />
                          </span>
                        </button>
                      </h3>

                      <AnimatePresence initial={false}>
                        {open && (
                          <m.div
                            id={panelId}
                            key="panel"
                            layout
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.5, ease: EASE_OUT }}
                            className="px-5 pb-6 sm:grid sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:gap-4 sm:px-8 sm:pb-8"
                          >
                            <div className="hidden sm:block" />
                            <div>
                              <ul className="flex flex-col gap-2.5">
                                {job.highlights.map((h) => (
                                  <li
                                    key={h}
                                    className={cn(
                                      "relative pl-5 text-[15px] leading-relaxed",
                                      inverse ? "text-inverse-muted" : "text-muted",
                                    )}
                                  >
                                    <span
                                      aria-hidden
                                      className={cn(
                                        "absolute top-[0.7em] left-0 h-1 w-2.5 rounded-full",
                                        inverse ? "bg-text-inverse/40" : "bg-accent/70",
                                      )}
                                    />
                                    {h}
                                  </li>
                                ))}
                              </ul>
                              <p className={cn("type-label mt-5", inverse ? "text-inverse-muted" : "text-muted")}>
                                {job.stack.join(" / ")}
                              </p>
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                </m.li>
              );
            })}
          </ul>
          <m.p layout className="type-label mt-8 text-right text-muted">
            <Emphasis text={experienceSummary} />
          </m.p>
        </LayoutGroup>
      </Container>
    </section>
  );
}
