# Remaining Work — Responsive / UI / Motion Pass

Status file. Written mid-pass so the next person (or session) can pick up exactly
where this stopped. Read `HANDOFF.md` first for project background — this file
only covers the responsive/UI/animation workstream.

---

## 0. How this was verified

A dependency-free Chrome DevTools Protocol harness was used (Node 24 has a global
`WebSocket`, so no npm install was needed). Scripts live in the session scratchpad:

| Script | What it does |
|---|---|
| `cdp.js` | Minimal CDP driver (launch, navigate, viewport, screenshot, evaluate) |
| `audit.js` | Every page x 8 widths: overflow, console errors, broken images, tap targets, sub-12px text, stuck reveals |
| `contrast.js` | Screenshots the hero with text hidden, samples the **brightest** backdrop pixel behind each text box, computes real WCAG ratios |
| `interact.js` | Drives real clicks/keys: nav drawer, gallery filters, lightbox, form validation, counters |
| `probe.js` | Ad-hoc single-page inspector for chasing one specific finding |

**These scripts are in the temp scratchpad and will be lost.** If this work
continues, re-create them or move them into the repo under `tools/`. That is
item 4 below.

Breakpoints tested: **360, 390, 430, 768, 1024, 1280, 1440, 1920**
(13 HTML pages x 8 widths = 104 combinations).

---

## 1. DONE and verified

| # | Change | Where | Verified by |
|---|---|---|---|
| 1 | Touch targets raised to 44px on coarse pointers (footer nav/contact/credit links, brand lockup, breadcrumbs, filter pills, dropdown items, `.contact-v`, `.reach-link`, `.fac-title-link`) | `css/style.css` §24.2 | audit.js — went from ~20 failures/page to 0 |
| 2 | All rendered text raised to >=12px (`.brand-sub`, `.contact-k`, `.stat-label`, `.footer-name span`, `.footer-h`). Narrow screens now trade **letter-spacing**, not font-size, to keep the brand on one line | `css/style.css` §24.1 | audit.js — 0 sub-12px text remaining |
| 3 | Desktop hero text was unreadable on the lit gold facade. Veil pool widened/deepened, headline moved `--gold` -> `--gold-light`, eyebrow -> `--gold-pale` | `css/style.css` `.hero-veil`, `.hero-title-main`, `.hero .eyebrow` | contrast.js — all 4 hero text elements now **PASS AA** at 960/1024/1100/1280/1440/1920 (worst case 3.26:1 vs 3.0 required) |
| 4 | **Gallery filter bar was missing from the markup.** The CSS (`.filters`, `.filter`, `.is-hidden`, `.gal-empty`), the JS (`initGalleryFilter`, `Lightbox.refresh`, arrow-key tablist) and every `data-category` attribute were all still present — only the HTML had been deleted, leaving stale copy telling users to "Select a category to filter". Restored the tablist + `#galEmpty` | `gallery.html` | interact.js — all 5 filters correct, tablist arrow keys work, lightbox re-collects only visible items |
| 5 | Mobile drawer never moved focus into itself (focus was silently dropped to `<body>` because `focus()` on a `visibility:hidden` element is a no-op) | `js/script.js` `initMobileNav` | interact.js |
| 6 | Drawer is modal (scrim + scroll lock) but Tab could escape behind it — added a focus trap, plus focus returns to the toggle on close | `js/script.js` `initMobileNav` | interact.js |
| 7 | Removed dead `.to-top` CSS — no page has ever contained that element; `initBackToTop` actually drives `.floating-wa` | `css/style.css` | grep across all 13 pages |

**Current automated state:**
- 104/104 page-width combos: **zero horizontal overflow**
- 104/104: **zero console errors, zero JS exceptions**
- 104/104: **zero stuck `.reveal` elements**
- **48/48 interaction assertions pass**

---

## 2. COMPLETED IN THIS PASS

| # | Task | Status | Details |
|---|---|---|---|
| 8 | `.to-top` cleanup | Done | Verified `.floating-wa` replaces `.to-top` in print styles (`css/style.css` line 1872) |
| 9 | Consolidate motion tokens | Done | Harmonized ad-hoc `cubic-bezier` and `ease` timings across dropdowns, filters, gallery overlays, lightbox, forms, and floating WhatsApp button onto `--ease`, `--ease-out`, and `--ease-spring` |
| 10 | Focus-visible filter pills | Done | Added explicit gold focus outline and pill border radius to `.filter:focus-visible` |
| 11 | Lightbox image transitions | Done | Smooth scaling/fading with `--ease-spring` and `--ease` tokens |
| 12 | Enhanced `prefers-reduced-motion` | Done | Disabled WhatsApp button blink and all transitions when reduced motion is preferred |
| 13 | Repository test harness | Done | Created `tools/audit.js` and `tools/README.md` for repeatable offline CDP layout/behavior audits |

---

## 3. Still open from `HANDOFF.md` §5 (untouched by this pass)

These are pre-existing items this workstream did not cover:

- **Video** — poster, play button, no autoplay-with-sound, muted hero loop.
  Never tested in a browser.
- **Google Maps iframe** — resolves to the correct location when online.
  Cannot be checked offline; all tests here ran against `file://`.
- **Google Fonts** — confirm they load when online. Every measurement in this
  pass used the local fallback stack, so **type metrics may shift slightly once
  the real fonts load**. Re-run `audit.js` against a served copy with network
  access before launch.
- **Favicon** — still an inline SVG data-URI in every `<head>`; no real file.
- **Canonical URLs / structured data** — deliberately relative until a live
  domain exists. Do not "fix" without the real domain.

---

## 4. Known non-issues — do not "fix" these

- `audit.js` reports `BROKEN-IMG (no src)` on 8 pages. This is the **closed
  lightbox** `<img id="lbImg">`, which intentionally has no `src` (see
  `HANDOFF.md` §2). It is a false positive in the audit script, not a bug.
- `enquiry.html` reports one 20px-tall tap target: the phone number link inside
  the `.form-note` sentence. WCAG 2.5.8 explicitly exempts links inline in a
  block of text, and forcing 44px there would break the line box. **Left
  deliberately.**
- The single-file shared `css/style.css` + `js/script.js` structure is
  intentional (`HANDOFF.md` §6). Do not split.
