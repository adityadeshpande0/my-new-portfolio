import { expect, test } from "@playwright/test";

// Phones (portrait + landscape), tablets, laptops and large monitors.
const viewports = [
  { width: 320, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 2560, height: 1440 },
];

test.describe("responsive layout", () => {
  test.skip(({ isMobile }) => isMobile, "viewport sizes are set explicitly below");

  for (const vp of viewports) {
    test(`${vp.width}x${vp.height}: no horizontal scroll, hero fits`, async ({ browser, baseURL }) => {
      // Phones and tablets get real mobile emulation: overflowing content widens their layout viewport.
      const touch = vp.width < 1024 || vp.height < 500;
      const context = await browser.newContext({ baseURL, viewport: vp, isMobile: touch, hasTouch: touch });
      const page = await context.newPage();
      await page.addInitScript(() => sessionStorage.setItem("ad-intro-seen", "1"));
      await page.goto("/");

      const heading = page.getByRole("heading", { level: 1, name: "Aditya Deshpande" });
      await expect(heading).toBeVisible();
      const box = await heading.boundingBox();
      expect(box, "hero heading has a box").not.toBeNull();
      // The name must sit fully inside the first screen, below the nav.
      expect(box!.y).toBeGreaterThanOrEqual(56);
      expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height);

      // Scroll through the page, recording the widest the layout gets at any point
      // (elements waiting to slide in must not widen it either).
      const widthNow = () => page.evaluate(() => document.documentElement.scrollWidth);
      let widest = await widthNow();
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += Math.round(vp.height / 2)) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        widest = Math.max(widest, await widthNow());
        await page.waitForTimeout(80);
      }
      expect(widest).toBeLessThanOrEqual(vp.width);
      await context.close();
    });
  }
});
