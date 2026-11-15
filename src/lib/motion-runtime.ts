import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion } from "./motion-config";

gsap.registerPlugin(ScrollTrigger);

export function mountMotion() {
  const root = document.documentElement;
  root.dataset.enhancedMotion = "true";
  const disposers: (() => void)[] = [];
  const media = gsap.matchMedia();
  const select = <T extends Element = HTMLElement>(selector: string) =>
    gsap.utils.toArray<T>(selector);
  const listen = (target: EventTarget, event: string, fn: EventListener) => {
    target.addEventListener(event, fn);
    disposers.push(() => target.removeEventListener(event, fn));
  };

  const context = gsap.context(() => {
    select<HTMLElement>(".curved-type").forEach((heading) => {
      const letters = heading.querySelectorAll(".glyph-ink");
      const inHero = !!heading.closest(
        ".home-hero,.page-hero,.detail-hero,.not-found",
      );
      gsap.from(letters, {
        yPercent: 105,
        rotation: (i) => (i % 2 ? 12 : -12),
        opacity: 0,
        duration: motion.reveal,
        ease: motion.ease,
        stagger: { each: motion.stagger, from: "center" },
        delay: inHero && root.dataset.transition ? 0.6 : 0,
        scrollTrigger: { trigger: heading, start: "top 94%", once: true },
      });
    });
    select<HTMLElement>(".tag").forEach((tag) => {
      gsap.from(tag, {
        rotationY: -85,
        opacity: 0,
        transformOrigin: "left center",
        transformPerspective: 700,
        duration: 0.8,
        ease: motion.spring,
        scrollTrigger: { trigger: tag, start: "top 94%", once: true },
      });
    });
    select<HTMLElement>(
      "[data-reveal], .story-columns p, .detail-copy, .mini-process article, .focus-article-copy, .service-note, .contact-sheet",
    ).forEach((item) => {
      if (
        item.matches(
          ".belief-heading,.contact-cta,.values-list article,.process-sheet",
        )
      )
        return;
      gsap.from(item, {
        y: 45,
        opacity: 0.25,
        duration: 0.9,
        ease: motion.ease,
        scrollTrigger: { trigger: item, start: "top 94%", once: true },
      });
    });
    select<HTMLElement>(
      ".handnote:not(.object-controls .handnote):not(.site-menu .handnote):not(.transition-mark .handnote)",
    ).forEach((note) => {
      gsap.from(note, {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.05,
        ease: "power2.inOut",
        scrollTrigger: { trigger: note, start: "top 95%", once: true },
      });
    });
    select<HTMLElement>(
      ".hero-object,.about-object,.approach-object,.detail-object,.service-product .three-object",
    ).forEach((object) => {
      gsap.from(object, {
        y: 100,
        scale: 0.7,
        rotation: -14,
        opacity: 0,
        duration: 1.15,
        ease: motion.spring,
        delay: object.closest(".home-hero") ? 0.5 : 0,
        scrollTrigger: { trigger: object, start: "top 98%", once: true },
      });
    });
    // Scroll poses complement manual drag and the native 3D idle movement.
    select<HTMLElement>(".object-canvas").forEach((host) => {
      const pose = { turn: -0.22, tilt: -0.05 };
      const update = () => {
        host.dataset.scrollTurn = String(pose.turn);
        host.dataset.scrollTilt = String(pose.tilt);
        host.dispatchEvent(new CustomEvent("gk-object-pose", { detail: pose }));
      };
      gsap.to(pose, {
        turn: 0.65,
        tilt: 0.1,
        ease: "none",
        onUpdate: update,
        scrollTrigger: {
          trigger: host.closest(".three-object"),
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
      disposers.push(() => {
        delete host.dataset.scrollTurn;
        delete host.dataset.scrollTilt;
        host.dispatchEvent(
          new CustomEvent("gk-object-pose", { detail: { turn: 0, tilt: 0 } }),
        );
      });
    });
    select<HTMLElement>(
      ".footer-sticker,.hero-stamp,.about-photo,.place-picture",
    ).forEach((item, i) => {
      gsap.fromTo(
        item,
        { y: 26, rotation: i % 2 ? -5 : 5 },
        {
          y: -28,
          rotation: i % 2 ? 4 : -4,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        },
      );
    });
    select<HTMLElement>(".tape").forEach((tape) => {
      gsap.to(tape, {
        rotationX: 23,
        skewX: 3,
        transformPerspective: 450,
        transformOrigin: "left center",
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        repeatDelay: 3.2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: tape,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      });
    });
  });

  media.add("(min-width: 1024px) and (min-height: 740px)", () => {
    const belief = document.querySelector<HTMLElement>(".belief-section");
    if (belief) {
      const lines = belief.querySelectorAll(".manifesto-line");
      gsap
        .timeline({
          scrollTrigger: {
            id: "belief-pin",
            trigger: belief,
            start: "top top",
            end: "+=110%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .from(
          lines,
          {
            xPercent: (i) => (i % 2 ? 18 : -18),
            opacity: 0.28,
            stagger: 0.3,
            duration: 0.7,
            ease: "power2.out",
          },
          0,
        )
        .to(
          belief.querySelector(".belief-asterisk"),
          { rotation: 210, scale: 1.3, x: -40, duration: 1.5 },
          0,
        )
        .from(
          belief.querySelector(".belief-bottom"),
          { y: 40, opacity: 0, duration: 0.6 },
          0.8,
        );
    }
    const values = document.querySelector<HTMLElement>(".values-section");
    const track = values?.querySelector<HTMLElement>(".values-list");
    const viewport = values?.querySelector<HTMLElement>(".values-window");
    if (values && track && viewport) {
      values.classList.add("values-conveyor");
      const distance = () =>
        Math.max(0, track.scrollWidth - viewport.clientWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          id: "values-pin",
          trigger: values,
          start: "top top",
          end: () => `+=${distance() + innerHeight * 0.4}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }
    const cards = select<HTMLElement>(".process-sheet");
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      gsap.to(card, {
        scale: 0.9,
        rotation: i % 2 ? -3 : 3,
        filter: "brightness(0.85)",
        transformOrigin: "center top",
        ease: "none",
        scrollTrigger: {
          trigger: cards[i + 1],
          start: "top 75%",
          end: "top 15%",
          scrub: 0.6,
        },
      });
    });
    return () => values?.classList.remove("values-conveyor");
  });

  media.add("(hover: hover) and (pointer: fine)", () => {
    const local: (() => void)[] = [];
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      allowNestedScroll: true,
      prevent: (node) => !!node.closest("dialog,textarea,[data-lenis-prevent]"),
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    const stop = () => lenis.stop();
    const start = () => {
      if (!document.querySelector("dialog[open]") && !root.dataset.transition)
        lenis.start();
    };
    window.addEventListener("gk-menu-open", stop);
    window.addEventListener("gk-menu-close", start);
    window.addEventListener("gk-route-start", stop);
    window.addEventListener("gk-route-end", start);
    if (root.dataset.transition || document.querySelector("dialog[open]"))
      stop();
    select<HTMLElement>(".glyph-ink").forEach((letter) => {
      const lift = gsap.quickTo(letter, "y", {
        duration: 0.65,
        ease: "elastic.out(1,0.45)",
      });
      const turn = gsap.quickTo(letter, "rotation", {
        duration: 0.7,
        ease: "elastic.out(1,0.4)",
      });
      const enter = () => {
        lift(-12);
        turn(8);
      };
      const leave = () => {
        lift(0);
        turn(0);
      };
      letter.addEventListener("pointerenter", enter);
      letter.addEventListener("pointerleave", leave);
      local.push(() => {
        letter.removeEventListener("pointerenter", enter);
        letter.removeEventListener("pointerleave", leave);
      });
    });
    const cursor = document.querySelector<HTMLElement>(".paper-cursor");
    const cursorShape = cursor?.firstElementChild;
    const sizeX = cursorShape
      ? gsap.quickTo(cursorShape, "scaleX", {
          duration: 0.25,
          ease: "power3.out",
        })
      : null;
    const sizeY = cursorShape
      ? gsap.quickTo(cursorShape, "scaleY", {
          duration: 0.25,
          ease: "power3.out",
        })
      : null;
    const size = (value: number) => {
      sizeX?.(value);
      sizeY?.(value);
    };
    const turn = cursorShape
      ? gsap.quickTo(cursorShape, "rotation", {
          duration: 0.3,
          ease: "power3.out",
        })
      : null;
    const pointer = (event: PointerEvent) => {
      if (!cursor) return;
      const target = event.target as Element;
      const native = !!target.closest(
        "input,textarea,select,dialog,.object-canvas",
      );
      root.classList.toggle("has-paper-cursor", !native);
      cursor.style.opacity = native ? "0" : "1";
      cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      const over = !!target.closest("a,button,summary");
      size?.(over ? 1.2 : 1);
      turn?.(over ? -10 : 7);
    };
    const hide = () => {
      root.classList.remove("has-paper-cursor");
      if (cursor) cursor.style.opacity = "0";
    };
    const press = () => size?.(0.85);
    const up = () => size?.(1);
    document.addEventListener("pointermove", pointer);
    document.addEventListener("pointerleave", hide);
    document.addEventListener("pointerdown", press);
    document.addEventListener("pointerup", up);
    window.addEventListener("blur", hide);
    select<HTMLElement>(".button,.social-link,.brand").forEach((button) => {
      const x = gsap.quickTo(button, "x", {
        duration: 0.55,
        ease: "elastic.out(1,0.5)",
      });
      const y = gsap.quickTo(button, "y", {
        duration: 0.55,
        ease: "elastic.out(1,0.5)",
      });
      const move = (e: PointerEvent) => {
        const box = button.getBoundingClientRect();
        x((e.clientX - box.left - box.width / 2) * 0.12);
        y((e.clientY - box.top - box.height / 2) * 0.18);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      button.addEventListener("pointermove", move);
      button.addEventListener("pointerleave", leave);
      local.push(() => {
        button.removeEventListener("pointermove", move);
        button.removeEventListener("pointerleave", leave);
      });
    });
    return () => {
      local.forEach((fn) => fn());
      hide();
      lenis.destroy();
      gsap.ticker.remove(tick);
      window.removeEventListener("gk-menu-open", stop);
      window.removeEventListener("gk-menu-close", start);
      window.removeEventListener("gk-route-start", stop);
      window.removeEventListener("gk-route-end", start);
      document.removeEventListener("pointermove", pointer);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", up);
      window.removeEventListener("blur", hide);
    };
  });
  const refresh = () => ScrollTrigger.refresh();
  listen(window, "gk-layout", refresh);
  listen(window, "gk-route-end", refresh);
  ScrollTrigger.refresh();
  return () => {
    media.revert();
    context.revert();
    disposers.forEach((dispose) => dispose());
    delete root.dataset.enhancedMotion;
  };
}
