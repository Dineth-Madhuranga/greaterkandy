import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  for (const route of ["", "/about", "/products", "/contact"]) {
    await page.goto(`https://sweet-tape.com${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `reference/sweet-tape/static-${route.slice(1) || "home"}.png`,
      fullPage: true,
    });
    await writeFile(
      `reference/sweet-tape/${route.slice(1) || "static-home"}.html`,
      await page.content(),
    );
    console.log("Captured", route || "home");
  }
  await context.close();
  const live = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  live.on("pageerror", (error) =>
    console.log("Reference page error:", error.message),
  );
  await live.route(/googletagmanager|google-analytics/, (route) =>
    route.abort(),
  );
  await live.goto("https://sweet-tape.com/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  try {
    await live.waitForFunction(
      () => !document.documentElement.hasAttribute("data-loading"),
      { timeout: 60000 },
    );
  } catch {
    console.log("Reference preloader still active");
  }
  await live.screenshot({ path: "reference/sweet-tape/live-home-ready.png" });
  await live.evaluate(() => window.scrollTo(0, 1600));
  await live.waitForTimeout(1500);
  await live.screenshot({
    path: "reference/sweet-tape/live-home-interaction.png",
  });
} finally {
  await browser.close();
}
