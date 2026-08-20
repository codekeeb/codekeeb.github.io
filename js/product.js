/* ============================================================
   CODEKEEB — página de producto (modelo.html?id=…)
   ------------------------------------------------------------
   Una sola plantilla para los 5 modelos: lee ?id= y saca todo
   de CK_PRODUCTS. Añadir un modelo a data.js le da su página
   sin tocar nada aquí.
   ============================================================ */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  let lang = localStorage.getItem("ck-lang") || "es";
  const t = k => (CK_I18N[lang] && CK_I18N[lang][k]) || CK_I18N.es[k] || k;
  /* Los textos del catálogo vienen como {es,en,fr} o como string suelto. */
  const L = v => (v && typeof v === "object") ? (v[lang] || v.es) : v;

  const prodImg = f => "assets/img/products/" + f;
  const prodSrcset = f => prodImg(f.replace(/\.jpg$/, "-sm.jpg")) + " 640w, " + prodImg(f) + " 1200w";

  const fmt = v => v === null || v === undefined ? "" :
    new Intl.NumberFormat(lang === "en" ? "en-IE" : lang === "fr" ? "fr-FR" : "es-ES",
      { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(v);

  const params = new URLSearchParams(location.search);
  const product = (typeof CK_PRODUCTS !== "undefined")
    ? CK_PRODUCTS.find(p => p.id === params.get("id")) : null;

  /* Mismo rotulado en 3 niveles que en la home (ver main.js). */
  function titleHTML(p){
    const T = p.title;
    if (!T) return `<span class="kbtitle"><b>${p.name}</b><em>${p.version}</em></span>`;
    return `<span class="kbtitle">` +
      `<b>${T.model}</b>` +
      (T.trait  ? `<em>${T.trait}</em>` : "") +
      (T.accent ? `<i class="grad-text">${T.accent}</i>` : "") +
      `</span>`;
  }

  function render() {
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    localStorage.setItem("ck-lang", lang);
    $$("[data-setlang]").forEach(b => b.classList.toggle("is-active", b.dataset.setlang === lang));
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });

    if (!product) {
      $("#pdpMissing").hidden = false;
      $("#pdp").hidden = true;
      document.title = t("pdp.notFound") + " · Codekeeb";
      return;
    }
    $("#pdpMissing").hidden = true;
    $("#pdp").hidden = false;

    const name = product.name + " " + product.version;
    const desc = L(product.desc);

    /* --- head --- */
    document.title = name + " · Codekeeb";
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', name + " · Codekeeb");
    setMeta('meta[property="og:description"]', desc);
    if (product.img) {
      const abs = location.origin + location.pathname.replace(/[^/]*$/, "") + prodImg(product.img);
      setMeta('meta[property="og:image"]', abs);
      setMeta('meta[name="twitter:image"]', abs);
    }

    /* --- cabecera --- */
    $("#pdpCrumb").textContent = name;
    $("#pdpKicker").textContent = L(product.kicker) || "";
    $("#pdpTitle").innerHTML = titleHTML(product);
    $("#pdpDesc").textContent = desc;

    const rating = $("#pdpRating");
    if (product.rating) {
      rating.hidden = false;
      rating.innerHTML = '<span class="stars">' + "★".repeat(Math.round(product.rating)) +
        "</span> " + product.rating.toFixed(1) +
        " · " + product.reviews + " " + t("models.reviews");
    } else rating.hidden = true;

    /* --- galería --- */
    const gallery = (product.gallery && product.gallery.length)
      ? product.gallery : (product.img ? [product.img] : []);
    const stage = $("#pdpImg");
    if (gallery.length) {
      setImg(stage, gallery[0], name);
      stage.hidden = false;
    } else {
      /* Sin foto: hueco con el nombre, nunca una imagen rota. */
      stage.hidden = true;
      $(".pdp__stage").classList.add("is-empty");
      $(".pdp__stage").dataset.name = product.name;
    }
    const off = $("#pdpOff");
    if (product.discountPct) { off.hidden = false; off.textContent = "-" + product.discountPct + "%"; }
    else off.hidden = true;

    const thumbs = $("#pdpThumbs");
    thumbs.innerHTML = gallery.length > 1 ? gallery.map((f, i) =>
      `<button class="pdp__thumb${i === 0 ? " on" : ""}" data-f="${f}" aria-label="${name} ${i + 1}">
         <img src="${prodImg(f.replace(/\.jpg$/, "-sm.jpg"))}" alt="" loading="lazy">
       </button>`).join("") : "";
    thumbs.querySelectorAll(".pdp__thumb").forEach(b => b.addEventListener("click", () => {
      setImg(stage, b.dataset.f, name);
      thumbs.querySelectorAll(".pdp__thumb").forEach(x => x.classList.toggle("on", x === b));
    }));

    /* --- precio --- */
    const orig = product.priceOriginal && product.discountPct
      ? `<s>${fmt(product.priceOriginal)}</s><em class="price__off">-${product.discountPct}%</em>` : "";
    $("#pdpPrice").innerHTML = product.priceFrom !== undefined && product.priceFrom !== null
      ? `<p class="price"><span class="price__lbl">${t("price.from")}</span>
           <strong>${fmt(product.priceFrom)}</strong>${orig}</p>` : "";

    /* --- opciones de compra --- */
    $("#pdpOpts").innerHTML = (product.buildOptions || []).map(o => {
      const price = o.price
        ? `<span class="opt__price">${fmt(o.price)}${o.priceTo ? "–" + fmt(o.priceTo) : ""}</span>` : "";
      const sold = o.sold ? `<span class="opt__sold">${t("pdp.soldOut")}</span>` : "";
      return `<li class="opt${o.sold ? " is-sold" : ""}">
                <span class="opt__name">${L(o.name)}</span>${price}${sold}</li>`;
    }).join("");

    const stock = $("#pdpStock");
    if (product.stock !== null && product.stock !== undefined && product.stock <= 2) {
      stock.hidden = false;
      stock.textContent = product.stock === 1
        ? t("models.lastUnit") : t("models.lastUnits").replace("%n", product.stock);
    } else stock.hidden = true;

    const url = product.url || CK_SHOP_URL;
    $("#pdpCta").href = url;
    $("#navBuy").href = url;

    if (typeof CK_PRICES_UPDATED !== "undefined") {
      const d = new Date(CK_PRICES_UPDATED + "T00:00:00");
      const f = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang === "fr" ? "fr-FR" : "es-ES",
        { day: "numeric", month: "long", year: "numeric" }).format(d);
      $("#pdpNote").textContent = t("price.note").replace("%d", f);
    }

    /* --- destacados y ficha --- */
    const hl = (product.highlights && L(product.highlights)) || [];
    $("#pdpHighlightsBlock").hidden = hl.length === 0;
    $("#pdpHighlights").innerHTML = hl.map(h => `<li>${h}</li>`).join("");

    const specs = product.specs || [];
    $("#pdpSpecsBlock").hidden = specs.length === 0;
    $("#pdpSpecs").innerHTML = specs.map(([k, v]) =>
      `<div class="pdp__spec"><dt>${L(k)}</dt><dd>${L(v)}</dd></div>`).join("");

    /* --- otros modelos --- */
    $("#pdpOthers").innerHTML = CK_PRODUCTS.filter(p => p.id !== product.id).map(p => {
      const media = p.img
        ? `<img src="${prodImg(p.img)}" srcset="${prodSrcset(p.img)}"
             sizes="(max-width:700px) 92vw, 30vw" alt="${p.name} ${p.version}" loading="lazy">`
        : `<div class="model-card__nophoto"><span>${p.name}</span></div>`;
      return `<a class="model-card" href="modelo.html?id=${p.id}">
        <div class="model-card__media">${media}</div>
        <div class="model-card__body">
          <h3>${titleHTML(p)}</h3>
          <p class="price"><span class="price__lbl">${t("price.from")}</span>
             <strong>${fmt(p.priceFrom)}</strong></p>
        </div></a>`;
    }).join("");
  }

  function setImg(el, file, alt) {
    el.src = prodImg(file);
    el.srcset = prodSrcset(file);
    el.sizes = "(max-width:900px) 92vw, 52vw";
    el.alt = alt;
  }
  function setMeta(sel, val) {
    const el = document.querySelector(sel);
    if (el) el.setAttribute("content", val);
  }

  $$("[data-setlang]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.setlang === lang) return;
    lang = b.dataset.setlang;
    render();
  }));

  render();
})();
