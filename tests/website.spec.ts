import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("3D illustration fallback survives an unavailable WebGL context", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.startsWith("webgl") || type === "experimental-webgl")
        return null;
      return Reflect.apply(getContext, this, [type, ...args]);
    } as typeof getContext;
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".hero-object .object-fallback")).toBeVisible();
  await expect(page.locator(".hero-object .object-art")).toBeVisible();
  await expect(page.locator(".hero-object .three-object")).not.toHaveClass(
    /is-3d/,
  );
  await expect(
    page.getByRole("link", { name: "Let’s make it happen" }),
  ).toBeVisible();
});

const routes = [
  "/",
  "/about",
  "/what-we-do",
  "/focus",
  "/our-approach",
  "/contact",
  "/credits",
  "/what-we-do/sustainable-marketing",
  "/what-we-do/outdoor-advertising",
  "/what-we-do/digital-signage",
  "/what-we-do/community-initiatives",
];

test("homepage at all five requested widths, with working fonts, images and no overflow", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "MAKE YOUR MARK.",
    );
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations,
      JSON.stringify(result.violations, null, 2),
    ).toEqual([]);
    if ([390, 1440].includes(width)) {
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const img of await page.locator("main img").all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((el: HTMLImageElement) => el.decode());
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `artifacts/home-${width}.png`,
        fullPage: true,
      });
      await page.screenshot({ path: `artifacts/hero-${width}.png` });
    }
  }
  expect(errors).toEqual([]);
});

test("pull-tab menu works on desktop and mobile, traps focus and restores it", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Menu", exact: true });
    const menu = page.getByRole("dialog", { name: "Main navigation" });
    await trigger.click();
    await expect(menu).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await menu.getByRole("link", { name: "GreaterKandy home" }).focus();
    await page.keyboard.press("Shift+Tab");
    await expect(
      menu.getByRole("link", { name: "info@greaterkandy.org" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      menu.getByRole("link", { name: "GreaterKandy home" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await menu.getByRole("link", { name: /What We Do/ }).click();
    await expect(page).toHaveURL(/\/what-we-do$/);
    await expect(menu).not.toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
      "hidden",
    );
  }
});

test("menu scrolls in a short viewport and remains usable after resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 420 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const menu = page.getByRole("dialog");
  const contact = menu.getByRole("link", { name: /Let’s talk/ });
  await contact.scrollIntoViewIfNeeded();
  await expect(contact).toBeInViewport();
  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
});

test("interactive 3D service selector changes content, rotates, pauses and links correctly", async ({
  page,
}) => {
  await page.goto("/");
  const stage = page.locator(".playground");
  await stage.scrollIntoViewIfNeeded();
  await expect(
    stage.getByRole("button", { name: "Rotate megaphone right" }),
  ).toBeVisible({ timeout: 30000 });
  await stage.getByRole("button", { name: "Rotate megaphone right" }).click();
  await stage.getByRole("button", { name: "Pause object animation" }).click();
  await expect(
    stage.getByRole("button", { name: "Resume object animation" }),
  ).toHaveAttribute("aria-pressed", "true");
  await stage.getByRole("button", { name: "Next service" }).click();
  await expect(stage.locator("h3")).toHaveText("Own the moment.");
  await expect(
    stage.getByRole("button", {
      name: "Outdoor & place-based visibility",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await stage.getByRole("link", { name: "Explore this service" }).click();
  await expect(page).toHaveURL(/outdoor-advertising$/);
  await expect(page.locator("h1")).toHaveAccessibleName("OWN THE MOMENT.");
});

test("focus filters show the selected subject and native service details work by keyboard", async ({
  page,
}) => {
  await page.goto("/focus");
  await expect(page.locator(".focus-article")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Greener places", exact: true })
    .click();
  await expect(page.locator(".focus-article")).toHaveCount(1);
  await expect(page.locator(".focus-article h2")).toHaveText(
    "Greener urban environments",
  );
  await page.getByRole("button", { name: "All possibilities" }).click();
  await expect(page.locator(".focus-article")).toHaveCount(3);
  await page.goto("/what-we-do/digital-signage");
  const details = page.locator(".detail-accordion details");
  await details.nth(1).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details.nth(1)).toHaveAttribute("open", "");
  await expect(details.nth(0)).not.toHaveAttribute("open");
  await page.keyboard.press("Space");
  await expect(details.nth(1)).not.toHaveAttribute("open");
});

test("form validates, preserves failed messages, shows loading and clears only confirmed success", async ({
  page,
}) => {
  await page.goto("/contact");
  const button = page.getByRole("button", { name: "Start a conversation" });
  await button.click();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await expect(
    page.getByText("Please enter a valid email address."),
  ).toBeVisible();
  await page.getByLabel("Your name").fill("Test Visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page.getByLabel("Company").fill("Example company");
  await page
    .getByLabel("What do you have in mind?")
    .fill("A test enquiry for our locally mocked endpoint only.");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({ success: false }),
    }),
  );
  await button.click();
  await expect(page.getByRole("status")).toContainText(
    "We couldn’t confirm delivery",
  );
  await expect(page.getByLabel("Your name")).toHaveValue("Test Visitor");
  await page.unroute("**/api/contact");
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/contact", async (route) => {
    await gate;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });
  await button.click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  release();
  await expect(page.getByRole("status")).toContainText(
    "Your enquiry has been received",
  );
  await expect(page.getByLabel("Your name")).toHaveValue("");
});

for (const route of routes.filter((r) => r !== "/"))
  test(`complete page: ${route}`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://greaterkandy.org${route}`,
      );
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
      if (width === 390) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(
          result.violations,
          JSON.stringify(result.violations, null, 2),
        ).toEqual([]);
      }
      for (const img of await page.locator("main img").all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((el: HTMLImageElement) => el.decode());
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `artifacts/${route.slice(1).replaceAll("/", "-")}-${width}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });

test("reduced motion, pause toggle, skip link, contact alternatives, 404 and no initial trackers", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (/crisp\.chat|google-analytics|googletagmanager/.test(r.url()))
      external.push(r.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator(".glyph")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page.goto("/contact");
  for (const href of [
    "mailto:info@greaterkandy.org",
    "tel:+94777692126",
    "https://wa.me/94777692126",
  ])
    await expect(page.locator(`main a[href="${href}"]`)).toBeVisible();
  expect(external).toEqual([]);
  const missing = await page.goto("/this-page-does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
});

test("all essential pages work without JavaScript and the enquiry fallback is honest", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".hero-object .object-art")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Navigation without JavaScript" }),
  ).toBeVisible();
  await page.goto("http://127.0.0.1:3000/what-we-do/digital-signage");
  await page.locator(".detail-accordion summary").nth(2).click();
  await expect(
    page.locator(".detail-accordion details").nth(2),
  ).toHaveAttribute("open", "");
  await page.goto("http://127.0.0.1:3000/contact");
  await expect(page.locator("noscript p")).toContainText(
    "The enquiry form needs JavaScript to send.",
  );
  await expect(page.locator("noscript p")).toBeVisible();
  await expect(
    page.locator('.contact-form button[type="submit"]'),
  ).toBeHidden();
  await context.close();
});
