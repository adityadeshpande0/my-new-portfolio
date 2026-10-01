import { profile } from "@/content/profile";
import { toIsoDateTime, type Article } from "@/lib/articles";
import { articlesDescription, articlesTitle, personId, siteUrl } from "@/lib/site";

const author = { "@type": "Person", "@id": personId, name: profile.name, url: siteUrl };

export function articleJsonLd(article: Article) {
  const url = `${siteUrl}/articles/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: article.title,
    description: article.description,
    image: `${url}/opengraph-image`,
    datePublished: toIsoDateTime(article.date),
    dateModified: toIsoDateTime(article.updated ?? article.date),
    author,
    publisher: author,
    keywords: article.tags.join(", "),
    articleSection: article.tags[0],
    wordCount: article.wordCount,
    timeRequired: `PT${article.readingMinutes}M`,
    inLanguage: "en",
    isPartOf: { "@type": "Blog", "@id": `${siteUrl}/articles#blog` },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function blogJsonLd(articles: Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}/articles#blog`,
    url: `${siteUrl}/articles`,
    name: `${articlesTitle} — ${profile.shortName} Deshpande`,
    description: articlesDescription,
    author,
    publisher: author,
    inLanguage: "en",
    blogPost: articles.slice(0, 20).map((a) => ({
      "@type": "BlogPosting",
      "@id": `${siteUrl}/articles/${a.slug}#article`,
      headline: a.title,
      url: `${siteUrl}/articles/${a.slug}`,
      datePublished: toIsoDateTime(a.date),
    })),
  };
}
