import { expect, test } from "@playwright/test";

// Regression: on laptop-sized windows the "Frontend" cluster label could end up off screen
// or under the nav, depending on window shape and where the cursor rested.
const cases = [
  { name: "laptop, cursor left", viewport: { width: 1280, height: 649 }, mouseX: 80 },
  { name: "laptop, cursor right", viewport: { width: 1366, height: 768 }, mouseX: 1300 },
  { name: "narrow window", viewport: { width: 960, height: 1000 }, mouseX: 900 },
  { name: "full HD", viewport: { width: 1920, height: 1080 }, mouseX: 100 },
];

test.describe("hero constellation clusters", () => {
  test.skip(({ isMobile }) => isMobile, "desktop windows are set explicitly below");
  // Software-rendered WebGL is CPU-heavy, especially at full HD alongside other workers.
  test.describe.configure({ timeout: 90_000 });

  for (const c of cases) {
    test(`all three cluster labels are visible: ${c.name}`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ baseURL, viewport: c.viewport });
      await context.addInitScript(() => {
        // The 3D scene is gated off on ≤4-core machines; CI runners often report fewer.
        Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
        sessionStorage.setItem("ad-intro-seen", "1");
      });
      const page = await context.newPage();
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.mouse.move(c.mouseX, c.viewport.height / 2);

      const labels = page.locator("#top .type-label.text-accent", { hasText: /^…\/(Frontend|Backend|Cloud)…$/ });
      await expect(labels).toHaveCount(3);

      // Check early and late in the pinned "clusters formed" stage of the hero.
      const heroHeight = await page.evaluate(() => document.getElementById("top")!.offsetHeight);
      for (const at of [0.32, 0.5]) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroHeight * at));
        await expect
          .poll(
            async () =>
              labels.evaluateAll((els) =>
                els.map((el) => {
                  const r = el.getBoundingClientRect();
                  return {
                    text: el.textContent,
                    visible:
                      Number((el as HTMLElement).style.opacity) > 0.5 &&
                      r.left >= 0 &&
                      r.right <= window.innerWidth &&
                      r.top >= 64 && // below the 64px nav bar
                      r.bottom <= window.innerHeight,
                  };
                }),
              ),
            { timeout: 30_000 },
          )
          .toEqual([
            { text: "…/Frontend…", visible: true },
            { text: "…/Backend…", visible: true },
            { text: "…/Cloud…", visible: true },
          ]);
      }
      await context.close();
    });
  }
});

test.describe("about portrait", () => {
  test("photo stays accessible and becomes a particle portrait on desktop", async ({ browser, baseURL, isMobile }) => {
    test.skip(isMobile, "phones show the plain photo");
    const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
      sessionStorage.setItem("ad-intro-seen", "1");
    });
    const page = await context.newPage();
    await page.goto("/");
    const figure = page.locator("#about figure").first();
    // The real image is always in the DOM for SEO and screen readers.
    await expect(figure.getByRole("img", { name: /Portrait of/ })).toBeAttached();
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator("canvas")).toHaveCount(1, { timeout: 30_000 });
    await expect(figure.getByText("hover to stir")).toHaveCSS("opacity", "1", { timeout: 30_000 });
    // Smaller than before (was up to 480px wide).
    expect((await figure.boundingBox())!.width).toBeLessThanOrEqual(380);
    await context.close();
  });
});
