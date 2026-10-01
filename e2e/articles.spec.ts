import { expect, test, type Page } from "@playwright/test";

/** Slugs of published articles, read from the archive (drafts never appear there in production). */
async function publishedSlugs(page: Page): Promise<string[]> {
  await page.goto("/articles");
  const hrefs = await page
    .locator("main ol a[href^='/articles/']:not([href^='/articles/tags/']):not([href^='/articles/page/'])")
    .evaluateAll((els) => els.map((e) => e.getAttribute("href") ?? ""));
  return [...new Set(hrefs.map((h) => h.replace("/articles/", "")))];
}

test.describe("articles", () => {
  test("home page has an Articles section linking to the archive", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section#articles");
    await expect(section.getByRole("heading", { level: 2, name: "Notes from the work." })).toBeAttached();
    await expect(section.locator('a[href="/articles"]').first()).toBeAttached();
  });

  test("archive renders with canonical URL and Blog structured data", async ({ page }) => {
    const slugs = await publishedSlugs(page);
    await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/articles$/);
    const types = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? "{}")["@type"]));
    expect(types).toEqual(expect.arrayContaining(["Blog", "BreadcrumbList"]));
    if (slugs.length === 0) await expect(page.getByText("The first article is on its way.")).toBeVisible();
  });

  test("RSS feed and sitemap list exactly the published articles", async ({ page, request }) => {
    const slugs = await publishedSlugs(page);
    const rss = await request.get("/articles/rss.xml");
    expect(rss.status()).toBe(200);
    expect(rss.headers()["content-type"]).toContain("application/rss+xml");
    const feed = await rss.text();
    expect(feed).toContain("<channel>");
    expect(feed.match(/<item>/g)?.length ?? 0).toBe(slugs.length);

    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/articles</loc>");
    for (const slug of slugs) {
      expect(feed).toContain(`/articles/${slug}</link>`);
      expect(sitemap).toContain(`/articles/${slug}</loc>`);
    }
  });

  test("a published article is SEO-complete", async ({ page, request }) => {
    const [slug] = await publishedSlugs(page);
    test.skip(!slug, "No published articles yet (drafts are excluded from production builds).");

    await page.goto(`/articles/${slug}`);
    await expect(page.locator("h1")).toHaveCount(1);

    const head = page.locator("head");
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/articles/${slug}$`));
    await expect(head.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,160}/);
    await expect(head.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    await expect(head.locator('meta[property="article:published_time"]')).toHaveAttribute(
      "content",
      /^\d{4}-\d{2}-\d{2}T/,
    );
    await expect(head.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
    await expect(head.locator('link[type="application/rss+xml"]')).toHaveAttribute("href", /\/articles\/rss\.xml$/);

    const ld = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? "{}")));
    expect(ld.find((d) => d["@type"] === "BlogPosting")).toMatchObject({
      headline: expect.any(String),
      datePublished: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      author: { "@type": "Person" },
    });
    expect(ld.some((d) => d["@type"] === "BreadcrumbList")).toBe(true);

    const og = await request.get(`/articles/${slug}/opengraph-image`);
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/png");

    // Tag links lead to working tag pages.
    const tagHref = await page.locator("header a[href^='/articles/tags/']").first().getAttribute("href");
    await page.goto(tagHref!);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(`a[href="/articles/${slug}"]`)).toBeVisible();
  });

  test("unknown articles 404", async ({ request }) => {
    expect((await request.get("/articles/does-not-exist")).status()).toBe(404);
  });
});
