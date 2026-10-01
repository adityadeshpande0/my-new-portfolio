import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** Builds the URL for a page number (page 1 should be the canonical index URL). */
  hrefFor: (page: number) => string;
}

export function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pill =
    "type-label inline-flex h-10 min-w-10 items-center justify-center rounded-pill border px-4 transition-colors";
  return (
    <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          rel="prev"
          className={cn(pill, "border-line-strong hover:border-accent hover:text-accent")}
        >
          ← Newer
        </Link>
      ) : null}
      <ol className="flex flex-wrap gap-2">
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={hrefFor(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                pill,
                p === page
                  ? "border-transparent bg-bg-inverse text-text-inverse"
                  : "border-line text-muted hover:border-line-strong hover:text-text",
              )}
            >
              {p}
            </Link>
          </li>
        ))}
      </ol>
      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          rel="next"
          className={cn(pill, "border-line-strong hover:border-accent hover:text-accent")}
        >
          Older →
        </Link>
      ) : null}
    </nav>
  );
}
