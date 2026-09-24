/* ============================================================
   CODEKEEB — la ficha de un modelo
   ------------------------------------------------------------
   Estructura sacada de ergodox: la familia arriba, la barra del
   producto, lo esencial, el configurador en una columna con "tu
   configuracion incluye", los principios con la forma de ESTE teclado,
   la ficha, la comparacion y una barra de compra fija abajo.

   Todo sale de `js/data.js`. Cuando un dato no existe (el precio de los
   completos del Retro, que switch lleva un Sofle) se dice, no se rellena.
   ============================================================ */

(() => {
  const $ = s => document.querySelector(s);
  const T = CK.t;
  const params = new URLSearchParams(location.search);
  const p = CK.productos().find(x => x.id === params.get("id"));

  if (!p) {
    /* Un enlace roto no deja una pagina vacia: dice que paso y adonde ir. */
    const vacio = () => {
      $("#pagina").innerHTML = `<section class="seccion"><div class="env cab cab--centro">
        <h1>${T("pdp.notFound")}</h1><p>${CK.escapar(params.get("id") || "")}</p>
        <a class="btn" href="/#tienda">${T("pdp.backToModels")}</a></div></section>`;
      document.querySelectorAll(".pbarra,.cbarra").forEach(e => e.hidden = true);
    };
    CK.montarSelectorIdioma(); CK.pintarIdioma(vacio); vacio();
    return;
  }

  const tablero = CK_TABLERO[p.id] || "sofle";
  const COMPONENTES = ["Switches", "Keycaps", "Pantallas", "Iluminación", "Encoders", "Case"];
  const FILAS = ["m.rPlaca", "m.rElec", "m.rCaja", "m.rSw", "m.rKc"];
  const ICONO_NIVEL = { pcb: "placa", soldada: "chip", barebones: "caja", completo: "teclado" };

  /* ---------- estado del configurador ---------- */
  const niveles = CK.niveles(p);
  /* Por omision, el nivel mas completo que quede disponible: es lo que
     compra la mayoria; quien quiere menos lo baja con un clic. */
  let nivel = niveles.find(n => n.id === params.get("op") && !n.agotado)
           || [...niveles].reverse().find(n => !n.agotado && n.precio != null)
           || [...niveles].reverse().find(n => !n.agotado) || niveles[0];
  let variante = null;
  const eligeVariante = () => {
    variante = nivel && nivel.conVariantes
      ? (nivel.variantes.find(v => v.variante === params.get("kc") && !v.agotada) || nivel.variantes.find(v => !v.agotada) || null)
      : null;
  };
  eligeVariante();
  const nombreNivel = n => n.conVariantes ? n.variantes[0].nombre.split("·")[0].trim() : n.variantes[0].nombre;
  const nombreCorto = `${p.name} ${p.version || ""}`.trim();

  /* ---------- la familia y la barra ---------- */
  function tira() {
    $("#tira").innerHTML = CK.productos().map(q => `<li><a href="modelo.html?id=${q.id}"${q === p ? ' aria-current="page"' : ""}>
      <img src="${CK.foto(q, true)}" alt="" data-foco="${q.foco ?? 50}">${CK.escapar(`${q.name} ${q.version || ""}`.trim())}</a></li>`).join("");
    /* la tira desliza hasta el modelo actual, que en el movil puede
       quedar fuera por la derecha */
    const a = $('#tira a[aria-current="page"]'), ul = $("#tira");
    if (a) {
      const r = a.getBoundingClientRect(), u = ul.getBoundingClientRect();
      if (r.right > u.right) ul.scrollLeft += r.left - u.left - 20;
    }
  }

  /* ---------- galeria ---------- */
  function galeria() {
    const fotos = (p.gallery && p.gallery.length ? p.gallery : [p.img]).filter(Boolean);
    $("#foto").innerHTML = fotos.map((f, i) =>
      `<img src="assets/img/products/${f}" alt="${CK.escapar(nombreCorto)}" ${i ? 'data-sale loading="lazy"' : 'fetchpriority="high"'}
            ${i === 0 && p.foco ? `data-foco="${p.foco}"` : ""}>`).join("");
    $("#miniaturas").innerHTML = fotos.length < 2 ? "" : fotos.map((f, i) =>
      `<button type="button" aria-pressed="${i === 0}" aria-label="${i + 1} / ${fotos.length}">
         <img src="assets/img/products/${f.replace(/\.jpg$/, "-sm.jpg")}" alt="" loading="lazy"></button>`).join("");
    $("#miniaturas").querySelectorAll("button").forEach((b, i) => b.onclick = () => {
      $("#miniaturas").querySelectorAll("button").forEach((x, j) => x.setAttribute("aria-pressed", String(i === j)));
      $("#foto").querySelectorAll("img").forEach((im, j) => im.toggleAttribute("data-sale", i !== j));
    });
  }

  /* ---------- lo esencial ---------- */
  function esencial() {
    document.title = `${nombreCorto} — Codekeeb`;
    $("#pNombre").innerHTML = CK.rotulo(p);
    $("#nombre").innerHTML = CK.rotulo(p);
    $("#desc").textContent = CK.L(p.desc) || "";
    const desde = CK.precioMinimo(p);
    $("#precioCab").innerHTML = desde == null ? "" : `
      <span class="precio">${niveles.length > 1 ? `<small>${T("price.from")}</small> ` : ""}${CK.precio(desde)}</span>
      ${p.discountPct ? `<span class="dto">−${p.discountPct}% ${T("m.dtoEtsy")}</span>` : ""}
      ${p.rating ? `<span class="valoracion">${CK.icono("estrella", 15)} ${String(p.rating.toFixed(1)).replace(".", CK.lang === "en" ? "." : ",")} · ${p.reviews} ${T(p.reviews === 1 ? "m.resena" : "m.resenas")}</span>` : ""}`;
    const e = CK.stock(p);
    $("#estado").innerHTML = `<span class="stock stock--${e.clase}">${CK.escapar(e.txt)}</span>`;
    $("#rasgos").innerHTML = (CK.L(p.highlights) || []).map(r => `<li>${CK.icono("si", 18)}<span>${CK.escapar(r)}</span></li>`).join("")
      + `<li>${CK.icono("codigo", 18)}<span>${T("m.studio")}</span></li>`;
  }

  /* ---------- el configurador ---------- */
  function pasoNiveles() {
    $("#h-config").textContent = T("e.configuraT").replace("%s", nombreCorto);
    $("#niveles").innerHTML = niveles.map(n => `
      <label class="opcion${n.agotado ? " opcion--agotada" : ""}">
        <input type="radio" name="nivel" value="${n.id}" ${n === nivel ? "checked" : ""} ${n.agotado ? "disabled" : ""}>
        <span class="opcion__ic">${CK.icono(ICONO_NIVEL[n.id], 24)}</span>
        <span class="opcion__n">${CK.escapar(nombreNivel(n))}</span>
        <span class="opcion__p">${n.agotado ? T("pdp.soldOut") : n.precio != null ? CK.precioRango(n.precio, n.hasta) : T("m.enEtsy")}</span>
        <span class="opcion__d">${T("m.d" + n.id[0].toUpperCase() + n.id.slice(1))}</span>
      </label>`).join("");
    $("#niveles").querySelectorAll("input").forEach(i => i.onchange = () => {
      nivel = niveles.find(n => n.id === i.value); eligeVariante(); actualiza();
    });
  }

  function pasoKeycaps() {
    const hay = nivel && nivel.conVariantes;
    $("#pasoKeycaps").hidden = !hay;
    if (!hay) return;
    $("#keycaps").innerHTML = nivel.variantes.map(v => `
      <label class="opcion${v.agotada ? " opcion--agotada" : ""}">
        <input type="radio" name="kc" value="${CK.escapar(v.variante)}" ${v === variante ? "checked" : ""} ${v.agotada ? "disabled" : ""}>
        <span class="opcion__ic">${CK.icono("keycap", 24)}</span>
        <span class="opcion__n">${CK.escapar(v.variante)}</span>
        <span class="opcion__p">${v.agotada ? T("pdp.soldOut") : v.precio != null ? CK.precioRango(v.precio, v.hasta) : T("m.enEtsy")}</span>
      </label>`).join("");
    $("#keycaps").querySelectorAll("input").forEach(i => i.onchange = () => {
      variante = nivel.variantes.find(v => v.variante === i.value); actualiza();
    });
  }

  /* Switches: ningun anuncio los trae a elegir con precio, asi que se dice
     cual monta, o con cual es compatible si esta opcion no los incluye.
     Si data.js trae `switches: [{name:{es,en,fr}, price}]`, sale selector. */
  function pasoSwitches() {
    const sw = CK.spec(p, "Switches"), incluidos = nivel && nivel.lleva[3];
    if (Array.isArray(p.switches) && p.switches.length && incluidos) {
      $("#switches").innerHTML = `<div class="opciones">${p.switches.map((s, i) => `
        <label class="opcion"><input type="radio" name="sw" value="${i}" ${i === 0 ? "checked" : ""}>
          <span class="opcion__ic">${CK.icono("switch", 24)}</span>
          <span class="opcion__n">${CK.escapar(CK.L(s.name))}</span>
          <span class="opcion__p">${s.price != null ? "+ " + CK.precio(s.price) : ""}</span></label>`).join("")}</div>`;
      return;
    }
    const bajoPedido = !!CK.spec(p, "Personalización");
    $("#switches").innerHTML = !sw ? "" : `<div class="fija">
      <span class="opcion__ic">${CK.icono("switch", 24)}</span>
      ${incluidos ? `<b>${CK.escapar(sw)}</b><span>${T("m.swIncluidos")}${bajoPedido ? " · " + T("m.swOtros") : ""}</span>`
                  : `<b>${T("m.swNo")} ${CK.escapar(sw)}</b>`}</div>`;
  }

  /* El total cuenta hasta el nuevo precio en vez de saltar: se ve que ha
     cambiado y en que direccion. */
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let mostrado = null, anim = 0;
  function pintaTotal(precio, hasta, texto) {
    const el = $("#total");
    cancelAnimationFrame(anim);
    const rango = precio != null && hasta != null && hasta > precio + 0.004;
    if (precio == null || rango || quieto || mostrado == null) { el.innerHTML = texto; mostrado = rango ? null : precio; return; }
    const ini = mostrado, t0 = performance.now(), dur = 420, curva = x => 1 - Math.pow(1 - x, 4);
    const paso = ahora => {
      const k = Math.min(1, (ahora - t0) / dur);
      el.textContent = CK.precio(Math.round((ini + (precio - ini) * curva(k)) * 100) / 100);
      if (k < 1) anim = requestAnimationFrame(paso); else el.innerHTML = texto;
    };
    mostrado = precio;
    anim = requestAnimationFrame(paso);
  }

  function incluye() {
    const precio = variante ? variante.precio : nivel && nivel.precio;
    const hasta = variante ? variante.hasta : nivel && nivel.hasta;
    const texto = precio != null ? CK.precioRango(precio, hasta) : T("m.enEtsy");
    const sw = CK.spec(p, "Switches");
    const detalle = [null, null, null, sw, variante ? variante.variante : CK.spec(p, "Keycaps")];
    $("#incluyeLista").innerHTML = FILAS.map((k, i) => {
      const si = nivel && nivel.lleva[i];
      return `<li class="${si ? "si" : "no"}">${CK.icono(si ? "si" : "no", 18)}
        <span>${T(k)}${si && detalle[i] ? ` · ${CK.escapar(detalle[i])}` : ""}<span class="oculto"> — ${T(si ? "m.si" : "m.no")}</span></span></li>`;
    }).join("");
    pintaTotal(precio, hasta, texto);
    const rango = precio != null && hasta != null && hasta > precio + 0.004;
    $("#totalNota").textContent = rango ? T("m.rango") : "";
    $("#totalNota").hidden = !rango;
    const url = CK.enlaceCompra(p);
    $("#comprar").href = url; $("#cbComprar").href = url;
    $("#icExt").innerHTML = CK.icono("externo", 16);
    $("#fecha").textContent = CK.notaPrecios();
    $("#cbNombre").textContent = `${nombreCorto} · ${nivel ? nombreNivel(nivel) : ""}${variante ? " · " + variante.variante : ""}`;
    $("#cbTotal").innerHTML = texto;
    /* La configuracion vive en la URL: se puede mandar y abre igual. */
    const q = new URLSearchParams(location.search);
    if (nivel) q.set("op", nivel.id);
    if (variante) q.set("kc", variante.variante); else q.delete("kc");
    history.replaceState(null, "", `${location.pathname}?${q}${location.hash}`);
  }

  function actualiza() { pasoKeycaps(); pasoSwitches(); incluye(); }

  /* ---------- los principios, con la forma de ESTE teclado ---------- */
  const G = CK_GEO[tablero];
  CK_DIBUJO.montar($("#dSplit"), tablero, "mitades");
  CK_DIBUJO.montar($("#dCol"), tablero, "columnas");
  CK_DIBUJO.montar($("#dPul"), tablero, "pulgares");
  /* La luz solo en el Sofle: es el unico del que tenemos medido el mapa de
     sus LED. Las pantallas y el hotswap, si la ficha los declara. */
  const conLuz = tablero === "sofle" && !!CK.spec(p, "Iluminación");
  const conOled = !!CK.spec(p, "Pantallas");
  const conHot = /hotswap/i.test(CK.spec(p, "Switches") || "");
  $("#p-luz").hidden = !conLuz; $("#p-oled").hidden = !conOled; $("#p-hot").hidden = !conHot;

  let teclado = null;
  const MODOS = ["gradient", "ripple", "fire", "sunset", "heatmap"];
  let modo = 0;
  if (conLuz) teclado = CK_RGB.montar($("#kb"));
  if (conOled) CK_OLED.montar($("#oledIzq"), $("#oledDer"));
  function modos() {
    if (!teclado) return;
    const pinta = () => {
      teclado.modo(MODOS[modo]);
      $("#fxTexto").textContent = T(`p.fx${modo + 1}Text`);
      $("#modos").querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String(i === modo)));
    };
    $("#modos").innerHTML = MODOS.map(m => `<button type="button" aria-pressed="false">${m}</button>`).join("");
    $("#modos").querySelectorAll("button").forEach((b, i) => b.onclick = () => { modo = i; pinta(); });
    pinta();
  }

  /* ---------- ficha, comparacion y confianza ---------- */
  function ficha() {
    const filas = (p.specs || []).map(([k, v]) => [k.es, CK.L(k), CK.L(v)]);
    const dl = l => l.map(([, k, v]) => `<div><dt>${CK.escapar(k)}</dt><dd>${CK.escapar(v)}</dd></div>`).join("");
    const comp = filas.filter(f => COMPONENTES.includes(f[0]));
    $("#fichaLista").innerHTML = dl(filas.filter(f => !COMPONENTES.includes(f[0])));
    $("#compLista").innerHTML = dl(comp);
    $("#compBloque").hidden = !comp.length;
  }

  /* ---------- lo que pasa al hacer scroll ---------- */
  function observa() {
    /* La barra de compra sale cuando ya has visto la presentacion. Con la
       posicion real, no con un IntersectionObserver: el observador no
       avisa al saltar de "por encima" a "por debajo" de la pantalla, y la
       barra se quedaba puesta arriba del todo. */
    const cb = $("#cbarra"), que = $("#que");
    let pend = false;
    const mira = () => {
      pend = false;
      const ver = que.getBoundingClientRect().bottom < 0;
      if (ver === cb.classList.contains("visible")) return;
      cb.classList.toggle("visible", ver);
      cb.setAttribute("aria-hidden", String(!ver));
      $("#cbComprar").tabIndex = ver ? 0 : -1;
    };
    addEventListener("scroll", () => { if (!pend) { pend = true; requestAnimationFrame(mira); } }, { passive: true });
    mira();
    /* La seccion que lees, marcada en la barra del producto. */
    const enlaces = [...document.querySelectorAll(".pbarra nav a")];
    const obs = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting)
        enlaces.forEach(a => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + e.target.id)));
    }, { rootMargin: "-35% 0px -60% 0px" });
    ["que", "configura", "ficha", "comparar"].forEach(id => obs.observe(document.getElementById(id)));
  }

  function pintar() {
    tira();
    esencial();
    pasoNiveles();
    actualiza();
    modos();
    ficha();
    CK.comparativa($("#comparativa"), p);
    CK.confianza($("#confianza"));
    $("#notaPrecios").textContent = CK.notaPrecios();
    document.querySelectorAll("[data-nota-dib]").forEach(e => e.textContent = T("e.dibNota").replace("%s", G.nombre));
    document.querySelectorAll(".ic-flecha").forEach(e => e.innerHTML = CK.icono("flecha", 16));
    CK.encuadrarTodo();
  }

  galeria();
  CK.montarSelectorIdioma();
  CK.pintarIdioma(pintar);
  pintar();
  observa();
})();
