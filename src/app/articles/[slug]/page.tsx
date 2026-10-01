import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { articleComponents } from "@/components/articles/articleComponents";
import { ShareLinks } from "@/components/articles/ShareLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import {
  formatDate,
  getAllArticles,
  getArticle,
  getArticleBody,
  getRelatedArticles,
  slugify,
  toIsoDateTime,
} from "@/lib/articles";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { rssAlternate, siteUrl } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) return {};
  const path = `/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: profile.name, url: siteUrl }],
    alternates: { canonical: path, ...rssAlternate },
    openGraph: {
      type: "article",
      url: path,
      title: article.title,
      description: article.description,
      publishedTime: toIsoDateTime(article.date),
      modifiedTime: toIsoDateTime(article.updated ?? article.date),
      authors: [profile.name],
      tags: article.tags,
      siteName: "Aditya Deshpande",
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description },
  };
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const [all, related, Body] = await Promise.all([getAllArticles(), getRelatedArticles(article), getArticleBody(slug)]);
  const index = all.findIndex((a) => a.slug === slug);
  const newer = index > 0 ? all[index - 1] : undefined;
  const older = index < all.length - 1 ? all[index + 1] : undefined;
  const url = `${siteUrl}/articles/${slug}`;

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
          { name: article.title, path: `/articles/${slug}` },
        ])}
      />

      <article className="pt-32 pb-24 sm:pt-40">
        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="type-label flex flex-wrap items-center gap-2 text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/articles" className="transition-colors hover:text-accent">
                  Articles
                </Link>
              </li>
            </ol>
          </nav>

          <header className="mt-10 max-w-[52rem]">
            <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Tags">
              {article.tags.map((t) => (
                <li key={t}>
                  <Link
                    href={`/articles/tags/${slugify(t)}`}
                    className="type-label text-accent underline-offset-4 hover:underline"
                  >
                    #{t}
                  </Link>
                </li>
              ))}
            </ul>
            <h1 className="mt-5 font-mono text-[clamp(32px,5vw,60px)] leading-[1.08] font-bold tracking-tight">
              {article.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">{article.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="flex items-center gap-3">
                <Image
                  src={profile.portrait}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border border-line-strong object-cover object-[50%_25%]"
                />
                <span className="text-[15px]">
                  <span className="block font-medium">{profile.shortName} Deshpande</span>
                  <span className="type-label text-muted">
                    <time dateTime={article.date}>{formatDate(article.date)}</time>
                    {" · "}
                    {article.readingMinutes} min read
                  </span>
                </span>
              </span>
              {article.updated && (
                <span className="type-label rounded-pill border border-line px-3 py-1 text-muted">
                  Updated <time dateTime={article.updated}>{formatDate(article.updated)}</time>
                </span>
              )}
            </div>
          </header>

          <div className="mt-14 grid gap-12 xl:grid-cols-[minmax(0,44rem)_minmax(0,1fr)] xl:gap-20">
            <div className="min-w-0">
              {article.headings.length > 1 && (
                <details className="group mb-10 rounded-2xl border border-line bg-bg-elevated/60 px-5 py-4 xl:hidden">
                  <summary className="type-label cursor-pointer list-none text-muted marker:hidden">
                    <span className="text-text">On this page</span>
                    <span aria-hidden className="ml-2 inline-block transition-transform group-open:rotate-90">
                      ›
                    </span>
                  </summary>
                  <TocList headings={article.headings} />
                </details>
              )}
              <div>
                <Body components={articleComponents} />
              </div>

              <div className="mt-14 border-t border-line pt-8">
                <ShareLinks url={url} title={article.title} />
              </div>

              <aside className="mt-10 flex flex-col gap-5 rounded-card border border-line bg-bg-elevated p-6 sm:flex-row sm:items-center sm:p-8">
                <Image
                  src={profile.portrait}
                  alt={`Portrait of ${profile.shortName}`}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-full border border-line-strong object-cover object-[50%_25%]"
                />
                <div>
                  <p className="type-label text-muted">Written by</p>
                  <p className="mt-1 text-lg font-medium">{profile.name}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">
                    {profile.role}, {profile.location}.{" "}
                    <Link href="/#about" className="text-text underline decoration-accent/60 underline-offset-4">
                      More about me
                    </Link>
                    .
                  </p>
                </div>
              </aside>
            </div>

            {article.headings.length > 1 && (
              <aside className="hidden xl:block">
                <div className="sticky top-28">
                  <p className="type-label text-muted">On this page</p>
                  <TocList headings={article.headings} />
                </div>
              </aside>
            )}
          </div>

          {(newer || older) && (
            <nav aria-label="More articles" className="mt-20 grid gap-3 sm:grid-cols-2">
              {older ? <AdjacentLink article={older} label="← Previous" /> : <span />}
              {newer ? <AdjacentLink article={newer} label="Next →" align="right" /> : null}
            </nav>
          )}

          {related.length > 0 && (
            <section aria-labelledby="related-title" className="mt-20">
              <h2 id="related-title" className="type-label text-muted">
                …/<span className="text-text">Related</span>…
              </h2>
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {related.map((a) => (
                  <li key={a.slug}>
                    <ArticleCard article={a} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Container>
      </article>
    </>
  );
}

function TocList({ headings }: { headings: Array<{ id: string; text: string }> }) {
  return (
    <ol className="mt-4 flex flex-col gap-2.5 border-l border-line">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            className="-ml-px block border-l border-transparent pl-4 text-[15px] leading-snug text-muted transition-colors hover:border-accent hover:text-text"
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

function AdjacentLink({
  article,
  label,
  align = "left",
}: {
  article: { slug: string; title: string };
  label: string;
  align?: "left" | "right";
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group rounded-card border border-line p-6 transition-colors hover:border-line-strong ${align === "right" ? "sm:text-right" : ""}`}
    >
      <span className="type-label text-muted">{label}</span>
      <span className="mt-2 block text-lg leading-snug font-medium transition-colors group-hover:text-accent">
        {article.title}
      </span>
    </Link>
  );
}
