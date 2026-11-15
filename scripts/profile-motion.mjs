import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

// Same browser/CPU settings before and after; diagnostics, not a hardware FPS claim.
const label = process.argv[2] || "current";
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-unsafe-swiftshader"] });
const samples = [];
for (const mobile of [false, true]) {
  for (let trial = 1; trial <= 2; trial++) {
    const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
    const page = await context.newPage();
    const client = await context.newCDPSession(page);
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      window.__motionProfile = { frames: [], tasks: [], phases: [], canvases: [], stopped: false };
      const data = window.__motionProfile;
      let previous = 0, phase = "startup";
      function frame(now) {
        const next = document.documentElement.dataset.transition || "idle";
        if (next !== phase) { data.phases.push({ phase: next, time: now }); phase = next; }
        if (previous) data.frames.push({ phase, time: now, duration: now - previous });
        previous = now;
        if (!data.stopped) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) data.tasks.push({ time: entry.startTime, duration: entry.duration });
      }).observe({ type: "longtask", buffered: true });
      const nativeContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type.startsWith("webgl")) data.canvases.push({ time: performance.now(), phase: document.documentElement.dataset.transition || "idle", type });
        return nativeContext.call(this, type, ...args);
      };
    });
    await page.goto("http://127.0.0.1:3000/", { waitUntil: "load" });
    await page.waitForFunction(() => document.querySelector(".hero-object canvas") && document.querySelector(".page-transition")?.dataset.phase === "idle", null, { timeout: 30000 });
    await page.waitForTimeout(1000);
    // A navigation wipe is also measured after the initial shaders are ready.
    await page.getByRole("link", { name: "Let’s make it happen" }).evaluate(link => link.click());
    await page.waitForURL("**/contact");
    await page.waitForFunction(() => document.querySelector(".page-transition")?.dataset.phase === "idle");
    await page.waitForTimeout(500);
    const raw = await page.evaluate(() => { window.__motionProfile.stopped = true; return window.__motionProfile; });
    const groups = {};
    for (const phase of ["intro", "covering", "revealing", "idle"]) {
      const frames = raw.frames.filter(frame => frame.phase === phase).map(frame => frame.duration).sort((a,b) => a-b);
      groups[phase] = { frames: frames.length, over33ms: frames.filter(n => n > 34).length, over50ms: frames.filter(n => n > 50).length, p95ms: Math.round(frames[Math.floor(frames.length * .95)] || 0), worstMs: Math.round(frames.at(-1) || 0) };
    }
    samples.push({ mobile, trial, groups, longTasks: raw.tasks, phases: raw.phases, webglStarts: raw.canvases });
    await context.close();
  }
}
await browser.close();
await mkdir("artifacts/performance", { recursive: true });
const result = { label, conditions: "Chrome headless, software WebGL, 4x CPU slowdown, fresh context per trial. RAF intervals indicate main-thread scheduling, not physical display FPS.", samples };
await writeFile(`artifacts/performance/${label}.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(samples.map(({ mobile, trial, groups, longTasks, webglStarts }) => ({ mobile, trial, groups, longTaskCount: longTasks.length, longestTaskMs: Math.round(Math.max(0,...longTasks.map(t=>t.duration))), webglStarts })), null, 2));
