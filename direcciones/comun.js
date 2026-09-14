/* ============================================================
   CODEKEEB — motor comun de las tres direcciones
   ------------------------------------------------------------
   Las direcciones son propuestas de DISENO, no de datos: las tres
   leen el mismo `js/data.js` y el mismo `js/i18n.js` que la web de
   produccion. Asi lo que se compara es la forma, no el contenido,
   y ninguna puede hacer trampas inventandose un producto.

   Aqui solo va lo que las tres necesitan igual: idioma, formato de
   precio y lectura del catalogo. El aspecto lo pone cada una en su
   propia hoja de estilo; ninguna carga `css/style.css`.
   ============================================================ */

const CK = (() => {
  const IDIOMAS = ["es", "en", "fr"];

  /* El idioma vive en localStorage y lo comparten las tres direcciones
     y la web: si lo cambias aqui, sigue cambiado alla. */
  function idioma() {
    const url = new URLSearchParams(location.search).get("lang");
    const guardado = url || localStorage.getItem("ck-lang");
    return IDIOMAS.includes(guardado) ? guardado : "es";
  }

  let lang = idioma();

  /* Un texto de i18n.js. Si falta la clave devolvemos la clave cruda
     a proposito: se ve en la pagina y en las capturas, que es como se
     caza un idioma a medias. */
  const t = k => (CK_I18N[lang] && CK_I18N[lang][k]) || k;

  /* Un campo del catalogo que viene como {es,en,fr}. Los hay que son
     una cadena suelta (un "58" no se traduce); esos se devuelven tal cual. */
  const L = v => (v && typeof v === "object" && !Array.isArray(v)) ? (v[lang] ?? v.es) : v;

  const LOCALE = { es: "es-ES", en: "en-GB", fr: "fr-FR" };

  /* Precio en euros. Sin decimales cuando son ,00: un "40 €" se lee
     mas rapido que un "40,00 €" y el importe real lo confirma Etsy. */
  function precio(n) {
    if (n == null) return null;
    const entero = Math.abs(n % 1) < 0.005;
    return new Intl.NumberFormat(LOCALE[lang], {
      style: "currency", currency: "EUR",
      minimumFractionDigits: entero ? 0 : 2,
      maximumFractionDigits: entero ? 0 : 2,
    }).format(n);
  }

  function fechaPrecios() {
    const d = new Date(CK_PRICES_UPDATED + "T00:00:00");
    return new Intl.DateTimeFormat(LOCALE[lang], { day: "numeric", month: "long", year: "numeric" }).format(d);
  }

  const notaPrecios = () => t("price.note").replace("%d", fechaPrecios());

  /* --- lectura del catalogo -------------------------------------- */

  /* Las fichas no traen los mismos campos en todos los modelos (el Sofle
     Carbon tiene 10 y el Corne v3 tiene 5), asi que buscamos por
     etiqueta en castellano, que es la que siempre existe. */
  function spec(p, etiqueta) {
    const fila = (p.specs || []).find(s => s[0].es === etiqueta);
    return fila ? L(fila[1]) : null;
  }

  /* Las etiquetas de ficha que aparecen en al menos un modelo, en el
     orden en que aparecen. Sirve para montar una tabla comparativa sin
     escribir a mano una lista que se quedaria desfasada al anadir un
     producto. */
  function etiquetasDeFicha(productos) {
    const orden = [], vistas = new Set();
    for (const p of productos) {
      for (const [clave] of (p.specs || [])) {
        if (vistas.has(clave.es)) continue;
        vistas.add(clave.es);
        orden.push(clave);
      }
    }
    return orden;
  }

  /* Rasgos deducidos de la ficha, no escritos a mano: si manana un
     modelo deja de ser inalambrico, el filtro se entera solo. */
  function rasgos(p) {
    const conexion = (spec(p, "Conexión") || "").toLowerCase();
    const switches = (spec(p, "Switches") || "").toLowerCase();
    return {
      inalambrico: /bluetooth|sans fil|wireless|inalámbric/.test(conexion),
      low: /choc|low profile/.test(switches),
      mx: /\bmx\b/.test(switches),
      encoder: !!spec(p, "Encoders"),
    };
  }

  const FILTROS = {
    all: () => true,
    wireless: p => rasgos(p).inalambrico,
    low: p => rasgos(p).low,
    mx: p => rasgos(p).mx,
    encoder: p => rasgos(p).encoder,
  };

  /* Stock en palabras. `null` significa "por encargo", que no es lo
     mismo que agotado y genera muchas menos preguntas. */
  function stock(p) {
    if (p.status === "soon") return { txt: t("models.soon"), clase: "pronto" };
    if (p.stock == null) return { txt: t("d.onRequest"), clase: "encargo" };
    if (p.stock <= 0) return { txt: t("pdp.soldOut"), clase: "agotado" };
    if (p.stock === 1) return { txt: t("d.lastOne"), clase: "ultima" };
    return { txt: t("d.units").replace("%n", p.stock), clase: "hay" };
  }

  /* El nombre en tres niveles, como el logotipo: modelo en negro,
     rasgo en gris, y el acento en degradado SOLO cuando dice RGB.
     Es compromiso de marca, no decoracion. */
  function rotulo(p) {
    const tit = p.title || { model: p.name, trait: p.version };
    const partes = [`<b>${tit.model}</b>`];
    if (tit.trait) partes.push(`<i>${tit.trait}</i>`);
    if (tit.accent) partes.push(`<u>${tit.accent}</u>`);
    return partes.join(" ");
  }

  const foto = (p, pequena) =>
    `../assets/img/products/${pequena && p.img ? p.img.replace(/\.jpg$/, "-sm.jpg") : p.img}`;

  /* --- idioma en la pagina --------------------------------------- */

  function pintarIdioma(alCambiar) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang-btn]").forEach(b => {
      b.setAttribute("aria-pressed", String(b.dataset.langBtn === lang));
      b.onclick = () => {
        lang = b.dataset.langBtn;
        localStorage.setItem("ck-lang", lang);
        pintarIdioma(alCambiar);
        alCambiar();
      };
    });
    document.querySelectorAll("[data-t]").forEach(e => { e.textContent = t(e.dataset.t); });
    document.querySelectorAll("[data-t-html]").forEach(e => { e.innerHTML = t(e.dataset.tHtml); });
  }

  /* --- entradas ---------------------------------------------------
     El sistema de movimiento acordado: una curva y dos duraciones, en
     las variables de cada direccion. Aqui solo se marca lo que ya ha
     entrado; el como lo decide cada hoja de estilo. */
  function observarEntradas() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".entra").forEach(e => e.classList.add("dentro"));
      return;
    }
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add("dentro"); io.unobserve(e.target); }
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".entra:not(.dentro)").forEach(e => io.observe(e));
  }

  const productos = () => CK_PRODUCTS;
  const escapar = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  return { get lang() { return lang; }, t, L, precio, notaPrecios, spec, etiquetasDeFicha,
           rasgos, FILTROS, stock, rotulo, foto, pintarIdioma, observarEntradas, productos,
           escapar, tiendaURL: CK_SHOP_URL };
})();
