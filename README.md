# VMS Dhamotharan Thirumana Mandapam — Website

A static, multi-page venue website built with vanilla HTML, CSS, and JavaScript. No build step, no framework, no dependencies.

---

## Project structure

```
VMS Dhamotharan Thirumana Mandapam/
├── index.html          Home page
├── about.html          About / story page
├── gallery.html        Filterable photo gallery + lightbox
├── services.html       Services & facilities
├── contact.html        Contact + embedded Google Map
├── enquiry.html        Enquiry form → WhatsApp prefill
├── 404.html            Custom 404 page
├── sitemap.xml         SEO sitemap
├── robots.txt          Crawler directives
├── css/
│   └── style.css       All styles (shared across every page)
├── js/
│   └── script.js       All behaviour (shared across every page)
└── assets/
    ├── images/
    │   ├── *.webp / *.jpeg / *.png   Original client photos (never delete)
    │   └── optimized/                 Resized / compressed WebP derivatives
    └── vedios/
        ├── VMS Dhamotharan Thirumana vedio.mp4   Original client video
        ├── hero-loop.mp4                          Muted background loop
        └── tour-web.mp4                           Clickable feature video
```

---

## Editing content

### Business information
All verified facts are already embedded in the HTML. **Do not invent** pricing, testimonials, social links, email address, or opening hours — the client has not provided them.

| Detail | Value |
|---|---|
| Phone / WhatsApp | +91 98942 76334 |
| Maps link | https://maps.app.goo.gl/6HmaUfeiSNMeDCNu9 |
| Address | Opp. Irumbai Sai Baba Temple, Dindivanam Bypass Rd, Irumbai, Acharampattu, TN 605111 |
| Main hall | 500+ guests |
| Dining | 250 guests |
| Kitchen + serving | 1500 capacity |

### Editing page text
1. Open the relevant `.html` file in any editor.
2. The visible text lives inside the `<main>` element — the header and footer are identical on every page.
3. Do **not** move or remove `class="reveal"` or `data-delay` attributes — they drive the scroll-in animations.

### Adding a gallery photo
1. Place the original file in `assets/images/`.
2. Resize it to no wider than 680 px (the other gallery images are 680 px) using ffmpeg or ImageMagick.
3. Add a `<li class="gal-item" data-category="CATEGORY">` block in `gallery.html`, following the pattern of the existing items.
   - Valid categories: `hall`, `dining`, `events`, `exterior`
4. Set `data-full` on the `.gal-btn` to the full-resolution source path.

---

## Regenerating derived assets

ffmpeg must be installed (`winget install Gyan.FFmpeg` on Windows).

### Hero-night optimized WebP set (from the 2.2 MB PNG)
```powershell
# Run from the project root
$src = "assets\images\VMS Dhamotharan Thirumana night.png"
ffmpeg -i $src -vf scale=800:-1  -quality 82 assets\images\optimized\hero-night-800.webp
ffmpeg -i $src -vf scale=1200:-1 -quality 82 assets\images\optimized\hero-night-1200.webp
ffmpeg -i $src -vf scale=1600:-1 -quality 82 assets\images\optimized\hero-night-1600.webp
```

### Exterior-day optimized WebP set
```powershell
$src = "assets\images\VMS Dhamotharan Thirumana Mandapam day.jpeg"
ffmpeg -i $src -vf scale=900:-1  -quality 82 assets\images\optimized\exterior-day-900.webp
ffmpeg -i $src -vf scale=1400:-1 -quality 82 assets\images\optimized\exterior-day-1400.webp
```

### Video poster
```powershell
ffmpeg -i "assets\vedios\VMS Dhamotharan Thirumana vedio.mp4" -ss 00:00:01 -frames:v 1 -quality 80 assets\images\optimized\video-poster.webp
```

### Hero loop (muted, no audio, optimized for autoplay)
```powershell
ffmpeg -i "assets\vedios\VMS Dhamotharan Thirumana vedio.mp4" `
  -an -vf "scale=1280:-2,fps=24" `
  -c:v libx264 -crf 26 -preset slow -movflags +faststart `
  assets\vedios\hero-loop.mp4
```

### Tour video (with audio, web-optimized)
```powershell
ffmpeg -i "assets\vedios\VMS Dhamotharan Thirumana vedio.mp4" `
  -c:v libx264 -crf 23 -preset slow -movflags +faststart `
  -c:a aac -b:a 128k `
  assets\vedios\tour-web.mp4
```

---

## JavaScript modules (js/script.js)

Each concern lives in its own guard-claused `init*` function, all wired in `boot()`:

| Function | What it does |
|---|---|
| `initStickyHeader` | Transparent to solid navbar on scroll |
| `initMobileNav` | Drawer open/close, scrim, ESC, body-lock |
| `initReveal` | IntersectionObserver scroll-in + backstop sweep |
| `initCounters` | Animated stat counters (fires once on scroll into view) |
| `initHeroVideo` | Loads the background loop only on 861px+ / good connection |
| `initTourVideo` | Play/pause button for the feature video |
| `initGalleryFilter` | Filter tablist with arrow-key support + empty-state message |
| `Lightbox` | Open / close / prev / next / swipe / focus trap |
| `initEnquiryForm` | Client-side validation - prefilled WhatsApp URL |
| `initBackToTop` | Shows after 90vh scroll; smooth scroll on click |
| `initYear` | Keeps the footer copyright year current |

---

## CSS organisation (css/style.css)

Sections are numbered and separated with comment banners. Key sections:

| Section | Content |
|---|---|
| 1 | Design tokens (CSS custom properties) |
| 2 | Reset and base |
| 6 | Site header and navigation |
| 7 | Hero section |
| 15 | Gallery and filters |
| 19 | Lightbox |
| 20 | Enquiry / contact sections |
| 22 | Footer |
| 23 | Responsive overrides |

---

## Deploying

The site is 100% static. Any static host works:

- **Netlify / Vercel**: drag-and-drop the project folder.
- **cPanel / shared hosting**: upload files via FTP.
- **GitHub Pages**: push to a `gh-pages` branch.

Once the real domain is known, update:
- `<link rel="canonical" href="...">` in every `<head>`
- `<meta property="og:url" content="...">` in every `<head>`
- `"url"` fields in the `application/ld+json` structured data blocks
- The `<loc>` entries in `sitemap.xml`

---

## House rules

1. One `style.css`, one `script.js` — keep everything shared.
2. After changing a shared component, visually verify all six pages.
3. Every `<img>` needs `width`, `height`, `loading="lazy"`, `decoding="async"` and a real `alt`.
4. Maintain zero horizontal scrolling at 1920 / 1440 / 1024 / 768 / 430 / 390 / 360 px.
5. Preserve accessibility: skip link, visible focus states, labelled form fields, `aria-label` on icon-only buttons.
6. Never delete original client assets from `assets/images/` or `assets/vedios/`.
