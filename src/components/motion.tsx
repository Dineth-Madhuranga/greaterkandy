"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motionAllowed } from "@/lib/motion-config";
import { PageTransition } from "./page-transition";

export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    let generation = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const setup = async () => {
      const run = ++generation;
      // Preserve the reader's place when removing a pinned scroll scene.
      const anchor = document
        .elementFromPoint(innerWidth / 2, innerHeight / 2)
        ?.closest("section,article");
      const top = anchor?.getBoundingClientRect().top;
      dispose?.();
      dispose = undefined;
      if (anchor && top !== undefined && !motionAllowed()) {
        window.scrollBy({
          top: anchor.getBoundingClientRect().top - top,
          behavior: "instant",
        });
      }
      if (!motionAllowed()) return;
      try {
        const [{ mountMotion }] = await Promise.all([
          import("@/lib/motion-runtime"),
          document.fonts.ready,
        ]);
        if (cancelled || run !== generation || !motionAllowed()) return;
        dispose = mountMotion();
      } catch {
        /* Static content stays visible if enhancement cannot load. */
      }
    };
    void setup();
    window.addEventListener("gk-motion", setup);
    reduced.addEventListener("change", setup);
    return () => {
      cancelled = true;
      generation++;
      dispose?.();
      window.removeEventListener("gk-motion", setup);
      reduced.removeEventListener("change", setup);
    };
  }, [pathname]);
  return (
    <>
      <PageTransition />
      <div className="paper-cursor" aria-hidden="true">
        <svg viewBox="0 0 40 48">
          <path
            d="M5 3 34 27 21 29 16 43Z"
            fill="#fdfbe8"
            stroke="#013900"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}

export function MotionToggle() {
  const [paused, setPaused] = useState(false);
  return (
    <button
      className="motion-toggle"
      aria-pressed={paused}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        document.documentElement.dataset.motion = next ? "paused" : "playing";
        window.dispatchEvent(new Event("gk-motion"));
      }}
    >
      {paused ? "Play motion ▶" : "Pause motion Ⅱ"}
    </button>
  );
}
