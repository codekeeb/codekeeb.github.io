/* ============================================================
   CODEKEEB — la portada, que es la familia y la tienda
   ------------------------------------------------------------
   Arriba la familia de cinco (lo primero de ergodox: te situa en el
   catalogo). Despues un principio por seccion, con el teclado dibujado
   y la parte que se explica encendida. Todo sale de js/data.js.
   ============================================================ */

(() => {
  const $ = s => document.querySelector(s);
  const T = CK.t;

  /* ---------- la familia ---------- */
  const FILTROS = [["all", "d.all"], ["wireless", "d.wireless"], ["low", "d.low"], ["mx", "d.mx"], ["encoder", "d.encoder"]];
  let filtro = "all";

  /* Cuatro datos por modelo, deducidos de la ficha y no escritos a mano. */
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

  function modelo(p, i) {
    const e = CK.stock(p), desde = CK.precioMinimo(p), varios = CK.niveles(p).length > 1;
    return `<article class="modelo">
      <div class="modelo__foto">
        <img src="${CK.foto(p)}" alt="${CK.escapar(`${p.name} ${CK.L(p.version) || ""}`.trim())}"
             data-foco="${p.foco ?? 50}" ${i > 2 ? 'loading="lazy"' : 'fetchpriority="high"'}>
        <span class="modelo__stock stock stock--${e.clase}">${CK.escapar(e.txt)}</span>
      </div>
      <h3 class="nombre"><a href="modelo.html?id=${p.id}">${CK.rotulo(p)}</a></h3>
      <p>${CK.escapar(CK.L(p.desc) || "")}</p>
      <ul class="datos">${datos(p).map(d => `<li>${CK.escapar(d)}</li>`).join("")}</ul>
      <div class="modelo__pie">
        <span class="precio">${desde == null ? "" : `${varios ? `<small>${T("price.from")}</small> ` : ""}${CK.precio(desde)}`}</span>
        <span class="modelo__cta">${T("p2.configurar")} ${CK.icono("flecha", 16)}</span>
      </div>
    </article>`;
  }

  function familia() {
    const todos = CK.productos(), lista = todos.filter(CK.FILTROS[filtro]);
    $("#filtros").innerHTML = FILTROS.map(([id, k]) =>
      `<button type="button" data-f="${id}" aria-pressed="${id === filtro}">${T(k)}</button>`).join("")
      + `<span class="cuenta" aria-live="polite">${lista.length} ${T("d.of")} ${todos.length}</span>`;
    $("#filtros").querySelectorAll("button").forEach(b => b.onclick = () => { filtro = b.dataset.f; familia(); });
    $("#rejilla").innerHTML = lista.length ? lista.map(modelo).join("") : `<p class="vacio">${T("d.nomatch")}</p>`;
    CK.encuadrarTodo();
  }

  /* ---------- los dibujos ----------
     Se montan una vez: cambiar de idioma no cambia la forma del Sofle. */
  CK_DIBUJO.montar($("#dSplit"), "sofle", "mitades");
  CK_DIBUJO.montar($("#dCol"), "sofle", "columnas");
  CK_DIBUJO.montar($("#dPul"), "sofle", "pulgares");

  /* ---------- la luz ---------- */
  const teclado = CK_RGB.montar($("#kb"));
  const MODOS = ["gradient", "ripple", "fire", "sunset", "heatmap"];
  let modo = 0, auto = true, reloj = 0;
  function pintaModo() {
    teclado.modo(MODOS[modo]);
    $("#fxTexto").textContent = T(`p.fx${modo + 1}Text`);
    $("#modos").querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String(i === modo)));
  }
  function modos() {
    $("#modos").innerHTML = MODOS.map(m => `<button type="button" aria-pressed="false">${m}</button>`).join("");
    $("#modos").querySelectorAll("button").forEach((b, i) => b.onclick = () => {
      /* quien elige un modo quiere verlo: se para el pase automatico */
      auto = false; clearInterval(reloj); modo = i; pintaModo();
    });
    pintaModo();
  }
  /* Los modos pasan solos cada seis segundos, solo con la seccion a la
     vista y hasta que alguien toca uno. */
  let luzVisible = false;
  const pase = () => {
    clearInterval(reloj);
    if (luzVisible && auto && !CK.quieto())
      reloj = setInterval(() => { modo = (modo + 1) % MODOS.length; pintaModo(); }, 6000);
  };
  new IntersectionObserver(([e]) => { luzVisible = e.isIntersecting; pase(); }).observe($("#luz"));
  document.addEventListener("ck-movimiento", pase);

  CK_OLED.montar($("#oledIzq"), $("#oledDer"));

  const LEYENDAS = [
    [["Q","1"],["W","2"],["E","3"],["R","4"],["T","5"],["Y","6"]],
    [["⇧","⇧"],["A","←"],["S","↓"],["D","↑"],["F","→"],["G","⌫"]],
  ];
  $("#capasFila").innerHTML = LEYENDAS.map((fila, f) =>
    `<div class="capas__fila">${fila.map(([a, b], i) =>
      `<span class="capas__t${f === 1 && i === 0 ? " capas__t--hold" : ""}"><span>${a}</span><span>${b}</span></span>`).join("")}</div>`).join("");

  function pintar() {
    familia();
    modos();
    document.querySelectorAll("[data-nota-dib]").forEach(e => e.textContent = T("e.dibNota").replace("%s", e.dataset.notaDib));
    document.querySelectorAll(".ic-flecha").forEach(e => e.innerHTML = CK.icono("flecha", 16));
    CK.comparativa($("#comparativa"), null);
    CK.confianza($("#confianza"));
    $("#notaPrecios").textContent = CK.notaPrecios();
  }

  CK.montarSelectorIdioma();
  CK.pintarIdioma(pintar);
  pintar();
})();
