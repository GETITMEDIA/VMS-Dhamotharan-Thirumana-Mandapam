# VMS Dhamotharan Thirumana Mandapam — Project Handoff

Status as of this handoff. Read this fully before continuing the build.

---

## 1. WHAT IS ALREADY BUILT (do not rebuild)

A complete, multi-page, vanilla HTML/CSS/JS website. No frameworks, no build step.

```
VMS Dhamotharan Thirumana Mandapam/
├── index.html          Home     — DONE
├── about.html          About    — DONE
├── gallery.html        Gallery  — DONE
├── services.html       Services — DONE
├── contact.html        Contact  — DONE
├── enquiry.html        Enquiry  — DONE
├── css/style.css       shared, complete
├── js/script.js        shared, complete
├── HANDOFF.md          this file
└── assets/
    ├── images/         8 original client .webp + 2 original large photos
    ├── images/optimized/   GENERATED derivatives (see §3)
    └── vedios/         original client mp4 + 2 GENERATED web versions
```

Header, footer, floating call/WhatsApp dock, back-to-top and all animations are
duplicated consistently across all six pages and driven by the same shared CSS/JS.

### Design system already in place
- Palette: ivory `#FBF7F0`, cream `#F4EDE1`, maroon `#6E1B26`, deep maroon `#4A1019`,
  gold `#C29A3C`, gold-light `#E0C177`, charcoal `#1C1714`. All as CSS custom properties in `:root`.
- Type: Cormorant Garamond (serif headings) + Jost (sans body) + Noto Sans Tamil (Tamil-ready).
- Components: sticky transparent→solid navbar, page-hero banner w/ breadcrumbs, stat counters,
  feature grid, event cards, alternating facility rows, filterable gallery + lightbox,
  numbered booking-process cards, CTA band, enquiry form, contact card, 4-column footer.

### JS modules in `js/script.js` (all guard-claused, safe on every page)
`initStickyHeader`, `initMobileNav`, `initReveal`, `initCounters`, `initHeroVideo`,
`initTourVideo`, `initGalleryFilter`, `Lightbox`, `initEnquiryForm`, `initBackToTop`, `initYear`.

---

## 2. VERIFICATION ALREADY PASSED

Ran a headless Chrome (CDP) sweep over all 6 pages × 6 widths (1920/1440/1024/768/430/360):

- **Zero horizontal overflow** on every page at every width.
- **Zero JS exceptions and zero console errors.**
- All local `src`/`href` targets resolve (script-verified).
- No duplicate element IDs, no broken in-page anchors.

### ⚠️ TWO FIXES WERE APPLIED AFTER THAT SWEEP AND ARE **NOT YET RE-VERIFIED**
1. `<img id="lbImg" src="">` → `<img id="lbImg" alt="">` in `index.html` + `gallery.html`
   (the empty `src` made the browser re-request the page itself as an image), and
   `img.src = ''` → `img.removeAttribute('src')` in the Lightbox `close()` function.
2. Added a **scroll-reveal backstop** in `initReveal()`. IntersectionObserver alone
   missed elements during fast scrolling (only 4 of 52 `.reveal` elements fired),
   which could leave content stuck at `opacity: 0` after an anchor jump or fast flick.
   A throttled `sweep()` on scroll/resize/load now reveals anything past the fold.

**→ First job: re-run verification and confirm reveals now reach ~100% and nothing regressed.**

---

## 3. ASSETS — IMPORTANT CONTEXT

The client supplied only **10 images and 1 video**. There are no room photos, no facility
photos, and no logo file. Work within this. Do NOT substitute stock photography.

### Original client assets (never delete)
| File | What it shows |
|---|---|
| `VMS Dhamotharan Thirumana night.png` (2.2 MB) | Illuminated exterior at night — the hero shot |
| `VMS Dhamotharan Thirumana Mandapam day.jpeg` | Daytime temple-style facade |
| `top.webp` | Main hall with rows of seating |
| `g-7.webp` | Main hall decorative false ceiling + mezzanine |
| `g-6.webp` | Separate dining hall with serving counters |
| `gallery-1.webp` | Shawl-honouring at a family function |
| `g-2.webp` | Ribbon-cutting at decorated entrance |
| `g-3.webp` | Ornate golden ceremonial seat in the hall |
| `g-4.webp` | Ceremony on the decorated stage |
| `g-5.webp` | Guests under the entrance canopy |
| `vedios/VMS Dhamotharan Thirumana vedio.mp4` | 9 s, 1280×720 — a slow cinematic pan of the lit night exterior. It is NOT a narrated promo. |

Note: the 8 `g-*/top/gallery-1` files are only **680 px wide**. Do not upscale them.
The lightbox is deliberately capped at 940 px so they never look soft.

### Generated derivatives (safe to regenerate; ffmpeg is installed)
- `assets/images/optimized/hero-night-{800,1200,1600}.webp` — 2.2 MB PNG → 165 KB
- `assets/images/optimized/exterior-day-{900,1400}.webp`
- `assets/images/optimized/video-poster.webp`
- `assets/vedios/hero-loop.mp4` — 419 KB, muted, no audio track, for the hero background
- `assets/vedios/tour-web.mp4` — 958 KB, with audio, for the video section player

