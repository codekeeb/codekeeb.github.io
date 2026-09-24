/* ============================================================
   CODEKEEB — la ficha de un modelo ("hardware con color")
   ------------------------------------------------------------
   El modelo pinta su placa con su color (data.js: color.fondo y
   color.tinta), se lee su nombre como la etiqueta de un aparato, sus
   cuatro datos en indicadores, y se configura modulo a modulo con teclas
   que encienden un LED. Una sola barra arriba con los cinco modelos.

   Todo sale de `js/data.js`. Cuando un dato no existe (el precio de los
   completos del Retro, que switch lleva un Sofle) se dice, no se rellena.
   ============================================================ */

(() => {
  const $ = s => document.querySelector(s);
  const T = CK.t;
  const params = new URLSearchParams(location.search);
  const p = CK.productos().find(x => x.id === params.get("id"));

  /* Los cinco modelos en la barra, cada uno con su color. Va antes del
     "no encontrado" para que un enlace roto tambien deje elegir modelo. */
  function modelos() {
    $("#modelos").innerHTML = CK.productos().map(q => {
      const c = q.color || { fondo: "#111111", tinta: "#ffffff" };
      return `<li><a class="f-chip" href="modelo.html?id=${q.id}" style="--c:${c.fondo};--ct:${c.tinta}"${q === p ? ' aria-current="page"' : ""}>
        <i aria-hidden="true"></i>${CK.escapar(q.corto || q.name)}</a></li>`;
    }).join("");
    /* en el movil la fila se desplaza: que el modelo actual quede a la vista */
    const a = $('#modelos [aria-current="page"]'), ul = $("#modelos");
    if (a) {
      const r = a.getBoundingClientRect(), u = ul.getBoundingClientRect();
      if (r.right > u.right) ul.scrollLeft += r.left - u.left - 20;
    }
  }

  if (!p) {
    /* Un enlace roto no deja una pagina vacia: dice que paso y adonde ir. */
    const vacio = () => {
      modelos();
      $("#pagina").innerHTML = `<section class="f-seccion"><div class="f-in">
        <h1 class="f-h2">${T("pdp.notFound")}</h1><p class="f-lede">${CK.escapar(params.get("id") || "")}</p>
        <p style="margin-top:20px"><a class="f-tecla f-tecla--tinta" href="/#tienda">${T("pdp.backToModels")}</a></p></div></section>`;
      $("#cbarra").hidden = true;
    };
    CK.montarSelectorIdioma(); CK.pintarIdioma(vacio); vacio();
    return;
  }

  /* El color del modelo manda en toda la pagina: placa, LED, seleccion. */
  const color = p.color || { fondo: "#2b3bf5", tinta: "#ffffff" };
  document.documentElement.style.setProperty("--modelo", color.fondo);
  document.documentElement.style.setProperty("--modelo-tinta", color.tinta);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color.fondo);

  const tablero = CK_TABLERO[p.id] || "sofle";
  const COMPONENTES = ["Switches", "Keycaps", "Pantallas", "Iluminación", "Encoders", "Case"];
  const FILAS = ["m.rPlaca", "m.rElec", "m.rCaja", "m.rSw", "m.rKc"];

  /* ---------- estado del configurador ---------- */
  const niveles = CK.niveles(p);
  /* Por omision, el nivel mas completo que quede disponible y tenga precio. */
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
  const nombreCorto = () => `${p.name} ${CK.L(p.version) || ""}`.trim();

  /* ---------- la ventana de la foto ---------- */
  function galeria() {
    const fotos = (p.gallery && p.gallery.length ? p.gallery : [p.img]).filter(Boolean);
    $("#foto").innerHTML = fotos.map((f, i) =>
      `<img src="assets/img/products/${f}" alt="" ${i ? 'data-sale loading="lazy"' : 'fetchpriority="high"'}>`).join("");
    $("#miniaturas").innerHTML = fotos.length < 2 ? "" : fotos.map((f, i) =>
      `<button type="button" aria-pressed="${i === 0}"><img src="assets/img/products/${f.replace(/\.jpg$/, "-sm.jpg")}" alt="" loading="lazy"></button>`).join("");
    $("#miniaturas").querySelectorAll("button").forEach((b, i) => b.onclick = () => {
      $("#miniaturas").querySelectorAll("button").forEach((x, j) => x.setAttribute("aria-pressed", String(i === j)));
      $("#foto").querySelectorAll("img").forEach((im, j) => im.toggleAttribute("data-sale", i !== j));
    });
  }
  /* Cada foto dice cual es de cuantas; se repite al cambiar de idioma. */
  function rotularGaleria() {
    const fotos = [...$("#foto").querySelectorAll("img")], n = fotos.length;
    const txt = i => T("a11y.foto").replace("%n", i + 1).replace("%t", n);
    fotos.forEach((im, i) => im.alt = n > 1 ? `${nombreCorto()}, ${txt(i)}` : nombreCorto());
    $("#miniaturas").querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-label", T("a11y.verFoto") + " " + txt(i)));
  }

  /* ---------- la placa ---------- */
  function placa() {
    const tit = p.title || { model: p.name, trait: p.version };
    document.title = `${nombreCorto()} — Codekeeb`;
    $("#nombre").textContent = tit.model;
    $("#rasgo").innerHTML = `<span>${CK.escapar(CK.L(tit.trait) || "")}</span>${tit.accent ? `<span class="f-rgb">${CK.escapar(tit.accent)}</span>` : ""}`;
    $("#desc").textContent = CK.L(p.desc) || "";
    $("#lecturas").innerHTML = (p.stats || []).slice(0, 4).map(([v, etq]) =>
      `<li><b>${CK.escapar(v)}</b><span>${CK.escapar(CK.L(etq))}</span></li>`).join("");
    const desde = CK.precioMinimo(p);
    $("#precioCab").innerHTML = desde == null ? `<b>${T("m.enEtsy")}</b>` :
      `<span class="f-pantalla__et">${niveles.length > 1 ? T("price.from") : T("m.total")}</span><b>${CK.precio(desde)}</b>`;
    const e = CK.stock(p);
    const partes = [`<span class="stock stock--${e.clase}">${CK.escapar(e.txt)}</span>`];
    if (p.discountPct && CK.datosFrescos()) partes.push(`−${p.discountPct}% ${T("m.dtoEtsy")}`);
    if (p.rating) partes.push(`<a href="${CK.enlaceCompra(p)}" target="_blank" rel="noopener">${String(p.rating.toFixed(1)).replace(".", CK.lang === "en" ? "." : ",")} · ${p.reviews} ${T(p.reviews === 1 ? "m.resena" : "m.resenas")}</a>`);
    $("#estado").innerHTML = partes.join(" · ");
  }

  /* ---------- el configurador ---------- */
  const opcion = (nombre, valor, marcada, agotada, n, precio, desc) => `
    <label class="f-opcion${agotada ? " f-opcion--agotada" : ""}">
      <input type="radio" name="${nombre}" value="${CK.escapar(valor)}" ${marcada ? "checked" : ""} ${agotada ? "disabled" : ""}>
      <span class="f-led" aria-hidden="true"></span>
      <span class="f-opcion__n">${CK.escapar(n)}</span>
      <span class="f-opcion__p">${precio}</span>
      ${desc ? `<span class="f-opcion__d">${desc}</span>` : ""}
    </label>`;
  const precioDe = x => x.agotado || x.agotada ? T("pdp.soldOut") : x.precio != null ? CK.precioRango(x.precio, x.hasta) : T("m.enEtsy");

  function pasoNiveles() {
    $("#h-config").textContent = T("e.configuraT").replace("%s", nombreCorto());
    $("#niveles").innerHTML = niveles.map(n => opcion("nivel", n.id, n === nivel, n.agotado, nombreNivel(n), precioDe(n),
      T("m.d" + n.id[0].toUpperCase() + n.id.slice(1)))).join("");
    $("#niveles").querySelectorAll("input").forEach(i => i.onchange = () => {
      nivel = niveles.find(n => n.id === i.value); eligeVariante(); actualiza();
    });
  }

  function pasoKeycaps() {
    const hay = nivel && nivel.conVariantes;
    $("#pasoKeycaps").hidden = !hay;
    /* los pasos van numerados porque el orden es el de la compra */
    $("#numSw").textContent = hay ? "03" : "02";
    if (!hay) return;
    $("#keycaps").innerHTML = nivel.variantes.map(v => opcion("kc", v.variante, v === variante, v.agotada, v.variante, precioDe(v))).join("");
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
      $("#switches").innerHTML = `<div class="f-opciones">${p.switches.map((s, i) =>
        opcion("sw", String(i), i === 0, false, CK.L(s.name), s.price != null ? "+ " + CK.precio(s.price) : "")).join("")}</div>`;
      return;
    }
    const bajoPedido = !!CK.spec(p, "Personalización");
    $("#switches").innerHTML = !sw ? "" : `<div class="f-fija">
      <span class="f-led" aria-hidden="true"></span>
      ${incluidos ? `<b>${CK.escapar(sw)}</b><span>${T("m.swIncluidos")}${bajoPedido ? " · " + T("m.swOtros") : ""}</span>`
                  : `<b>${T("m.swNo")} ${CK.escapar(sw)}</b>`}</div>`;
  }

  /* La pantalla del total cuenta hasta el nuevo precio en vez de saltar:
     se ve que ha cambiado y en que direccion. */
  let mostrado = null, anim = 0;
  function pintaTotal(precio, hasta, texto) {
    const el = $("#total");
    cancelAnimationFrame(anim);
    const rango = precio != null && hasta != null && hasta > precio + 0.004;
    if (precio == null || rango || CK.quieto() || mostrado == null) { el.innerHTML = texto; mostrado = rango ? null : precio; return; }
    const ini = mostrado, t0 = performance.now(), dur = 380, curva = x => 1 - Math.pow(1 - x, 4);
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
    $("#cbNombre").textContent = `${nombreCorto()} · ${nivel ? nombreNivel(nivel) : ""}${variante ? " · " + variante.variante : ""}`;
    $("#cbTotal").innerHTML = texto;
    /* La configuracion vive en la URL: se puede mandar y abre igual. */
    const q = new URLSearchParams(location.search);
    if (nivel) q.set("op", nivel.id);
    if (variante) q.set("kc", variante.variante); else q.delete("kc");
    history.replaceState(null, "", `${location.pathname}?${q}${location.hash}`);
  }

  function actualiza() { pasoKeycaps(); pasoSwitches(); incluye(); }

  /* ---------- firmware: solo lo que la ficha declara ---------- */
  /* La luz solo en el Sofle: es el unico con el mapa de sus LED medido. */
  const conLuz = tablero === "sofle" && !!CK.spec(p, "Iluminación");
  const conOled = !!CK.spec(p, "Pantallas");
  /* El Keymap Studio habla ZMK Studio: los Corne son QMK con VIA o Vial. */
  const conStudio = /ZMK Studio/.test(CK.spec(p, "Firmware") || "");
  $("#p-luz").hidden = !conLuz; $("#p-oled").hidden = !conOled; $("#p-studio").hidden = !conStudio;
  $("#firmware").hidden = !(conLuz || conOled || conStudio);

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

  /* ---------- hoja de datos ---------- */
  function ficha() {
    const filas = (p.specs || []).map(([k, v]) => [k.es, CK.L(k), CK.L(v)]);
    const fila = ([, k, v]) => `<tr><th scope="row">${CK.escapar(k)}</th><td>${CK.escapar(v)}</td></tr>`;
    const grupo = (titulo, l) => l.length ? `<tr class="f-grupo"><th scope="colgroup" colspan="2">${titulo}</th></tr>${l.map(fila).join("")}` : "";
    $("#fichaLista").innerHTML = grupo(T("e.general"), filas.filter(f => !COMPONENTES.includes(f[0])));
    $("#compLista").innerHTML = grupo(T("m.sComp"), filas.filter(f => COMPONENTES.includes(f[0])));
  }

  /* ---------- barra de compra ---------- */
  function observa() {
    /* Sale cuando la placa ya no se ve. Con la posicion real, no con un
       IntersectionObserver, que no avisa al saltar por encima de la placa. */
    const cb = $("#cbarra"), que = $("#que");
    let pend = false;
    const mira = () => {
      pend = false;
      const ver = que.getBoundingClientRect().bottom < 0;
      if (ver === cb.classList.contains("visible")) return;
      cb.classList.toggle("visible", ver);
      cb.inert = !ver;   /* escondida, no recibe el foco del teclado */
    };
    addEventListener("scroll", () => { if (!pend) { pend = true; requestAnimationFrame(mira); } }, { passive: true });
    mira();
  }

  function pintar() {
    modelos();
    placa();
    rotularGaleria();
    pasoNiveles();
    actualiza();
    modos();
    ficha();
    CK.comparativa($("#comparativa"), p);
    CK.confianza($("#confianza"));
    $("#notaPrecios").textContent = CK.notaPrecios();
    document.querySelectorAll(".ic-flecha").forEach(e => e.innerHTML = CK.icono("flecha", 16));
  }

  /* El formulario no se envia a ningun sitio: comprar es un enlace a Etsy. */
  $("#config").addEventListener("submit", e => e.preventDefault());
  galeria();
  CK.montarSelectorIdioma();
  CK.pintarIdioma(pintar);
  pintar();
  observa();
})();
