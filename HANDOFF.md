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

### Fixes applied and since re-verified
1. `<img id="lbImg" src="">` → `<img id="lbImg" alt="">` in `index.html` + `gallery.html`
   (the empty `src` made the browser re-request the page itself as an image), and
   `img.src = ''` → `img.removeAttribute('src')` in the Lightbox `close()` function.
2. Added a **scroll-reveal backstop** in `initReveal()`. IntersectionObserver alone can
   miss elements during a fast flick or anchor jump, leaving them stuck at `opacity: 0`.
   A throttled `sweep()` on scroll/resize/load now reveals anything past the fold.
   **Confirmed: 100% of `.reveal` elements fire on all 6 pages at all 6 widths.**

Note when re-testing: the site sets `scroll-behavior: smooth`, so an automated
`window.scrollTo(0, y)` loop animates and never reaches the bottom, which makes reveals
look broken. Set `document.documentElement.style.scrollBehavior = 'auto'` and use
`behavior: 'instant'` in test harnesses.

### Hero rework (latest change)
The hero previously used an all-over radial veil that darkened the edges to 80% black,
`object-position: center 60%` which cropped the top off the facade, and a wrong intrinsic
size (`1024×1024` instead of `1537×1023`) with the `srcset` removed. The mandapam was
barely visible. Now:
- **Desktop:** uses a **widened hero image**, `assets/images/optimized/hero-wide-{1200,1800,2400}.webp`,
  served via `<picture>` at `min-width: 761px`. The client photo is 3:2, which is too narrow
  for a wide browser window — `object-fit: cover` kept slicing the roofline off the top and
  the base off the bottom on shorter windows (e.g. 1366×655).
  The wide file is 2742×1080 (~2.54:1), generated from the original by extending each side
  with a stretched, blurred, slightly darkened copy of the edge column, plus a vignette.
  Because the scene is a night shot, the extension reads as the night sky simply continuing —
  colours match exactly at the seam, so there is no visible join.
  With that extra sky on either side, `object-fit: cover` is now safe: the crop lands on
  empty sky, never on the building. Regenerate with the ffmpeg `hstack` recipe in §3 if the
  source photo is ever replaced.
  An earlier attempt used `contain` plus a blurred CSS backdrop (`.hero-media::before`) —
  that worked but the blurred side panels looked poor, so it was replaced. Do not reinstate it.
  Also: banded veil (soft pool behind the headline + thin top/bottom bands) keeps the
  building bright, and the mobile fallback keeps the true `1537×1023` original.
- **Mobile (≤760px):** the hero **stacks instead of overlaying** — the photo renders at its
  true 3:2 ratio with the whole facade visible, and the copy sits on solid charcoal beneath
  it. A wide building cannot fill a tall phone viewport without being cropped to its middle
  columns, and centred text on top hid whatever survived. Do not revert this to a
  full-bleed overlay on mobile.
- The hero eyebrow had been changed to "Premium Wedding Planning & Celebrations", which is
  the reference site's positioning and factually wrong here — this is a venue, not a wedding
  planner. Restored to "Near Pondicherry • Dindivanam Bypass Road".

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

### ⚠️ Stray images in `assets/images/optimized/` — do not use these
Another session left these behind. They are **not referenced by any page**, and two of them
should not be published:

| File | Verdict |
|---|---|
| `vms_night_widescreen.png` | **Do not use.** It is an AI-altered rendering of the venue — the night sky has been repainted to blue/purple twilight and surrounding details differ from the real photograph. Publishing an AI-modified image of a real business as if it were a real photo misrepresents the venue. |
| `velvet_mandapam_hero.png` | **Do not use.** Named after the reference site; unverified provenance. |
| `hero-cine-{900,1200,1536}.webp` | Genuine crop of the real photo, but it loses the top and base of the facade — the exact problem that was reported twice. Superseded by `hero-wide-*`. |
| `vms_day_hero.jpg` | Duplicate of the original day photo; `exterior-day-*.webp` is the optimised version in use. |

Safe to delete all of the above. Only publish images derived from the client's own
photographs in `assets/images/`.

### ⚠️ `hero-wide-*.webp` has been deleted once already
A later session removed all three `hero-wide-*.webp` files while `index.html` still
referenced them, which left the desktop hero showing nothing. If the hero ever goes blank,
check that these three files exist and regenerate with the command below.

### Regenerating the widened desktop hero
```
ffmpeg -i "assets/images/VMS Dhamotharan Thirumana night.png" -filter_complex \
 "[0:v]scale=-2:1080[m];[m]split=3[main][a][b];\
  [a]crop=3:1080:0:0,scale=560:1080,boxblur=24:1,eq=brightness=-0.05[L];\
  [b]crop=3:1080:iw-3:0,scale=560:1080,boxblur=24:1,eq=brightness=-0.05[R];\
  [L][main][R]hstack=inputs=3,vignette=PI/4.5[out]" \
 -map "[out]" -frames:v 1 hero-wide-src.png
# then encode at 1200 / 1800 / 2400 wide with -c:v libwebp -quality 73
```

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
