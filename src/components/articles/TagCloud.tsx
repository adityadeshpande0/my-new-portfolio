import Link from "next/link";
import type { Tag } from "@/lib/articles";
import { cn } from "@/lib/utils";

export interface TagCloudProps {
  tags: Tag[];
  /** Slug of the tag being viewed, if any. */
  active?: string;
}

export function TagCloud({ tags, active }: TagCloudProps) {
  if (tags.length === 0) return null;
  const pill =
    "type-label inline-flex h-9 shrink-0 items-center gap-2 rounded-pill border px-4 whitespace-nowrap transition-colors";
  return (
    <nav
      aria-label="Topics"
      className="no-scrollbar -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:px-0"
    >
      <ul className="flex gap-1.5 sm:flex-wrap">
        <li>
          <Link
            href="/articles"
            aria-current={!active ? "page" : undefined}
            className={cn(
              pill,
              !active ? "border-transparent bg-bg-inverse text-text-inverse" : "border-line text-muted hover:text-text",
            )}
          >
            All
          </Link>
        </li>
        {tags.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/articles/tags/${t.slug}`}
              aria-current={active === t.slug ? "page" : undefined}
              className={cn(
                pill,
                active === t.slug
                  ? "border-transparent bg-bg-inverse text-text-inverse"
                  : "border-line text-muted hover:border-line-strong hover:text-text",
              )}
            >
              {t.name}
              <span className="text-[11px] opacity-60">{t.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
