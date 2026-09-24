/* ============================================================
   CODEKEEB — la portada, que es la tienda
   ------------------------------------------------------------
   Tres cosas, en el orden en que las busca quien entra:
     1. los cinco modelos, con precio, stock y lo que los distingue;
     2. lo que llevan dentro, funcionando (luz, pantallas, capas,
        hotswap), en un solo escenario con pestanas;
     3. los cinco lado a lado, y lo que hay que saber antes de pagar.
   Todo sale de `js/data.js`.
   ============================================================ */

(() => {
  const $ = s => document.querySelector(s);
  const T = CK.t;

  /* ---------- la tienda ---------- */
  const FILTROS = [["all", "d.all"], ["wireless", "d.wireless"], ["low", "d.low"], ["mx", "d.mx"], ["encoder", "d.encoder"]];
  let filtro = "all";

  /* Cuatro datos por tarjeta, deducidos de la ficha y no escritos a mano:
     si manana un modelo deja de llevar OLED, la tarjeta se entera sola. */
  function datos(p) {
    const r = CK.rasgos(p), d = [];
    const teclas = CK.spec(p, "Teclas");
    if (teclas) d.push(`${teclas} ${T("p2.teclas")}`);
    d.push(r.low ? "Choc" : r.mx ? "MX" : null);
    d.push(T(r.inalambrico ? "p2.bt" : "p2.cable"));
    if (CK.spec(p, "Pantallas")) d.push(T("p2.oled"));
    else if (r.encoder) d.push(T("p2.encoder"));
    return d.filter(Boolean).slice(0, 4);
  }

  function tarjeta(p, i) {
    const e = CK.stock(p);
    const desde = CK.precioMinimo(p);
    const varios = CK.niveles(p).length > 1;
    return `<article class="producto">
      <div class="producto__foto">
        <img src="${CK.foto(p)}" alt="${CK.escapar(`${p.name} ${p.version || ""}`.trim())}"
             data-foco="${p.foco ?? 50}" ${i > 2 ? 'loading="lazy"' : ""}>
      </div>
      <span class="producto__insignia stock stock--${e.clase}">${CK.escapar(e.txt)}</span>
      <div class="producto__cuerpo">
        <h3 class="nombre"><a href="modelo.html?id=${p.id}">${CK.rotulo(p)}</a></h3>
        <p class="producto__pitch">${CK.escapar(CK.L(p.desc) || "")}</p>
        <ul class="datos">${datos(p).map(d => `<li>${CK.escapar(d)}</li>`).join("")}</ul>
        <div class="producto__pie">
          <span class="precio">${desde == null ? "" : `${varios ? `<small>${T("price.from")}</small> ` : ""}${CK.precio(desde)}`}</span>
          <span class="producto__cta">${T("p2.configurar")} ${CK.icono("flecha", 16)}</span>
        </div>
      </div>
    </article>`;
  }

  function tienda() {
    const todos = CK.productos();
    const lista = todos.filter(CK.FILTROS[filtro]);
    $("#filtros").innerHTML = FILTROS.map(([id, k]) =>
      `<button type="button" data-f="${id}" aria-pressed="${id === filtro}">${T(k)}</button>`).join("")
      + `<span class="cuenta" aria-live="polite">${lista.length} ${T("d.of")} ${todos.length}</span>`;
    $("#filtros").querySelectorAll("button").forEach(b => b.onclick = () => { filtro = b.dataset.f; tienda(); });
    $("#rejilla").innerHTML = lista.length
      ? lista.map(tarjeta).join("")
      : `<p class="vacio">${T("d.nomatch")}</p>`;
    CK.encuadrarTodo();
  }

  /* ---------- el escenario ---------- */
  const teclado = CK_RGB.montar($("#kb"));
  CK_OLED.montar($("#oledIzq"), $("#oledDer"));

  const MODOS = ["gradient", "ripple", "fire", "sunset", "heatmap"];
  let modo = 0, autoModo = true, relojModo = 0;
  function pintaModo() {
    teclado.modo(MODOS[modo]);
    $("#fxTexto").textContent = T(`p.fx${modo + 1}Text`);
    $("#modos").querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String(i === modo)));
  }
  function modos() {
    $("#modos").innerHTML = MODOS.map(m => `<button type="button" aria-pressed="false">${m}</button>`).join("");
    $("#modos").querySelectorAll("button").forEach((b, i) => b.onclick = () => {
      /* Quien elige un modo quiere verlo: se para el pase automatico. */
      autoModo = false; clearInterval(relojModo);
      modo = i; pintaModo();
    });
    pintaModo();
  }
  /* Los modos pasan solos cada seis segundos hasta que alguien toca uno.
     Solo mientras la pestana de luz esta abierta y en pantalla. */
  function arrancaModos() {
    clearInterval(relojModo);
    if (!autoModo || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    relojModo = setInterval(() => { modo = (modo + 1) % MODOS.length; pintaModo(); }, 6000);
  }

  const LEYENDAS = [
    [["Q","1"],["W","2"],["E","3"],["R","4"],["T","5"],["Y","6"]],
    [["⇧","⇧"],["A","←"],["S","↓"],["D","↑"],["F","→"],["G","⌫"]],
  ];
  function capas() {
    $("#capasFila").innerHTML = LEYENDAS.map((fila, f) =>
      `<div class="capas__fila">${fila.map(([a, b], i) =>
        `<span class="capas__t${f === 1 && i === 0 ? " capas__t--hold" : ""}"><span>${a}</span><span>${b}</span></span>`
      ).join("")}</div>`).join("");
  }

  /* Pestanas de verdad: flechas para moverse, Inicio y Fin, y solo la
     activa entra en el orden de tabulacion. */
  const pestanas = [...document.querySelectorAll('[role="tab"]')];
  function abre(tab, foco) {
    pestanas.forEach(t => {
      const si = t === tab, panel = document.getElementById(t.getAttribute("aria-controls"));
      t.setAttribute("aria-selected", String(si));
      t.tabIndex = si ? 0 : -1;
      panel.hidden = !si;
      panel.setAttribute("aria-hidden", String(!si));
    });
    if (foco) tab.focus();
    /* Un lienzo que estaba oculto media 0 de ancho: se le avisa para que
       vuelva a escalar el teclado al abrirse. */
    dispatchEvent(new Event("resize"));
    if (tab.id === "t-rgb") arrancaModos(); else clearInterval(relojModo);
  }
  pestanas.forEach((t, i) => {
    t.onclick = () => abre(t);
    t.onkeydown = e => {
      const n = pestanas.length;
      const destino = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
      if (destino === undefined) return;
      e.preventDefault();
      abre(pestanas[destino], true);
    };
  });

  /* El pase de modos solo corre con el escenario a la vista. */
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && $("#t-rgb").getAttribute("aria-selected") === "true") arrancaModos();
    else clearInterval(relojModo);
  }).observe($("#ventajas"));

  function pintar() {
    tienda();
    modos();
    CK.comparativa($("#comparativa"), null);
    CK.confianza($("#confianza"));
    $("#notaPrecios").textContent = CK.notaPrecios();
  }

  capas();
  CK.montarSelectorIdioma();
  CK.pintarIdioma(pintar);
  pintar();
})();
