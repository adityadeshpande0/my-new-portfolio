import { ArticleCard } from "@/components/articles/ArticleCard";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { CtaGroup } from "@/components/ui/CtaGroup";
import { getAllArticles } from "@/lib/articles";
import { SectionHeading } from "./SectionHeading";

/** Latest three articles on the home page, linking through to the full archive. */
export async function Articles() {
  const latest = (await getAllArticles()).slice(0, 3);

  return (
    <section id="articles" aria-labelledby="articles-title" className="section">
      <Container>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="articles" index={6} label="Articles" title="Notes from the work." className="lg:mb-16" />
          <div className="mb-12 lg:mb-16">
            <CtaGroup label="All articles" href="/articles" />
          </div>
        </div>

        {latest.length > 0 ? (
          <ul className="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
            {latest.map((article, i) => (
              <li key={article.slug} className={latest.length === 1 ? "lg:col-span-1 md:col-span-2" : undefined}>
                <Reveal delay={i * 0.08} className="h-full">
                  <ArticleCard article={article} />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-card border border-line p-10 text-center text-muted">
            The first article is on its way.
          </p>
        )}
      </Container>
    </section>
  );
}
