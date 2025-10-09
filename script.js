/* NavBar */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1060 && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* HeroSection- Index */
(function () {
  const container = document.querySelector('.rotator');
  if (!container) return;
  const words = Array.from(container.querySelectorAll('.rot-word'));
  if (words.length === 0) return;

  let idx = 0;
  function setActive(nextIndex, prevIndex) {
    words.forEach(w => w.classList.remove('active', 'enter', 'leave-up'));
    const next = words[nextIndex];
    const prev = (prevIndex != null) ? words[prevIndex] : null;
    if (prev) prev.classList.add('leave-up');
    next.classList.add('active', 'enter');
    container.setAttribute('aria-label', next.textContent || '');
  }
  setActive(idx, null);

  let interval = setInterval(() => {
    const prev = idx;
    idx = (idx + 1) % words.length;
    setActive(idx, prev);
  }, 2000);

  // Reduced motion
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    clearInterval(interval);
    words.forEach((w, i) => w.classList.toggle('active', i === 0));
  }
})();




/* ===== Interactive Image Accordion ===== */
(function () {
  const strip = document.getElementById('ia-accordion');
  if (!strip) return;

  const items = Array.from(strip.querySelectorAll('.ia-item'));

  // Default active: 3rd card (match previous demo behavior)
  let activeIndex = 0;

  function setActive(i) {
    items.forEach((el, idx) => {
      el.classList.toggle('active', idx === i);
    });
    activeIndex = i;
  }

  setActive(activeIndex);

  // Hover / keyboard focus
  items.forEach((el, idx) => {
    el.addEventListener('mouseenter', () => setActive(idx));
    el.addEventListener('focus', () => setActive(idx));
    el.tabIndex = 0; // keyboard focusable
  });

  // Tap to activate on touch
  items.forEach((el, idx) => {
    el.addEventListener('click', () => setActive(idx));
  });
})();


/**
 * Orbit builder (no frameworks)
 * Matches the React behavior: 3 equally spaced rings, dotted, spinning.
 * Icons per ring are auto-distributed.
 */

// Public logo SVG/PNG sources (Commons/official CDNs). You can replace with your own assets.
const SF_ICON_URLS = [
  "imgs/Logos/Partners(webp)/aws.webp",
  "imgs/Logos/Partners(webp)/crayon.webp",
  "imgs/Logos/Partners(webp)/databricks.webp",
  "imgs/Logos/Partners(webp)/google-cloud.webp",
  "imgs/Logos/Partners(webp)/intellimark.webp",
  "imgs/Logos/Partners(webp)kore.webp",
  "imgs/Logos/Partners(webp)/microsoft.webp",
  "imgs/Logos/Partners(webp)/qlik.webp",
  "imgs/Logos/Partners(webp)/snowflake.webp",
  "imgs/Logos/Partners(webp)/symphony.webp"        /* Fallback 2 */
];

(function buildStackFeature() {
  const stage = document.querySelector('#stack-feature .sf-orbit-stage');
  if (!stage) return;

  // Configuration (mirrors the React version)
  const orbitCount = 3;
  const orbitGapRem = 8;                  // equal spacing between rings in rem
  const baseSizeRem = 12;                 // first ring ~12rem
  const iconsPerOrbit = Math.ceil(SF_ICON_URLS.length / orbitCount);

  // Helper to px from rem
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
  const toSize = i => (baseSizeRem + orbitGapRem * (i + 1)) * rem;  // ring diameter

  // Build each ring
  const rings = Array.from(stage.querySelectorAll('.sf-ring'));
  rings.forEach((ringEl, ringIdx) => {
    const sizePx = toSize(ringIdx);
    const duration = 12 + ringIdx * 6;
    ringEl.style.width = sizePx + 'px';
    ringEl.style.height = sizePx + 'px';
    ringEl.style.animationDuration = duration + 's';

    // Slice icons for this ring
    const start = ringIdx * iconsPerOrbit;
    const end = start + iconsPerOrbit;
    const icons = SF_ICON_URLS.slice(start, end);

    const angleStep = (2 * Math.PI) / Math.max(icons.length, 1);

    icons.forEach((url, iconIdx) => {
      const angle = iconIdx * angleStep;
      // position relative to ring box (0..100%)
      const x = 50 + 50 * Math.cos(angle);
      const y = 50 + 50 * Math.sin(angle);

      const holder = document.createElement('div');
      holder.className = 'sf-icon';
      holder.style.left = x + '%';
      holder.style.top = y + '%';

      const img = document.createElement('img');
      img.alt = 'tech-icon';
      img.src = url;
      img.onerror = () => { img.src = 'https://placehold.co/32x32?text=?'; };
      holder.appendChild(img);

      ringEl.appendChild(holder);
    });
  });
})();



