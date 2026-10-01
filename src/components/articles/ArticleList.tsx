import Link from "next/link";
import { formatDate, slugify, type Article } from "@/lib/articles";

export interface ArticleListProps {
  articles: Article[];
}

/** Editorial list used on /articles and tag pages: date on the left, title and summary on the right. */
export function ArticleList({ articles }: ArticleListProps) {
  return (
    <ol className="border-t border-line">
      {articles.map((a) => (
        <li key={a.slug} className="border-b border-line">
          <article className="group relative grid gap-3 py-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 sm:py-10">
            <p className="type-label text-muted">
              <time dateTime={a.date}>{formatDate(a.date)}</time>
              <span className="mt-1 block">{a.readingMinutes} min read</span>
            </p>
            <div>
              <h2 className="text-[22px] leading-snug font-medium tracking-tight transition-colors group-hover:text-accent sm:text-[26px]">
                <Link href={`/articles/${a.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {a.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-[40rem] leading-relaxed text-muted">{a.description}</p>
              <ul className="relative z-10 mt-4 flex flex-wrap gap-x-4 gap-y-1" aria-label="Tags">
                {a.tags.map((t) => (
                  <li key={t}>
                    <Link
                      href={`/articles/tags/${slugify(t)}`}
                      className="type-label text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                    >
                      #{t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
