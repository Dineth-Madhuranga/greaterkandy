"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import { motionAllowed } from "@/lib/motion-config";
import Link from "next/link";
import { capabilities } from "@/lib/content";
import { ThreeObject } from "./three-object";
import { type ObjectKind } from "./object-art";
import { Arrow } from "./icons";
import { Tag } from "./design";

export function ServicePlayground() {
  const [selected, setSelected] = useState(0);
  const stage = useRef<HTMLElement>(null);
  const current = useRef(0);
  const requested = useRef(0);
  const busy = useRef(false);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const service = capabilities[selected];
  const change = (n: number) => {
    const next = (n + capabilities.length) % capabilities.length;
    requested.current = next;
    if (busy.current || next === current.current) return;
    const el = stage.current!;
    const object = el.querySelector(".playground-object");
    const copy = el.querySelectorAll(
      ".playground-info,.playground-description",
    );
    const wipe = el.querySelector<HTMLElement>(".playground-wipe")!;
    const commit = () => {
      current.current = next;
      flushSync(() => setSelected(next));
      window.dispatchEvent(new Event("gk-layout"));
    };
    if (!motionAllowed()) {
      commit();
      return;
    }
    busy.current = true;
    el.dataset.changing = "true";
    wipe.style.background = `var(--${capabilities[next].color})`;
    const direction = next > current.current ? 1 : -1;
    animation.current = gsap
      .timeline({
        onComplete: () => {
          gsap.set([object, ...copy], {
            clearProps: "opacity,visibility,scale,rotate,y",
          });
          busy.current = false;
          delete el.dataset.changing;
          if (requested.current !== current.current) change(requested.current);
        },
      })
      .to(
        object,
        {
          scale: 0.35,
          rotation: -24 * direction,
          opacity: 0,
          duration: 0.38,
          ease: "back.in(1.2)",
        },
        0,
      )
      .to(copy, { y: 35, opacity: 0, duration: 0.3, stagger: 0.035 }, 0)
      .fromTo(
        wipe,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.65, ease: "power3.inOut" },
        0.1,
      )
      .call(commit, [], 0.75)
      .set(wipe, { yPercent: 110 }, 0.76)
      .fromTo(
        object,
        { scale: 0.35, rotation: 28 * direction, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.75,
          ease: "back.out(1.6)",
        },
        0.76,
      )
      .to(
        copy,
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.04, ease: "power3.out" },
        0.8,
      );
  };
  useEffect(() => {
    const interrupt = () => {
      if (!motionAllowed()) animation.current?.progress(1);
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("gk-motion", interrupt);
    reduced.addEventListener("change", interrupt);
    return () => {
      animation.current?.kill();
      window.removeEventListener("gk-motion", interrupt);
      reduced.removeEventListener("change", interrupt);
    };
  }, []);
  return (
    <section
      id="capabilities"
      ref={stage}
      className={`playground paper color-${service.color}`}
      aria-labelledby="playground-heading"
    >
      <div className="playground-wipe paper" aria-hidden="true" />
      <div className="playground-top">
        <Tag>Four ways to make a difference</Tag>
        <Link className="text-link" href="/what-we-do">
          All our services <Arrow diagonal />
        </Link>
      </div>
      <h2 id="playground-heading" className="sr-only">
        Find your kind of impact
      </h2>
      <div className="playground-ghost" aria-hidden="true">
        FIND YOUR
        <br />
        KIND OF IMPACT.
      </div>
      <div className="playground-object">
        <ThreeObject key={service.object} kind={service.object as ObjectKind} />
      </div>
      <div className="playground-info" aria-live="polite">
        <span className="eyebrow">0{selected + 1} / 04 — WHAT WE DO</span>
        <h3>{service.shortTitle}</h3>
        <p>{service.title}</p>
        <Link className="button" href={`/what-we-do/${service.slug}`}>
          Explore this service <Arrow diagonal />
        </Link>
      </div>
      <div className="playground-description">
        <p>{service.description}</p>
        <span className="handnote">
          A new perspective
          <br />
          looks good on you.
        </span>
      </div>
      <div className="playground-controls">
        <button
          className="circle-button"
          aria-label="Previous service"
          onClick={() => change(requested.current - 1)}
        >
          ←
        </button>
        <div
          className="service-selector"
          role="group"
          aria-label="Choose a service"
        >
          {capabilities.map((s, i) => (
            <button
              key={s.slug}
              aria-pressed={selected === i}
              aria-label={s.title}
              onClick={() => change(i)}
            >
              <span>0{i + 1}</span>
              <span>{["Marketing", "Outdoor", "Digital", "Community"][i]}</span>
            </button>
          ))}
        </div>
        <button
          className="circle-button"
          aria-label="Next service"
          onClick={() => change(requested.current + 1)}
        >
          →
        </button>
      </div>
      <noscript>
        <p className="container">
          Explore all four services on our{" "}
          <Link href="/what-we-do">What We Do page</Link>.
        </p>
      </noscript>
    </section>
  );
}
