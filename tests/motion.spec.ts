import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("gk-intro", "1"));
});

test("paper navigation covers, commits, reveals and releases scroll and focus", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-enhanced-motion",
    "true",
  );
  await page.getByRole("link", { name: "Let’s make it happen" }).click();
  await expect(page.locator(".page-transition")).toHaveAttribute(
    "data-phase",
    /covering|covered|revealing/,
  );
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator(".page-transition")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  await expect(page.locator("main")).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.style.overflow),
  ).not.toBe("hidden");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".page-transition")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("menu arrows finish at full size and pointer effects emit no animation warnings", async ({
  page,
}) => {
  const warnings: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "warning") warnings.push(message.text());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-enhanced-motion",
    "true",
  );
  await page.locator("h1 .glyph-ink").first().hover();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const arrow = page.locator(".site-menu nav .arrow").last();
  await expect
    .poll(() => arrow.evaluate((el) => el.getBoundingClientRect().width))
    .toBeGreaterThan(25);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(warnings).toEqual([]);
});

test("switching to reduced motion during a page wipe still completes navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-enhanced-motion", "true");
  await page.getByRole("link", { name: "Let’s make it happen" }).evaluate((link: HTMLAnchorElement) => link.click());
  await expect(page.locator(".page-transition")).toHaveAttribute("data-phase", "covering");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator(".page-transition")).toHaveAttribute("data-phase", "idle");
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");
});

test("desktop scenes pin, respond to scroll and fully release when motion is paused", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  await expect(page.locator(".values-section")).toHaveClass(/values-conveyor/);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  const track = page.locator(".values-list");
  const start = await page
    .locator(".values-section")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(
    (y) => scrollTo({ top: y + 700, behavior: "instant" }),
    start,
  );
  await expect
    .poll(() =>
      track.evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
      ),
    )
    .toBeLessThan(-100);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-enhanced-motion",
    "true",
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".values-section")).not.toHaveClass(
    /values-conveyor/,
  );
  await expect(page.locator(".values-list article")).toHaveCount(3);
  await page.getByRole("button", { name: "Play motion" }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  // Responsive teardown must not leave desktop-sized spacers on a phone.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("3D scroll pose and queued service changes remain usable during a transition", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const model = page.locator(".hero-object .object-canvas");
  await expect(page.locator("html")).toHaveAttribute(
    "data-enhanced-motion",
    "true",
  );
  const before = await model.getAttribute("data-scroll-turn");
  await page.evaluate(() => scrollTo({ top: 500, behavior: "instant" }));
  await expect
    .poll(() => model.getAttribute("data-scroll-turn"))
    .not.toBe(before);
  const stage = page.locator(".playground");
  await stage.scrollIntoViewIfNeeded();
  await stage.getByRole("button", { name: "Next service" }).click();
  await expect(stage).toHaveAttribute("data-changing", "true");
  await stage.getByRole("button", { name: "Next service" }).click();
  await expect(stage.locator("h3")).toHaveText("Turn heads.");
  await expect(stage).not.toHaveAttribute("data-changing", "true");
  await expect(
    stage.getByRole("link", { name: "Explore this service" }),
  ).toHaveAttribute("href", "/what-we-do/digital-signage");
  await expect(stage.locator(".playground-object")).toHaveCSS("opacity", "1");
});

test("mobile keeps native scrolling and reduced motion bypasses curtains and pins", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await expect(page.locator(".page-transition")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-enhanced-motion",
    "true",
  );
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-enhanced-motion",
    "true",
  );
  await page.getByRole("link", { name: "Let’s make it happen" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator(".page-transition")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
  await context.close();
});
