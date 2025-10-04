/* Mobile menu toggle */
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

/* Rotating words in hero */
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
const data = {
  healthcare: {
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    text: "We help healthcare providers modernize compliance, operations, and reporting with AI-powered document intelligence, Qlik dashboards, and cloud analytics. Our solutions enhance regulatory tracking, patient data access, and performance insights—improving care delivery and operational efficiency."
  },
  retail: {
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    text: "From daily store insights to granular demand forecasting, our AI and analytics tools empower retailers to optimize pricing, inventory, and customer engagement. Solutions like RetailPulse.AI guide regional managers with actionable summaries, boosting efficiency across retail clusters."
  },
  manufacturing: {
    img: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&h=600&fit=crop",
    text: "We enable manufacturers to track operational KPIs, unify reporting across plants, and improve forecasting accuracy. With tools like DBQuery.AI and custom dashboards, we reduce IT dependency, unlock real-time insights, and streamline supply chain and production decisions."
  },
  automobile: {
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
    text: "Lagozon supports automotive clients with AI-led service analytics, part-level cost insights, and dealer performance dashboards. We empower vehicle repair and service teams to reduce delays, optimize processes, and scale decision intelligence across regions and functions."
  },
  logistics: {
    img: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&h=600&fit=crop",
    text: "Our solutions drive visibility across fleet operations, service metrics, and delivery performance. From geo-analytics to S&OP dashboards, we unify distributed data for faster exception handling, better route planning, and smarter network decisions across logistics chains."
  },
  pharma: {
    img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=600&fit=crop",
    text: "We enable pharma companies to automate CVR analysis, track product interest, and enhance sales planning using AI. From sentiment tagging to dashboarding, our tools provide intelligence across sales, marketing, and regulatory compliance functions."
  }
};

function switchIndustry(industry, el) {
  // Update image and text
  document.getElementById('industry-img').src = data[industry].img;
  document.getElementById('industry-text').innerHTML = data[industry].text;

  // Update active tab
  const tabs = document.querySelectorAll('.industry-tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  el.classList.add('active');

  // Scroll active tab into view on mobile
  if (window.innerWidth <= 768) {
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}


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
// Contact card
// Bottom
const buttons = document.querySelectorAll(".accordion-btn");

        buttons.forEach((btn) => {
            btn.addEventListener("click", function () {
                const isActive = btn.classList.contains("active");

                // Close all open accordions
                document.querySelectorAll(".accordion-btn").forEach(b => b.classList.remove("active"));
                document.querySelectorAll(".accordion-content").forEach(c => c.style.display = "none");

                // Open the clicked one
                if (!isActive) {
                    btn.classList.add("active");
                    btn.nextElementSibling.style.display = "block";
                }
            });
        });



// Submit
document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();
  alert("Thank you! Your query has been submitted.");
});