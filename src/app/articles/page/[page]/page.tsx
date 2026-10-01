import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticlesIndexView } from "@/components/articles/ArticlesIndexView";
import { ARTICLES_PER_PAGE, articlesPageHref, getAllArticles, getAllTags, paginate } from "@/lib/articles";
import { articlesDescription, articlesTitle, rssAlternate } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const total = Math.ceil((await getAllArticles()).length / ARTICLES_PER_PAGE);
  // Page 1 lives at /articles; at least one entry keeps the route valid while the archive is small.
  return Array.from({ length: Math.max(1, total - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: PageProps<"/articles/page/[page]">): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `${articlesTitle} — page ${page}`,
    description: articlesDescription,
    alternates: { canonical: `/articles/page/${page}`, ...rssAlternate },
  };
}

export default async function ArticlesPaginatedPage({ params }: PageProps<"/articles/page/[page]">) {
  const page = Number((await params).page);
  if (page === 1) permanentRedirect("/articles");
  const [articles, tags] = await Promise.all([getAllArticles(), getAllTags()]);
  const { items, totalPages } = paginate(articles, page);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();
  return (
    <ArticlesIndexView
      label={`Articles / page ${page}`}
      title={articlesTitle}
      description={articlesDescription}
      articles={items}
      tags={tags}
      page={page}
      totalPages={totalPages}
      hrefFor={articlesPageHref}
    />
  );
}
