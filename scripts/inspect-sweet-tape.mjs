import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("reference/sweet-tape", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.route(/googletagmanager|google-analytics/, (route) =>
    route.abort(),
  );
  const resources = [];
  page.on("response", (response) => {
    const url = response.url();
    if (/\.(woff2?|ttf|otf|glb|gltf|js|css)(\?|$)/.test(url))
      resources.push(url);
  });
  await page.goto("https://sweet-tape.com/", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: "reference/sweet-tape/home-desktop.png" });
  const report = await page.evaluate(() => ({
    title: document.title,
    links: [...document.querySelectorAll("a[href]")].map((a) => ({
      text: a.textContent?.trim(),
      href: a.getAttribute("href"),
    })),
    fonts: [...document.fonts].map((font) => ({
      family: font.family,
      weight: font.weight,
      status: font.status,
    })),
    stylesheets: [...document.styleSheets].map((style) => style.href),
    elements: [
      ...document.querySelectorAll("h1,h2,body,nav,header,main,section"),
    ]
      .slice(0, 35)
      .map((element) => ({
        tag: element.tagName,
        class: element.className,
        text: element.textContent?.trim().slice(0, 100),
        font: getComputedStyle(element).fontFamily,
        size: getComputedStyle(element).fontSize,
        color: getComputedStyle(element).color,
        background: getComputedStyle(element).backgroundColor,
      })),
    images: [...document.images].map((image) => ({
      src: image.currentSrc,
      alt: image.alt,
      width: image.naturalWidth,
      height: image.naturalHeight,
    })),
    canvas: [...document.querySelectorAll("canvas")].map((canvas) => ({
      width: canvas.width,
      height: canvas.height,
      class: canvas.className,
    })),
  }));
  await writeFile("reference/sweet-tape/home.html", await page.content());
  await writeFile(
    "reference/sweet-tape/report.json",
    JSON.stringify({ ...report, resources: [...new Set(resources)] }, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        ...report,
        images: report.images.slice(0, 12),
        resources: [...new Set(resources)],
      },
      null,
      2,
    ),
  );
  for (const position of [900, 1800, 3000, 4800, 6500]) {
    await page.evaluate((y) => window.scrollTo(0, y), position);
    await page.waitForTimeout(900);
    await page.screenshot({
      path: `reference/sweet-tape/home-scroll-${position}.png`,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("https://sweet-tape.com/", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: "reference/sweet-tape/home-mobile.png" });
} finally {
  await browser.close();
}
