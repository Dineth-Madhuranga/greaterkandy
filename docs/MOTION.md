# GreaterKandy motion implementation

The public Sweet Tape site was inspected in Chrome at desktop and phone widths on 15 November 2026. Its rendered behavior and public client bundles informed this inventory. Reference captures remain in the ignored `reference/sweet-tape/` directory. The implementation uses original code, procedural 3D objects, and GreaterKandy content; the approved font substitute is Barlow Condensed.

## Reference behavior and implementation

| Behavior observed | GreaterKandy implementation | Where |
| --- | --- | --- |
| Curved, layered paper transitions | Four orange, blue, yellow and lime sheets cover before route commit, then lift away | Internal page links throughout the site |
| Animated brand intro | A springing, turning brand sticker followed by a sheet reveal, once per tab | First visit to any page |
| Smooth wheel scrolling | Lenis coordinated with GSAP ScrollTrigger; nested dialog and text fields excluded | Fine-pointer desktop devices |
| Menu unroll / sideways unfold | Desktop vertical clip reveal, phone horizontal reveal; staggered letter rows, dotted rules and popping arrows; reverse close | Shared native dialog |
| Menu hover illustrations | Original advertising-object previews spring into each row | Menu hover and keyboard focus |
| Split headline entrance | Curved letters rise and rotate with a center-out stagger | Hero and CTA headings, footer |
| Elastic letter interactions | Individual letters lift and tilt, then spring back | Fine-pointer headings |
| Label flips and handwriting reveals | Perspective label flip and directional handwritten-note reveal | All pages with shared tags/notes |
| Floating and parallax collage | Scroll-linked photo/sticker tilt and vertical drift; paper tape peels | Home, About, footer |
| Custom paper cursor | Original outlined arrow changes scale/angle over links and buttons | Fine-pointer devices; native cursors on fields, dialogs and 3D controls |
| Responsive buttons and cards | Subtle magnetic buttons, hover lift and rotation, moving arrows | Shared CTAs, service catalogue, links |
| Animated product carousel | Curved color wipe, outgoing object shrink, incoming spring rotation, dipped text, queued changes | Homepage services |
| Pinned typographic story | Three manifesto lines enter in sequence with a rotating asterisk and final CTA | Homepage, desktop width ≥1024 and height ≥740 |
| Pinned horizontal conveyor | Three values cards move horizontally with the page scroll | About, same desktop conditions |
| Stacked moving sheets | Sticky process cards scale/tilt as later cards cover them | Our Approach, same desktop conditions |
| 3D ambient and scroll motion | Procedural objects float, yaw, tilt with scrolling, follow pointer position, and accept drag/button rotation | Home, About, services, detail pages, Approach, footer |
| Filter transitions | Focus articles rise and tilt into the filtered layout | Areas of Focus |
| Continuous ribbons | Seamless, duplicated CSS text tracks | Home and About |

The visual palette also follows the reference's lime opening with forest type, followed by deep green sections. Content and page-specific sequences are adapted to an advertising agency, rather than presenting tape products or invented agency projects. The reference's audio effects are not included; the requested work concerns visual motion.

## Controls, resilience and accessibility

- `Pause motion` removes the GSAP/Lenis enhancement, returns pinned content to normal flow, and stops CSS/3D ambient animation. `Play motion` restores it. The choice survives client-side navigation.
- Reduced-motion settings are observed live. Changing the preference during a curtain finishes the intended navigation without leaving an overlay or scroll lock.
- Mobile touch scroll stays native. Pinning and horizontal scroll scenes have vertical fallbacks at smaller sizes and short heights.
- The menu retains native dialog semantics, focus containment, Escape/backdrop dismissal, and trigger-focus restoration. Route navigation closes the dialog before the curtain covers the page.
- Route curtains ignore external links, download links, modifier clicks and same-path links. Back/forward navigation stays with the browser. A seven-second failsafe removes the curtain if a route cannot finish.
- New pages receive main-content focus after an animated navigation. No introductory animation is required to access server-rendered content when JavaScript is absent.
- GSAP contexts and media-query contexts revert on route changes. Lenis, ticker subscriptions, pointer listeners, scrolling poses and pinned spacers are disposed together.
- Three.js loads only near the viewport, caps device pixel ratio, stops idle rendering when hidden, and disposes renderer/material/texture/geometry resources. Original SVG artwork remains available when WebGL fails.

## Source map

- `src/components/page-transition.tsx`: shared intro and route curtains.
- `src/components/motion.tsx`: runtime lifecycle, global toggle and cursor markup.
- `src/lib/motion-runtime.ts`: type, labels, parallax, scroll sequences, pointer behavior and Lenis integration.
- `src/lib/motion-config.ts`: shared timing/easing and motion preference guard.
- `src/components/header.tsx`: menu reveal, close and interaction lifecycle.
- `src/components/service-playground.tsx`: queued carousel choreography.
- `src/lib/three-scene.ts`: original models, pointer and scroll poses.
- `src/app/motion.css`: progressive motion styling and responsive fallbacks.

## Verification

`tests/motion.spec.ts` covers curtain lifecycle, route focus/scroll restoration, history navigation, pinned scroll movement and teardown, live motion preference changes, responsive fallback, menu arrow completion, pointer warnings, 3D scroll poses, and queued carousel changes. The wider suite checks all content pages, five widths, automated accessibility, menu keyboard behavior, no-JavaScript use and form/API behavior.

`node scripts/review-motion.mjs` captures representative animation frames under `artifacts/motion/` and records browser errors/warnings in `review.json`. `node scripts/review-design.mjs` captures the stable page layouts. These are Chrome desktop/mobile-emulation checks; physical iOS Safari and Android hardware checks have not been performed.

The completed build passed 27 browser/API tests, TypeScript, ESLint and the production build. The animation frame review reported no browser errors or warnings. Results and diagnostic limitations are recorded in [the validation report](../artifacts/motion/VALIDATION.md).

The animation APIs follow [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [GSAP matchMedia documentation](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), and the [Lenis integration documentation](https://github.com/darkroomengineering/lenis).