// Industries Data
(function () {
  const tablist = document.querySelector('.industry-tabs');
  if (!tablist) return;

  const tabs = tablist.querySelectorAll('.industry-tab');
  const panels = document.querySelectorAll('.industry-panel');

  function activate(tab) {
    // deactivate all
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(p => p.classList.add('is-hidden'));

    // activate current
    const panelId = tab.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    if (panel) panel.classList.remove('is-hidden');

    // mobile convenience
    if (window.innerWidth <= 768) {
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // click handlers
  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (e) => {
      // arrow key support
      const i = Array.from(tabs).indexOf(tab);
      if (e.key === 'ArrowRight') { e.preventDefault(); activate(tabs[(i + 1) % tabs.length]); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); activate(tabs[(i - 1 + tabs.length) % tabs.length]); }
    });
  });

  // deep-link via hash (e.g., #retail)
  const hash = window.location.hash.replace('#', '');
  const deep = hash && document.getElementById(`tab-${hash}`);
  activate(deep || tabs[0]);
})();



// Testimonials
const testimonials = document.querySelectorAll('.testimonial-card');
let current = 0;

function showNextTestimonial() {
  testimonials[current].classList.remove('active');
  current = (current + 1) % testimonials.length;
  testimonials[current].classList.add('active');
}

setInterval(showNextTestimonial, 2000);



// CONTACT US PAGE
// Contact card and Insightagentai Card
// Global Presence Accordion Fix
// Global Presence Accordion (No Default Open)
document.addEventListener("DOMContentLoaded", function () {
  let uidCounter = 0;
  const uniqueSeed = Math.random().toString(36).slice(2, 7);

  function initAccordionIn(root) {
    if (!root) return;
    const items = root.querySelectorAll(".accordion-item");
    if (!items.length) return;

    // Close all panels
    const closeAll = () => {
      items.forEach(item => {
        const btn = item.querySelector(".accordion-btn");
        const panel = item.querySelector(".accordion-content");
        if (!btn || !panel) return;
        btn.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
      });
    };

    items.forEach(item => {
      const btn = item.querySelector(".accordion-btn");
      const panel = item.querySelector(".accordion-content");
      if (!btn || !panel) return;

      // Accessibility & IDs
      btn.setAttribute("role", "button");
      btn.setAttribute("aria-controls", `acc-panel-${uniqueSeed}-${uidCounter}`);
      btn.setAttribute("aria-expanded", "false");
      panel.id = `acc-panel-${uniqueSeed}-${uidCounter++}`;
      panel.style.maxHeight = null;

      // Toggle function
      const toggle = () => {
        const isOpen = btn.classList.contains("active");
        closeAll();
        if (!isOpen) {
          btn.classList.add("active");
          btn.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      };

      // Event listeners
      btn.addEventListener("click", toggle);
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  // Initialize for Global Presence and any other accordion sections
  document.querySelectorAll(".global-presence, .accordion-section, .content-wrapper")
    .forEach(root => {
      if (root.querySelector(".accordion-item")) {
        initAccordionIn(root);
      }
    });
});


// =========== SIMPLE FORM SUBMIT ===========
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you! Your query has been submitted.");
  });
});

// =========== INSIGHTAGENT HERO FADE (unchanged) ===========
(function () {
  const section = document.querySelector('.indoc-hero');
  const targets = section ? section.querySelectorAll('.indoc-fadeup') : [];

  if (!('IntersectionObserver' in window) || !section) return;

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        targets.forEach(el => el.style.animationPlayState = 'running');
        o.disconnect();
      }
    });
  }, { threshold: 0.25 });

  targets.forEach(el => el.style.animationPlayState = 'paused');
  obs.observe(section);
})();

