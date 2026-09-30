/* =========================================================
   MMG — interactions & animations
   ========================================================= */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Business details used for WhatsApp links — update in one place.
  const WHATSAPP_NUMBER = "97466964620";

  /* ---------- Preloader ---------- */
  const preloader = $("#preloader");
  const hidePreloader = () => preloader && preloader.classList.add("hide");
  window.addEventListener("load", () => setTimeout(hidePreloader, 300));
  setTimeout(hidePreloader, 2500); // safety net if an external asset hangs

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
  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
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
  window.addEventListener("resize", () => { if (window.innerWidth >= 1100) setMenu(false); });

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = $$(".nav-link");
  const linkTargets = navLinks.map((link) => ({ link, target: $(link.getAttribute("href")) }));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const section = entry.target;
      const matches = linkTargets.filter(({ target }) => target && (target === section || section.contains(target)));
      if (!matches.length) return;
      navLinks.forEach((l) => l.classList.remove("active"));
      matches.forEach(({ link }) => link.classList.add("active"));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => sectionObserver.observe(s));

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("in");
      obs.unobserve(el);
      // Drop the reveal class afterwards so hover transitions use the element's own timing.
      const delay = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
      setTimeout(() => el.classList.remove("reveal", "in"), 1000 + delay * 1000);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Counters ---------- */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString(); return; }
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  $$(".counter").forEach((c) => counterObserver.observe(c));

  /* ---------- Product filter ---------- */
  const filters = $$(".filter");
  const cards = $$(".product-card");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const f = btn.dataset.filter;
      cards.forEach((card) => {
        const show = f === "all" || card.dataset.cat.split(" ").includes(f);
        card.classList.remove("reveal", "in", "pop");
        card.classList.toggle("is-hidden", !show);
        if (show) { void card.offsetWidth; card.classList.add("pop"); }
      });
    });
  });

  /* ---------- Escape closes the mobile menu ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) setMenu(false);
  });

  /* ---------- Testimonials carousel ---------- */
  const track = $("#carouselTrack");
  const slides = $$(".t-card", track);
  const dotsWrap = $("#dots");
  const carousel = $("#carousel");
  let index = 0;
  let autoplay = null;

  const perView = () => parseInt(getComputedStyle(slides[0]).getPropertyValue("--per"), 10) || 1;
  const maxIndex = () => Math.max(0, slides.length - perView());

  const buildDots = () => {
    dotsWrap.innerHTML = "";
    for (let i = 0; i <= maxIndex(); i++) {
      const d = document.createElement("button");
      d.className = "dot";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.addEventListener("click", () => { goTo(i); restart(); });
      dotsWrap.appendChild(d);
    }
  };
  const goTo = (i) => {
    const max = maxIndex();
    index = i > max ? 0 : i < 0 ? max : i;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const offset = index * (slides[0].getBoundingClientRect().width + gap);
    track.style.transform = `translateX(${-offset}px)`;
    $$(".dot", dotsWrap).forEach((d, di) => {
      d.classList.toggle("active", di === index);
      d.setAttribute("aria-selected", String(di === index));
    });
  };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);
  const stop = () => { clearInterval(autoplay); autoplay = null; };
  const start = () => { if (!reduceMotion && !autoplay) autoplay = setInterval(next, 5000); };
  const restart = () => { stop(); start(); };

  $("#nextBtn").addEventListener("click", () => { next(); restart(); });
  $("#prevBtn").addEventListener("click", () => { prev(); restart(); });
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  // Swipe / drag support
  let startX = 0, dragging = false, dx = 0;
  track.addEventListener("pointerdown", (e) => { dragging = true; startX = e.clientX; dx = 0; stop(); });
  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    start();
  });
  track.addEventListener("pointermove", (e) => { if (dragging) dx = e.clientX - startX; });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); goTo(Math.min(index, maxIndex())); }, 150);
  });
  buildDots();
  goTo(0);
  start();

  /* ---------- FAQ accordion ---------- */
  const accItems = $$(".acc-item");
  accItems.forEach((item) => {
    const head = $(".acc-head", item);
    if (head.getAttribute("aria-expanded") === "true") item.classList.add("open");
    head.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      accItems.forEach((other) => {
        other.classList.remove("open");
        $(".acc-head", other).setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");
  const success = $("#formSuccess");
  const submitBtn = $("#submitBtn");
  const validators = {
    name: (v) => v.trim().length >= 2 || "Please enter your name.",
    phone: (v) => /^[+]?[\d\s-]{10,15}$/.test(v.trim()) || "Please enter a valid phone number.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.",
    message: (v) => v.trim().length >= 10 || "Please tell us a bit more (at least 10 characters)."
  };
  const validateField = (input) => {
    const rule = validators[input.name];
    if (!rule) return true;
    const result = rule(input.value);
    const field = input.closest(".field");
    const err = $(".error", field);
    const ok = result === true;
    field.classList.toggle("invalid", !ok);
    err.textContent = ok ? "" : result;
    input.setAttribute("aria-invalid", String(!ok));
    return ok;
  };
  Object.keys(validators).forEach((name) => {
    const input = form.elements[name];
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => { if (input.closest(".field").classList.contains("invalid")) validateField(input); });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = Object.keys(validators).map((n) => form.elements[n]);
    const results = inputs.map(validateField);
    if (results.includes(false)) {
      inputs[results.indexOf(false)].focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const text = `Hello MMG, I'd like a quote.%0A%0AName: ${encodeURIComponent(data.name)}%0APhone: ${encodeURIComponent(data.phone)}%0AEmail: ${encodeURIComponent(data.email)}%0AProduct: ${encodeURIComponent(data.product || "Not specified")}%0A%0A${encodeURIComponent(data.message)}`;
    $("#waFollowUp").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

    submitBtn.classList.add("loading");
    $("span", submitBtn).textContent = "Sending...";

    // TODO: connect to your backend or a form service (e.g. Formspree, EmailJS) here.
    setTimeout(() => {
      submitBtn.classList.remove("loading");
      $("span", submitBtn).textContent = "Send Inquiry";
      success.hidden = false;
      form.reset();
    }, 1200);
  });

  /* ---------- Prefill product from a product page link (?product=...) ---------- */
  const wanted = new URLSearchParams(location.search).get("product");
  if (wanted) {
    const select = $("#product");
    if (Array.from(select.options).some((o) => o.value === wanted)) select.value = wanted;
  }

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
