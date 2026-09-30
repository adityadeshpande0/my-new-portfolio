import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Parallax } from "@/components/motion/Parallax";
import { RevealText } from "@/components/motion/RevealText";
import { Arc } from "@/components/ui/Arc";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { CtaGroup } from "@/components/ui/CtaGroup";
import { PillButton } from "@/components/ui/PillButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SocialPill } from "@/components/ui/SocialPill";
import { Tag } from "@/components/ui/Tag";
import { socials } from "@/content/profile";

export const metadata: Metadata = { title: "UI kit", robots: { index: false, follow: false } };

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-10">
      <p className="type-label mb-6 text-muted">{title}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  );
}

export default function UiKitPage() {
  return (
    <Container className="relative overflow-hidden pt-32 pb-24">
      <Arc size={600} className="-top-40 -right-60" />
      <SectionLabel>UI kit</SectionLabel>
      <RevealText as="h1" text="Component library" className="type-h2 mt-4 mb-12 block" immediate />

      <Row title="PillButton">
        <PillButton>Solid pill</PillButton>
        <PillButton variant="ghost">Ghost pill</PillButton>
        <PillButton disabled>Disabled</PillButton>
      </Row>
      <Row title="ArrowButton">
        <ArrowButton href="#" label="Next" />
        <ArrowButton href="#" label="Open" direction="up-right" variant="ghost" />
        <ArrowButton href="#" label="Open" direction="up-right" variant="accent" />
      </Row>
      <Row title="CtaGroup (magnetic)">
        <CtaGroup label="View Work" href="/#work" />
      </Row>
      <Row title="SocialPill">
        {socials.map((s) => (
          <SocialPill key={s.label} link={s} />
        ))}
      </Row>
      <Row title="Tag">
        {["React", "TypeScript", "ASP.NET Core", "Nx"].map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </Row>
      <Row title="SectionLabel">
        <SectionLabel>About me</SectionLabel>
        <SectionLabel index={2}>Work</SectionLabel>
      </Row>
      <Row title="Counter">
        <Counter value={40} suffix="%" className="type-display text-6xl" />
      </Row>
      <Row title="Magnetic">
        <Magnetic strength={14}>
          <span className="type-label rounded-pill border border-line-strong px-5 py-3">Hover me</span>
        </Magnetic>
      </Row>
      <section className="border-t border-line py-10">
        <p className="type-label mb-6 text-muted">Card</p>
        <div className="grid gap-4 md:grid-cols-3">
          <Card interactive>
            <h3 className="text-xl font-medium">Default</h3>
            <p className="mt-2 text-muted">Elevated surface.</p>
          </Card>
          <Card variant="inverse" interactive>
            <h3 className="text-xl font-medium">Inverse</h3>
            <p className="mt-2 text-inverse-muted">Hero card.</p>
          </Card>
          <Card variant="outline" interactive>
            <h3 className="text-xl font-medium">Outline</h3>
            <p className="mt-2 text-muted">Quiet container.</p>
          </Card>
        </div>
      </section>
      <section className="border-t border-line py-10">
        <p className="type-label mb-6 text-muted">Parallax</p>
        <Parallax>
          <Card className="max-w-sm">Drifts ±40px while scrolling.</Card>
        </Parallax>
      </section>
    </Container>
  );
}
