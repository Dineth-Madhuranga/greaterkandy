import { chromium } from "@playwright/test";

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:3000/");
  await page.evaluate(() => document.fonts.ready);
  for (const section of [
    "capabilities",
    "focus",
    "sustainability",
    "contact",
  ]) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded();
    for (const image of await page.locator(`#${section} img`).all())
      await image.evaluate((element) => element.decode());
    await page
      .locator(`#${section}`)
      .screenshot({ path: `artifacts/section-${section}.png` });
  }
  const noScript = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await noScript.newPage();
  await fallback.goto("http://127.0.0.1:3000/");
  console.log(
    JSON.stringify(
      await fallback
        .locator("noscript")
        .evaluateAll((elements) =>
          elements.map((element) => ({
            html: element.innerHTML,
            text: element.textContent,
            children: element.children.length,
            display: getComputedStyle(element).display,
          })),
        ),
      null,
      2,
    ),
  );
  console.log(
    "No-JS fallback matches:",
    await fallback
      .getByText("The enquiry form needs JavaScript to send.", { exact: false })
      .count(),
  );
  await noScript.close();
} finally {
  await browser.close();
}
