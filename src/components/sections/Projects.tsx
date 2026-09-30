"use client";

import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Container } from "@/components/ui/Container";
import { Emphasis } from "@/components/ui/Emphasis";
import { GitHubIcon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/Tag";
import { projectFilters, projects } from "@/content/projects";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ProjectVisual } from "./ProjectVisual";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const visible = projects.filter((p) => filter === "All" || p.focus.includes(filter));

  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <Container>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="projects" index={4} label="Projects" title="Selected work." className="lg:mb-16" />
          <LayoutGroup id="project-filters">
            <div
              role="group"
              aria-label="Filter projects"
              className="no-scrollbar -mx-[var(--gutter)] mb-12 flex gap-1.5 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:mb-16 lg:flex-wrap lg:overflow-visible lg:px-0"
            >
              {projectFilters.map((f) => {
                const selected = f === filter;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "type-label relative h-9 shrink-0 rounded-pill px-4 whitespace-nowrap transition-colors duration-300",
                      selected ? "text-text-inverse" : "text-muted hover:text-text",
                    )}
                  >
                    {selected && (
                      <m.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-pill bg-bg-inverse"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{f}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <m.ul layout className="grid gap-x-16 gap-y-20 sm:gap-y-24 lg:grid-cols-2 lg:gap-y-28">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <m.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className={cn(
                  "w-full lg:max-w-none md:max-w-[40rem]",
                  i % 2 === 1 && "lg:ml-0 md:ml-auto",
                  i % 2 === 1 && filter === "All" && "lg:mt-28",
                )}
              >
                <Reveal>
                  <article className="group relative">
                    <div className="relative">
                      <m.div layoutId={`project-visual-${p.slug}`}>
                        <ProjectVisual motif={p.motif} />
                      </m.div>
                      <Magnetic className="absolute top-12 left-5 sm:left-6">
                        <ArrowButton
                          href={`/projects/${p.slug}`}
                          label={p.title}
                          direction="up-right"
                          variant="accent"
                          decorative
                        />
                      </Magnetic>
                    </div>

                    <div className="mt-12 flex items-baseline justify-between gap-4">
                      <h3 className="text-2xl font-medium tracking-tight sm:text-[28px]">
                        <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
                          {p.title}
                        </Link>
                      </h3>
                      <span className="type-label text-muted">{p.year}</span>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
                      {p.tags.map((t) => (
                        <li key={t}>
                          <Tag>{t}</Tag>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 max-w-[34rem] leading-relaxed text-muted">
                      <Emphasis text={p.summary} />
                    </p>
                    <div className="relative z-10 mt-5 flex items-center gap-4">
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted transition-colors hover:text-accent"
                          aria-label={`${p.title} on GitHub`}
                        >
                          <GitHubIcon width={18} height={18} />
                        </a>
                      )}
                      <Link
                        href={`/projects/${p.slug}`}
                        className="type-label inline-flex items-center gap-1 text-text underline-offset-4 hover:text-accent hover:underline"
                      >
                        Case study <span aria-hidden>↗</span>
                      </Link>
                    </div>
                  </article>
                </Reveal>
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      </Container>
    </section>
  );
}
