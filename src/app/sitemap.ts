import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { ARTICLES_PER_PAGE, getAllArticles, getAllTags } from "@/lib/articles";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, tags] = await Promise.all([getAllArticles(), getAllTags()]);
  const latest = articles[0] ? new Date(`${articles[0].updated ?? articles[0].date}T00:00:00Z`) : undefined;
  const archivePages = Math.ceil(articles.length / ARTICLES_PER_PAGE);

  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1, lastModified: latest },
    { url: `${siteUrl}/articles`, changeFrequency: "weekly", priority: 0.9, lastModified: latest },
    ...Array.from({ length: Math.max(0, archivePages - 1) }, (_, i) => ({
      url: `${siteUrl}/articles/page/${i + 2}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...articles.map((a) => ({
      url: `${siteUrl}/articles/${a.slug}`,
      lastModified: new Date(`${a.updated ?? a.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...tags.map((t) => ({
      url: `${siteUrl}/articles/tags/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
