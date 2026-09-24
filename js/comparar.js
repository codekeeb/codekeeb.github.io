/* ============================================================
   CODEKEEB — el comparador
   ------------------------------------------------------------
   Se compara descartando: se empieza con los cinco y se quitan los que
   no interesan. Y el interruptor "solo lo que cambia" deja unicamente
   las filas en las que los que quedan se diferencian.

   Las filas salen del catalogo (`etiquetasDeFicha`), no de una lista
   escrita a mano: si un modelo estrena una fila en su ficha, aparece
   aqui sola. Mas una fila que no esta en ninguna ficha y es la primera
   pregunta de quien compra: como se vende (solo PCB, soldada,
   barebones o completo).
   ============================================================ */

(() => {
  const $ = s => document.querySelector(s);
  const T = CK.t;
  const NOMBRE_NIVEL = { pcb: "c.nPcb", soldada: "c.nSoldada", barebones: "c.nBarebones", completo: "c.nCompleto" };

  let activos = new Set(CK.productos().map(p => p.id));
  let soloDif = false;

  function cabecera(p) {
    const e = CK.stock(p), desde = CK.precioMinimo(p), varios = CK.niveles(p).length > 1;
    return `<th scope="col">
      <div class="cmp__col">
        <a class="cmp__foto" href="modelo.html?id=${p.id}" tabindex="-1" aria-hidden="true">
          <img src="${CK.foto(p, true)}" alt="" data-foco="${p.foco ?? 50}"></a>
        <a class="nombre cmp__nombre" href="modelo.html?id=${p.id}">${CK.rotulo(p)}</a>
        <span class="precio">${desde == null ? "" : `${varios ? `<small>${T("price.from")}</small> ` : ""}${CK.precio(desde)}`}</span>
        <span class="stock stock--${e.clase}">${CK.escapar(e.txt)}</span>
        <div class="cmp__acciones">
          <a class="btn" href="modelo.html?id=${p.id}">${T("p2.configurar")}</a>
          <button type="button" class="cmp__quitar" data-quitar="${p.id}"
                  aria-label="${T("c.quitar")}: ${CK.escapar(`${p.name} ${CK.L(p.version) || ""}`.trim())}">${T("c.quitar")}</button>
        </div>
      </div>
    </th>`;
  }

  function pintar() {
    const todos = CK.productos();
    const lista = todos.filter(p => activos.has(p.id));
    $("#soloDif").setAttribute("aria-pressed", String(soloDif));
    $("#todos").hidden = lista.length === todos.length;
    $("#cuenta").textContent = `${lista.length} ${T("d.of")} ${todos.length}`;
    $("#notaPrecios").textContent = CK.notaPrecios();

    $("#vacio").hidden = lista.length > 0;
    $("#tabla").parentElement.hidden = !lista.length;
    $("#vacio").textContent = T("d.nomatch");
    if (!lista.length) return;

    /* Una fila por dato. Si todos los que quedan dicen lo mismo, la fila
       se apaga (o desaparece con el interruptor): lo que queda en tinta
       es lo que de verdad decide entre ellos. */
    const fila = (etq, valores, html = false) => {
      const iguales = new Set(valores.map(v => v ?? "—")).size === 1 && lista.length > 1;
      if (soloDif && iguales) return "";
      return `<tr class="${iguales ? "igual" : ""}"><th scope="row">${CK.escapar(etq)}</th>
        ${valores.map(v => `<td>${v == null ? "—" : html ? v : CK.escapar(v)}</td>`).join("")}</tr>`;
    };

    const opciones = lista.map(p => CK.niveles(p).map(n =>
      `<span class="${n.agotado ? "cmp__agotado" : ""}">${T(NOMBRE_NIVEL[n.id])}</span>`).join("<br>"));

    $("#tabla").innerHTML = `
      <thead><tr><th scope="col"><span class="oculto">${T("d.model")}</span></th>${lista.map(cabecera).join("")}</tr></thead>
      <tbody>
        ${fila(T("c.opciones"), opciones, true)}
        ${CK.etiquetasDeFicha(lista).map(k => fila(CK.L(k), lista.map(p => CK.spec(p, k.es)))).join("")}
      </tbody>`;

    $("#tabla").querySelectorAll("[data-quitar]").forEach(b => b.onclick = () => {
      activos.delete(b.dataset.quitar);
      pintar();
    });
    CK.encuadrarTodo();
  }

  $("#soloDif").onclick = () => { soloDif = !soloDif; pintar(); };
  $("#todos").onclick = () => { activos = new Set(CK.productos().map(p => p.id)); pintar(); };

  CK.montarSelectorIdioma();
  CK.pintarIdioma(pintar);
  pintar();
})();
