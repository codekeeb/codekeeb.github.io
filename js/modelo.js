/* ============================================================
   CODEKEEB — la ficha de un modelo
   ------------------------------------------------------------
   Lo que tiene que quedar claro al entrar: QUE estas comprando. Por eso
   la pagina gira alrededor del configurador, y todo lo de debajo
   (que incluye, ficha, componentes, comparacion) responde a las
   preguntas que se hace alguien antes de pagar.

   Todo sale de `js/data.js`. No hay un precio, una opcion ni una
   caracteristica escritos aqui: si el anuncio de Etsy cambia, se cambia
   alli y esta pagina se entera sola. Y cuando el dato no existe (el
   precio de los completos del Retro, por ejemplo) se dice "precio en
   Etsy" en vez de rellenar el hueco con un numero.
   ============================================================ */

(() => {
  const $ = s => document.querySelector(s);
  const T = CK.t;

  const id = new URLSearchParams(location.search).get("id");
  const p = CK.productos().find(x => x.id === id);

  if (!p) {
    /* Un enlace roto no debe dejar una pagina vacia: dice que ha pasado
       y adonde ir. */
    CK.montarSelectorIdioma();
    const pintarVacio = () => {
      $("#pagina").innerHTML = `<div class="env seccion"><div class="vacio">
        <h1 class="titulo">${T("pdp.notFound")}</h1>
        <p style="margin-block:12px 20px">${CK.escapar(id || "")}</p>
        <a class="btn" href="/#tienda">${T("pdp.backToModels")}</a></div></div>`;
    };
    CK.pintarIdioma(pintarVacio); pintarVacio();
    return;
  }

  /* Las filas de la ficha se reparten en dos grupos. No es un dato
     nuevo: son las mismas filas de siempre, separadas entre lo que
     describe el teclado (cuantas teclas, como se conecta) y las piezas
     fisicas que lo componen, que es lo que se mira al comparar calidad. */
  const COMPONENTES = ["Switches", "Keycaps", "Pantallas", "Iluminación", "Encoders", "Case"];
  const NOMBRE_FILA = ["m.rPlaca", "m.rElec", "m.rCaja", "m.rSw", "m.rKc"];

  const niveles = CK.niveles(p);
  /* Por omision, el nivel mas completo que quede disponible: es lo que
     compra la mayoria, y quien quiere menos lo baja con un clic. */
  const params = new URLSearchParams(location.search);
  let nivel = niveles.find(n => n.id === params.get("op") && !n.agotado)
           || [...niveles].reverse().find(n => !n.agotado) || niveles[0];
  let variante = null;
  const elegirVariante = () => {
    variante = nivel && nivel.conVariantes
      ? (nivel.variantes.find(v => v.variante === params.get("kc") && !v.agotada) || nivel.variantes.find(v => !v.agotada) || null)
      : null;
  };
  elegirVariante();

  /* ---------- galeria ---------- */
  function galeria() {
    const fotos = (p.gallery && p.gallery.length ? p.gallery : [p.img]).filter(Boolean);
    const alt = `${p.name} ${p.version || ""}`.trim();
    $("#foto").innerHTML = fotos.map((f, i) =>
      `<img src="assets/img/products/${f}" alt="${CK.escapar(alt)}" ${i ? 'data-sale loading="lazy"' : 'fetchpriority="high"'}
            ${i === 0 && p.foco ? `data-foco="${p.foco}"` : ""}>`).join("");
    $("#miniaturas").innerHTML = fotos.length < 2 ? "" : fotos.map((f, i) =>
      `<button type="button" aria-pressed="${i === 0}" aria-label="${i + 1} / ${fotos.length}">
         <img src="assets/img/products/${f.replace(/\.jpg$/, "-sm.jpg")}" alt="" loading="lazy"></button>`).join("");
    /* Fundido entre fotos, no un salto: las dos estan en la pila y solo
       cambia cual es opaca. */
    $("#miniaturas").querySelectorAll("button").forEach((b, i) => b.onclick = () => {
      $("#miniaturas").querySelectorAll("button").forEach((x, j) => x.setAttribute("aria-pressed", String(i === j)));
      $("#foto").querySelectorAll("img").forEach((im, j) => im.toggleAttribute("data-sale", i !== j));
    });
  }

  /* ---------- cabeza ---------- */
  function cabeza() {
    document.title = `${p.name} ${p.version || ""} — Codekeeb`.replace(/\s+—/, " —");
    $("#migaNombre").textContent = `${p.name} ${p.version || ""}`.trim();
    $("#nombre").innerHTML = CK.rotulo(p);
    $("#desc").textContent = CK.L(p.desc) || "";
    const desde = CK.precioMinimo(p);
    const varios = niveles.length > 1;
    $("#cabezaPrecio").innerHTML = desde == null ? "" : `
      <span class="precio">${varios ? `<small>${T("price.from")}</small> ` : ""}${CK.precio(desde)}</span>
      ${p.discountPct ? `<span class="dto">−${p.discountPct}% ${T("m.dtoEtsy")}</span>` : ""}
      ${p.rating ? `<span class="valoracion">${CK.icono("estrella", 15)} ${p.rating.toFixed(1).replace(".", CK.lang === "en" ? "." : ",")}
        · ${p.reviews} ${T(p.reviews === 1 ? "m.resena" : "m.resenas")}</span>` : ""}`;
    const e = CK.stock(p);
    $("#estado").innerHTML = `<span class="stock stock--${e.clase}">${CK.escapar(e.txt)}</span>`;
  }

  /* ---------- configurador ---------- */
  const lleva = (fila, si) => `<li class="${si ? "si" : ""}">${CK.icono(si ? "si" : "no", 14)}
      <span>${T(NOMBRE_FILA[fila])}</span><span class="oculto">: ${T(si ? "m.si" : "m.no")}</span></li>`;

  function pintarNiveles() {
    $("#niveles").innerHTML = niveles.map(n => {
      const precio = n.precio != null ? CK.precioRango(n.precio, n.hasta) : T("m.enEtsy");
      return `<label class="opcion${n.agotado ? " opcion--agotada" : ""}">
        <input type="radio" name="nivel" value="${n.id}" ${n === nivel ? "checked" : ""} ${n.agotado ? "disabled" : ""}>
        <span class="opcion__n">${CK.escapar(n.conVariantes ? n.variantes[0].nombre.split("·")[0].trim() : n.variantes[0].nombre)}</span>
        <span class="opcion__p">${n.agotado ? T("pdp.soldOut") : precio}</span>
        <span class="opcion__d">${T("m.d" + n.id[0].toUpperCase() + n.id.slice(1))}</span>
        <ul class="lleva">${n.lleva.map((si, i) => lleva(i, si)).join("")}</ul>
      </label>`;
    }).join("");
    $("#niveles").querySelectorAll("input").forEach(inp => inp.onchange = () => {
      nivel = niveles.find(n => n.id === inp.value);
      elegirVariante();
      actualizar();
    });
  }

  function pintarKeycaps() {
    const hay = nivel && nivel.conVariantes;
    $("#pasoKeycaps").hidden = !hay;
    if (!hay) return;
    $("#keycaps").innerHTML = nivel.variantes.map(v => `
      <label class="opcion${v.agotada ? " opcion--agotada" : ""}">
        <input type="radio" name="kc" value="${CK.escapar(v.variante)}" ${v === variante ? "checked" : ""} ${v.agotada ? "disabled" : ""}>
        <span class="opcion__n">${CK.escapar(v.variante)}</span>
        <span class="opcion__p">${v.agotada ? T("pdp.soldOut") : v.precio != null ? CK.precioRango(v.precio, v.hasta) : T("m.enEtsy")}</span>
      </label>`).join("");
    $("#keycaps").querySelectorAll("input").forEach(inp => inp.onchange = () => {
      variante = nivel.variantes.find(v => v.variante === inp.value);
      actualizar();
    });
  }

  /* Switches: hoy ningun anuncio trae switches a elegir con su precio, asi
     que se dice cual monta (o con cual es compatible si no los incluye)
     en vez de inventarse un selector. Si algun dia `data.js` trae
     `switches: [{name:{es,en,fr}, price}]`, sale como una opcion mas. */
  function pintarSwitches() {
    const sw = CK.spec(p, "Switches");
    const incluidos = nivel && nivel.lleva[3];
    const bajoPedido = !!CK.spec(p, "Personalización");
    if (Array.isArray(p.switches) && p.switches.length && incluidos) {
      $("#switches").innerHTML = `<div class="opciones">${p.switches.map((s, i) => `
        <label class="opcion"><input type="radio" name="sw" value="${i}" ${i === 0 ? "checked" : ""}>
          <span class="opcion__n">${CK.escapar(CK.L(s.name))}</span>
          <span class="opcion__p">${s.price != null ? CK.precio(s.price) : ""}</span></label>`).join("")}</div>`;
      return;
    }
    $("#switches").innerHTML = !sw ? "" : `<div class="fija">
      ${CK.icono("switch", 22)}
      <b>${CK.escapar(sw)}</b>
      <span>${incluidos ? T("m.swIncluidos") : T("m.swNo") + " " + CK.escapar(sw)}${bajoPedido && incluidos ? ` · ${T("m.swOtros")}` : ""}</span>
    </div>`;
  }

  /* El total cambia contando, no saltando: se ve que ha cambiado y en que
     direccion. Corto, con la curva del sistema, y sin animar si el
     sistema pide menos movimiento. */
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let totalMostrado = null, animTotal = 0;
  function pintaTotal(desde, hasta, texto) {
    const el = $("#total");
    cancelAnimationFrame(animTotal);
    if (desde == null || hasta != null && hasta > desde + 0.004 || quieto || totalMostrado == null) {
      el.innerHTML = texto; totalMostrado = hasta != null && hasta > desde + 0.004 ? null : desde; return;
    }
    const ini = totalMostrado, fin = desde, t0 = performance.now(), dur = 420;
    const curva = x => 1 - Math.pow(1 - x, 4);        /* ease-out, como --ease */
    const paso = ahora => {
      const k = Math.min(1, (ahora - t0) / dur);
      el.textContent = CK.precio(Math.round((ini + (fin - ini) * curva(k)) * 100) / 100);
      if (k < 1) animTotal = requestAnimationFrame(paso); else el.innerHTML = texto;
    };
    totalMostrado = fin;
    animTotal = requestAnimationFrame(paso);
  }

  function resumen() {
    const precio = variante ? variante.precio : nivel && nivel.precio;
    const hasta = variante ? variante.hasta : nivel && nivel.hasta;
    const texto = precio != null ? CK.precioRango(precio, hasta) : T("m.enEtsy");
    const nombreNivel = nivel ? (nivel.conVariantes ? nivel.variantes[0].nombre.split("·")[0].trim() : nivel.variantes[0].nombre) : "—";
    const sw = CK.spec(p, "Switches");
    const filas = [
      [T("m.opcion"), nombreNivel],
      variante ? [T("m.keycaps"), variante.variante] : null,
      sw ? [T("m.switches"), nivel && nivel.lleva[3] ? sw : T("m.no")] : null,
    ].filter(Boolean);
    $("#resumenLista").innerHTML = filas.map(([a, b]) => `<div><dt>${CK.escapar(a)}</dt><dd>${CK.escapar(b)}</dd></div>`).join("");
    pintaTotal(precio, hasta, texto);
    /* El rango se explica junto al total, que es donde aparece: suelto
       entre las filas del resumen no se sabia a que se referia. */
    const rango = precio != null && hasta != null && hasta > precio + 0.004;
    $("#totalNota").textContent = rango ? T("m.rango") : "";
    $("#totalNota").hidden = !rango;
    const url = CK.enlaceCompra(p);
    $("#comprar").href = url; $("#barraComprar").href = url;
    $("#iconoExterno").innerHTML = CK.icono("externo", 16);
    $("#barraNombre").textContent = `${p.name} ${p.version || ""} · ${nombreNivel}${variante ? " · " + variante.variante : ""}`;
    $("#barraTotal").innerHTML = texto;
    $("#fecha").textContent = CK.notaPrecios();

    /* La configuracion vive en la URL: se puede mandar a alguien y abre
       exactamente con lo mismo elegido. */
    const q = new URLSearchParams(location.search);
    if (nivel) q.set("op", nivel.id);
    if (variante) q.set("kc", variante.variante); else q.delete("kc");
    history.replaceState(null, "", `${location.pathname}?${q}${location.hash}`);
  }

  function actualizar() {
    pintarKeycaps();
    pintarSwitches();
    resumen();
    matriz();
  }

  /* ---------- que incluye cada opcion ---------- */
  function matriz() {
    const cols = niveles;
    $("#matriz").innerHTML = `
      <thead><tr><th scope="col"><span class="oculto">${T("m.sIncluye")}</span></th>
        ${cols.map(n => `<th scope="col" class="${n === nivel ? "actual" : ""}">
          ${CK.escapar(n.conVariantes ? n.variantes[0].nombre.split("·")[0].trim() : n.variantes[0].nombre)}
          <small>${n.agotado ? T("pdp.soldOut") : n.precio != null ? CK.precioRango(n.precio, n.hasta) : T("m.enEtsy")}</small>
          ${n === nivel ? `<small>${T("m.elegido")}</small>` : ""}</th>`).join("")}</tr></thead>
      <tbody>${NOMBRE_FILA.map((clave, fila) => `<tr><th scope="row">${T(clave)}</th>
        ${cols.map(n => `<td class="${n.lleva[fila] ? "si" : "no"}${n === nivel ? " actual" : ""}">
          ${CK.icono(n.lleva[fila] ? "si" : "no", 18)}<span class="oculto">${T(n.lleva[fila] ? "m.si" : "m.no")}</span></td>`).join("")}
      </tr>`).join("")}</tbody>`;
    /* En el movil la columna elegida suele quedar fuera, a la derecha. Se
       desliza el marco hasta ella: lo primero que tienes que ver de esta
       tabla es lo que has elegido. */
    const marco = $("#matriz").parentElement, col = $("#matriz thead th.actual"), fija = $("#matriz thead th");
    if (marco && col && marco.scrollWidth > marco.clientWidth)
      marco.scrollLeft = Math.max(0, col.offsetLeft - fija.offsetWidth);
  }

  /* ---------- caracteristicas, ficha y componentes ---------- */
  function contenido() {
    const rasgos = [...(CK.L(p.highlights) || [])];
    $("#rasgos").innerHTML = rasgos.map(r => `<li>${CK.icono("si", 18)}<span>${CK.escapar(r)}</span></li>`).join("")
      + `<li>${CK.icono("codigo", 18)}<span>${T("m.studio")} <a class="enlace" href="keymap-studio/">Keymap Studio</a></span></li>`;
    const filas = (p.specs || []).map(([k, v]) => [k.es, CK.L(k), CK.L(v)]);
    const dl = lista => lista.map(([, k, v]) => `<div><dt>${CK.escapar(k)}</dt><dd>${CK.escapar(v)}</dd></div>`).join("");
    const comp = filas.filter(f => COMPONENTES.includes(f[0]));
    $("#fichaLista").innerHTML = dl(filas.filter(f => !COMPONENTES.includes(f[0])));
    $("#compLista").innerHTML = dl(comp);
    /* Si un modelo no declara componentes, la seccion no se queda con un
       titulo y nada debajo. */
    $("#componentes").hidden = !comp.length;
    document.querySelector('.subnav a[href="#componentes"]').parentElement.hidden = !comp.length;
  }

  /* ---------- frente a los otros, y confianza: compartidos ---------- */
  function comparativa() { CK.comparativa($("#comparativa"), p); }
  function confianza() {
    CK.confianza($("#confianza"));
    $("#notaPrecios").textContent = CK.notaPrecios();
  }

  /* ---------- lo que pasa al hacer scroll ---------- */
  function observar() {
    /* La barra del movil sale cuando el resumen ya ha quedado ARRIBA, no
       cuando todavia no ha llegado: al entrar en la pagina el boton de
       comprar ya esta a la vista y una segunda copia sobraria.

       Con la posicion real y no con un IntersectionObserver: el
       observador solo avisa cuando CAMBIA el estado, y un salto de
       "por encima de la pantalla" a "por debajo" (volver arriba de golpe,
       un enlace de anclaje) no cambia nada, porque sigue fuera. La barra
       se quedaba puesta arriba del todo. */
    const barra = $("#barra"), res = $("#resumen");
    let pendiente = false;
    const mira = () => {
      pendiente = false;
      const pasado = res.getBoundingClientRect().bottom < 0;
      if (pasado === barra.classList.contains("visible")) return;
      barra.classList.toggle("visible", pasado);
      barra.setAttribute("aria-hidden", String(!pasado));
      $("#barraComprar").tabIndex = pasado ? 0 : -1;
    };
    addEventListener("scroll", () => { if (!pendiente) { pendiente = true; requestAnimationFrame(mira); } }, { passive: true });
    mira();

    /* La seccion que estas leyendo se marca en la subnavegacion. La banda
       activa es una franja estrecha por encima del centro: asi solo hay
       una seccion "actual" a la vez. */
    const enlaces = [...document.querySelectorAll(".subnav a")];
    const obs = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting)
        enlaces.forEach(a => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + e.target.id)));
    }, { rootMargin: "-35% 0px -60% 0px" });
    document.querySelectorAll(".bloque").forEach(b => obs.observe(b));
  }

  function pintar() {
    cabeza();
    pintarNiveles();
    actualizar();
    contenido();
    comparativa();
    confianza();
    CK.encuadrarTodo();
  }

  galeria();
  CK.montarSelectorIdioma();
  CK.pintarIdioma(pintar);
  pintar();
  observar();
})();
