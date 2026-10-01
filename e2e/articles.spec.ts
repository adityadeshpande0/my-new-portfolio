import { expect, test } from "@playwright/test";

const SLUG = "building-a-cinematic-portfolio-with-nextjs-and-r3f";

test.describe("articles", () => {
  test("home page shows the latest articles and links to the archive", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section#articles");
    await expect(section.getByRole("heading", { level: 2, name: "Notes from the work." })).toBeAttached();
    await expect(section.locator(`a[href="/articles/${SLUG}"]`)).toBeAttached();
    await expect(section.locator('a[href="/articles"]').first()).toBeAttached();
  });

  test("archive lists articles with tag filters and Blog structured data", async ({ page }) => {
    await page.goto("/articles");
    await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();
    await expect(page.locator(`a[href="/articles/${SLUG}"]`)).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/articles$/);
    const types = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? "{}")["@type"]));
    expect(types).toEqual(expect.arrayContaining(["Blog", "BreadcrumbList"]));

    await page
      .getByRole("navigation", { name: "Topics" })
      .getByRole("link", { name: /Next\.js/ })
      .click();
    await expect(page).toHaveURL(/\/articles\/tags\/next-js$/);
    await expect(page.getByRole("heading", { level: 1, name: "Next.js" })).toBeVisible();
  });

  test("article page is SEO-complete", async ({ page }) => {
    await page.goto(`/articles/${SLUG}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Building a cinematic portfolio");

    // Exactly one h1, and section headings are linkable.
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("article h2#the-stack")).toBeAttached();

    const head = page.locator("head");
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/articles/${SLUG}$`));
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
    const posting = ld.find((d) => d["@type"] === "BlogPosting");
    expect(posting).toMatchObject({
      headline: expect.stringContaining("Building a cinematic portfolio"),
      datePublished: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      author: { "@type": "Person" },
    });
    expect(ld.some((d) => d["@type"] === "BreadcrumbList")).toBe(true);
  });

  test("RSS feed, OG image and sitemap include the article", async ({ request }) => {
    const rss = await request.get("/articles/rss.xml");
    expect(rss.status()).toBe(200);
    expect(rss.headers()["content-type"]).toContain("application/rss+xml");
    expect(await rss.text()).toContain(`/articles/${SLUG}</link>`);

    const og = await request.get(`/articles/${SLUG}/opengraph-image`);
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/png");

    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain(`/articles/${SLUG}</loc>`);
    expect(sitemap).toContain("/articles/tags/next-js</loc>");
  });

  test("unknown articles 404", async ({ request }) => {
    expect((await request.get("/articles/does-not-exist")).status()).toBe(404);
  });
});
