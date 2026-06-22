/* ============================================================
   25th Anniversary Sunday School Website — Main Script
   Vanilla JavaScript, no frameworks required
   ============================================================ */

'use strict';

/* ── Search Index ── */
const SEARCH_INDEX = [
  /* Learning Articles */
  { title: 'ስለ እምነት - መሠረታዊ ትምህርት', category: 'ትምህርት', url: 'learning/article1.html' },
  { title: 'ጸሎት - ከእግዚአብሔር ጋር ያለ ግንኙነት', category: 'ትምህርት', url: 'learning/article2.html' },
  { title: 'ቅዱሳት መጻሕፍት - አስፈላጊነቱ', category: 'ትምህርት', url: 'learning/article3.html' },
  { title: 'ፍቅር - ክርስቲያናዊ እሴቶች', category: 'ትምህርት', url: 'learning/article4.html' },
  { title: 'ስለ ቤተ ክርስቲያን ታሪክ', category: 'ሰበካ', url: 'learning/article5.html' },
  { title: 'መለኮታዊ ጸጋ - ምስክርነት', category: 'ሰበካ', url: 'learning/article6.html' },
  /* Songs */
  { title: 'ሃሌሉያ - የምስጋና መዝሙር', category: 'መዝሙር', url: 'songs/song1.html' },
  { title: 'ወደ ቤተ ክርስቲያን - ልዩ ዝማሬ', category: 'መዝሙር', url: 'songs/song2.html' },
  { title: 'ፍቅርህ ይወደድ - የምስጋና ዝማሬ', category: 'መዝሙር', url: 'songs/song3.html' },
  { title: 'አምላኬ ሆይ - ዝማሬ', category: 'መዝሙር', url: 'songs/song4.html' },
  { title: 'የውሉደ ብርሃን ሰንበት ትምህርት ቤት 25 ዓመት - ዝማሬ', category: 'ዝክረ ዓመት', url: 'songs/song5.html' },
  /* Pages */
  { title: 'ስለ ውሉደ ብርሃን ሰንበት ትምህርት ቤት', category: 'ገጽ', url: 'about.html' },
  { title: 'ታሪካዊ ጉዞ', category: 'ታሪክ', url: 'history.html' },
  { title: 'ፎቶ ጋለሪ', category: 'ጋለሪ', url: 'gallery.html' },
  { title: 'ማስታወቂያ', category: 'ዜና', url: 'announcements.html' },
  { title: 'አድራሻ', category: 'ገጽ', url: 'contact.html' },
];

/* ── DOM Ready Helper ── */
function onReady(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

onReady(() => {
  initNavigation();
  initStickyHeader();
  initSearch();
  initGallery();
  initLightbox();
  initGenTabs();
  initCounters();
  initBackToTop();
  initContactForm();
  initDropdowns();
  initPrintBtn();
  initLyricsFilter();
});

/* ══════════════════════════════════════════════
   NAVIGATION — Hamburger + close on link click
══════════════════════════════════════════════ */
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  /* Close on nav link click (mobile) */
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 920) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* Mark active link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  menu.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || href === './' + path) {
      a.classList.add('active');
    }
  });
}

/* ══════════════════════════════════════════════
   STICKY HEADER — adds shadow on scroll
══════════════════════════════════════════════ */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ══════════════════════════════════════════════
   MOBILE DROPDOWN
══════════════════════════════════════════════ */
function initDropdowns() {
  document.querySelectorAll('.nav-dropdown > a').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth < 920) {
        e.preventDefault();
        link.closest('.nav-dropdown').classList.toggle('open');
      }
    });
  });
}

/* ══════════════════════════════════════════════
   SEARCH — live client-side filtering
══════════════════════════════════════════════ */
function initSearch() {
  const inputs   = document.querySelectorAll('.search-input');
  const resultContainers = document.querySelectorAll('.search-results');
  if (!inputs.length) return;

  inputs.forEach((input, idx) => {
    const container = resultContainers[idx] || resultContainers[0];
    if (!container) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 1) { container.innerHTML = ''; return; }

      const matches = SEARCH_INDEX.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );

      if (!matches.length) {
        container.innerHTML = '<p style="text-align:center;color:var(--color-gray-400);padding:1rem;">ምንም ውጤት አልተገኘም።</p>';
        return;
      }

      container.innerHTML = matches.map(m => `
        <div class="search-result-item">
          <a href="${m.url}">${m.title}</a>
          <span class="cat-badge">${m.category}</span>
        </div>
      `).join('');
    });
  });
}

