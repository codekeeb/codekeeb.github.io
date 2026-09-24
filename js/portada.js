/* ============================================================
   CODEKEEB — la portada: el muestrario
   ------------------------------------------------------------
   Cinco franjas, una por modelo, con su color de data.js. Los filtros
   no quitan modelos: pliegan los que no encajan, para que la familia
   siga a la vista. Debajo, dos aparatos: la forma de un split (cuatro
   teclas de modo) y lo que hace el firmware. Todo sale de js/data.js.
   ============================================================ */

(() => {
  const $ = s => document.querySelector(s);
  const T = CK.t;

  /* ---------- las franjas ---------- */
  const FILTROS = [["all", "d.all"], ["wireless", "d.wireless"], ["low", "d.low"], ["mx", "d.mx"], ["encoder", "d.encoder"]];
  let filtro = "all";

  function franja(p, i) {
    const c = p.color || { fondo: "#e8e9eb", tinta: "#111111" };
    const tit = p.title || { model: p.name, trait: p.version };
    const e = CK.stock(p), desde = CK.precioMinimo(p), varios = CK.niveles(p).length > 1;
    const nombre = p.corto || `${p.name} ${CK.L(p.version) || ""}`.trim();
    const pantalla = desde == null ? `<b>${T("m.enEtsy")}</b>`
      : `<span class="f-pantalla__et">${varios ? T("price.from") : T("m.total")}</span><b>${CK.precio(desde)}</b>`;
    /* El nombre visible ("Sofle") va dentro del nombre accesible, que
       ademas dice cual de los dos Sofle es: WCAG 2.5.3. */
    return `<article class="p-franja" style="--c:${c.fondo};--ct:${c.tinta}" data-id="${p.id}">
      <header class="p-franja__cab">
        <h2 class="p-franja__nombre"><a href="modelo.html?id=${p.id}" aria-label="${CK.escapar(`${nombre} — ${T("p2.configurar")}`)}">${CK.escapar(tit.model)}</a></h2>
        <p class="p-franja__rasgo"><span>${CK.escapar(CK.L(tit.trait) || "")}</span>${tit.accent ? `<span class="f-rgb">${CK.escapar(tit.accent)}</span>` : ""}</p>
      </header>
      <div class="p-franja__cuerpo">
        <div class="f-ventana"><div class="f-ventana__foto">
          <img src="${CK.foto(p)}" alt="${CK.escapar(nombre)}" data-foco="${p.foco ?? 50}" ${i > 1 ? 'loading="lazy"' : 'fetchpriority="high"'}>
        </div></div>
        <ul class="f-lecturas">${(p.stats || []).slice(0, 4).map(([v, etq]) =>
          `<li><b>${CK.escapar(v)}</b><span>${CK.escapar(CK.L(etq))}</span></li>`).join("")}</ul>
        <div class="p-franja__pie">
          <div class="f-pantalla">${pantalla}</div>
          <span class="f-tecla f-tecla--placa" aria-hidden="true">${T("p2.configurar")}</span>
          <p class="stock stock--${e.clase}">${CK.escapar(e.txt)}</p>
        </div>
      </div>
    </article>`;
  }

  function franjas() {
    $("#franjas").innerHTML = CK.productos().map(franja).join("");
    CK.encuadrarTodo();
    filtrar();
  }

  /* Solo cambia atributos: asi la franja se pliega con transicion en vez
     de desaparecer y volver a pintarse. */
  function filtrar() {
    const todos = CK.productos(), dentro = new Set(todos.filter(CK.FILTROS[filtro]).map(p => p.id));
    $("#franjas").querySelectorAll(".p-franja").forEach(f => {
      const fuera = !dentro.has(f.dataset.id);
      f.toggleAttribute("data-fuera", fuera);
      /* plegada no esconde el enlace: el nombre sigue llevando a la ficha */
      f.querySelector(".p-franja__cuerpo").inert = fuera;
    });
    $("#filtros").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.f === filtro)));
    $("#cuenta").innerHTML = `<b aria-hidden="true">${dentro.size}/${todos.length}</b><span class="oculto">${dentro.size} ${T("d.of")} ${todos.length}</span>`;
    $("#vacio").hidden = dentro.size > 0;
  }

  function filtros() {
    $("#filtros").innerHTML = FILTROS.map(([id, k]) =>
      `<button type="button" class="p-filtro" data-f="${id}" aria-pressed="false"><i aria-hidden="true"></i>${T(k)}</button>`).join("");
    $("#filtros").querySelectorAll("button").forEach(b => b.onclick = () => { filtro = b.dataset.f; filtrar(); });
  }

  /* ---------- la forma: un aparato, cuatro teclas ----------
     El dibujo se monta una vez (cambiar de idioma no cambia la forma del
     Sofle); cada tecla solo le cambia el modo. */
  const FORMAS = [
    ["mitades", "p3.mitades", "e.splitT", "e.splitP"],
    ["columnas", "p3.columnas", "e.colT", "e.colP"],
    ["pulgares", "p3.pulgares", "e.pulT", "e.pulP"],
    ["hotswap", "p3.hotswap", "p.hotTitle", "p.hotText"],
  ];
  let forma = 0;
  const dibujo = CK_DIBUJO.montar($("#dibujo"), "sofle", FORMAS[0][0]);
  function pintaForma() {
    const [id, , titulo, texto] = FORMAS[forma], hot = id === "hotswap";
    $("#dibujo").hidden = hot;
    $("#hot").hidden = !hot;
    if (!hot) dibujo.modo(id);
    $("#formaT").innerHTML = T(titulo);
    $("#formaP").textContent = T(texto);
    $("#formaNota").textContent = hot ? T("p.hotNota") : T("e.dibNota").replace("%s", "Sofle");
    $("#formas").querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String(i === forma)));
  }
  function formas() {
    $("#formas").innerHTML = FORMAS.map(([, k]) =>
      `<button type="button" class="p-modo" aria-pressed="false"><i aria-hidden="true"></i>${T(k)}</button>`).join("");
    $("#formas").querySelectorAll("button").forEach((b, i) => b.onclick = () => { forma = i; pintaForma(); });
    pintaForma();
  }

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
  /* Los modos pasan solos cada seis segundos, solo con la luz a la vista
     y hasta que alguien toca uno. */
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
    document.querySelectorAll("[data-t-aria]").forEach(e => e.setAttribute("aria-label", T(e.dataset.tAria)));
    filtros();
    franjas();
    formas();
    modos();
    document.querySelectorAll(".ic-flecha").forEach(e => e.innerHTML = CK.icono("flecha", 16));
    CK.comparativa($("#comparativa"), null);
    CK.confianza($("#confianza"));
    $("#notaPrecios").textContent = CK.notaPrecios();
  }

  CK.montarSelectorIdioma();
  CK.pintarIdioma(pintar);
  pintar();
})();
