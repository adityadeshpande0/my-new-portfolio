"use client";

import dynamic from "next/dynamic";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { CanvasGate } from "@/components/three/CanvasGate";
import { Arc } from "@/components/ui/Arc";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { profile } from "@/content/profile";
import { ContactForm } from "./ContactForm";

const ParticleMonogram = dynamic(() => import("@/components/three/ParticleMonogram"), { ssr: false });

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section overflow-hidden">
      <Arc size={980} className="top-[4%] -right-[360px] hidden lg:block" />
      <Arc size={640} className="top-[18%] -right-[180px] hidden lg:block" sweep={0.3} rotate={150} accent />
      <Container className="relative">
        <SectionLabel index={7}>Contacts</SectionLabel>
        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <RevealText
              as="h2"
              id="contact-title"
              text="Let's build something."
              className="type-display text-[clamp(40px,5.4vw,80px)]"
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-[32rem] text-lg text-muted">
                Open to <em>full-stack</em> and <em>frontend</em> roles, and to interesting problems. Drop a note, or
                write to{" "}
                <a
                  href={`mailto:${profile.email}`}
                  className="[overflow-wrap:anywhere] text-text underline decoration-accent/60 underline-offset-4 hover:text-accent"
                >
                  {profile.email}
                </a>
                .
              </p>
            </Reveal>
            <Reveal delay={0.25} className="mt-10">
              <ContactForm />
            </Reveal>
          </div>
          <div className="relative hidden aspect-square w-full self-center lg:block">
            <CanvasGate interactive fallback={<MonogramFallback />}>
              {({ active }) => <ParticleMonogram text={profile.initials} active={active} />}
            </CanvasGate>
          </div>
        </div>
      </Container>
    </section>
  );
}

function MonogramFallback() {
  return (
    <div className="glow-fallback absolute inset-0 grid place-items-center rounded-card">
      <span className="type-display text-[160px] text-accent/80">{profile.initials}</span>
    </div>
  );
}