/* ══════════════════════════════════════════════
   GALLERY — inject thumbnails + filter buttons
   Images show by default. Click → opens lightbox.
══════════════════════════════════════════════ */
function initGallery() {

  /* ── 1. Inject <img> thumbnail into every gallery item ── */
  document.querySelectorAll('.gallery-item[data-full]').forEach(item => {
    const src     = item.dataset.full;
    const caption = item.dataset.caption || '';
    const ph      = item.querySelector('.gallery-placeholder');

    // Create the thumbnail img
    const img = document.createElement('img');
    img.src     = src;
    img.alt     = caption;
    img.loading = 'lazy';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;';

    // When image loads successfully → hide the placeholder, show img
    img.addEventListener('load', () => {
      img.classList.add('loaded');  // triggers opacity:1 via CSS
      if (ph) ph.style.display = 'none';
    }, { once: true });

    // When image fails → keep placeholder visible, remove broken img
    img.addEventListener('error', () => {
      img.remove();
      if (ph) ph.style.display = '';
    }, { once: true });

    // Insert img before the placeholder so it sits on top when loaded
    item.insertBefore(img, ph || item.firstChild);

    // Hover zoom on the thumbnail (via JS so it works with dynamically added img)
    item.addEventListener('mouseenter', () => { img.style.transform = 'scale(1.08)'; });
    item.addEventListener('mouseleave', () => { img.style.transform = 'scale(1)'; });

    // Caption overlay — build it if not present
    if (!item.querySelector('.caption-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'caption-overlay';
      overlay.innerHTML = `<span class="caption-text">${caption}</span>`;
      item.appendChild(overlay);
    }
  });

  /* ── 2. Category filter buttons ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      document.querySelectorAll('.gallery-item').forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════
   LIGHTBOX — click any gallery item to enlarge
══════════════════════════════════════════════ */
function initLightbox() {
  const lightbox  = document.querySelector('.lightbox');
  const lbImg     = document.querySelector('.lightbox-img');
  const lbCaption = document.querySelector('.lightbox-caption');
  const lbClose   = document.querySelector('.lightbox-close');
  if (!lightbox || !lbImg) return;

  function openLightbox(src, caption) {
    // Show loading state
    lbImg.style.opacity = '0';
    lbImg.src = src;
    lbImg.alt = caption || '';
    if (lbCaption) lbCaption.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Fade in once loaded
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
    lbClose && lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
    lbImg.style.opacity = '0';
  }

  // Attach click to all gallery items (thumbnail + placeholder both covered)
  document.querySelectorAll('.gallery-item[data-full]').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', (item.dataset.caption || 'ፎቶ ተመልከት') + ' — ጠቅ ለማስፋት');
    item.style.cursor = 'zoom-in';

    item.addEventListener('click', () => {
      openLightbox(item.dataset.full, item.dataset.caption || '');
    });

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item.dataset.full, item.dataset.caption || '');
      }
    });
  });

  // Close on X button
  lbClose && lbClose.addEventListener('click', closeLightbox);

  // Close on clicking backdrop
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

/* ══════════════════════════════════════════════
   GENERATION TABS
══════════════════════════════════════════════ */
function initGenTabs() {
  const tabs = document.querySelectorAll('.gen-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.gen;
      document.querySelectorAll('.gen-content').forEach(c => {
        c.classList.toggle('active', c.dataset.gen === target);
      });
    });
  });
}

/* ══════════════════════════════════════════════
   ANIMATED COUNTERS
══════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const dur = 1800;
      const step = end / (dur / 16);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.floor(cur).toLocaleString() + (el.dataset.suffix || '');
        if (cur >= end) clearInterval(timer);
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

/* ══════════════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════
   CONTACT FORM (front-end only)
══════════════════════════════════════════════ */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    // Look inside form first, then in parent container
    const success = form.querySelector('.form-success') ||
                    form.closest('.contact-form-col')?.querySelector('.form-success') ||
                    document.querySelector('.form-success');
    if (success) {
      form.querySelectorAll('input, textarea').forEach(f => f.value = '');
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }
  });
}