Hero video only loads on ≥861 px viewports, when `prefers-reduced-motion` is not set,
and when `navigator.connection` does not report saveData or 2G.

---

## 4. VERIFIED BUSINESS FACTS — USE THESE EXACTLY, INVENT NOTHING ELSE

- **Name:** VMS Dhamotharan Thirumana Mandapam (client's spelling; signage varies — keep client's)
- **Phone:** +91 98942 76334 → `tel:+919894276334`, `https://wa.me/919894276334`
- **Maps link:** https://maps.app.goo.gl/6HmaUfeiSNMeDCNu9
- **Address** (confirmed by resolving the Maps short link to Google's own place record):
  Opposite Irumbai Sai Baba Temple, Dindivanam Bypass Road, beyond Pondicherry Moratandi
  Tollgate — Irumbai, Acharampattu, Tamil Nadu 605111
- **Capacities:** 500+ guests (main hall), 250 (dining), 1500 (kitchen & serving)
- **Facilities:** centralized AC, AC rooms with attached bathrooms, dressing room,
  separate room option, utensils on site, car + bike parking, generator backup,
  premium hand wash area, budget-friendly

### Hard content rules
- **Do NOT invent:** pricing, packages, testimonials, reviews, ratings, awards, years in
  business, number of rooms, opening hours, email address, or social media accounts.
- The testimonials and pricing sections seen on the reference site were **deliberately
  omitted** because the client supplied no real ones. Only add them if the client provides real data.
- The gallery has **no "Rooms" filter** because no room photographs exist. `gallery.html`
  carries an honest note that more photos are available on request. Keep it that way.
- Avoid the "10 km from Pondicherry" claim — the source video says "10 kms from here",
  which is relative to the speaker, not the city. Current copy says "on the outskirts of
  Pondicherry", which is safe.

---

## 5. REMAINING WORK

### A. Re-verify (highest priority — see §2)
Re-run the headless sweep across all 6 pages × 6 widths and confirm:
no horizontal overflow, no console errors, no broken images, and `.reveal` elements
now reach ~100% instead of ~8%.

### B. Interaction testing not yet performed
None of these have been exercised in a browser. Test each and fix what breaks:
1. **Mobile menu** — open/close, hamburger→X animation, scrim click, ESC key, focus moves
   into the drawer, body scroll lock, auto-close when resizing past 941 px.
2. **Gallery filters** — All/Hall/Dining/Events/Exterior; arrow-key movement across the
   tablist; the `#galEmpty` message; and confirm the lightbox re-collects only *visible*
   items after filtering (`Lightbox.refresh()` is already wired to the filter click).
3. **Lightbox** — open, prev/next, ESC, backdrop click, focus trap, counter text,
   touch swipe, and that `gal-wide` night/day images load their larger `data-full` source.
4. **Enquiry form** — validation for name, 10-digit Indian mobile (accepts `0`/`91` prefix),
   required event type, past-date rejection, guest range 1–5000; then confirm the generated
   WhatsApp URL opens with a correctly formatted, readable prefilled message.
5. **Counters** — 500+/250/1500 animate once on scroll into view; `24/7` stays static.
6. **Video** — poster shows, play button works, no autoplay with sound, hero loop is muted.

### C. Not yet written
- `README.md` — setup, structure, how to edit content, how derivatives were generated.
- `sitemap.xml` and `robots.txt`.
- A real favicon file (currently an inline SVG data-URI in every `<head>`).
- Optional `404.html`.

### D. Polish pass
- Review the 1440 px and 430 px screenshots of each page for spacing, rhythm and hierarchy.
- Check the Google Maps iframe actually resolves to the correct location when online
  (it uses a place-name query, not an API key — the authoritative "Get Directions"
  buttons use the client's exact short link, so those are already correct).
- Confirm Google Fonts load correctly when online.

### E. Known deliberate decisions — do not "fix" these
- Canonical URLs and structured-data `url` fields are **relative** because no live domain
  was supplied. Replace them with absolute URLs once the real domain is known.
- `scroll-behavior: smooth` plus `scroll-padding-top` handles anchor offset under the
  fixed navbar; there is no JS smooth-scroll and none is needed.
- Nav active state is set per-page in the HTML (`class="is-active"` + `aria-current="page"`).
  The old IntersectionObserver scroll-spy was intentionally removed when the site became
  multi-page — do not reintroduce it.

---

## 6. HOUSE RULES FOR WHOEVER CONTINUES

1. Keep the CSS and JS **shared and reusable** — one `style.css`, one `script.js`. If you
   change a shared component, verify all six pages still render correctly.
2. Match the existing code style: CSS is organised in numbered sections with a comment
   banner each; JS uses one guard-claused `init*` function per concern, wired in `boot()`.
3. Every new image needs `width`, `height`, `loading="lazy"`, `decoding="async"` and real
   descriptive `alt` text. Only above-the-fold hero images get `fetchpriority="high"`.
4. Maintain **zero horizontal scrolling** at 1920 / 1440 / 1024 / 768 / 430 / 390 / 360 px.
5. Preserve accessibility: semantic landmarks, skip link, visible focus states, labelled
   form fields, `aria-label` on icon-only buttons, and the `prefers-reduced-motion` block.
6. Do not restructure folders or delete original client assets in `assets/images` and
   `assets/vedios`.
