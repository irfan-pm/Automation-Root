/* =========================================================
   MMG — product detail page
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WHATSAPP_NUMBER = "97466964620";
  const products = window.MMG_PRODUCTS || {};

  /* ---------- Fill the page from the product catalogue ---------- */
  const id = new URLSearchParams(location.search).get("id");
  const p = products[id];

  const el = (tag, text, cls) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };

  if (!p) {
    $("#productMain").innerHTML = `
      <section class="page-hero"><div class="container">
        <h1>Product not found</h1>
        <p class="page-hero-sub">We couldn't find that product. Browse the full range instead.</p>
        <a href="index.html#products" class="btn btn-primary btn-lg">View All Products</a>
      </div></section>`;
  } else {
    document.title = `${p.title} | MMG Factories Management for Plastics, Qatar`;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.short);

    $("#crumbName").textContent = p.title;
    $("#pCategory").textContent = p.category;
    $("#pTitle").textContent = p.title;
    $("#pTitle2").textContent = p.title;
    $("#pShort").textContent = p.short;
    $("#pDesc").textContent = p.desc;
    $("#pIcon").className = `fa-solid fa-${p.icon}`;

    const img = $("#pImg");
    img.dataset.fallback = p.fallback;
    img.alt = p.title;
    img.src = p.img;

    p.chips.forEach((c) => $("#pChips").appendChild(el("li", c)));
    p.specs.forEach(([k, v]) => {
      const tr = document.createElement("tr");
      tr.append(el("th", k), el("td", v));
      $("#pSpecs").appendChild(tr);
    });
    p.features.forEach((f) => {
      const li = el("li");
      li.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      li.appendChild(document.createTextNode(" " + f));
      $("#pFeatures").appendChild(li);
    });
    p.applications.forEach((a) => $("#pApps").appendChild(el("li", a)));

    $("#pQuote").href = `index.html?product=${encodeURIComponent(p.title)}#contact`;
    $("#pWhatsApp").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello MMG, I would like a quote for ${p.title}.`)}`;

    // Related: products sharing a category first, then the rest
    const others = Object.entries(products).filter(([k]) => k !== id);
    const shares = ([, o]) => o.cats.some((c) => p.cats.includes(c));
    const related = [...others.filter(shares), ...others.filter((o) => !shares(o))].slice(0, 3);
    related.forEach(([k, o], i) => {
      const card = el("article", null, "product-card reveal");
      card.dataset.anim = "fade-up";
      card.style.setProperty("--d", `${i * 0.1}s`);
      card.innerHTML = `
        <div class="product-media"><img alt="" loading="lazy" /></div>
        <div class="product-body">
          <div class="product-icon"><i class="fa-solid fa-${o.icon}"></i></div>
          <h3></h3><p></p>
          <a class="learn-more" href="product.html?id=${k}">View Details <i class="fa-solid fa-arrow-right"></i></a>
        </div>`;
      const cimg = $("img", card);
      cimg.dataset.fallback = o.fallback;
      cimg.alt = o.title;
      cimg.src = o.thumb;
      $("h3", card).textContent = o.title;
      $("p", card).textContent = o.short;
      $("#pRelated").appendChild(card);
    });
  }

  /* ---------- Navbar, progress bar, back-to-top ---------- */
  const navbar = $("#navbar");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 600);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Mobile menu ---------- */
  const hamburger = $("#hamburger");
  const navMenu = $("#navMenu");
  const overlay = el("div", null, "nav-overlay");
  document.body.appendChild(overlay);
  const setMenu = (open) => {
    navMenu.classList.toggle("open", open);
    hamburger.classList.toggle("active", open);
    overlay.classList.toggle("show", open);
    hamburger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
  };
  hamburger.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
  overlay.addEventListener("click", () => setMenu(false));
  $$("a", navMenu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth >= 1100) setMenu(false); });

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const t = entry.target;
      t.classList.add("in");
      obs.unobserve(t);
      const delay = parseFloat(getComputedStyle(t).getPropertyValue("--d")) || 0;
      setTimeout(() => t.classList.remove("reveal", "in"), 1000 + delay * 1000);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((r) => revealObserver.observe(r));

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
