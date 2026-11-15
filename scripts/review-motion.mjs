import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("artifacts/motion", { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
const report = { errors: [], warnings: [], frames: [] };
page.on("pageerror", (error) => report.errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "warning") report.warnings.push(message.text());
});
const frame = async (name) => {
  await page.screenshot({ path: `artifacts/motion/${name}.png` });
  report.frames.push({
    name,
    scroll: await page.evaluate(() => scrollY),
    pins: await page.locator(".pin-spacer").count(),
  });
};
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await page.locator("html[data-enhanced-motion]").waitFor();
await page.waitForFunction(
  () => document.querySelector(".page-transition").dataset.phase === "idle",
);
await page.waitForTimeout(1100);
await frame("home-hero");
await page.mouse.move(600, 290);
await page.mouse.move(650, 295, { steps: 10 });
await page.getByRole("button", { name: "Menu", exact: true }).click();
await page.waitForTimeout(250);
await frame("menu-unfolding");
await page.waitForTimeout(700);
await frame("menu-open");
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
await page.locator(".playground").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.getByRole("button", { name: "Next service" }).click();
await page.waitForTimeout(350);
await frame("service-wipe");
await page.waitForTimeout(1400);
await frame("service-arrived");
const belief = await page
  .locator(".belief-section")
  .evaluate((el) => el.getBoundingClientRect().top + scrollY);
for (const offset of [0, 500, 950]) {
  await page.evaluate(
    (y) => scrollTo({ top: y, behavior: "instant" }),
    belief + offset,
  );
  await page.waitForTimeout(950);
  await frame(`manifesto-${offset}`);
}
await page.getByRole("link", { name: "How we think" }).click();
await page.waitForTimeout(300);
await frame("route-cover");
await page.waitForURL("**/our-approach");
await page.waitForFunction(
  () => document.querySelector(".page-transition").dataset.phase === "idle",
);
await page.waitForTimeout(600);
await frame("approach-arrived");
await page.locator(".process-sheet").nth(2).scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await frame("process-stack");
await page.goto("http://127.0.0.1:3000/about", { waitUntil: "networkidle" });
const values = await page
  .locator(".values-section")
  .evaluate((el) => el.getBoundingClientRect().top + scrollY);
await page.evaluate(
  (y) => scrollTo({ top: y + 650, behavior: "instant" }),
  values,
);
await page.waitForTimeout(1100);
await frame("about-conveyor");
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1400);
await frame("mobile-hero");
await page.getByRole("button", { name: "Menu", exact: true }).click();
await page.waitForTimeout(900);
await frame("mobile-menu");
await context.close();
await browser.close();
await writeFile(
  "artifacts/motion/review.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
