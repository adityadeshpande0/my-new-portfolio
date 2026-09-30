import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders every section with real content", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: "Aditya Deshpande" })).toBeVisible();
    for (const id of ["about", "work", "stack", "projects", "recognition", "contact"]) {
      await expect(page.locator(`section#${id}`)).toBeAttached();
    }
    await expect(page.getByText("VConstruct").first()).toBeAttached();
    await expect(page.getByRole("link", { name: /Verify Azure Administrator/ })).toHaveAttribute(
      "href",
      /learn\.microsoft\.com/,
    );
    // The phone number must never be published on the site.
    await expect(page.locator("body")).not.toContainText("9405459309");
    expect(errors).toEqual([]);
  });

  test("experience accordion is keyboard-accessible", async ({ page }) => {
    await page.goto("/");
    const infosys = page.getByRole("button", { name: /Infosys/ });
    await infosys.scrollIntoViewIfNeeded();
    await expect(infosys).toHaveAttribute("aria-expanded", "false");
    await infosys.focus();
    await page.keyboard.press("Enter");
    await expect(infosys).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/Reduced data fetch times by 40%/)).toBeVisible();
  });

  test("contact form validates input", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("#contact form");
    await form.scrollIntoViewIfNeeded();
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please share your name.")).toBeVisible();
    await expect(page.getByText("That email doesn't look right.")).toBeVisible();
  });

  test("resume is downloadable", async ({ request }) => {
    const res = await request.get("/resume/Aditya_Deshpande_Resume.pdf");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("pdf");
  });
});

test("case study page renders from MDX", async ({ page }) => {
  await page.goto("/projects/nx-monorepo-migration");
  await expect(page.getByRole("heading", { level: 1, name: "Nx Monorepo Migration" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What I learned" })).toBeAttached();
  await expect(page.getByRole("img", { name: "Nx workspace architecture" })).toBeAttached();
});

test("SEO routes respond", async ({ request }) => {
  for (const path of ["/sitemap.xml", "/robots.txt", "/opengraph-image"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});