// =========== AI SUITE CAROUSEL (3/2/1, step=1, dots + arrows) ===========
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("genaiCarouselTrack");
  const dotsWrap = document.getElementById("genaiCarouselDots");
  if (!track || !dotsWrap) return;

  const container = track.parentElement; // .genai-carousel-container
  const cards = Array.from(track.children);

  // Create arrows
  const prev = document.createElement("button");
  const next = document.createElement("button");
  prev.className = "genai-arrow genai-prev"; prev.innerHTML = "&#10094;";
  next.className = "genai-arrow genai-next"; next.innerHTML = "&#10095;";
  container.appendChild(prev); container.appendChild(next);

  const AUTOPLAY = 2000;       // ms
  const SWIPE_THRESHOLD = 40;  // px
  let visible = 3;
  let maxIndex = 0;
  let index = 0;
  let timer = null;

  const getVisible = () => (innerWidth <= 600 ? 1 : innerWidth <= 992 ? 2 : 3);

  function cardFullWidth(el) {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    const m = parseFloat(s.marginLeft) + parseFloat(s.marginRight);
    return r.width + m;
  }

  function calc() {
    visible = getVisible();
    maxIndex = Math.max(0, cards.length - visible);
    index = Math.min(index, maxIndex);
    renderDots();
    applyTransform();
  }

  function applyTransform() {
    const w = cardFullWidth(cards[0]) || 0;
    track.style.transform = `translateX(${-index * w}px)`;
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function renderDots() {
    dotsWrap.innerHTML = "";
    const count = maxIndex + 1;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "genai-dot" + (i === index ? " active" : "");
      b.addEventListener("click", () => { index = i; applyTransform(); restart(); });
      dotsWrap.appendChild(b);
    }
  }

  function nextSlide() { index = index >= maxIndex ? 0 : index + 1; applyTransform(); }
  function prevSlide() { index = index <= 0 ? maxIndex : index - 1; applyTransform(); }

  function stop() { if (timer) clearInterval(timer); timer = null; }
  function start() { stop(); timer = setInterval(nextSlide, AUTOPLAY); }
  function restart() { stop(); start(); }

  next.addEventListener("click", () => { nextSlide(); restart(); });
  prev.addEventListener("click", () => { prevSlide(); restart(); });

  container.addEventListener("mouseenter", stop);
  container.addEventListener("mouseleave", start);

  let down = false, startX = 0, dx = 0;
  function startDrag(x) { down = true; startX = x; dx = 0; stop(); }
  function moveDrag(x) { if (!down) return; dx = x - startX; }
  function endDrag() {
    if (!down) return;
    if (dx <= -SWIPE_THRESHOLD) nextSlide();
    else if (dx >= SWIPE_THRESHOLD) prevSlide();
    down = false; start();
  }
  container.addEventListener("touchstart", e => startDrag(e.touches[0].clientX), { passive: true });
  container.addEventListener("touchmove", e => moveDrag(e.touches[0].clientX), { passive: true });
  container.addEventListener("touchend", endDrag);
  container.addEventListener("mousedown", e => startDrag(e.clientX));
  window.addEventListener("mousemove", e => moveDrag(e.clientX));
  window.addEventListener("mouseup", endDrag);

  let rAF;
  window.addEventListener("resize", () => {
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(calc);
  });

  calc();
  start();
});

// Intellidoc Section
// Light, dependency-free entrance animation using IntersectionObserver
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".gent-hero");
  if (!section || !("IntersectionObserver" in window)) return;

  const badge = section.querySelector(".gent-badge");
  const title = section.querySelector(".gent-hero-title");
  const desc = section.querySelector(".gent-hero-desc");
  const cta = section.querySelector(".gent-cta");
  const micro = section.querySelector(".gent-micro");

  // Start in resting state (already handled by CSS) and fade in when visible
  const show = () => {
    // Staggered reveal
    if (badge) setTimeout(() => badge.classList.add("gent-in-badge"), 80);
    if (title) setTimeout(() => title.classList.add("gent-in"), 200);
    if (desc) setTimeout(() => desc.classList.add("gent-in"), 360);
    if (cta) setTimeout(() => cta.classList.add("gent-in"), 480);
    if (micro) setTimeout(() => micro.classList.add("gent-in"), 560);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        show();
        io.disconnect();
      }
    });
  }, { threshold: 0.25 });

  io.observe(section);
});


// IntelliDoc.AI CTA Typewriter Animation
document.addEventListener("DOMContentLoaded", function () {
  const words = [
    "Automate Documents",
    "Summarize Reports",
    "Extract Key Data",
    "Accelerate Decisions"
  ];

  const typewriterEl = document.getElementById("intellidoc-typewriter");
  const cursor = document.querySelector(".intellidoc-cursor");
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 1500;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterEl.textContent = currentWord.substring(0, charIndex--);
    } else {
      typewriterEl.textContent = currentWord.substring(0, charIndex++);
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, delayBetweenWords);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }
  }

  type();
});


// IntelliDoc.AI - Custom Pilot: lightweight client-side validation + toast
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("intellidoc-cpilot-form");
  const toast = document.getElementById("intellidoc-cpilot-toast");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // basic validation
    const requiredIds = ["cpilot-name", "cpilot-email", "cpilot-company", "cpilot-usecase"];
    let valid = true;

    requiredIds.forEach((id) => {
      const field = document.getElementById(id);
      const wrapper = field.closest(".intellidoc-cpilot-field");
      if (wrapper) wrapper.classList.remove("invalid");

      if (!field.value || (field.type === "email" && !/.+@.+\..+/.test(field.value))) {
        valid = false;
        if (wrapper) wrapper.classList.add("invalid");
      }
    });

    if (!valid) return;

    // Simulate success — integrate with your backend/Forms tool here
    form.reset();
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  });
});
