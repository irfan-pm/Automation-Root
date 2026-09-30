# MMG — Polythene & Disposable Packaging Website

A one-page, fully responsive business website for **MMG** (polythene rolls, garbage bags and disposable packaging).
Pure HTML, CSS and vanilla JavaScript, with no build step.

## Run it locally
**Easiest (nothing to install):**
- Windows: double-click `start-server.bat`. The site opens at http://localhost:3000. Keep the black window open.
- Mac: double-click `start-server.command`.

**With Node.js:**
Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
cd mmg-website
npm install        # installs the local server and the Vercel CLI
npm run dev        # open http://localhost:3000
```

No Node? `python3 -m http.server 3000` inside `mmg-website` works too.

## Deploy to Vercel
```bash
npx vercel login   # sign in with your Vercel account (email or GitHub)
npm run deploy     # runs `vercel --prod`; first run asks a few setup questions, press Enter for the defaults
```
The command prints your live link (for example `https://mmg-website.vercel.app`).
Run `npm run deploy` again after any change to publish it.

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

## Business details
Contact details and products come from the client's current website (oceanpfactory.com):
Al Bayli 1 Street, Mussafah 15 (M15) Industrial Area, Abu Dhabi, UAE · P.O. Box 90894 ·
landline +971 2 555 5637 · mobile/WhatsApp +971 56 504 1573 · oceanpf@oceanpf.ae.
The WhatsApp number used by the form lives in `WHATSAPP_NUMBER` in `assets/js/main.js`.

## Still to replace before going live
| What | Where |
|------|-------|
| Client names, logos & testimonials | Sample content: swap in real clients (with their permission) |
| Social media links (`href="#"`) | Footer in `index.html` |
| Form submission | `assets/js/main.js`: see the `TODO`; connect to Formspree, EmailJS or your backend |

## Images
Product, hero, about and background images are free stock photos from [Pexels](https://www.pexels.com/license/)
(free for commercial use, no attribution required), loaded from `images.pexels.com`.
If a photo can't load, the page automatically falls back to the matching SVG illustration in `assets/img/`.

| Spot | Pexels photo |
|------|--------------|
| Hero (main) | [10697106](https://www.pexels.com/photo/10697106/) warehouse interior with pallets |
| Hero inset, Polythene Rolls | [18541873](https://www.pexels.com/photo/18541873/) plastic wrap close-up |
| About | [4481327](https://www.pexels.com/photo/4481327/) shelves in a warehouse |
| Garbage Bags | [5994772](https://www.pexels.com/photo/5994772/) black plastic garbage bag |
| Disposable Packaging | [33960213](https://www.pexels.com/photo/33960213/) stacked disposable cups |
| Custom Bulk Orders | [5156696](https://www.pexels.com/photo/5156696/) boxes on warehouse shelves |
| Shopping Bags | [972887](https://www.pexels.com/photo/972887/) woman holding shopping bags |
| Industrial Wrapping | [34585120](https://www.pexels.com/photo/34585120/) forklifts loading pallets |
| Quote banner background | [14005602](https://www.pexels.com/photo/14005602/) truck on a highway |
| Testimonials background | [4481326](https://www.pexels.com/photo/4481326/) warehouse |
| Contact background | [31352672](https://www.pexels.com/photo/31352672/) factory floor machinery |

For the most professional result, replace these with photos of your own products and factory:
put the files in `assets/img/` and update the `src` values (and the `img` paths in `products` in `main.js`).

Fonts (Poppins, Inter) load from Google Fonts and icons from Font Awesome (cdnjs).
