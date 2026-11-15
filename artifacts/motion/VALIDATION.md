# Motion build validation — 15 November 2026

- Production build: passed; all 11 content routes, custom 404, metadata and contact API generated successfully.
- TypeScript: passed, including motion regression tests.
- ESLint: passed.
- Playwright: **27 passed**, 3.8 minutes, Chrome with software WebGL. Includes six motion regressions, responsive/accessibility checks, all content pages, contact/API behavior, and no-JavaScript fallbacks.
- Homepage widths: 360, 390, 768, 1024 and 1440. Inner pages checked at 390 and 1440. No horizontal overflow or axe violations in the tested states.
- Animated desktop/mobile frame review: no browser errors or warnings; see `review.json` and the PNG captures in this directory.
- Runtime dependency audit: zero reported vulnerabilities with `npm audit --omit=dev`. The development dependency tree still has eight moderate advisories inherited through the TypeScript ESLint tooling.
- Local diagnostics: LCP 1.844 s at width 390 and 2.052 s at width 1440; CLS 0 and 0.00121 respectively. These are unthrottled local Chrome samples, not Lighthouse, field Core Web Vitals or INP results. Details: `../local-performance.json`.

The local production preview is served at `http://127.0.0.1:3000`. No public deployment was made. Physical iOS Safari/Android devices and real enquiry email delivery were not tested; form/API tests use mocked responses.
