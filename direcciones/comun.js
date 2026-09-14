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

  /* El precio que se ensena es `priceFrom`, que es la opcion mas barata
     (muchas veces la PCB suelta, no el teclado montado). Ensenarlo a secas
     es mentir por omision: 26 € no compra un Totem. Asi que cuando hay dos
     precios, el numero va precedido de "desde". */
  function precioDe(p) {
    const n = p.priceFrom ?? p.priceFull;
    const desde = p.priceFrom != null && p.priceFull != null && p.priceFrom < p.priceFull;
    return { txt: precio(n), desde };
  }
  const precioHTML = p => {
    const { txt, desde } = precioDe(p);
    return desde ? `<small>${t("price.from")}</small> ${txt}` : txt;
  };

  /* Comprar SIEMPRE lleva al anuncio concreto. La tienda generica obliga a
     buscar el modelo otra vez entre los cinco, y ahi es donde se perdia la
     venta; `js/data.js` lo deja escrito. `CK_SHOP_URL` solo es el ultimo
     recurso si algun dia falta el enlace. */
  const enlaceCompra = p => (p && p.url) || CK_SHOP_URL;

  /* --- encuadre ----------------------------------------------------
     `object-fit: cover` recorta, y por omision recorta por el centro. En
     las cinco fotos del catalogo sobra mesa por arriba (entre un 11% y un
     33%), asi que el centro cae en el mantel y el teclado se va por abajo.

     `foco` dice donde esta el teclado dentro de la foto. Pero no se puede
     pasar tal cual a `object-position`: ese porcentaje alinea el punto P
     de la foto con el punto P del marco, no "ensename P". Con el marco
     recortando en vertical, la ventana visible va de P(1-v) a P(1-v)+v,
     donde v es la fraccion de alto que sobrevive. Despejando para que el
     foco caiga en el centro de la ventana:

         P = (foco - encaje*v) / (1 - v)

     donde `encaje` es donde queremos el teclado dentro del marco (0,5 =
     centrado).

     Ejemplo real: el Sofle Carbon tiene el teclado al 58% y en el marco
     16/10 del heroe solo sobrevive el 72% del alto, asi que P sale 79% y
     no 58%. Ponerle 58 a pelo lo dejaba igual de descentrado. */
  function encuadrar(img) {
    const foco = Number(img.dataset.foco);
    if (!Number.isFinite(foco)) return;
    /* `encaje` dice en que punto del MARCO queremos que caiga el teclado.
       Por omision en el centro; en el heroe se baja al 62% para que el
       texto tenga arriba mesa vacia y no se coma el producto. */
    const encaje = Number(img.dataset.encaje);
    const q = Number.isFinite(encaje) ? encaje / 100 : 0.5;
    const ajustar = () => {
      const r = img.getBoundingClientRect();
      if (!img.naturalWidth || !r.width || !r.height) return;
      const alturaFoto = img.naturalHeight / img.naturalWidth;
      const alturaMarco = r.height / r.width;
      if (alturaMarco >= alturaFoto) { img.style.objectPosition = "center center"; return; }
      const v = alturaMarco / alturaFoto;          /* alto que sobrevive */
      const p = (foco / 100 - q * v) / (1 - v);
      img.style.objectPosition = `center ${(Math.min(1, Math.max(0, p)) * 100).toFixed(1)}%`;
    };
    if (img.complete && img.naturalWidth) ajustar();
    else img.addEventListener("load", ajustar, { once: true });
    encuadrar._todas.push(ajustar);
  }
  encuadrar._todas = [];

  /* Al cambiar el ancho cambia la proporcion del marco, y con ella el
     recorte. Se recalcula al final del redimensionado, no durante. */
  let temporizador;
  addEventListener("resize", () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => encuadrar._todas.forEach(f => f()), 120);
  }, { passive: true });

  /* Encuadra todo lo que lleve data-foco dentro de un trozo de pagina. */
  function encuadrarTodo(raiz = document) {
    encuadrar._todas.length = 0;
    raiz.querySelectorAll("img[data-foco]").forEach(encuadrar);
  }

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

  return { get lang() { return lang; }, t, L, precio, notaPrecios, spec, etiquetasDeFicha, encuadrarTodo,
           precioDe, precioHTML, enlaceCompra,
           rasgos, FILTROS, stock, rotulo, foto, pintarIdioma, observarEntradas, productos,
           escapar, tiendaURL: CK_SHOP_URL };
})();
