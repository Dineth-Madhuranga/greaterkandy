import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const report = { errors: [], screens: [] };
page.on("pageerror", (error) => report.errors.push(error.message));
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".hero-object canvas").waitFor({ timeout: 30000 });
  await page.screenshot({ path: `artifacts/review-hero-${width}.png` });
  for (const selector of [
    ".hello-section",
    ".playground",
    ".belief-section",
    ".place-section",
    ".contact-cta",
    ".site-footer",
  ]) {
    const section = page.locator(selector);
    await section.scrollIntoViewIfNeeded();
    if (selector === ".playground")
      await section.locator("canvas").waitFor({ timeout: 30000 });
    await page.screenshot({
      path: `artifacts/review-${selector.slice(1)}-${width}.png`,
    });
  }
  report.screens.push({
    width,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    canvasCount: await page.locator("canvas").count(),
  });
}
for (const path of [
  "/about",
  "/what-we-do",
  "/contact",
  "/our-approach",
  "/focus",
  "/what-we-do/digital-signage",
]) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`http://127.0.0.1:3000${path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `artifacts/review-${path.slice(1).replaceAll("/", "-")}.png`,
  });
  if (path === "/contact") {
    await page.locator(".contact-sheet").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "artifacts/review-contact-sheet.png" });
  }
}
await writeFile(
  "artifacts/browser-review.json",
  JSON.stringify(report, null, 2),
);
await browser.close();
console.log(JSON.stringify(report));
