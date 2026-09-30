import { ArrowUpRight, Award as AwardIcon, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { awards, certifications } from "@/content/recognition";
import { SectionHeading } from "./SectionHeading";

export function Recognition() {
  return (
    <section id="recognition" aria-labelledby="recognition-title" className="section">
      <Container>
        <SectionHeading id="recognition" index={5} label="Recognition" title="Certified & recognised." />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {certifications.map((c, i) => (
              <li key={c.credentialId}>
                <Reveal delay={i * 0.08} className="h-full">
                  <Card interactive className="group flex h-full flex-col gap-10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="type-label text-muted">{c.issuer}</p>
                        <h3 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">{c.title}</h3>
                      </div>
                      <span
                        aria-hidden
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-accent/40 text-accent"
                      >
                        <BadgeCheck size={18} strokeWidth={1.75} />
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <p className="type-label text-[12px] break-all text-muted">
                        ID <span className="text-text">{c.credentialId}</span>
                      </p>
                      <a
                        href={c.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="type-label inline-flex shrink-0 items-center gap-1 rounded-pill border border-line-strong px-3 py-1.5 transition-colors hover:border-accent hover:text-accent"
                        aria-label={`Verify ${c.title} credential`}
                      >
                        Verify <ArrowUpRight aria-hidden size={14} />
                      </a>
                    </div>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ul>

          <ol className="flex flex-col border-t border-line">
            {awards.map((a, i) => (
              <li key={a.title} className="border-b border-line">
                <Reveal delay={i * 0.06} y={16}>
                  <div className="group grid grid-cols-[auto_minmax(0,1fr)] gap-5 py-6 sm:py-7">
                    <span className="type-label pt-1 text-muted transition-colors group-hover:text-accent">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-medium tracking-tight">
                        {a.title}
                        <AwardIcon
                          aria-hidden
                          size={16}
                          className="text-accent opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </h3>
                      <p className="mt-1 text-[15px] text-muted">{a.detail}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
