"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { CanvasGate } from "@/components/three/CanvasGate";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

const ParticlePortrait = dynamic(() => import("@/components/three/ParticlePortrait"), { ssr: false });

/**
 * The photo rebuilt from warm halftone particles that assemble on view and part around the
 * cursor. The real image stays underneath for LCP, SEO and screen readers, and is what phones,
 * reduced-motion and low-power devices see.
 */
export function Portrait() {
  const [particles, setParticles] = useState(false);
  const onReady = useCallback(() => setParticles(true), []);

  return (
    <figure>
      <div
        className={cn(
          "relative aspect-[3/4] w-full overflow-hidden rounded-card border transition-[background-color,border-color] duration-1000",
          particles ? "border-transparent bg-transparent" : "border-line bg-bg-elevated",
        )}
      >
        <Image
          src={profile.portrait}
          alt={`Portrait of ${profile.shortName}`}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 340px, 300px"
          className={cn(
            "object-cover object-[50%_30%] saturate-[0.9] sepia-[0.25] transition-opacity duration-1000",
            particles && "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_30%,rgba(232,161,92,0.28),transparent_60%)] mix-blend-soft-light transition-opacity duration-1000",
            particles && "opacity-0",
          )}
        />
        <CanvasGate interactive fallback={null}>
          {({ active }) => <ParticlePortrait src={profile.portrait} active={active} onReady={onReady} />}
        </CanvasGate>
      </div>
      <figcaption className="type-label mt-4 flex items-center justify-between text-muted">
        <span>{profile.location}</span>
        <span aria-hidden className={cn("transition-opacity duration-700", particles ? "opacity-100" : "opacity-0")}>
          hover to stir
        </span>
      </figcaption>
    </figure>
  );
}
