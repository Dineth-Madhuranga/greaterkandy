# GreaterKandy reference audit

Audit date: 14 November 2026. The supplied workspace was empty, including hidden files: there was no Git history, package manifest, application source, asset library, backend source, or AGENTS.md. No existing user files were replaced.

The live reference was accessible via direct HTTP: https://greater-kandy-mauve.vercel.app/ . Its `/`, `/about`, `/what-we-do`, and `/contact` pages and public page scripts were inspected. `scripts/audit-reference.py` reproduces the read-only audit. Downloaded reference material is ignored by Git.

## Existing implementation

- Next.js App Router / React, utility-class styling consistent with Tailwind, Lucide icons, and client motion components. Exact original package versions and package manager cannot be recovered from public HTML.
- Routes `/`, `/about`, `/what-we-do`, `/contact` are retained as real pages.
- The live canonical is `https://greaterkandy.org/`. This is preserved, not replaced with the Vercel preview domain. The domain's ownership and current deployment remain for the owner to confirm.
- Existing contact submits JSON `{ name, email, subject, message }` to `/api/contact` and expects `{ success: true }`. Backend code and email-provider configuration are absent. The replacement route forwards this same contract to the existing public endpoint, configurable through server-side `CONTACT_API_URL`.
- Crisp website ID `24164f41-20f7-43da-b799-2f23541ae008` is present in the public layout. It is preserved, but loaded on explicit visitor request.
- Public footer/contact content verifies `info@greaterkandy.org`, `+94 77 769 2126`, and `Kandy 20000, Sri Lanka`.
- Main contact and floating WhatsApp use `94777692126`. One footer social link instead uses `94701551777`; the consistent primary number was retained and the inconsistent one omitted.
- Instagram, Facebook, LinkedIn, and X destinations are retained, without tracking query parameters.
- No privacy/legal destination was present. No new legal claims, tracking analytics, cookie banner, or fake policy is introduced.

## Content and asset decisions

- Make sustainable marketing the primary story, as requested. Retain supported green advertising, brand engagement, public-space opportunities, digital signage, interactive kiosks, wayfinding, and city-initiative themes.
- Reframe broad smart-city infrastructure topics as supporting interests on `/what-we-do`, rather than completed work or established delivery capabilities.
- No sufficient case-study details, dates, substantiated outcomes, client approvals, or authentic campaign photographs were available. Use Areas of Focus instead of Selected Work. Do not invent Brand Strategy, full-service design, campaign activation delivery, or website development services.
- Existing client logos are generic-numbered, duplicated in a marquee, and include recognizable technology companies without clear relationship evidence. Omit the trust strip pending confirmation.
- Omit animated counters, exclusivity/leadership claims, quantified sustainability claims, and unverified government affiliations. The live site mentions Media Asia Networks ownership; this corporate/legal claim is not repeated without supporting company information.
- The existing 120px logo is a small raster wordmark with white lettering and low legibility on warm paper. Its source file is preserved in `public/images/greaterkandy-mark.webp`; the header/footer use an accessible typographic GreaterKandy wordmark. A higher-resolution brand master remains desirable.
- Existing service images include generic interiors and illustrative technology imagery. Those are not represented as real projects. Licensed Kandy photographs establish local context; see ASSETS.md and `/credits`.

## Problems addressed

- Original hero is a full-screen canvas with `touch-action:none`; substantial navigation/content is initially opacity-zero and depends on scripts.
- Duplicate titles and descriptions, placeholder Open Graph image, generic client-image alt text, nested anchor/button controls, tiny text, large floating widgets, and a stale footer year were present.
- Replacement uses semantic HTML, one H1 per page, native details, a native dialog, a skip link, focus styles, reduced-motion support, persistent server-rendered content, local fonts, optimized images, reusable tokens, and page-specific metadata.
- The four-stage process and sustainability considerations are editorial framing for the requested positioning, not evidence of certified practices or measured impact.

## Implementation choice

Next.js App Router was chosen to match the live site's framework family. npm was chosen because no existing lockfile was supplied. Styling uses plain CSS with reusable tokens. The later Sweet Tape direction adds Three.js, GSAP and Lenis for the requested 3D and motion. No UI kit, icon package, or analytics dependency is added.

## Updated visual direction — 15 November 2026

The user subsequently requested the Sweet Tape visual treatment across all pages. This supersedes the original warm-paper editorial direction and its preference against 3D. Inspected the reference homepage, About, Products, News, and Contact, along with their browser-rendered layouts, CSS, typography, and public media.

- Reference palette: forest `#034102`, dark ink `#013900`, lime `#b6fe00`, orange `#fa8005`, sky `#50cbff`, royal `#2e3eac`, yellow `#f7d000`, coral `#ff7b5f`, and cream `#fdfbe8`.
- User approved Barlow Condensed as a close open-license alternative to the reference’s licensed Futura PT Condensed. Inter Tight and Nothing You Could Do match the reference’s other families.
- Implemented curved oversized headings, a shared tear-away menu, paper textures and tape, curved section edges, animated ribbons, original interactive 3D objects, and a large sticker-led footer.
- Dedicated compositions for About, services catalogue, four service details, Areas of Focus, Our Approach, Contact, credits, and 404. Broader city interests now have their own `/focus` route.
- Three.js provides the original procedural objects and textures. Each scene loads near the viewport, caps pixel density, pauses when out of view, respects reduced motion, offers rotation/pause buttons, disposes resources, and retains a native SVG fallback.
- No Sweet Tape branded copy, model files, images, or Adobe Fonts project is embedded in the site. Reference inspection files remain outside the public application.

All original truthfulness, accessibility, contact contract, canonical, and local-only deployment constraints continue to apply.

## Expanded motion — 15 November 2026

The user explicitly requested the reference's transitions, animations, and motion across the complete site. Further browser and public-bundle inspection identified its layered paper curtains, brand intro, rolling menu, split-letter entrances, elastic pointer response, smooth desktop scrolling, pinned stories, horizontal conveyor, changing 3D product stage and parallax collage.

GSAP/ScrollTrigger and Lenis now drive equivalent shared behaviors, adapted to the agency content. The homepage opening is lime with forest type, followed by forest sections, matching the reference's actual initial state. The About values use a desktop conveyor, the homepage manifesto pins during its sequence, and the Approach cards stack. The service selector queues rapid changes through a curved color wipe and spring entrance. Other pages share type, tag, note, cursor, 3D, menu and navigation behavior. See [MOTION.md](MOTION.md) for the complete mapping and fallbacks.

Reduced motion and the pause toggle restore normal page flow and remove the enhanced runtime. Phone touch scrolling remains native. Testing includes route/history behavior, cleanup of pinning, live preference changes, menu arrows, pointer warnings, rapid service selection and responsive layout. No reference-site source, model, audio or proprietary font file is shipped in the public application.
