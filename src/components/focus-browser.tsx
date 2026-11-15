"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motionAllowed } from "@/lib/motion-config";
import Image from "next/image";
import Link from "next/link";
import { cityInterests } from "@/lib/content";
import { ObjectArt } from "./object-art";
import { Arrow } from "./icons";

export function FocusBrowser() {
  const [filter, setFilter] = useState(-1);
  const results = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!motionAllowed()) return;
    const context = gsap.context(() => {
      gsap.from(".focus-article", {
        y: 36,
        rotation: -1.5,
        opacity: 0.15,
        duration: 0.7,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "all",
      });
    }, results);
    window.dispatchEvent(new Event("gk-layout"));
    const settle = () => {
      if (!motionAllowed()) context.revert();
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("gk-motion", settle);
    reduced.addEventListener("change", settle);
    return () => {
      context.revert();
      window.removeEventListener("gk-motion", settle);
      reduced.removeEventListener("change", settle);
    };
  }, [filter]);
  return (
    <section className="focus-browser">
      <div
        className="focus-filters"
        role="group"
        aria-label="Filter areas of focus"
      >
        {[
          "All possibilities",
          "Mobility",
          "Greener places",
          "Public technology",
        ].map((label, i) => (
          <button
            key={label}
            aria-pressed={filter === i - 1}
            onClick={() => setFilter(i - 1)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="focus-results" aria-live="polite" ref={results}>
        {cityInterests.map(
          (item, i) =>
            (filter === -1 || filter === i) && (
              <article
                className={`focus-article focus-article-${i}`}
                key={item.title}
              >
                <div
                  className={`focus-image color-${["blue", "coral", "yellow"][i]} paper`}
                >
                  {i === 0 ? (
                    <Image
                      src="/images/kandy-city.webp"
                      alt="Kandy’s streets and buildings within the surrounding green hills"
                      width={1440}
                      height={1080}
                      sizes="(max-width:768px) 90vw, 65vw"
                    />
                  ) : (
                    <ObjectArt kind={i === 1 ? "flower" : "kiosk"} />
                  )}
                  <span className="focus-label">
                    {["THE WAY WE MOVE", "ROOM TO GROW", "TECH THAT HELPS"][i]}
                  </span>
                </div>
                <div className="focus-article-copy">
                  <span className="eyebrow">0{i + 1} / AREA OF INTEREST</span>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <Link className="text-link" href="/contact">
                    Start a conversation <Arrow diagonal />
                  </Link>
                </div>
              </article>
            ),
        )}
      </div>
      <p className="focus-context">
        These are areas we’re interested in exploring with businesses and local
        stakeholders. They describe opportunities for discussion, not completed
        projects or guaranteed services.
      </p>
    </section>
  );
}
