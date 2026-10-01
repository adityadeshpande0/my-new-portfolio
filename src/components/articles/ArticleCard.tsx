import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { formatDate, type Article } from "@/lib/articles";
import { cn } from "@/lib/utils";

export interface ArticleCardProps {
  article: Article;
  className?: string;
  /** Heading level for the title, so cards fit the page outline. */
  headingLevel?: "h2" | "h3";
}

/** Card used on the home page and in "related articles". The whole card is clickable. */
export function ArticleCard({ article, className, headingLevel: H = "h3" }: ArticleCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-card border border-line bg-bg-elevated p-6 transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_60px_-30px_rgba(232,161,92,0.35)] sm:p-7",
        className,
      )}
    >
      <p className="type-label flex flex-wrap items-center gap-x-2 text-muted">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span aria-hidden>·</span>
        <span>{article.readingMinutes} min read</span>
      </p>
      <H className="mt-4 text-xl leading-snug font-medium tracking-tight sm:text-[22px]">
        <Link href={`/articles/${article.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {article.title}
        </Link>
      </H>
      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted">{article.description}</p>
      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {article.tags.slice(0, 2).map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
        <span
          aria-hidden
          className="type-label inline-flex h-9 shrink-0 items-center rounded-pill bg-bg-inverse px-4 text-text-inverse italic transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5"
        >
          Read more
        </span>
      </div>
    </article>
  );
}
