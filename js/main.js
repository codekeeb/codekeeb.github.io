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

    renderCarousel();
    renderSpecs();
    renderFlavors();
    renderModels(); renderPriceNote();
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

  /* ---------- carrusel del inicio (modelos disponibles) ---------- */
  let carIndex = 0, carTimer = null, carSlides = [];

/* Las fotos de producto viven en assets/img/products/ (no por idioma:
   son el mismo teclado en las tres webs). Hay version -sm para movil. */
/* Rotulacion del nombre en 3 niveles, como el logotipo:
   modelo en negro, lo caracteristico en gris, y el RGB en degradado.
   Sin `title` en data.js se cae a name+version, todo en negro. */
function titleHTML(p){
  const T = p.title;
  if (!T) return `<span class="kbtitle"><b>${p.name}</b><em>${p.version}</em></span>`;
  return `<span class="kbtitle">` +
    `<b>${T.model}</b>` +
    (T.trait  ? `<em>${T.trait}</em>` : "") +
    (T.accent ? `<i class="grad-text">${T.accent}</i>` : "") +
    `</span>`;
}
function prodImg(file){ return "assets/img/products/" + file; }
function prodSrcset(file){
  const sm = file.replace(/\.jpg$/, "-sm.jpg");
  return prodImg(sm) + " 640w, " + prodImg(file) + " 1200w";
}
/* Precio formateado en euros, con el separador del idioma activo. */
function fmtPrice(v){
  if (v === null || v === undefined) return "";
  return new Intl.NumberFormat(lang === "en" ? "en-IE" : lang === "fr" ? "fr-FR" : "es-ES",
    { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(v);
}
/* Bloque de precio: "desde X" + tachado del original si hay descuento. */
function priceBlock(p){
  if (p.priceFrom === undefined || p.priceFrom === null) return "";
  const from = fmtPrice(p.priceFrom);
  const orig = p.priceOriginal && p.discountPct
    ? `<s>${fmtPrice(p.priceOriginal)}</s><em class="price__off">-${p.discountPct}%</em>` : "";
  return `<p class="price"><span class="price__lbl">${t("price.from")}</span>
    <strong>${from}</strong>${orig}</p>`;
}

  function renderCarousel() {
    const track = $("#carouselTrack");
    const dots = $("#carouselDots");
    if (!track) return;

    /* Al carrusel solo van los destacados: con 5 modelos, pasarlos
       todos era justo lo que lo hacia parecer un pase de diapositivas.
       El resto vive en la reja de "Modelos", que se escanea de un vistazo. */
    carSlides = CK_PRODUCTS.filter(p => p.status === "available" && p.featured && p.heroImg);

    track.innerHTML = carSlides.map((p, i) => {
      const url = p.url || CK_SHOP_URL;
      const title = p.titleImg
        ? `<img src="assets/${p.titleImg}" alt="${p.name} ${p.version}" class="slide__title-svg" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>`
        : `<span class="slide__title-text">${titleHTML(p)}</span>`;
      const stats = (p.stats || []).map(([v, lbl]) => `
        <li><strong>${v}</strong><span>${lbl[lang] || lbl.es}</span></li>`).join("");
      return `
      <article class="slide" role="group" aria-roledescription="modelo" aria-label="${p.name} ${p.version}">
        <div class="slide__copy">
          <p class="kicker">${(p.kicker && (p.kicker[lang] || p.kicker.es)) || ""}</p>
          <h1 class="slide__title" aria-label="${p.name} ${p.version}">${title}</h1>
          <p class="slide__sub">${p.desc[lang] || p.desc.es}</p>
          ${priceBlock(p)}
          <div class="slide__actions">
            <a class="btn btn--primary" href="${url}" target="_blank" rel="noopener">${t("hero.buy")}</a>
            <a class="btn btn--ghost" href="modelo.html?id=${p.id}">${t("hero.discover")}</a>
          </div>
          <ul class="slide__stats">${stats}</ul>
        </div>
        <figure class="slide__figure">
          <div class="slide__card">
            <img src="${prodImg(p.heroImg || p.img)}"
                 srcset="${prodSrcset(p.heroImg || p.img)}" sizes="(max-width:900px) 92vw, 46vw"
                 alt="${p.name} ${p.version}"
                 ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
            <span class="cross cross--tl" aria-hidden="true"></span>
            <span class="cross cross--br" aria-hidden="true"></span>
          </div>
          <figcaption class="mono slide__cap">${p.caption || ""}</figcaption>
        </figure>
      </article>`;
    }).join("");

    // puntos (solo si hay más de un modelo)
    dots.innerHTML = carSlides.length > 1
      ? carSlides.map((p, i) =>
          `<button class="carousel__dot" role="tab" aria-label="${p.name} ${p.version}" data-go="${i}"></button>`).join("")
      : "";

    // ¿un solo modelo? ocultar flechas/puntos
    $("#carousel").classList.toggle("is-single", carSlides.length <= 1);

    if (carIndex >= carSlides.length) carIndex = 0;
    goSlide(carIndex, false);
  }

  function goSlide(i, animate = true) {
    if (!carSlides.length) return;
    carIndex = (i + carSlides.length) % carSlides.length;
    const track = $("#carouselTrack");
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translateX(${-carIndex * 100}%)`;
    if (!animate) requestAnimationFrame(() => { track.style.transition = ""; });

    $$(".carousel__dot").forEach((d, di) => d.classList.toggle("is-active", di === carIndex));
    $$(".slide", track).forEach((s, si) => s.classList.toggle("is-active", si === carIndex));
    animateCounters($$(".slide", track)[carIndex]);
  }

  function carNext() { goSlide(carIndex + 1); }
  function carPrev() { goSlide(carIndex - 1); }

  function startAuto() {
    if (reduceMotion || carSlides.length <= 1) return;
    stopAuto();
    carTimer = setInterval(carNext, 6000);
  }
  function stopAuto() { if (carTimer) { clearInterval(carTimer); carTimer = null; } }

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

      /* Foto: si un modelo aun no tiene la suya, se pinta un hueco con
         el nombre en vez de una imagen rota o una foto de otro teclado. */
      const media = p.img
        ? `<img src="${prodImg(p.img)}" srcset="${prodSrcset(p.img)}"
                sizes="(max-width:700px) 92vw, 30vw"
                alt="${p.name} ${p.version}" loading="lazy">`
        : `<div class="model-card__nophoto"><span>${p.name}</span></div>`;

      /* Variantes reales del anuncio. Las agotadas salen tachadas: si
         desaparecen, el cliente pregunta por ellas igualmente. */
      const opts = (p.buildOptions || []).map(o => {
        const label = o.name[lang] || o.name.es;
        const price = o.price ? ` · ${fmtPrice(o.price)}${o.priceTo ? "–" + fmtPrice(o.priceTo) : ""}` : "";
        return `<li${o.sold ? ' class="is-sold"' : ""}>${label}${o.sold ? "" : price}</li>`;
      }).join("");

      /* Ultimas unidades: solo cuando es verdad y es bajo. */
      const low = (p.stock !== null && p.stock !== undefined && p.stock <= 2)
        ? `<span class="model-card__stock">${p.stock === 1
              ? t("models.lastUnit")
              : t("models.lastUnits").replace("%n", p.stock)}</span>` : "";

      const stars = p.rating
        ? `<span class="model-card__rating" title="${p.reviews} ${t("models.reviews")}">
             ${"★".repeat(Math.round(p.rating))} <em>${p.rating.toFixed(1)}</em></span>` : "";

      /* La tarjeta entera lleva a su pagina; el boton va directo a Etsy
         para quien ya lo tiene decidido. */
      return `
      <article class="model-card reveal" style="--d:${i * 0.08}s">
        <a class="model-card__link" href="modelo.html?id=${p.id}"
           aria-label="${p.name} ${p.version}"></a>
        <div class="model-card__media">
          <span class="model-card__badge${soon ? " is-soon" : ""}">
            ${soon ? t("models.soon") : t("models.available")}
          </span>
          ${p.discountPct ? `<span class="model-card__off">-${p.discountPct}%</span>` : ""}
          ${media}
        </div>
        <div class="model-card__body">
          <h3>${titleHTML(p)}</h3>
          ${stars}
          <p class="model-card__desc">${p.desc[lang] || p.desc.es}</p>
          ${priceBlock(p)}
          ${opts ? `<ul class="model-card__opts">${opts}</ul>` : ""}
          <div class="model-card__meta">
            ${p.meta.map(m => `<span>${m}</span>`).join("")}
          </div>
          ${low}
          ${soon ? "" : `<div class="model-card__ctas">
            <a class="btn btn--primary model-card__cta" href="modelo.html?id=${p.id}">${t("models.details")}</a>
            <a class="btn btn--ghost model-card__cta2" href="${url}" target="_blank" rel="noopener">${t("models.view")}</a>
          </div>`}
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

  /* ---------- nota de precios ---------- */
  function renderPriceNote(){
    const el = $("#priceNote");
    if (!el || typeof CK_PRICES_UPDATED === "undefined") return;
    const d = new Date(CK_PRICES_UPDATED + "T00:00:00");
    const fmt = new Intl.DateTimeFormat(
      lang === "en" ? "en-GB" : lang === "fr" ? "fr-FR" : "es-ES",
      { day: "numeric", month: "long", year: "numeric" }).format(d);
    el.textContent = t("price.note").replace("%d", fmt);
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  function observeNew() {
    $$(".reveal:not(.is-in)").forEach(el => io.observe(el));
  }

  /* ---------- contadores (anima los <strong> numéricos del slide activo) ---------- */
  function animateCounters(scope) {
    if (!scope) return;
    $$(".slide__stats strong", scope).forEach(el => {
      const target = parseInt(el.dataset.count ?? el.textContent, 10);
      if (!Number.isFinite(target)) return;          // "BT+5", "ZMK"… se dejan tal cual
      el.dataset.count = target;
      if (reduceMotion) { el.textContent = target; return; }
      const dur = 1100, t0 = performance.now();
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

  /* ---------- controles del carrusel ---------- */
  const carousel = $("#carousel");
  if (carousel) {
    $("#carNext").addEventListener("click", () => { carNext(); startAuto(); });
    $("#carPrev").addEventListener("click", () => { carPrev(); startAuto(); });
    $("#carouselDots").addEventListener("click", e => {
      const btn = e.target.closest("[data-go]");
      if (btn) { goSlide(+btn.dataset.go); startAuto(); }
    });

    // pausa al pasar el ratón / al perder visibilidad
    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    document.addEventListener("visibilitychange", () =>
      document.hidden ? stopAuto() : startAuto());

    // teclado (flechas) cuando el carrusel está enfocado
    carousel.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { carNext(); startAuto(); }
      else if (e.key === "ArrowLeft") { carPrev(); startAuto(); }
    });

    // swipe táctil
    let x0 = null;
    const vp = $(".carousel__viewport");
    vp.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; stopAuto(); }, { passive: true });
    vp.addEventListener("touchend", e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) (dx < 0 ? carNext() : carPrev());
      x0 = null; startAuto();
    }, { passive: true });

    startAuto();
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
