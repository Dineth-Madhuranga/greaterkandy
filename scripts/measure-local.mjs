import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-unsafe-swiftshader"] });
const samples = [];
for (const width of [390, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__metrics = { lcp: 0, cls: 0 };
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__metrics.lcp = entry.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__metrics.cls += entry.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".hero-object canvas").waitFor();
  await page.getByRole("button", { name: "Pause motion", exact: false }).click();
  samples.push(await page.evaluate(() => ({ width: innerWidth, ...window.__metrics, transferBytes: performance.getEntriesByType("resource").reduce((sum, entry) => sum + entry.transferSize, 0), scriptTransferBytes: performance.getEntriesByType("resource").filter(entry => entry.initiatorType === "script").reduce((sum, entry) => sum + entry.transferSize, 0), fonts: document.fonts.status, scripts: performance.getEntriesByType("resource").filter(entry => entry.initiatorType === "script").length })));
  await context.close();
}
await browser.close();
const report = { note: "Local production server in desktop Chrome with software WebGL, unthrottled network/CPU. Diagnostic samples only; not Lighthouse, field Core Web Vitals, or INP measurements.", samples };
await writeFile("artifacts/local-performance.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
