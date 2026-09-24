/* ============================================================
   CODEKEEB — pagina 404
   ------------------------------------------------------------
   GitHub Pages sirve 404.html en cualquier ruta que no exista, a
   cualquier profundidad (/sofle, /tienda/corne/...). Por eso aqui todo
   va con ruta absoluta, y las fotos llevan "/" delante. Quien llega a
   un enlace roto casi siempre buscaba un teclado: se le ensenan los cinco.
   ============================================================ */

(() => {
  const lista = document.getElementById("perdida");
  function pintar() {
    document.title = `${CK.t("n.titulo")} — Codekeeb`;
    lista.innerHTML = CK.productos().map(p => `<li><a href="/modelo.html?id=${p.id}">
      <img src="/${CK.foto(p, true)}" alt="" loading="lazy">
      <span class="nombre">${CK.rotulo(p)}</span></a></li>`).join("");
    document.getElementById("notaPrecios").textContent = CK.notaPrecios();
  }
  CK.montarSelectorIdioma();
  CK.pintarIdioma(pintar);
  pintar();
})();
