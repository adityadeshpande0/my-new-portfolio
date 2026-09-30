"use client";

import { m } from "framer-motion";
import type { Project } from "@/content/projects";
import { ProjectVisual } from "./ProjectVisual";

export interface ProjectHeroProps {
  slug: string;
  motif: Project["motif"];
}

/** Shares a layoutId with the card on the home page so the visual can morph between routes. */
export function ProjectHero({ slug, motif }: ProjectHeroProps) {
  return (
    <m.div layoutId={`project-visual-${slug}`} className="pr-3 pb-6 sm:pr-6">
      <ProjectVisual motif={motif} />
    </m.div>
  );
}
