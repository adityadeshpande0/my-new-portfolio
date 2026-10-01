import { Rss } from "lucide-react";
import { Arc } from "@/components/ui/Arc";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Article, Tag } from "@/lib/articles";
import { ArticleList } from "./ArticleList";
import { Pagination } from "./Pagination";
import { TagCloud } from "./TagCloud";

export interface ArticlesIndexViewProps {
  title: string;
  description: string;
  articles: Article[];
  tags: Tag[];
  activeTag?: string;
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  /** Breadcrumb-style label, e.g. "Articles" or "Articles / React". */
  label: string;
}

export function ArticlesIndexView({
  title,
  description,
  articles,
  tags,
  activeTag,
  page,
  totalPages,
  hrefFor,
  label,
}: ArticlesIndexViewProps) {
  return (
    <div className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      <Arc size={900} className="-top-[420px] -right-[380px] hidden lg:block" />
      <Container>
        <header className="max-w-[46rem]">
          <SectionLabel>{label}</SectionLabel>
          <h1 className="type-display mt-5 text-[clamp(44px,7vw,96px)]">{title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">{description}</p>
          <a
            href="/articles/rss.xml"
            className="type-label mt-6 inline-flex items-center gap-2 text-muted transition-colors hover:text-accent"
          >
            <Rss size={14} aria-hidden /> RSS feed
          </a>
        </header>

        <div className="mt-12">
          <TagCloud tags={tags} active={activeTag} />
        </div>

        <div className="mt-10">
          {articles.length > 0 ? (
            <ArticleList articles={articles} />
          ) : (
            <p className="rounded-card border border-line p-10 text-center text-muted">
              The first article is on its way. Check back soon, or follow the RSS feed.
            </p>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
      </Container>
    </div>
  );
}
