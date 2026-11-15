"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { brand, navigation } from "@/lib/content";
import { Arrow } from "./icons";
import { Wordmark } from "./design";
import { MotionToggle } from "./motion";
import { gsap } from "gsap";
import { motionAllowed } from "@/lib/motion-config";
import { ObjectArt, type ObjectKind } from "./object-art";

export function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();
  const close = () => {
    const el = dialog.current;
    if (!el?.open) return;
    animation.current?.kill();
    if (!motionAllowed()) {
      el.close();
      return;
    }
    animation.current = gsap
      .timeline({ onComplete: () => el.close() })
      .to(el, {
        clipPath: matchMedia("(max-width: 767px)").matches
          ? "inset(0 0 0 100%)"
          : "inset(0 0 100% 0)",
        duration: 0.4,
        ease: "power3.inOut",
      });
  };
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const elements = event.currentTarget.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    const first = elements[0],
      last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("gk-menu-open"));
    const el = dialog.current!;
    const context = gsap.context(() => {
      if (!motionAllowed()) return;
      animation.current = gsap
        .timeline()
        .fromTo(
          el,
          {
            clipPath: matchMedia("(max-width: 767px)").matches
              ? "inset(0 0 0 100%)"
              : "inset(0 0 100% 0)",
          },
          { clipPath: "inset(0 0 0 0)", duration: 0.7, ease: "power3.inOut" },
        );
      el.querySelectorAll("nav > a").forEach((row, index) => {
        const start = 0.18 + index * 0.075;
        animation
          .current!.from(
            row.querySelectorAll(".menu-letter"),
            {
              yPercent: 115,
              rotation: 8,
              opacity: 0,
              duration: 0.7,
              stagger: { each: 0.018, from: "center" },
              ease: "power3.out",
            },
            start,
          )
          .from(
            row.querySelector(".menu-rule"),
            { scaleX: 0, transformOrigin: "left", duration: 0.7 },
            start,
          )
          .fromTo(
            row.querySelector(".arrow"),
            { scale: 0, rotation: -70 },
            { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.2)" },
            start + 0.15,
          );
      });
    });
    const forceClose = () => {
      animation.current?.kill();
      el.close();
    };
    const interrupt = () => {
      if (!motionAllowed()) {
        animation.current?.progress(1);
      }
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("gk-route-start", forceClose);
    window.addEventListener("gk-motion", interrupt);
    reduced.addEventListener("change", interrupt);
    return () => {
      animation.current?.kill();
      context.revert();
      document.body.style.overflow = before;
      window.dispatchEvent(new Event("gk-menu-close"));
      window.removeEventListener("gk-route-start", forceClose);
      window.removeEventListener("gk-motion", interrupt);
      reduced.removeEventListener("change", interrupt);
    };
  }, [open]);
  return (
    <>
      <header className="site-header">
        <Link href="/about" className="header-note">
          BIG IDEAS.
          <br />
          ROOTED IN KANDY.
        </Link>
        <Link className="brand" href="/" aria-label="GreaterKandy home">
          <Wordmark small />
        </Link>
        <button
          className="menu-trigger paper"
          ref={trigger}
          onClick={() => {
            dialog.current?.showModal();
            setOpen(true);
          }}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-haspopup="dialog"
        >
          <span className="perforation" />
          <span>PULL ME</span>
          <span className="menu-down" aria-hidden="true">
            ↓
          </span>
        </button>
        <MotionToggle />
      </header>
      <noscript>
        <style>
          {
            ".menu-trigger,.motion-toggle,.focus-filters,.playground-controls,.chat-option{display:none}*{animation:none!important}"
          }
        </style>
        <nav
          className="no-script-nav"
          aria-label="Navigation without JavaScript"
        >
          {navigation.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
          <a href="/contact">Contact</a>
        </nav>
      </noscript>
      <dialog
        ref={dialog}
        id="site-menu"
        className="site-menu paper"
        aria-label="Main navigation"
        onKeyDown={trapFocus}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
      >
        <div className="menu-top">
          <Link href="/" onClick={close} aria-label="GreaterKandy home">
            <Wordmark small />
          </Link>
          <span className="handnote">Go somewhere good.</span>
          <button className="menu-close" onClick={close} autoFocus>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Main navigation pages">
          {[
            { label: "Home", href: "/" },
            ...navigation,
            { label: "Let’s talk", href: "/contact" },
          ].map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={close}
            >
              <span className="menu-index">0{index + 1}</span>
              <span className="menu-label" aria-label={item.label}>
                {[...item.label].map((letter, i) => (
                  <span className="menu-letter" aria-hidden="true" key={i}>
                    {letter === " " ? "\u00a0" : letter}
                  </span>
                ))}
              </span>
              <Arrow diagonal />
              <span className="menu-preview" aria-hidden="true">
                <ObjectArt
                  kind={
                    (
                      [
                        "megaphone",
                        "flower",
                        "billboard",
                        "kiosk",
                        "megaphone",
                        "flower",
                      ] as ObjectKind[]
                    )[index]
                  }
                />
              </span>
              <span className="menu-rule" aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <div className="menu-bottom">
          <span>KANDY, SRI LANKA ↗ THE WORLD</span>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </div>
      </dialog>
    </>
  );
}
