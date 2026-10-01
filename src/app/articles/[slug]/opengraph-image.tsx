import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { formatDate, getAllArticles, getArticle } from "@/lib/articles";

export const alt = "Article by Aditya Deshpande";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getAllArticles()).map((a) => ({ slug: a.slug }));
}

/** Per-article social preview: title, tags and date on the site's amber-on-black style. */
export default async function ArticleOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug);
  const title = article?.title ?? "Articles";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "radial-gradient(60% 70% at 85% 20%, rgba(232,161,92,0.32), rgba(11,11,12,0) 70%), #0B0B0C",
        color: "#EDEDED",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, color: "#8A8A8F" }}>
        …/<span style={{ color: "#EDEDED" }}>articles</span>…
      </div>
      <div
        style={{
          display: "flex",
          fontSize: title.length > 70 ? 54 : 64,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: -2,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
        <span>{profile.wordmark}</span>
        <span style={{ color: "#E8A15C" }}>
          {article ? `${article.tags.slice(0, 2).join(" · ")}  ·  ${formatDate(article.date)}` : ""}
        </span>
      </div>
    </div>,
    size,
  );
}
