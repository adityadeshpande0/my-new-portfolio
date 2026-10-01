import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlesIndexView } from "@/components/articles/ArticlesIndexView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllTags, getArticlesByTag } from "@/lib/articles";
import { breadcrumbJsonLd } from "@/lib/seo";
import { articlesTitle, rssAlternate } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.length ? tags.map((t) => ({ tag: t.slug })) : [{ tag: "none" }];
}

async function findTag(slug: string) {
  return (await getAllTags()).find((t) => t.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/articles/tags/[tag]">): Promise<Metadata> {
  const tag = await findTag((await params).tag);
  if (!tag) return {};
  const description = `Articles by Aditya Deshpande about ${tag.name}.`;
  return {
    title: `${tag.name} articles`,
    description,
    alternates: { canonical: `/articles/tags/${tag.slug}`, ...rssAlternate },
    openGraph: { type: "website", url: `/articles/tags/${tag.slug}`, title: `${tag.name} articles`, description },
  };
}

export default async function TagPage({ params }: PageProps<"/articles/tags/[tag]">) {
  const tag = await findTag((await params).tag);
  if (!tag) notFound();
  const [articles, tags] = await Promise.all([getArticlesByTag(tag.slug), getAllTags()]);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: articlesTitle, path: "/articles" },
          { name: tag.name, path: `/articles/tags/${tag.slug}` },
        ])}
      />
      <ArticlesIndexView
        label={`Articles / ${tag.name}`}
        title={tag.name}
        description={`${tag.count} ${tag.count === 1 ? "article" : "articles"} about ${tag.name}.`}
        articles={articles}
        tags={tags}
        activeTag={tag.slug}
        page={1}
        totalPages={1}
        hrefFor={() => `/articles/tags/${tag.slug}`}
      />
    </>
  );
}
