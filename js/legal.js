/* ============================================================
   CODEKEEB — la pagina legal
   ------------------------------------------------------------
   Pinta los textos de legal-textos.js en el idioma elegido y rellena
   lo que depende de datos: el titular (data.js, CK_TITULAR), la fecha
   de los precios y lo que guarda el navegador, con botones para
   borrarlo. Nada de esto sale del navegador.
   ============================================================ */

(() => {
  const $ = s => document.querySelector(s);
  const T = CK.t;
  const SECCIONES = ["aviso", "privacidad", "cookies", "compras"];

  /* Un idioma sin alguna seccion dejaria esa parte en blanco sin avisar.
     Por consola, que es donde preview.mjs caza los errores. */
  for (const l of Object.keys(CK_LEGAL))
    for (const s of SECCIONES) if (!CK_LEGAL[l][s]) console.error(`legal: falta "${s}" en "${l}"`);

  const fecha = iso => new Intl.DateTimeFormat(CK.lang, { day: "numeric", month: "long", year: "numeric" })
    .format(new Date(iso + "T00:00:00"));
  const tienda = `<a href="${CK.tiendaURL}" target="_blank" rel="noopener">etsy.com/shop/CodeKeeb</a>`;

  /* Lo que exige el aviso legal y todavia no esta se dice tal cual: es
     preferible a un hueco que parezca un descuido o a un dato inventado. */
  function titular() {
    const CAMPOS = [["nombre", "l.nombre"], ["nif", "l.nif"], ["domicilio", "l.domicilio"], ["email", "l.email"], ["registro", "l.registro"]];
    const hay = CAMPOS.filter(([k]) => CK_TITULAR[k]);
    const falta = ["nombre", "nif", "domicilio", "email"].some(k => !CK_TITULAR[k]);
    const dl = hay.length ? `<dl class="legal__titular">${hay.map(([k, et]) => {
      const v = CK.escapar(CK_TITULAR[k]);
      return `<div><dt>${T(et)}</dt><dd>${k === "email" ? `<a href="mailto:${v}">${v}</a>` : v}</dd></div>`;
    }).join("")}</dl>` : "";
    return dl + (falta ? `<p class="legal__pendiente">${T("l.pendiente").replace("%s", tienda)}</p>` : "");
  }

  /* Lo que la tienda y el Studio guardan en el navegador. Si se anade una
     clave nueva en el codigo, se anade aqui: es lo que se le promete al
     visitante en la politica de cookies. */
  function tabla() {
    const FILAS = [
      ["ck-lang", "l.rIdioma", "l.tienda"],
      ["ck-pausa", "l.rPausa", "l.tienda"],
      ["ck.lang · ck.board · ck.symLayout · ck.ucMode", "l.rStudioAjustes", "Keymap Studio"],
      ["ck.keymap… · ck.shape… · ck.macros · ck.rgb", "l.rStudioDatos", "Keymap Studio"],
    ];
    /* En el movil la tabla se desplaza de lado: tiene que poder recibir el
       foco para moverla con el teclado, y decir que es. */
    return `<div class="tabla-env" tabindex="0" role="region" aria-label="${T("l.cookies")}"><table class="tabla legal__tabla">
      <thead><tr><th scope="col">${T("l.tNombre")}</th><th scope="col">${T("l.tPara")}</th>
        <th scope="col">${T("l.tDonde")}</th><th scope="col">${T("l.tDura")}</th></tr></thead>
      <tbody>${FILAS.map(([k, para, donde]) => `<tr><th scope="row"><code>${k}</code></th><td>${T(para)}</td>
        <td>${donde.startsWith("l.") ? T(donde) : donde}</td><td>${T("l.hasta")}</td></tr>`).join("")}</tbody>
    </table></div>`;
  }

  const borrar = () => `<div class="legal__borrar">
      <button type="button" class="btn btn--linea" data-borrar="tienda">${T("l.borrarPref")}</button>
      <button type="button" class="btn btn--linea" data-borrar="studio">${T("l.borrarStudio")}</button>
      <p class="legal__estado" id="borrado" role="status"></p>
    </div>`;

  /* Las preferencias de la tienda se borran sin preguntar: no se pierde
     nada que cueste rehacer. Lo del Studio si: son horas de keymap. */
  function borrarGuardado(que) {
    if (que === "studio" && !confirm(T("l.confirmaStudio"))) return;
    let n = 0;
    try {
      const claves = Object.keys(localStorage).filter(k =>
        que === "tienda" ? k === "ck-lang" || k === "ck-pausa" : k.startsWith("ck.") || k === "ck-lang" || k === "ck-pausa");
      claves.forEach(k => { localStorage.removeItem(k); n++; });
    } catch (e) { /* sin acceso al almacenamiento: no hay nada que borrar */ }
    $("#borrado").textContent = T(n ? "l.borrado" : "l.nada");
  }

  function pintar() {
    document.title = `${T("l.titulo")} — Codekeeb`;
    $("#actualizada").textContent = T("l.actualizada").replace("%d", fecha(CK_LEGAL_ACTUALIZADO));
    const txt = CK_LEGAL[CK.lang] || CK_LEGAL.es;
    SECCIONES.forEach(s => {
      $(`#${s} .legal__cuerpo`).innerHTML = txt[s]
        .replace("{{TITULAR}}", titular())
        .replace("{{TIENDA}}", tienda)
        .replace("{{FECHA}}", fecha(CK_PRICES_UPDATED))
        .replace("{{TABLA}}", tabla())
        .replace("{{BORRAR}}", borrar());
    });
    document.querySelectorAll("[data-borrar]").forEach(b => b.onclick = () => borrarGuardado(b.dataset.borrar));
    $("#notaPrecios").textContent = CK.notaPrecios();
  }

  CK.montarSelectorIdioma();
  CK.pintarIdioma(pintar);
  pintar();
  /* Al llegar con #privacidad, el ancla existia antes de pintar el texto:
     se vuelve a colocar cuando ya tiene su altura real. */
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
