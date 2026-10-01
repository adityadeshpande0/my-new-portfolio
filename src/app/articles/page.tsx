import type { Metadata } from "next";
import { ArticlesIndexView } from "@/components/articles/ArticlesIndexView";
import { JsonLd } from "@/components/seo/JsonLd";
import { articlesPageHref, getAllArticles, getAllTags, paginate } from "@/lib/articles";
import { blogJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { articlesDescription, articlesTitle, rssAlternate } from "@/lib/site";

export const metadata: Metadata = {
  title: articlesTitle,
  description: articlesDescription,
  alternates: { canonical: "/articles", ...rssAlternate },
  openGraph: {
    type: "website",
    url: "/articles",
    title: `${articlesTitle} — Aditya Deshpande`,
    description: articlesDescription,
  },
};

export default async function ArticlesPage() {
  const [articles, tags] = await Promise.all([getAllArticles(), getAllTags()]);
  const { items, totalPages } = paginate(articles, 1);
  return (
    <>
      <JsonLd data={blogJsonLd(articles)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: articlesTitle, path: "/articles" },
        ])}
      />
      <ArticlesIndexView
        label="Articles"
        title={articlesTitle}
        description={articlesDescription}
        articles={items}
        tags={tags}
        page={1}
        totalPages={totalPages}
        hrefFor={articlesPageHref}
      />
    </>
  );
}
