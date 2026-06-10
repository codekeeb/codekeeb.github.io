/* ============================================================
   CODEKEEB — interacción, animaciones e i18n runtime
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- idioma ---------- */
  let lang = localStorage.getItem("ck-lang");
  if (!CK_I18N[lang]) {
    const nav = (navigator.language || "es").slice(0, 2);
    lang = CK_I18N[nav] ? nav : "es";
  }

  function t(key) {
    return (CK_I18N[lang] && CK_I18N[lang][key]) ?? CK_I18N.es[key] ?? "";
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    localStorage.setItem("ck-lang", lang);

    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-img]").forEach(el => {
      el.src = `assets/img/${lang}/${el.dataset.i18nImg}`;
    });
    $$("[data-setlang]").forEach(b =>
      b.classList.toggle("is-active", b.dataset.setlang === lang));

    renderSpecs();
    renderFlavors();
    renderModels();
    observeNew();
  }

  $$("[data-setlang]").forEach(btn =>
    btn.addEventListener("click", () => {
      if (btn.dataset.setlang === lang) return;
      lang = btn.dataset.setlang;
      document.body.style.opacity = "0";
      setTimeout(() => {
        applyLang();
        document.body.style.transition = "opacity .45s ease";
        document.body.style.opacity = "1";
      }, 180);
    }));

  /* ---------- enlaces a tienda ---------- */
  function applyShopLinks() {
    $$("[data-shop]").forEach(a => {
      a.href = CK_SHOP_URL;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ---------- specs (desde i18n) ---------- */
  function renderSpecs() {
    const grid = $("#specsGrid");
    if (!grid) return;
    const items = CK_I18N[lang]["specs.items"] || CK_I18N.es["specs.items"];
    grid.innerHTML = items.map(([dt, dd], i) => `
      <div class="specs__cell reveal" style="--d:${(i % 4) * 0.06}s">
        <dt>${dt}</dt><dd>${dd}</dd>
      </div>`).join("");
  }

  /* ---------- sabores (desde data.js) ---------- */
  function renderFlavors() {
    const wrap = $("#flavorCards");
    if (!wrap) return;
    const cards = CK_FLAVORS.map(f => `
      <div class="flavor-card${f.status === "soon" ? " flavor-card--ghost" : ""}">
        <div class="flavor-card__dots">
          ${f.swatches.map(c => `<i style="background:${c}"></i>`).join("")}
        </div>
        <h3>${f.name}</h3>
        <span class="mono">${f.status === "available" ? t("flavors.available") : t("flavors.soon")}</span>
      </div>`);
    // tarjeta fantasma fija: el siguiente sabor
    cards.push(`
      <div class="flavor-card flavor-card--ghost">
        <div class="flavor-card__dots"><i></i><i></i><i></i></div>
        <h3>${t("flavors.ghostName")}</h3>
        <span class="mono">${t("flavors.soon")}</span>
      </div>`);
    wrap.innerHTML = cards.join("");
  }

  /* ---------- modelos (desde data.js) ---------- */
  function renderModels() {
    const grid = $("#modelsGrid");
    if (!grid) return;
    const cards = CK_PRODUCTS.map((p, i) => {
      const soon = p.status === "soon";
      const url = p.url || CK_SHOP_URL;
      return `
      <article class="model-card reveal" style="--d:${i * 0.08}s">
        <div class="model-card__media">
          <span class="model-card__badge${soon ? " is-soon" : ""}">
            ${soon ? t("models.soon") : t("models.available")}
          </span>
          <img src="assets/img/${lang}/${p.img}" alt="${p.name}" loading="lazy">
        </div>
        <div class="model-card__body">
          <h3>${p.name} <em>${p.version}</em></h3>
          <p class="model-card__desc">${p.desc[lang] || p.desc.es}</p>
          <div class="model-card__meta">
            ${p.meta.map(m => `<span>${m}</span>`).join("")}
          </div>
          ${soon ? "" : `<a class="btn btn--primary model-card__cta" href="${url}" target="_blank" rel="noopener">${t("models.view")}</a>`}
        </div>
      </article>`;
    });
    // tarjeta fantasma: escalabilidad visible
    cards.push(`
      <article class="model-card model-card--ghost reveal" style="--d:${CK_PRODUCTS.length * 0.08}s">
        <span class="crosshair-icon" aria-hidden="true">
          <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="26" stroke-linecap="round">
            <path d="M256 28v160M256 324v160M28 256h160M324 256h160"/>
            <rect x="178" y="178" width="156" height="156"/>
          </svg>
        </span>
        <h3>${t("models.ghostTitle")}</h3>
        <p>${t("models.ghostText")}</p>
      </article>`);
    grid.innerHTML = cards.join("");
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
        if (e.target.matches(".hero__stats")) animateCounters(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  function observeNew() {
    $$(".reveal:not(.is-in)").forEach(el => io.observe(el));
  }

  /* ---------- contadores ---------- */
  function animateCounters(scope) {
    $$(".count", scope).forEach(el => {
      const target = +el.dataset.count;
      if (reduceMotion) { el.textContent = target; return; }
      const dur = 1400, t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }

  /* ---------- nav + barra de progreso ---------- */
  const nav = $("#nav");
  const bar = $("#progressBar");
  const sections = ["caracteristicas", "specs", "sabores", "modelos"]
    .map(id => document.getElementById(id)).filter(Boolean);

  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      nav.classList.toggle("is-scrolled", y > 24);
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";

      // enlace activo
      let current = null;
      for (const s of sections) {
        if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id;
      }
      $$(".nav__links a").forEach(a =>
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + current));
      ticking = false;
    });
  }, { passive: true });

  /* ---------- tilt del hero con el ratón ---------- */
  const heroCard = $("#heroTilt");
  if (heroCard && !reduceMotion && matchMedia("(pointer:fine)").matches) {
    const hero = $(".hero");
    hero.addEventListener("mousemove", e => {
      const r = heroCard.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      heroCard.style.setProperty("--ry", (x * 4).toFixed(2) + "deg");
      heroCard.style.setProperty("--rx", (y * -4).toFixed(2) + "deg");
    });
    hero.addEventListener("mouseleave", () => {
      heroCard.style.setProperty("--ry", "0deg");
      heroCard.style.setProperty("--rx", "0deg");
    });
  }

  /* ---------- marquee: duplicar para bucle perfecto ---------- */
  function buildMarquee() {
    const track = $("#marqueeTrack");
    if (!track) return;
    const span = track.querySelector("span");
    // limpiar duplicados previos (cambio de idioma) y re-duplicar
    track.innerHTML = "";
    for (let i = 0; i < 6; i++) track.appendChild(span.cloneNode(true));
  }
  // el contenido del span cambia con i18n: reconstruir tras cada applyLang
  const _applyLang = applyLang;
  applyLang = function () { _applyLang(); buildMarquee(); };

  /* ---------- menú móvil ---------- */
  $("#burger").addEventListener("click", () =>
    document.body.classList.toggle("menu-open"));
  $$(".nav__links a").forEach(a =>
    a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  /* ---------- init ---------- */
  applyShopLinks();
  applyLang();
})();
