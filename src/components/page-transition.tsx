"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motionAllowed } from "@/lib/motion-config";
import { Wordmark } from "./design";

/** Transform-only native animations keep the curtain off the JavaScript frame loop. */
export function PageTransition() {
  const host = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const lastPath = useRef(pathname);
  const pending = useRef<string | null>(null);
  const release = useRef<() => void>(() => {});

  useEffect(() => {
    const el = host.current!;
    const sheets = Array.from(el.querySelectorAll<HTMLElement>(".transition-sheet"));
    const mark = el.querySelector<HTMLElement>(".transition-mark")!;
    const root = document.documentElement;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let animations: Animation[] = [];
    let generation = 0;
    let locked = false;
    let previousOverflow = "";
    let navigationStarted = false;
    const cancel = () => {
      generation++;
      animations.forEach(animation => animation.cancel());
      animations = [];
    };
    const lock = () => {
      if (locked) return;
      previousOverflow = root.style.overflow;
      root.style.overflow = "hidden";
      locked = true;
    };
    const phase = (value: string) => {
      el.dataset.phase = value;
      root.dataset.transition = value;
      el.style.visibility = "visible";
    };
    const play = (target: HTMLElement, frames: Keyframe[], duration: number, delay = 0, easing = "cubic-bezier(.55,0,.2,1)") => {
      const animation = target.animate(frames, { duration, delay, easing, fill: "both" });
      animations.push(animation);
      return animation;
    };
    const complete = (callback: () => void) => {
      const run = generation;
      Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (run === generation) callback();
      }).catch(() => { /* Cancellation is expected on navigation or preference changes. */ });
    };
    const finish = () => {
      clearTimeout(timeout);
      el.style.visibility = "hidden";
      cancel();
      sheets.forEach(sheet => { sheet.style.transform = "translate3d(0,115%,0)"; });
      mark.style.opacity = "0";
      el.dataset.phase = "idle";
      delete root.dataset.transition;
      pending.current = null;
      if (locked) root.style.overflow = previousOverflow;
      locked = false;
      window.dispatchEvent(new Event("gk-route-end"));
    };
    const uncover = () => {
      cancel();
      if (!motionAllowed()) { finish(); return; }
      phase("revealing");
      sheets.forEach((sheet, index) => {
        sheet.style.transform = "translate3d(0,0,0)";
        play(sheet, [{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(0,-115%,0)" }], 580, index * 35);
      });
      play(mark, [{ transform: "translate3d(0,0,0) rotate(-4deg)", opacity: 1 }, { transform: "translate3d(0,-28px,0) rotate(-7deg)", opacity: 0 }], 240, 0, "ease-out");
      complete(finish);
    };
    release.current = () => {
      const target = pending.current ? new URL(pending.current, location.href) : null;
      window.scrollTo({ top: 0, behavior: "instant" });
      if (target?.hash) document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView();
      const main = document.querySelector<HTMLElement>("main");
      main?.setAttribute("tabindex", "-1");
      main?.focus({ preventScroll: true });
      uncover();
    };
    let seen = true;
    try { seen = sessionStorage.getItem("gk-intro") === "1"; sessionStorage.setItem("gk-intro", "1"); } catch { /* Storage is optional. */ }
    if (!seen && motionAllowed()) {
      lock();
      phase("intro");
      sheets.forEach(sheet => { sheet.style.transform = "translate3d(0,0,0)"; });
      play(mark, [{ transform: "translate3d(0,18px,0) rotate(-12deg) scale(.88)", opacity: 0 }, { transform: "translate3d(0,0,0) rotate(-4deg) scale(1)", opacity: 1 }], 460, 0, "cubic-bezier(.16,1,.3,1)");
      complete(uncover);
    }
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !motionAllowed()) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download") || link.hasAttribute("data-no-transition")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      event.preventDefault();
      if (pending.current) return;
      pending.current = url.pathname + url.search + url.hash;
      navigationStarted = false;
      router.prefetch(url.pathname);
      cancel();
      phase("covering");
      window.dispatchEvent(new Event("gk-route-start"));
      lock();
      sheets.forEach((sheet, index) => {
        sheet.style.transform = "translate3d(0,115%,0)";
        play(sheet, [{ transform: "translate3d(0,115%,0)" }, { transform: "translate3d(0,0,0)" }], 480, index * 35);
      });
      play(mark, [{ transform: "translate3d(0,24px,0) rotate(3deg) scale(.94)", opacity: 0 }, { transform: "translate3d(0,0,0) rotate(-4deg) scale(1)", opacity: 1 }], 280, 250, "ease-out");
      complete(() => {
        el.dataset.phase = "covered";
        root.dataset.transition = "covered";
        navigationStarted = true;
        router.push(pending.current!, { scroll: false });
      });
      timeout = setTimeout(finish, 7000);
    };
    const interrupt = () => {
      if (motionAllowed()) return;
      const destination = pending.current;
      const started = navigationStarted;
      finish();
      if (destination && !started) router.push(destination);
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    document.addEventListener("click", click, true);
    window.addEventListener("gk-motion", interrupt);
    window.addEventListener("popstate", finish);
    reduced.addEventListener("change", interrupt);
    return () => {
      finish();
      document.removeEventListener("click", click, true);
      window.removeEventListener("gk-motion", interrupt);
      window.removeEventListener("popstate", finish);
      reduced.removeEventListener("change", interrupt);
    };
  }, [router]);

  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      if (pending.current) release.current();
    }
  }, [pathname]);

  return <div className="page-transition" ref={host} data-phase="idle" aria-hidden="true">
    {["orange", "blue", "yellow", "lime"].map(color => <div key={color} className={`transition-sheet transition-${color}`} />)}
    <div className="transition-mark"><Wordmark /><span className="handnote">Good things in motion.</span></div>
  </div>;
}
