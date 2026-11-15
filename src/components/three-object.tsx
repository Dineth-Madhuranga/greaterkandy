"use client";

import { useEffect, useRef, useState } from "react";
import { ObjectArt, type ObjectKind } from "./object-art";
import { deferVisualTask } from "@/lib/visual-idle";

type Controls = {
  rotate: (amount: number) => void;
  pause: (value: boolean) => void;
};

export function ThreeObject({
  kind = "megaphone",
  className = "",
  decorative = false,
}: {
  kind?: ObjectKind;
  className?: string;
  decorative?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls | null>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    let cancelImport: (() => void) | undefined;
    let cancelMount: (() => void) | undefined;
    const lazy = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        lazy.disconnect();
        cancelImport = deferVisualTask(async () => {
          try {
            const { mountObject } = await import("@/lib/three-scene");
            if (cancelled) return;
            cancelMount = deferVisualTask(async () => {
              if (cancelled) return;
              try {
                const mounted = mountObject(element, kind, decorative);
                dispose = mounted.dispose;
                await mounted.ready;
                if (cancelled) return;
                controls.current = mounted;
                setReady(true);
              } catch { dispose?.(); }
            });
          } catch { /* Keep the original illustration when WebGL is unavailable. */ }
        });
      },
      { rootMargin: "150px" },
    );
    lazy.observe(element);
    return () => {
      cancelled = true;
      lazy.disconnect();
      cancelImport?.();
      cancelMount?.();
      dispose?.();
      controls.current = null;
    };
  }, [kind, decorative]);

  return (
    <div className={`three-object ${className} ${ready ? "is-3d" : ""}`}>
      <div className="object-fallback">
        <ObjectArt kind={kind} />
      </div>
      <div className="object-canvas" ref={host} aria-hidden="true" />
      {!decorative && (
        <div className="object-controls">
          <span className="handnote">
            {ready ? "Go on, give it a spin ↗" : "Made for a little impact ↗"}
          </span>
          {ready && (
            <div
              className="spin-buttons"
              role="group"
              aria-label={`Explore the 3D ${kind}`}
            >
              <button
                type="button"
                aria-label={`Rotate ${kind} left`}
                onClick={() => controls.current?.rotate(-0.5)}
              >
                ↶
              </button>
              <button
                type="button"
                aria-label={
                  paused ? "Resume object animation" : "Pause object animation"
                }
                aria-pressed={paused}
                onClick={() => {
                  controls.current?.pause(!paused);
                  setPaused(!paused);
                }}
              >
                {paused ? "▶" : "Ⅱ"}
              </button>
              <button
                type="button"
                aria-label={`Rotate ${kind} right`}
                onClick={() => controls.current?.rotate(0.5)}
              >
                ↷
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
