import { profile } from "@/content/profile";
import { getAllArticles, slugify, toIsoDateTime } from "@/lib/articles";
import { articlesDescription, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] ?? c);

/** RSS 2.0 feed of published articles, newest first. */
export async function GET() {
  const articles = await getAllArticles();
  const lastBuild = articles[0] ? toIsoDateTime(articles[0].updated ?? articles[0].date) : new Date(0).toISOString();
  const items = articles
    .map((a) => {
      const url = `${siteUrl}/articles/${a.slug}`;
      return `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(toIsoDateTime(a.date)).toUTCString()}</pubDate>
      <author>${escapeXml(`${profile.email} (${profile.name})`)}</author>
${a.tags.map((t) => `      <category domain="${siteUrl}/articles/tags/${slugify(t)}">${escapeXml(t)}</category>`).join("\n")}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`Articles — ${profile.shortName} Deshpande`)}</title>
    <link>${siteUrl}/articles</link>
    <description>${escapeXml(articlesDescription)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/articles/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
