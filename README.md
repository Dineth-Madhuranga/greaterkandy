# GreaterKandy — Make your mark

A complete, locally implemented sustainable-marketing agency website built with Next.js App Router, React, TypeScript, Three.js, GSAP, Lenis, plain CSS, and npm. No public deployment has been made.

The current visual direction follows the user’s Sweet Tape reference across the full site: forest and acid lime, oversized condensed curved headings, bright service colors, paper texture, tear-away menu, handwritten notes, and original interactive 3D advertising objects. Barlow Condensed is the user-approved open-license substitute for Futura PT Condensed. Body and note families are Inter Tight and Nothing You Could Do.

## Run locally

Requires Node.js 20.9 or later and npm.

```powershell
npm install
npm run dev
```

Open http://127.0.0.1:3000 . Dependencies are pinned in `package-lock.json` after installation; use `npm ci` for subsequent clean installs.

For production locally:

```powershell
npm run build
npm run start
```

## Validation

```powershell
npm run lint
npm run typecheck
npm run build
npm test
```

Browser tests use an installed Google Chrome via Playwright's `chrome` channel. They start the production server automatically, or reuse an existing server at port 3000. If Chrome is not installed, install Chrome or change `channel` in `playwright.config.ts` to your available browser. No browser binaries are bundled into the application.

The suite checks widths 360, 390, 768, 1024, and 1440; every page at phone and desktop widths; accessibility with axe; dialog focus and Escape; interactive 3D controls and service selection; focus filters; keyboard accordions; form validation and response states; metadata; reduced motion; no-JavaScript content; and the contact proxy’s contract. All enquiry tests use mocked responses: they do not email the business. Chrome uses software WebGL in tests so that actual canvas rendering is exercised without requiring a GPU.

## Project map

- `src/app/`: home, About, service catalogue and four detail routes, Areas of Focus, Our Approach, Contact, credits, 404, API, metadata, and styles. Original useful URLs remain valid.
- `src/components/`: header, footer, design components, service selector, focus filters, contact form, optional chat, and motion enhancement.
- `src/lib/three-scene.ts`: procedural advertising objects with drag rotation, keyboard-accessible button controls, pause, resource cleanup, visibility gating, and reduced-motion support.
- `src/lib/content.ts`: verified contact details, navigation, services, process, and city interests.
- `src/app/tokens.css`: colors, spacing, page width, motion, and focus tokens.
- `public/images/` and `src/app/fonts/`: locally hosted assets and font licenses.
- `tests/`: browser/accessibility checks and contact API contract tests.
- `docs/AUDIT.md`: original-site audit, content decisions, and limitations.
- `docs/ASSETS.md`: photo sources, licensing, and desired future brand assets.
- `artifacts/`: review screenshots and validation notes.

## Enquiry delivery

The existing site's client calls `/api/contact` with `{ name, email, subject, message }` and expects `{ success: true }`. Its backend source and email-provider credentials were not supplied. This implementation preserves that contract through a server-side adapter; it defaults to the original public endpoint:

```text
https://greater-kandy-mauve.vercel.app/api/contact
```

The optional company field is included in the original subject/message fields. Only a successful HTTP response containing the boolean `success: true` displays success. Timeouts, malformed responses, and errors preserve the visitor's message and display the verified email/phone alternatives. Form content is never logged by the adapter.

Copy `.env.example` to `.env.local` to configure another backend:

```text
CONTACT_API_URL=https://your-backend.example/api/contact
CONTACT_API_TOKEN=
```

`CONTACT_API_TOKEN` is optional and sent only server-side as a Bearer token. An explicitly empty `CONTACT_API_URL` disables forwarding with an honest unavailable response. Do not point this URL back at this same `/api/contact` route. A future production domain move must restore the original backend or set this URL to a separate backend; the original Vercel host cannot proxy recursively to itself.

End-to-end email delivery remains unverified because no real enquiry was submitted during development. Existing provider/account configuration, durable anti-abuse controls, and delivery monitoring belong to the backend owner. The adapter includes server validation, same-origin checks, a honeypot, size limits, and a request timeout.

## Existing chat and direct contact

Crisp retains its public website identifier and loads only after the visitor clicks “Open live chat.” Set `NEXT_PUBLIC_CRISP_WEBSITE_ID` to override it. This is a public identifier, not a secret. No chat or external tracking script loads on initial page load. Email, telephone, WhatsApp, and social destinations come from the original site.

## Content decisions

The workspace was empty; the public site was used as the reference. The implementation matches its Next.js framework family, preserves useful routes and the existing `https://greaterkandy.org` canonical, and makes sustainable marketing the primary story.

“Areas of Focus” replaces unsubstantiated case studies. No clients, project results, government partnerships, environmental measurements, certifications, or testimonials are invented. Broader smart-city topics are retained as supporting areas of interest. The image credits page identifies licensed local-context photos and their adaptations.

Before a future launch, confirm the canonical domain and backend configuration. An approved vector logo, owned project photography, approved case studies, and verified client relationships would support future content additions; the current experience has no empty cards waiting for them.

## Motion and 3D behavior

The shared motion system recreates the Sweet Tape reference's paper transitions, rolling menu, staggered type, playful pointer responses, scrolling scenes, and 3D movement using GreaterKandy's own content and objects. See [the motion inventory](docs/MOTION.md) for the page-by-page mapping and implementation details.

Internal navigation uses four curved color sheets, followed by a reveal of the new page. A short brand reveal runs once per tab. Desktop wheel scrolling uses Lenis; touch scrolling stays native. The homepage manifesto and About-page values become pinned desktop sequences, and the Approach cards stack as the visitor scrolls. Smaller and short viewports use flowing layouts. The service carousel has a color wipe and springing object swap, and queues rapid selections.

Three.js is loaded on demand as an object approaches the viewport. Each object renders an original SVG before the canvas is ready and retains that illustration if WebGL is unavailable. Drag horizontally to rotate, or use the visible rotate and pause buttons. Scroll and pointer position influence the models. Vertical touch gestures remain available for scrolling. Render loops stop offscreen and in hidden tabs.

The fixed motion toggle removes scroll pinning, smooth scrolling, pointer effects and ambient movement. The operating system's reduced-motion preference also bypasses animated navigation and menu/carousel entrances. Essential content and navigation work without JavaScript. All listeners, pinned spacers, timers and WebGL resources are cleaned up on route changes. There is no autoplay audio.

## Routes

`/`, `/about`, `/what-we-do`, `/what-we-do/sustainable-marketing`, `/what-we-do/outdoor-advertising`, `/what-we-do/digital-signage`, `/what-we-do/community-initiatives`, `/focus`, `/our-approach`, `/contact`, `/credits`.
