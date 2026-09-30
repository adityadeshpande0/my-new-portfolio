"use client";

import dynamic from "next/dynamic";
import { Reveal } from "@/components/motion/Reveal";
import { CanvasGate } from "@/components/three/CanvasGate";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Emphasis } from "@/components/ui/Emphasis";
import { skills, skillsCaption, type SkillGroup } from "@/content/skills";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { SkillHoverProvider, useSkillHover } from "./SkillHover";

const IcosahedronBg = dynamic(() => import("@/components/three/IcosahedronBg"), { ssr: false });

const span: Record<SkillGroup["size"], string> = {
  lg: "col-span-2 lg:row-span-2",
  md: "col-span-2",
  sm: "col-span-2 min-[400px]:col-span-1",
};

function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const { setHovered } = useSkillHover();
  const inverse = !!group.inverse;
  return (
    <li className={span[group.size]}>
      <Reveal delay={index * 0.05} className="h-full">
        <div
          className="h-full"
          onPointerEnter={() => setHovered(group.id)}
          onPointerLeave={() => setHovered(null)}
          onFocus={() => setHovered(group.id)}
          onBlur={() => setHovered(null)}
        >
          <Card
            variant={inverse ? "inverse" : "default"}
            interactive
            className={cn("flex h-full flex-col justify-between gap-6 !p-5 sm:!p-7", group.size === "lg" && "lg:!p-9")}
          >
            <div className="flex items-start justify-between gap-3">
              <h3
                className={cn(
                  "font-medium tracking-tight",
                  group.size === "lg" ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
                )}
              >
                {group.title}
              </h3>
              <span className={cn("type-label text-[11px]", inverse ? "text-inverse-muted" : "text-muted")}>
                {String(group.items.length).padStart(2, "0")}
              </span>
            </div>
            <p
              className={cn(
                "type-label leading-relaxed",
                inverse ? "text-inverse-muted" : "text-muted",
                group.size === "lg" && "text-[14px] sm:text-[15px] lg:text-[17px] lg:leading-[1.7]",
              )}
            >
              {group.items.map((item) => (
                <span
                  key={item}
                  className={cn("transition-colors", inverse ? "hover:text-text-inverse" : "hover:text-text")}
                >
                  {item}
                  {/* Non-breaking space keeps each slash attached to its item. */}
                  <span aria-hidden className={inverse ? "text-inverse-muted/60" : "text-accent/70"}>
                    {"\u00A0/ "}
                  </span>
                </span>
              ))}
            </p>
          </Card>
        </div>
      </Reveal>
    </li>
  );
}

function SkillsBackground() {
  const { hovered } = useSkillHover();
  return (
    <CanvasGate
      fallback={null}
      className="-inset-y-20 [mask-image:radial-gradient(closest-side,black_55%,transparent)]"
    >
      {({ active }) => <IcosahedronBg highlighted={hovered !== null} active={active} />}
    </CanvasGate>
  );
}

export function Skills() {
  return (
    <SkillHoverProvider>
      <section id="stack" aria-labelledby="stack-title" className="section">
        <SkillsBackground />
        <Container className="relative">
          <SectionHeading id="stack" index={3} label="Stack" title="Tools I reach for." />
          <ul className="grid grid-flow-dense grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {skills.map((g, i) => (
              <SkillCard key={g.id} group={g} index={i} />
            ))}
            <li className="col-span-2 min-[400px]:col-span-1 lg:col-span-3">
              <Reveal delay={0.3} className="h-full">
                <Card variant="outline" className="flex h-full items-end !p-5 sm:!p-7">
                  <p className="max-w-[28rem] text-[15px] leading-relaxed text-muted sm:text-base">
                    <Emphasis text={skillsCaption} />
                  </p>
                </Card>
              </Reveal>
            </li>
          </ul>
        </Container>
      </section>
    </SkillHoverProvider>
  );
}
