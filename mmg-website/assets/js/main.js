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
  const WHATSAPP_NUMBER = "971565041573";

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

  /* ---------- Product modal ---------- */
  const products = {
    "ldpe": {
      "title": "LDPE Bags",
      "cat": "Bags",
      "img": "https://images.pexels.com/photos/972887/pexels-photo-972887.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/shopping-bags.svg",
      "option": "LDPE Bags",
      "desc": "High-quality LDPE bags, favoured by top-tier companies for their strength and visual impact. They offer superior tear resistance and customisable printing options to meet your specific needs.",
      "specs": [
        [
          "Material",
          "Low-density polyethylene (LDPE)"
        ],
        [
          "Strength",
          "Superior tear resistance"
        ],
        [
          "Printing",
          "Custom designs to your requirements"
        ],
        [
          "Options",
          "Sizes, colours and thickness made to order"
        ],
        [
          "Eco option",
          "Oxo-biodegradable"
        ]
      ]
    },
    "lldpe": {
      "title": "LLDPE Bags",
      "cat": "Bags",
      "img": "https://images.pexels.com/photos/5156696/pexels-photo-5156696.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/custom-bulk.svg",
      "option": "LLDPE Bags",
      "desc": "Premium LLDPE bags, preferred by leading corporations worldwide. They combine strength and sophistication for exceptional presentation, are fully customisable and offer superior durability.",
      "specs": [
        [
          "Material",
          "Linear low-density polyethylene (LLDPE)"
        ],
        [
          "Strength",
          "Superior durability and puncture resistance"
        ],
        [
          "Printing",
          "Custom designs to your requirements"
        ],
        [
          "Options",
          "Sizes, colours and thickness made to order"
        ],
        [
          "Eco option",
          "Oxo-biodegradable"
        ]
      ]
    },
    "hdpe": {
      "title": "HDPE Bags",
      "cat": "Bags",
      "img": "https://images.pexels.com/photos/4033160/pexels-photo-4033160.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/shopping-bags.svg",
      "option": "HDPE Bags",
      "desc": "Premium HDPE bags, favoured for their strength and versatility. They offer unbeatable durability and visual impact, with customisable options for size, colour and print.",
      "specs": [
        [
          "Material",
          "High-density polyethylene (HDPE)"
        ],
        [
          "Strength",
          "High strength at low thickness"
        ],
        [
          "Printing",
          "Custom designs to your requirements"
        ],
        [
          "Uses",
          "Retail, grocery, food and general packaging"
        ],
        [
          "Eco option",
          "Oxo-biodegradable"
        ]
      ]
    },
    "sheets": {
      "title": "Polyethylene Sheets & Rolls",
      "cat": "Sheets, Films & Tapes",
      "img": "https://images.pexels.com/photos/18541873/pexels-photo-18541873.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/roll.svg",
      "option": "Polyethylene Sheets & Rolls",
      "desc": "Premium polyethylene sheets trusted by industry leaders worldwide, together with construction plastic rolls for site covering, lining, damp-proofing and general industrial use.",
      "specs": [
        [
          "Material",
          "Polyethylene"
        ],
        [
          "Formats",
          "Sheets and rolls"
        ],
        [
          "Uses",
          "Construction, industry, covering and lining"
        ],
        [
          "Options",
          "Width, thickness and colour made to order"
        ],
        [
          "Eco option",
          "Environmentally friendly sheets"
        ]
      ]
    },
    "garbage": {
      "title": "Garbage Bags",
      "cat": "Hygiene & Waste",
      "img": "https://images.pexels.com/photos/5994772/pexels-photo-5994772.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/garbage-bags.svg",
      "option": "Garbage Bags",
      "desc": "Strong, leak-resistant garbage bags for households, offices, hotels, restaurants and municipal waste collection, produced in a full range of sizes, colours and thicknesses.",
      "specs": [
        [
          "Material",
          "Polyethylene"
        ],
        [
          "Sizes",
          "Small to jumbo, made to order"
        ],
        [
          "Colours",
          "Black and custom colours"
        ],
        [
          "Uses",
          "Homes, hospitality, offices, municipalities"
        ],
        [
          "Eco option",
          "Oxo-biodegradable"
        ]
      ]
    },
    "biohazard": {
      "title": "Biohazard Waste Bags",
      "cat": "Hygiene & Waste",
      "img": "https://images.pexels.com/photos/10058483/pexels-photo-10058483.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/garbage-bags.svg",
      "option": "Biohazard Waste Bags",
      "desc": "Biohazard waste bags for the safe collection and disposal of clinical and infectious waste in hospitals, clinics, laboratories and healthcare facilities, made to meet UAE regulatory requirements.",
      "specs": [
        [
          "Material",
          "Polyethylene"
        ],
        [
          "Marking",
          "Biohazard symbol and colour coding"
        ],
        [
          "Uses",
          "Hospitals, clinics, laboratories"
        ],
        [
          "Sizes",
          "Made to order"
        ],
        [
          "Compliance",
          "Made to UAE regulatory requirements"
        ]
      ]
    },
    "fruitveg": {
      "title": "Fruit & Vegetable Rolls",
      "cat": "Food & Retail",
      "img": "https://images.pexels.com/photos/4033167/pexels-photo-4033167.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/roll.svg",
      "option": "Fruit & Vegetable Rolls",
      "desc": "Produce bags supplied on rolls for supermarkets, hypermarkets, groceries and fresh-food counters. Hygienic, easy to tear off and quick to open.",
      "specs": [
        [
          "Format",
          "Bags on a roll"
        ],
        [
          "Uses",
          "Fruit, vegetables and fresh produce"
        ],
        [
          "Features",
          "Easy tear-off and opening"
        ],
        [
          "Options",
          "Sizes and thickness made to order"
        ],
        [
          "Eco option",
          "Oxo-biodegradable"
        ]
      ]
    },
    "sufra": {
      "title": "Sufra Table Sheets",
      "cat": "Food & Retail",
      "img": "https://images.pexels.com/photos/5086623/pexels-photo-5086623.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/disposable.svg",
      "option": "Sufra Table Sheets",
      "desc": "Disposable sufra (table) sheets that keep tables and floor dining areas clean and hygienic at homes, restaurants, camps, events and large gatherings.",
      "specs": [
        [
          "Format",
          "Sheets and rolls"
        ],
        [
          "Uses",
          "Homes, restaurants, events, gatherings"
        ],
        [
          "Features",
          "Hygienic, quick clean-up"
        ],
        [
          "Options",
          "Sizes and colours made to order"
        ],
        [
          "Eco option",
          "Oxo-biodegradable"
        ]
      ]
    },
    "shopping": {
      "title": "Shopping Bags",
      "cat": "Bags",
      "img": "https://images.pexels.com/photos/5705102/pexels-photo-5705102.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/shopping-bags.svg",
      "option": "Shopping Bags",
      "desc": "Shopping bags for retailers, supermarkets, pharmacies and boutiques, with strong handles and custom printing so your brand travels with every customer.",
      "specs": [
        [
          "Styles",
          "Handle and carry bags"
        ],
        [
          "Material",
          "LDPE / HDPE"
        ],
        [
          "Printing",
          "Custom designs to your requirements"
        ],
        [
          "Uses",
          "Retail, grocery, pharmacy, fashion"
        ],
        [
          "Eco option",
          "Oxo-biodegradable"
        ]
      ]
    },
    "tape": {
      "title": "Warning Tapes",
      "cat": "Sheets, Films & Tapes",
      "img": "https://images.pexels.com/photos/16231473/pexels-photo-16231473.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/industrial-wrap.svg",
      "option": "Warning Tapes",
      "desc": "High-visibility warning and barrier tapes for construction sites, roadworks, utilities, underground cable and pipe marking, and restricted areas.",
      "specs": [
        [
          "Material",
          "Polyethylene"
        ],
        [
          "Uses",
          "Construction, utilities, cable and pipe marking"
        ],
        [
          "Printing",
          "Custom warning text"
        ],
        [
          "Colours",
          "Standard safety colours"
        ],
        [
          "Format",
          "Rolls"
        ]
      ]
    },
    "greenhouse": {
      "title": "UV Greenhouse Film",
      "cat": "Sheets, Films & Tapes",
      "img": "https://images.pexels.com/photos/11792259/pexels-photo-11792259.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/roll.svg",
      "option": "UV Greenhouse Film",
      "desc": "UV-stabilised greenhouse film made to withstand strong sunlight, protecting crops in greenhouses, nurseries and farms for longer.",
      "specs": [
        [
          "Material",
          "Polyethylene with UV stabiliser"
        ],
        [
          "Uses",
          "Greenhouses, nurseries, farms"
        ],
        [
          "Features",
          "Longer life under strong sunlight"
        ],
        [
          "Options",
          "Width and thickness made to order"
        ],
        [
          "Format",
          "Rolls"
        ]
      ]
    },
    "custom": {
      "title": "Custom & Export Orders",
      "cat": "Custom Orders",
      "img": "https://images.pexels.com/photos/34585120/pexels-photo-34585120.jpeg?auto=compress&cs=tinysrgb&w=800",
      "fallback": "assets/img/custom-bulk.svg",
      "option": "Custom & Export Orders",
      "desc": "Tell us your specification and we manufacture to match: size, colour, thickness, printing and packing. With 10,000 metric tons of monthly capacity we supply bulk orders punctually across the UAE and to export markets.",
      "specs": [
        [
          "Customisation",
          "Size, colour, thickness and printing"
        ],
        [
          "Capacity",
          "10,000 metric tons per month"
        ],
        [
          "Supply",
          "UAE and export markets"
        ],
        [
          "Quality",
          "Strict quality control on every batch"
        ],
        [
          "Also available",
          "Laundry bags, calcium filler masterbatch, PE raw material"
        ]
      ]
    }
  };


  const modal = $("#productModal");
  let lastFocus = null;
  const openModal = (key) => {
    const p = products[key];
    if (!p) return;
    const modalImg = $("#modalImg");
    modalImg.classList.remove("is-fallback");
    delete modalImg.dataset.failed;
    modalImg.dataset.fallback = p.fallback;
    modalImg.src = p.img;
    $("#modalImg").alt = p.title;
    $("#modalCat").textContent = p.cat;
    $("#modalTitle").textContent = p.title;
    $("#modalDesc").textContent = p.desc;
    const body = $("#modalSpecs");
    body.innerHTML = "";
    p.specs.forEach(([k, v]) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th"); th.textContent = k;
      const td = document.createElement("td"); td.textContent = v;
      tr.append(th, td); body.appendChild(tr);
    });
    $("#modalQuote").dataset.option = p.option;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    $(".modal-close", modal).focus();
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  };
  $$(".learn-more").forEach((btn) => btn.addEventListener("click", () => openModal(btn.dataset.product)));
  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!modal.hidden) closeModal();
    if (navMenu.classList.contains("open")) setMenu(false);
  });
  $("#modalQuote").addEventListener("click", (e) => {
    const option = e.currentTarget.dataset.option;
    const select = $("#product");
    if (option) select.value = option;
    closeModal();
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

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
