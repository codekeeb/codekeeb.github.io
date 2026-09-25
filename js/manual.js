/* ============================================================
   CODEKEEB — el manual de un modelo (manual.html?id=)
   ------------------------------------------------------------
   Como un manual de aparato: el modelo en su color arriba, un indice de
   capitulos fijo a la izquierda y el texto a la derecha, con las capas
   del teclado dibujadas tecla a tecla. El contenido sale de
   js/manuales.js (uno por firmware); lo que cambia entre modelos del
   mismo firmware (si tiene pantallas) lo dice su ficha en data.js.
   ============================================================ */

(() => {
  const $ = s => document.querySelector(s);
  const T = CK.t, L = v => CK.L(v), esc = CK.escapar;
  const params = new URLSearchParams(location.search);
  const p = CK.productos().find(x => x.id === params.get("id"));
  const man = p && p.manual && CK_MANUALES[p.manual];

  /* Solo los modelos que tienen manual salen en la tira: un enlace que
     lleva a "en preparacion" no ayuda a nadie. */
  function modelos() {
    $("#modelos").closest("nav").setAttribute("aria-label", T("man.modelos"));
    $("#modelos").innerHTML = CK.productos().filter(q => q.manual).map(q => {
      const c = q.color || { fondo: "#111111", tinta: "#ffffff" };
      return `<li><a class="f-chip" href="manual.html?id=${q.id}" style="--c:${c.fondo};--ct:${c.tinta}"${q === p ? ' aria-current="page"' : ""}>
        <i aria-hidden="true"></i>${esc(q.corto || q.name)}</a></li>`;
    }).join("");
  }

  if (p) {
    const color = p.color || { fondo: "#2b3bf5", tinta: "#ffffff" };
    document.documentElement.style.setProperty("--modelo", color.fondo);
    document.documentElement.style.setProperty("--modelo-tinta", color.tinta);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color.fondo);
  }

  /* ---------- marcado de los textos ----------
     [TECLA] sale como una tecla y **texto** en negrita. Se escapa antes,
     asi que el contenido no puede meter HTML propio. */
  function texto(v) {
    return esc(L(v))
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]/g, "<kbd>$1</kbd>");
  }

  /* ---------- las capas, tecla a tecla ---------- */
  function tecla(k) {
    if (k === null) return `<span class="m-t m-t--hueco" aria-hidden="true"></span>`;
    let o = typeof k === "object" && !("es" in k) ? k : { t: k };
    if (o.pant && !tiene("pantallas")) o = { t: "·", e: true };
    const txt = L(o.t);
    const cls = ["m-t"];
    if (txt === "·") cls.push("m-t--igual");
    if (o.f) cls.push("m-t--fn");
    if (o.m) cls.push("m-t--mantenida");
    if (o.e) cls.push("m-t--encoder");
    if (txt.length > 5) cls.push("m-t--largo");
    const hold = o.h ? `<small>${esc(L(o.h))}</small>` : "";
    return `<span class="${cls.join(" ")}">${esc(txt)}${hold}</span>`;
  }
  function mitad(h, lado) {
    const cols = Math.max(...h.filas.map(f => f.length));
    const filas = h.filas.map(f => f.map(tecla).join("")).join("");
    /* los pulgares van en su propia fila, desde la columna que toque */
    const pul = Array.from({ length: cols }, (_, i) => {
      const j = i - h.pulgares.desde;
      return j >= 0 && j < h.pulgares.teclas.length ? tecla(h.pulgares.teclas[j]) : tecla(null);
    }).join("");
    return `<div class="m-mitad m-mitad--${lado}" style="--cols:${cols}">${filas}${pul}</div>`;
  }
  function capa(id, nota, primera) {
    const c = man.capas[id];
    const leyenda = primera ? `<p class="m-leyenda">${T("man.leyenda")}</p>` : "";
    return `<figure class="m-capa">
      <div class="m-lamina" role="img" aria-label="${esc(T("man.capa"))} ${esc(c.nombre)}">
        <span class="m-lamina__nombre">${esc(c.nombre)}</span>
        <div class="m-teclado">${mitad(c.izq, "izq")}${mitad(c.der, "der")}</div>
      </div>
      ${nota ? `<figcaption>${texto(nota)}</figcaption>` : ""}${leyenda}
    </figure>`;
  }

  /* ---------- los bloques ---------- */
  const tiene = que => que !== "pantallas" || !!CK.spec(p, "Pantallas");
  function enlace([txt, url]) {
    const href = url === "@releases" ? man.releases : url === "@repo" ? man.repo : url;
    const fuera = /^https?:/.test(href);
    return `<a class="f-enlace" href="${esc(href)}"${fuera ? ' target="_blank" rel="noopener"' : ""}>${esc(L(txt))}<span class="ic-flecha">${CK.icono(fuera ? "externo" : "flecha", 16)}</span></a>`;
  }
  let capas = 0;
  function bloque(b) {
    if (b.solo && !tiene(b.solo)) return "";
    if (b.capa) return capa(b.capa, b.p, capas++ === 0);
    if (b.p) return `<p>${texto(b.p)}</p>`;
    /* el texto del paso va en su propio <span>: el <li> es una rejilla
       (numero y texto) y cada <kbd> suelto se volvia una celda */
    if (b.pasos) return `<ol class="m-pasos">${b.pasos.map(x => `<li><span>${texto(x)}</span></li>`).join("")}</ol>`;
    if (b.nota) return `<p class="m-nota">${texto(b.nota)}</p>`;
    if (b.enlaces) return `<p class="m-enlaces">${b.enlaces.map(enlace).join("")}</p>`;
    if (b.tabla) {
      const cab = b.tabla.cab.map(x => `<th scope="col">${texto(x)}</th>`).join("");
      const celda = x => x && x.pant ? (tiene("pantallas") ? x.pant : "—") : x;
      const filas = b.tabla.filas.map(f => `<tr>${f.map(celda).map((x, i) => i ? `<td>${texto(x)}</td>` : `<th scope="row">${texto(x)}</th>`).join("")}</tr>`).join("");
      return `<div class="m-tabla" tabindex="0" role="region" aria-label="${esc(L(b.tabla.cab[0]))}"><table class="f-datos"><thead><tr>${cab}</tr></thead><tbody>${filas}</tbody></table></div>`;
    }
    return "";
  }

  /* ---------- la pagina ---------- */
  function placa() {
    const tit = p.title || { model: p.name, trait: p.version };
    const nombre = p.corto || p.name;
    document.title = `${T("man.titulo")} · ${nombre} — Codekeeb`;
    const datos = man ? [
      ["man.firmware", man.firmware], ["man.controlador", man.controlador],
      ["man.conexion", CK.spec(p, "Conexión")], ["man.bateria", CK.spec(p, "Batería")],
    ].filter(([, v]) => v) : [];
    return `<section class="m-placa" aria-labelledby="h-manual">
      <div class="f-in m-placa__in">
        <h1 class="m-placa__nombre" id="h-manual">${esc(tit.model)}</h1>
        <p class="m-placa__sub">${T("man.titulo")} · ${esc(L(tit.trait) || "")}</p>
        ${datos.length ? `<dl class="m-datos">${datos.map(([k, v]) => `<div><dt>${T(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
      </div>
    </section>`;
  }

  function pintar() {
    modelos();
    if (!p) {
      $("#pagina").innerHTML = `<section class="f-seccion"><div class="f-in">
        <h1 class="f-h2">${T("pdp.notFound")}</h1><p class="f-lede">${esc(params.get("id") || "")}</p>
        <p style="margin-top:20px"><a class="f-tecla f-tecla--tinta" href="/#tienda">${T("pdp.backToModels")}</a></p></div></section>`;
      return;
    }
    if (!man) {
      /* Sin manual todavia (los Corne): se dice, no se inventan pasos. */
      $("#pagina").innerHTML = placa() + `<section class="f-seccion"><div class="f-in">
        <h2 class="f-h2">${T("man.pendT")}</h2><p class="f-lede">${T("man.pendP")}</p>
        <p style="margin-top:20px"><a class="f-tecla f-tecla--tinta" href="modelo.html?id=${p.id}">${T("man.verFicha")}</a></p></div></section>`;
      return;
    }
    capas = 0;
    const caps = man.capitulos.filter(c => !c.solo || tiene(c.solo));
    const num = i => String(i + 1).padStart(2, "0");
    const indice = caps.map((c, i) =>
      `<li><a href="#${c.id}"><span class="m-num">${num(i)}</span>${esc(L(c.titulo))}</a></li>`).join("");
    const cuerpo = caps.map((c, i) => `<section class="m-cap" id="${c.id}" aria-labelledby="h-${c.id}">
        <h2 id="h-${c.id}"><span class="m-num">${num(i)}</span>${esc(L(c.titulo))}</h2>
        ${c.bloques.map(bloque).join("")}
      </section>`).join("");
    $("#pagina").innerHTML = placa() + `<div class="f-in m-cuerpo">
      <nav class="m-indice" aria-label="${esc(T("man.indice"))}"><ol>${indice}</ol></nav>
      <div class="m-texto">${cuerpo}
        <p class="m-pie"><a class="f-enlace" href="modelo.html?id=${p.id}">${T("man.verFicha")}<span class="ic-flecha">${CK.icono("flecha", 16)}</span></a></p>
      </div>
    </div>`;
    seguir();
  }

  /* El indice marca el capitulo que se esta leyendo. */
  let obs;
  function seguir() {
    obs?.disconnect();
    const enlaces = [...document.querySelectorAll(".m-indice a")];
    obs = new IntersectionObserver(es => {
      es.filter(e => e.isIntersecting).forEach(e => {
        enlaces.forEach(a => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".m-cap").forEach(s => obs.observe(s));
  }

  /* En el movil la cabecera ocupa dos pisos: el indice se pega justo
     debajo, midiendola en vez de suponer su alto. */
  const alto = () => document.documentElement.style.setProperty("--alto-cab", $(".f-top").offsetHeight + "px");
  addEventListener("resize", alto, { passive: true });

  CK.montarSelectorIdioma();
  CK.pintarIdioma(pintar);
  pintar();
  alto();
  $("#notaPrecios") && ($("#notaPrecios").textContent = CK.notaPrecios());
})();