/* ══════════════════════════════════════════════
   PRINT LYRICS BUTTON
══════════════════════════════════════════════ */
function initPrintBtn() {
  document.querySelectorAll('.btn-print').forEach(btn => {
    btn.addEventListener('click', () => window.print());
  });
}

/* ══════════════════════════════════════════════
   SONG / ARTICLE CATEGORY FILTER
══════════════════════════════════════════════ */
function initLyricsFilter() {
  const filterBtns = document.querySelectorAll('.cat-filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('[data-cat-item]').forEach(item => {
        if (cat === 'all' || item.dataset.catItem === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════
   ANNIVERSARY PAGE — Tab panels (.tab-btn / .tab-content)
══════════════════════════════════════════════ */
onReady(() => {
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetId = btn.getAttribute('aria-controls');
      document.querySelectorAll('.tab-content').forEach(panel => {
        panel.classList.add('hidden');
        panel.setAttribute('hidden', '');
      });
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.remove('hidden');
        target.removeAttribute('hidden');
      }
    });
  });

  // Ensure first tab panel is visible on load
  const firstPanel = document.querySelector('.tab-content');
  if (firstPanel) {
    firstPanel.classList.remove('hidden');
    firstPanel.removeAttribute('hidden');
  }
});

/* ══════════════════════════════════════════════
   SMOOTH SCROLL for anchor links (#section)
══════════════════════════════════════════════ */
onReady(() => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 90; // header height
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
});

/* ══════════════════════════════════════════════
   IMAGE FALLBACK — replace broken images with
   a styled placeholder (cross + label)
══════════════════════════════════════════════ */
onReady(() => {
  /* Logo fallback — swap broken logo img with inline SVG cross */
  const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" role="img" aria-label="ውሉደ ብርሃን ሰንበት ትምህርት ቤት አርማ">
    <circle cx="30" cy="30" r="29" fill="#0D1F3C" stroke="#C9A84C" stroke-width="2.5"/>
    <rect x="27" y="10" width="6" height="34" rx="2" fill="#C9A84C"/>
    <rect x="16" y="20" width="28" height="6" rx="2" fill="#C9A84C"/>
  </svg>`;

  document.querySelectorAll('img[src*="logo"]').forEach(img => {
    img.addEventListener('error', () => {
      const wrapper = img.parentElement;
      const div = document.createElement('div');
      div.className = 'logo-fallback';
      div.innerHTML = LOGO_SVG;
      div.style.cssText = `
        width:${img.width || 44}px;
        height:${img.height || 44}px;
        flex-shrink:0;
      `;
      wrapper.replaceChild(div, img);
    }, { once: true });
  });

  /* Card / person / gallery images — show placeholder on error */
  document.querySelectorAll('.card-img img, .person-card img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const wrap = img.parentElement;
      if (!wrap.querySelector('.img-fallback')) {
        const fb = document.createElement('div');
        fb.className = 'img-fallback';
        fb.setAttribute('aria-hidden', 'true');
        fb.innerHTML = '✞';
        wrap.appendChild(fb);
      }
    }, { once: true });
  });
});

/* ══════════════════════════════════════════════
   NO-IMAGE NOTICE
   — shows a soft info bar when gallery placeholders
     are present (no real photos uploaded yet)
══════════════════════════════════════════════ */
onReady(() => {
  const placeholders = document.querySelectorAll('.gallery-placeholder');
  if (!placeholders.length) return;

  const grid = document.querySelector('.gallery-grid, .gallery-filters');
  if (!grid) return;

  // Only show once per page
  if (document.querySelector('.no-image-notice')) return;

  const notice = document.createElement('div');
  notice.className = 'no-image-notice';
  notice.innerHTML = `
    <span class="notice-icon">📷</span>
    <span>ፎቶዎቹ ገና አልተጫኑም። ፎቶዎቹን <code>images/</code> ፎልደር ውስጥ ሲጨምሩ ይታያሉ።</span>
  `;
  grid.parentElement.insertBefore(notice, grid);
});
