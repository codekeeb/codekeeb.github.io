/* ============================================================
   CODEKEEB — motor comun de la tienda
   ------------------------------------------------------------
   Lo usan las tres paginas: la portada (js/portada.js), la ficha de
   cada modelo (js/modelo.js) y el comparador (js/comparar.js). Aqui
   vive lo que las tres necesitan igual: idioma, formato de precio,
   lectura del catalogo, los niveles de montaje, la tabla comparativa y
   los iconos.

   Todo sale de `js/data.js` y `js/i18n.js`. Si falta un dato, se dice
   que falta; no se rellena.
   ============================================================ */

const CK = (() => {
  const IDIOMAS = ["es", "en"];

  /* El idioma vive en localStorage y lo comparten las tres direcciones
     y la web: si lo cambias aqui, sigue cambiado alla. */
  /* localStorage puede no existir o lanzar un error (navegador que bloquea
     el almacenamiento, modo privado estricto). Sin esta proteccion, ese
     visitante veia la tienda en blanco. Lo que se guarda son solo
     preferencias que elige el visitante: idioma y pausa del movimiento. */
  const leer = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sin memoria, no pasa nada */ } };

  /* Sin eleccion guardada, manda el idioma del navegador: quien no lo
     tiene en espanol ve la web en ingles. Antes caia siempre al espanol,
     y desde que se quito el frances (25 sep 2026) un visitante frances
     habria acabado en espanol. Un "fr" viejo guardado cae aqui tambien. */
  function idioma() {
    const url = new URLSearchParams(location.search).get("lang");
    const guardado = url || leer("ck-lang");
    if (IDIOMAS.includes(guardado)) return guardado;
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "es";
    return /^es\b/i.test(nav) ? "es" : "en";
  }

  let lang = idioma();

  /* Un texto de i18n.js. Si falta la clave devolvemos la clave cruda
     a proposito: se ve en la pagina y en las capturas, que es como se
     caza un idioma a medias. */
  const t = k => (CK_I18N[lang] && CK_I18N[lang][k]) || k;

  /* Un campo del catalogo que viene como {es,en}. Los hay que son
     una cadena suelta (un "58" no se traduce); esos se devuelven tal cual. */
  const L = v => (v && typeof v === "object" && !Array.isArray(v)) ? (v[lang] ?? v.es) : v;

  const LOCALE = { es: "es-ES", en: "en-GB" };

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
  /* --- frescura de los datos ---------------------------------------
     Precio, stock y descuento se copian a mano de Etsy, y la fecha es
     CK_PRICES_UPDATED. Pasadas dos semanas, "ultima unidad" o "-35%"
     dejan de ser un dato y se vuelven presion de compra que quiza ya no
     es verdad (y un descuento anunciado tiene que ser real y vigente).
     Entonces la web deja de decirlo y manda a Etsy a comprobarlo. Se
     arregla solo en cuanto se revisan los datos y se cambia la fecha. */
  const DIAS_FRESCOS = 14;
  const datosFrescos = () =>
    (Date.now() - new Date(CK_PRICES_UPDATED + "T00:00:00").getTime()) / 864e5 <= DIAS_FRESCOS;

  function stock(p) {
    if (p.status === "soon") return { txt: t("models.soon"), clase: "pronto" };
    if (p.stock == null) return { txt: t("d.onRequest"), clase: "encargo" };
    if (p.stock <= 0) return { txt: t("pdp.soldOut"), clase: "agotado" };
    if (!datosFrescos()) return { txt: t("d.verStock"), clase: "consulta" };
    if (p.stock === 1) return { txt: t("d.lastOne"), clase: "ultima" };
    return { txt: t("d.units").replace("%n", p.stock), clase: "hay" };
  }

  /* El nombre en tres niveles, como el logotipo: modelo en negro,
     rasgo en gris, y el acento en degradado SOLO cuando dice RGB.
     Es compromiso de marca, no decoracion. */
  function rotulo(p) {
    const tit = p.title || { model: p.name, trait: p.version };
    const partes = [`<b>${tit.model}</b>`];
    /* el rasgo puede venir en tres idiomas: "38 teclas" salia tal cual en ingles */
    if (tit.trait) partes.push(`<i>${L(tit.trait)}</i>`);
    if (tit.accent) partes.push(`<u>${tit.accent}</u>`);
    return partes.join(" ");
  }

  const foto = (p, pequena) =>
    `assets/img/products/${pequena && p.img ? p.img.replace(/\.jpg$/, "-sm.jpg") : p.img}`;

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


  /* --- niveles de montaje -----------------------------------------
     Las opciones de cada anuncio de Etsy vienen con el nombre que les
     puso Ernesto ("Solo PCB", "PCB soldada", "Barebones", "Teclado
     completo", o "Completo · Kea Grey" en el Retro). Aqui se ordenan en
     cuatro niveles, de menos a mas montado, porque la pregunta de quien
     compra es exactamente esa: cuanto viene hecho.

     Lo que incluye cada nivel es la definicion del nivel, no un dato que
     me invente: una PCB soldada es la placa con la electronica soldada, un
     barebones es el teclado montado SIN switches ni keycaps, y el completo
     lo trae todo. Las diferencias de precio de los propios anuncios lo
     confirman (en el Totem y el Sofle, completo menos barebones son unos
     30 euros: los switches y las keycaps). */
  const NIVELES = ["pcb", "soldada", "barebones", "completo"];
  const LLEVA = {
    /*            placa  electronica  caja   switches  keycaps */
    pcb:        [true,  false,       false, false,    false],
    soldada:    [true,  true,        false, false,    false],
    barebones:  [true,  true,        true,  false,    false],
    completo:   [true,  true,        true,  true,     true ],
  };
  function nivelDe(nombreEs) {
    const n = (nombreEs || "").toLowerCase();
    if (/^solo pcb/.test(n)) return "pcb";
    if (/^pcb soldada/.test(n)) return "soldada";
    if (/^barebones/.test(n)) return "barebones";
    if (/completo/.test(n)) return "completo";
    return null;
  }
  /* Devuelve los niveles que vende ESTE producto, en orden, cada uno con
     sus variantes (el Retro tiene cuatro completos, uno por juego de
     keycaps). Un nivel esta agotado solo si lo estan todas sus variantes. */
  function niveles(p) {
    const grupos = new Map();
    for (const op of (p.buildOptions || [])) {
      const nivel = nivelDe(op.name && op.name.es);
      if (!nivel) continue;
      if (!grupos.has(nivel)) grupos.set(nivel, []);
      const partes = L(op.name).split("·").map(x => x.trim());
      grupos.get(nivel).push({
        nombre: L(op.name),
        variante: partes.length > 1 ? partes.slice(1).join(" · ") : null,
        precio: op.price ?? null,
        hasta: op.priceTo ?? null,
        agotada: !!op.sold,
      });
    }
    return NIVELES.filter(n => grupos.has(n)).map(n => {
      const vars = grupos.get(n);
      const conPrecio = vars.filter(v => !v.agotada && v.precio != null);
      return {
        id: n,
        lleva: LLEVA[n],
        variantes: vars,
        conVariantes: vars.some(v => v.variante),
        agotado: vars.every(v => v.agotada),
        precio: conPrecio.length ? Math.min(...conPrecio.map(v => v.precio)) : null,
        hasta: conPrecio.length ? Math.max(...conPrecio.map(v => v.hasta ?? v.precio)) : null,
      };
    });
  }

  /* --- iconos --------------------------------------------------------
     Dibujados, con un solo grosor de trazo. No glifos Unicode ni emoji:
     un "✓" cambia de forma y de grosor segun la fuente y el sistema. */
  const TRAZOS = {
    si:       '<path d="M4 10.5l3.6 3.6L16 5.8"/>',
    pausa:    '<path d="M7.5 5v10M12.5 5v10"/>',
    play:     '<path d="M6.5 4.8l8.5 5.2-8.5 5.2z" fill="currentColor"/>',
    no:       '<path d="M5.5 10h9"/>',
    flecha:   '<path d="M4 10h11M11 5.5L15.5 10 11 14.5"/>',
    chevron:  '<path d="M5.5 8l4.5 4.5L14.5 8"/>',
    externo:  '<path d="M8 4.5H4.5v11h11V12M11 4.5h4.5V9M15.5 4.5L9 11"/>',
    estrella: '<path d="M10 3.3l2 4.2 4.6.6-3.4 3.1.9 4.5L10 13.5l-4.1 2.2.9-4.5L3.4 8.1 8 7.5z" fill="currentColor" stroke="none"/>',
    envio:    '<path d="M2.5 5.5h9v8h-9zM11.5 8h3.2l2.8 2.8v2.7h-6"/><circle cx="6" cy="14.5" r="1.5"/><circle cx="14" cy="14.5" r="1.5"/>',
    garantia: '<path d="M10 2.8l6 2.4v4.2c0 3.6-2.5 6.3-6 7.8-3.5-1.5-6-4.2-6-7.8V5.2z"/><path d="M7.2 10l2 2 3.8-4"/>',
    mano:     '<path d="M12.8 3.5a3.6 3.6 0 00-4.4 4.4L3.5 12.8a1.8 1.8 0 002.6 2.6L11 10.6a3.6 3.6 0 004.4-4.4l-2.1 2.1-2-.6-.6-2z"/>',
    codigo:   '<path d="M7 5.5L2.5 10 7 14.5M13 5.5l4.5 4.5-4.5 4.5M11.5 4l-3 12"/>',
    switch:   '<rect x="4" y="7" width="12" height="9" rx="1.5"/><path d="M8.5 7V4h3v3M10 4v3"/>',
    teclado:  '<rect x="2.5" y="5" width="15" height="10" rx="2"/><path d="M5.5 8h1M9.5 8h1M13.5 8h1M5.5 11.5h9"/>',
    /* Un icono por nivel de montaje, de menos a mas hecho. */
    placa:    '<rect x="2.5" y="5" width="15" height="10" rx="1.5"/><circle cx="6.5" cy="10" r="1"/><circle cx="10" cy="10" r="1"/><circle cx="13.5" cy="10" r="1"/>',
    chip:     '<rect x="6.5" y="6.5" width="7" height="7" rx="1"/><path d="M8.5 3.5v3M11.5 3.5v3M8.5 13.5v3M11.5 13.5v3M3.5 8.5h3M3.5 11.5h3M13.5 8.5h3M13.5 11.5h3"/>',
    caja:     '<rect x="2.5" y="5" width="15" height="10" rx="2"/><rect x="5" y="7.5" width="2.5" height="2" rx=".5"/><rect x="8.75" y="7.5" width="2.5" height="2" rx=".5"/><rect x="12.5" y="7.5" width="2.5" height="2" rx=".5"/>',
    keycap:   '<path d="M4.5 15.5h11l-1.8-9.5a1.5 1.5 0 00-1.5-1.2H7.8a1.5 1.5 0 00-1.5 1.2z"/><path d="M7.5 7.5h5"/>',
  };
  const icono = (n, t = 18) =>
    `<svg width="${t}" height="${t}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TRAZOS[n] || ""}</svg>`;

  /* --- rango de precio ---------------------------------------------- */
  function precioRango(desde, hasta) {
    if (desde == null) return null;
    if (hasta != null && hasta > desde + 0.004) return `${precio(desde)} – ${precio(hasta)}`;
    return precio(desde);
  }


  /* --- la tabla comparativa ----------------------------------------
     La usan la portada (sin modelo "actual") y cada ficha (con el suyo
     marcado). Las filas son las que deciden la compra; las demas estan en
     el comparador. Lo que COINCIDE con el modelo actual se apaga, para que
     salte a la vista lo que cambia. */
  const FILAS_COMPARA = ["Teclas", "Switches", "Conexión", "Pantallas", "Iluminación", "Encoders"];
  function precioMinimo(q) {
    const ns = niveles(q).filter(n => !n.agotado && n.precio != null);
    return ns.length ? Math.min(...ns.map(n => n.precio)) : (q.priceFrom ?? null);
  }
  function comparativa(tabla, actual) {
    const todos = productos();
    const celda = (q, cont, mio) =>
      `<td class="${q === actual ? "actual" : ""}${actual && q !== actual && cont === mio ? " igual" : ""}">${cont}</td>`;
    const fila = (etq, valor) => {
      const mio = actual ? valor(actual) : null;
      return `<tr><th scope="row">${escapar(etq)}</th>${todos.map(q => celda(q, valor(q), mio)).join("")}</tr>`;
    };
    const etiquetaDe = es => {
      for (const q of todos) { const f = (q.specs || []).find(x => x[0].es === es); if (f) return L(f[0]); }
      return es;
    };
    tabla.innerHTML = `
      <thead><tr><th scope="col"><span class="oculto">${t("m.sCompar")}</span></th>
        ${todos.map(q => `<th scope="col" class="${q === actual ? "actual" : ""}">${q === actual
          ? `<span class="nombre">${rotulo(q)}</span>`
          : `<a class="nombre" href="modelo.html?id=${q.id}">${rotulo(q)}</a>`}</th>`).join("")}</tr></thead>
      <tbody>
        ${fila(t("d.priceCol"), q => { const v = precioMinimo(q); return v == null ? "—" : `<span class="precio"><small>${t("price.from")}</small> ${precio(v)}</span>`; })}
        ${FILAS_COMPARA.map(es => fila(etiquetaDe(es), q => escapar(spec(q, es) || "—"))).join("")}
        ${fila(t("d.stockCol"), q => { const e = stock(q); return `<span class="stock stock--${e.clase}">${escapar(e.txt)}</span>`; })}
      </tbody>`;
    /* En la ficha, el modelo que miras puede quedar fuera por la derecha
       en el movil: se desliza el marco hasta su columna. */
    const marco = tabla.parentElement, col = tabla.querySelector("thead th.actual"), fija = tabla.querySelector("thead th");
    if (actual && marco && col && marco.scrollWidth > marco.clientWidth)
      marco.scrollLeft = Math.max(0, col.offsetLeft - fija.offsetWidth);
  }

  /* --- confianza: lo que se pregunta antes de pagar ------------------ */
  function confianza(ul) {
    ul.innerHTML = [
      ["envio", "trust.shipping", "trust.shippingText"],
      ["garantia", "trust.warranty", "trust.warrantyText"],
      ["mano", "trust.custom", "trust.customText"],
      ["codigo", "trust.firmware", "trust.firmwareText"],
      ["externo", "m.pagoEtsy", "m.pagoEtsyT"],
    ].map(([ic, a, b]) => `<li>${icono(ic, 22)}<b>${t(a)}</b><span>${t(b)}</span></li>`).join("");
  }

  /* --- idioma en la pagina --------------------------------------- */

  function pintarIdioma(alCambiar) {
    document.documentElement.lang = lang;
    pintarPausa();
    document.querySelectorAll("[data-lang-btn]").forEach(b => {
      const activo = b.dataset.langBtn === lang;
      b.setAttribute("aria-checked", String(activo));
      b.setAttribute("role", "menuitemradio");
      b.onclick = () => {
        lang = b.dataset.langBtn;
        guardar("ck-lang", lang);
        cerrarIdiomas();
        pintarIdioma(alCambiar);
        alCambiar();
      };
    });
    document.querySelectorAll("[data-lang-actual]").forEach(e => { e.textContent = lang.toUpperCase(); });
    document.querySelectorAll("[data-t]").forEach(e => { e.textContent = t(e.dataset.t); });
    document.querySelectorAll("[data-t-html]").forEach(e => { e.innerHTML = t(e.dataset.tHtml); });
    /* los nombres accesibles tambien cambian de idioma: un lector de
       pantalla en ingles leia "Principal" e "Idioma" */
    document.querySelectorAll("[data-t-aria]").forEach(e => { e.setAttribute("aria-label", t(e.dataset.tAria)); });
  }

  /* --- selector de idioma: un boton, no tres -----------------------
     Tres botones fijos gastan el ancho de la cabecera para ensenar dos
     idiomas que no estas usando, y en el movil median 25x21 px. Un boton
     con el idioma actual y un desplegable con los tres ocupa un sitio y
     los objetivos caben en el dedo.

     Se cierra con Escape, al pulsar fuera y al elegir; y devuelve el foco
     al disparador, que es lo que espera quien navega con el teclado. */
  function cerrarIdiomas() {
    document.querySelectorAll("[data-lang-menu]").forEach(m => {
      m.hidden = true;
      const d = m.previousElementSibling;
      if (d) d.setAttribute("aria-expanded", "false");
    });
  }

  function montarSelectorIdioma() {
    const disp = document.querySelector("[data-lang-disparador]");
    const menu = document.querySelector("[data-lang-menu]");
    if (!disp || !menu) return;
    menu.hidden = true;
    disp.setAttribute("aria-expanded", "false");
    disp.onclick = e => {
      e.stopPropagation();
      const abierto = !menu.hidden;
      cerrarIdiomas();
      if (abierto) return;
      menu.hidden = false;
      disp.setAttribute("aria-expanded", "true");
      (menu.querySelector('[aria-checked="true"]') || menu.firstElementChild)?.focus();
    };
    /* Tocar fuera cierra. Con pointerdown y no con click: Safari en
       iPhone no manda click al tocar algo que no es un enlace o un boton.
       El disparador se excluye, que ya abre y cierra el solo. */
    addEventListener("pointerdown", e => {
      if (!menu.hidden && !menu.contains(e.target) && !disp.contains(e.target)) cerrarIdiomas();
    });
    addEventListener("keydown", e => {
      if (e.key !== "Escape" || menu.hidden) return;
      cerrarIdiomas();
      disp.focus();
    });
    /* Un role="menu" promete flechas a quien usa lector de pantalla:
       arriba y abajo recorren, Inicio y Fin van a los extremos, y salir
       con Tab cierra el menu en vez de dejarlo abierto detras. */
    menu.addEventListener("keydown", e => {
      const items = [...menu.querySelectorAll("button")];
      const i = items.indexOf(document.activeElement);
      const destino = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key];
      if (destino === undefined) return;
      e.preventDefault();
      items[(destino + items.length) % items.length].focus();
    });
    /* Salir con Tab cierra. Pero solo si el foco se va a OTRO sitio: en
       Safari del iPhone tocar un boton no le da el foco, asi que al tocar
       "English" el foco salia del menu hacia ninguna parte (relatedTarget
       null), el menu se cerraba antes de que llegara el toque y el idioma
       no cambiaba nunca desde el movil (Ernesto, 25 sep 2026). */
    menu.addEventListener("focusout", e => {
      if (!e.relatedTarget) return;
      if (!menu.hidden && !menu.contains(e.relatedTarget) && e.relatedTarget !== disp) cerrarIdiomas();
    });
  }

  /* --- pausa del movimiento (WCAG 2.2.2) --------------------------
     La luz, las pantallas y los esquemas en bucle se mueven solos mas de
     cinco segundos, y eso exige poder pararlos: a quien le cuesta leer
     con algo moviendose al lado, o a quien le marea. Un solo boton en la
     cabecera para todo, recordado entre paginas. Si el sistema ya pide
     menos movimiento, no se mueve nada y el boton sobra. */
  const pocoMovimiento = matchMedia("(prefers-reduced-motion: reduce)");
  let pausado = leer("ck-pausa") === "1";
  const quieto = () => pocoMovimiento.matches || pausado;

  function pintarPausa() {
    document.documentElement.classList.toggle("sin-movimiento", quieto());
    document.querySelectorAll("[data-pausa]").forEach(b => {
      b.hidden = pocoMovimiento.matches;
      b.setAttribute("aria-pressed", String(pausado));
      const txt = t(pausado ? "a11y.reanudar" : "a11y.pausar");
      b.setAttribute("aria-label", txt);
      b.title = txt;
      b.innerHTML = icono(pausado ? "play" : "pausa", 18);
    });
  }
  function montarPausa() {
    document.querySelectorAll("[data-pausa]").forEach(b => b.onclick = () => {
      pausado = !pausado;
      guardar("ck-pausa", pausado ? "1" : "0");
      pintarPausa();
      document.dispatchEvent(new Event("ck-movimiento"));
    });
    pocoMovimiento.addEventListener?.("change", () => { pintarPausa(); document.dispatchEvent(new Event("ck-movimiento")); });
    pintarPausa();
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

  montarPausa();

  return { get lang() { return lang; }, datosFrescos, quieto, montarPausa, pintarPausa, leer, guardar, t, L, precio, notaPrecios, spec, etiquetasDeFicha, encuadrarTodo,
           precioDe, precioHTML, enlaceCompra, niveles, NIVELES, icono, precioRango,
           comparativa, confianza, precioMinimo,
           rasgos, FILTROS, stock, rotulo, foto, pintarIdioma, montarSelectorIdioma,
           observarEntradas, productos,
           escapar, tiendaURL: CK_SHOP_URL };
})();
