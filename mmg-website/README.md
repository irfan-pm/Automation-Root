# MMG — Polythene & Disposable Packaging Website

A one-page, fully responsive business website for **MMG** (polythene rolls, garbage bags and disposable packaging).
Pure HTML, CSS and vanilla JavaScript, with no build step.

## Run it
Open `index.html` in a browser, or serve the folder:

```bash
cd mmg-website && python3 -m http.server 8080   # http://localhost:8080
```

## Sections
1. Sticky navbar (transparent → solid on scroll, mobile slide-in menu, active-link tracking)
2. Hero (animated gradient, floating product illustration, dual CTAs, trust stats)
3. About (texture background, illustration, animated stat counters)
4. Vision & Mission (navy, recycle pattern, glass cards, core values)
5. Services & Products (category filter, 6 product cards, "Learn More" spec modal)
6. Why Choose Us + How It Works process
7. CTA band
8. Testimonials carousel (autoplay, dots, arrows, swipe)
9. Clients logo grid (grayscale → colour on hover) + industries served
10. FAQ accordion
11. Contact (validated form, WhatsApp, Google Map)
12. Footer (links, socials, contact, copyright)

Extras: preloader, scroll-progress bar, fade-in-on-scroll animations, floating WhatsApp button,
back-to-top button, `prefers-reduced-motion` support.

## Before going live, replace the placeholders
| What | Where |
|------|-------|
| Phone `+92 300 1234567` / WhatsApp `923001234567` | `index.html` (search `1234567`) and `WHATSAPP_NUMBER` in `assets/js/main.js` |
| Email `info@mmg.pk` | `index.html` |
| Address & map location | Contact section + footer in `index.html` (map `iframe` `q=` parameter) |
| Social media links (`href="#"`) | Footer in `index.html` |
| Client names, logos & testimonials | They are sample content: swap in real clients (with their permission) |
| Stats (10+ years, 500+ clients…) | `data-target` values in the About section |
| Form submission | `assets/js/main.js`: see the `TODO`; connect to Formspree, EmailJS or your backend |

## Images
All illustrations are lightweight custom SVGs in `assets/img/`, so the site works offline and loads fast.
To use real product photography, replace the `src` of the product `<img>` tags (and the `img` paths in
`products` in `main.js`) with your own `.jpg`/`.webp` photos.

Fonts (Poppins, Inter) load from Google Fonts and icons from Font Awesome (cdnjs).
