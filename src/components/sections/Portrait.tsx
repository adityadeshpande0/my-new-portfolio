"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { CanvasGate } from "@/components/three/CanvasGate";
import { profile } from "@/content/profile";

const PortraitShader = dynamic(() => import("@/components/three/PortraitShader"), { ssr: false });

export function Portrait() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card border border-line bg-bg-elevated">
      {/* Static layer: LCP-friendly, and the fallback when WebGL is gated off. */}
      <Image
        src={profile.portrait}
        alt={`Portrait of ${profile.shortName}`}
        fill
        sizes="(min-width: 1024px) 480px, 100vw"
        className="object-cover object-[50%_30%] saturate-[0.9] sepia-[0.25]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_30%,rgba(232,161,92,0.28),transparent_60%)] mix-blend-soft-light"
      />
      <CanvasGate interactive fallback={null}>
        {({ active }) => <PortraitShader src={profile.portrait} active={active} />}
      </CanvasGate>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/70 to-transparent"
      />
      <p className="type-label pointer-events-none absolute bottom-5 left-6 text-text/80">{profile.location}</p>
    </div>
  );
}
