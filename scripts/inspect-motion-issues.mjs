import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
await page.getByRole("button", { name: "Menu", exact: true }).click();
await page.waitForTimeout(1800);
console.log(
  await page
    .locator(".site-menu .arrow")
    .evaluateAll((nodes) =>
      nodes.map((el) => ({
        html: el.outerHTML,
        rect: el.getBoundingClientRect().toJSON(),
        css: getComputedStyle(el).transform,
      })),
    ),
);
await browser.close();
