// Server-only: reads the filesystem at build time.
import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import { cache } from "react";
import { z } from "zod";

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles");
export const ARTICLES_PER_PAGE = 10;
const WORDS_PER_MINUTE = 225;

/** Shape of the `export const metadata = { … }` block at the top of every article. */
const articleMetaSchema = z.object({
  title: z.string().min(8).max(110),
  /** 50–160 chars: used as the meta description and in cards, RSS and social previews. */
  description: z.string().min(50).max(160),
  /** Publish date, YYYY-MM-DD. */
  date: z.iso.date(),
  /** Last meaningful update, YYYY-MM-DD (optional). */
  updated: z.iso.date().optional(),
  tags: z.array(z.string().min(1)).min(1).max(6),
  /** Drafts render in `next dev` only and are excluded from builds, feeds and the sitemap. */
  draft: z.boolean().optional().default(false),
});

export type ArticleMeta = z.infer<typeof articleMetaSchema>;

export interface Article extends ArticleMeta {
  slug: string;
  readingMinutes: number;
  wordCount: number;
  /** Second-level headings, for the table of contents. */
  headings: Array<{ id: string; text: string }>;
}

export interface Tag {
  name: string;
  slug: string;
  count: number;
}

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const showDrafts = () => process.env.NODE_ENV === "development" || process.env.SHOW_DRAFTS === "true";

/** Strips code fences, JSX/ESM lines and markup so word counts reflect prose. */
function proseOf(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^(import|export)\s[\s\S]*?(?:;\s*$|^\}\s*;?\s*$)/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`[\]()-]/g, " ");
}

function headingsOf(source: string): Article["headings"] {
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");
  return [...withoutCode.matchAll(/^##\s+(.+?)\s*#*\s*$/gm)].map((m) => {
    const text = m[1].replace(/[*_`]/g, "").trim();
    return { id: slugify(text), text };
  });
}

async function loadArticle(slug: string): Promise<Article> {
  const mod = (await import(`@/content/articles/${slug}.mdx`)) as { metadata?: unknown };
  const parsed = articleMetaSchema.safeParse(mod.metadata);
  if (!parsed.success) {
    throw new Error(`Invalid metadata in src/content/articles/${slug}.mdx:\n${z.prettifyError(parsed.error)}`);
  }
  const source = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.mdx`), "utf8");
  const wordCount = proseOf(source).split(/\s+/).filter(Boolean).length;
  return {
    ...parsed.data,
    slug,
    wordCount,
    readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
    headings: headingsOf(source),
  };
}

/** All publishable articles, newest first. Files starting with `_` (templates) are ignored. */
export const getAllArticles = cache(async (): Promise<Article[]> => {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const slugs = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(/\.mdx$/, ""));
  for (const slug of slugs) {
    if (slug !== slugify(slug)) throw new Error(`Article file name "${slug}.mdx" must be lowercase-kebab-case.`);
  }
  const articles = await Promise.all(slugs.map(loadArticle));
  return articles
    .filter((a) => showDrafts() || !a.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
});

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await getAllArticles()).find((a) => a.slug === slug);
}

export async function getArticleBody(slug: string): Promise<ComponentType<{ components?: object }>> {
  const mod = (await import(`@/content/articles/${slug}.mdx`)) as {
    default: ComponentType<{ components?: object }>;
  };
  return mod.default;
}

export async function getAllTags(): Promise<Tag[]> {
  const counts = new Map<string, Tag>();
  for (const article of await getAllArticles()) {
    for (const name of article.tags) {
      const slug = slugify(name);
      const tag = counts.get(slug) ?? { name, slug, count: 0 };
      tag.count += 1;
      counts.set(slug, tag);
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getArticlesByTag(tagSlug: string): Promise<Article[]> {
  return (await getAllArticles()).filter((a) => a.tags.some((t) => slugify(t) === tagSlug));
}

/** Up to `limit` other articles sharing the most tags, then newest. */
export async function getRelatedArticles(article: Article, limit = 2): Promise<Article[]> {
  const mine = new Set(article.tags.map(slugify));
  return (await getAllArticles())
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({ a, score: a.tags.filter((t) => mine.has(slugify(t))).length }))
    .filter(({ score }) => score > 0)
    .sort((x, y) => y.score - x.score || y.a.date.localeCompare(x.a.date))
    .slice(0, limit)
    .map(({ a }) => a);
}

export function paginate<T>(items: T[], page: number, perPage = ARTICLES_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  return { items: items.slice((page - 1) * perPage, page * perPage), page, totalPages };
}

/** Stable, timezone-proof display date ("5 Oct 2026"). */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

export const toIsoDateTime = (date: string) => `${date}T00:00:00.000Z`;

export const articlesPageHref = (page: number) => (page === 1 ? "/articles" : `/articles/page/${page}`);
