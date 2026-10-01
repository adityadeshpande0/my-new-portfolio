import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Arc } from "@/components/ui/Arc";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Emphasis } from "@/components/ui/Emphasis";
import { profile } from "@/content/profile";
import { Portrait } from "./Portrait";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section overflow-hidden">
      <Arc size={720} className="top-24 -left-[420px]" />
      <Container>
        <div className="grid gap-12 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-12 lg:gap-20">
          <Parallax
            offset={30}
            className="order-2 mx-auto w-full max-w-[300px] sm:max-w-[340px] md:order-1 md:self-center lg:max-w-[380px]"
          >
            <Reveal>
              <Portrait />
            </Reveal>
          </Parallax>

          <div className="order-1 flex flex-col justify-center md:order-2">
            <SectionHeading id="about" index={1} label="About me" title="Engineer, by way of systems." />
            <Reveal delay={0.1}>
              <p className="max-w-[38rem] text-base leading-relaxed text-muted sm:text-lg">
                <Emphasis text={profile.about} />
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="type-label mt-8 text-muted">
                {profile.education.degree} — {profile.education.school}, {profile.education.year}
              </p>
            </Reveal>
          </div>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-3 sm:mt-24 lg:grid-cols-4 lg:gap-4">
          {profile.stats.map((s, i) => (
            <li key={s.label}>
              <Reveal delay={i * 0.06} className="h-full">
                <Card interactive className="flex h-full flex-col justify-between gap-8 !p-5 sm:!p-7">
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    className="type-display block text-[clamp(40px,6vw,64px)] text-text tabular-nums"
                  />
                  <span className="type-label text-muted">{s.label}</span>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
