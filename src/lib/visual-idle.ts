// Serialize expensive scene startup, and keep it out of page/menu transitions.
let workQueue = Promise.resolve();

export function deferVisualTask(task: () => void | Promise<void>) {
  let cancelled = false;
  let idle = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const blocked = () => document.hidden || !!document.documentElement.dataset.transition || !!document.querySelector("dialog[open]");
  const cleanup = () => {
    clearTimeout(timer);
    if (idle && "cancelIdleCallback" in window) window.cancelIdleCallback(idle);
    window.removeEventListener("gk-route-end", schedule);
    window.removeEventListener("gk-menu-close", schedule);
    document.removeEventListener("visibilitychange", schedule);
  };
  const enqueue = () => {
    idle = 0;
    workQueue = workQueue.then(async () => {
      if (cancelled) return;
      if (blocked()) return;
      cleanup();
      await task();
    }).catch(() => { /* The caller retains its illustration fallback on failure. */ });
  };
  function schedule() {
    if (cancelled) return;
    clearTimeout(timer);
    if (idle && "cancelIdleCallback" in window) window.cancelIdleCallback(idle);
    if (blocked()) return;
    // Give the preceding reveal/layout a paint before starting shader work.
    timer = setTimeout(() => {
      if (cancelled || blocked()) return;
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(enqueue, { timeout: 1200 });
      else timer = setTimeout(enqueue, 32);
    }, 160);
  }
  window.addEventListener("gk-route-end", schedule);
  window.addEventListener("gk-menu-close", schedule);
  document.addEventListener("visibilitychange", schedule);
  schedule();
  return () => { cancelled = true; cleanup(); };
}
