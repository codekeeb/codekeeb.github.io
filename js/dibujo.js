/* ============================================================
   CODEKEEB — el teclado dibujado, para explicarlo
   ------------------------------------------------------------
   Ergodox explica cada principio (split, columnas, pulgares) con un
   render del teclado y la parte que cuenta encendida. Nosotros no
   tenemos renders, y las fotos no sirven para eso: estan hechas sobre
   mesas con vineteado y no hay forma de recortarlas limpias (medido: los
   bordes de cada foto tienen hasta tres grises distintos). Asi que el
   "render" se dibuja a partir de la geometria REAL de cada teclado
   (js/geometria.js), y la foto se queda para lo que hace mejor: probar
   que el teclado existe.

   La carcasa no es un rectangulo: es la union de todas las teclas
   ensanchadas, asi que sigue el escalonado de las columnas y el abanico
   de los pulgares, que es la silueta de la placa de verdad.

   Tres cosas que se pueden encender, cada una con su clase en el <svg>:
     dib--mitades   las dos mitades se separan hasta el ancho de hombros
     dib--columnas  las columnas se encienden de fuera adentro
     dib--pulgares  la fila de los pulgares
   ============================================================ */

const CK_DIBUJO = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const PAD = 17;            /* lo que sobresale la carcasa de cada tecla */

  /* Esquinas de una tecla, ya giradas y llevadas al escenario. Hace falta
     para ajustar el viewBox al teclado y no al lienzo de 1520x666 del
     Studio, que tiene mucho aire alrededor. */
  function esquinas(g, M, KEY) {
    const [mitad, x, y, rot, ancho] = g, w = ancho || KEY, h = KEY;
    const m = M[mitad];
    const cx = x + w / 2, cy = y + h / 2;
    const a = rot * Math.PI / 180, b = m.rot * Math.PI / 180;
    const pts = [[-w / 2 - PAD, -h / 2 - PAD], [w / 2 + PAD, -h / 2 - PAD], [w / 2 + PAD, h / 2 + PAD], [-w / 2 - PAD, h / 2 + PAD]];
    return pts.map(([px, py]) => {
      /* la tecla gira sobre su centro */
      let X = cx + px * Math.cos(a) - py * Math.sin(a);
      let Y = cy + px * Math.sin(a) + py * Math.cos(a);
      /* y la mitad gira sobre el suyo */
      const mx = m.w / 2, my = m.h / 2;
      const X2 = mx + (X - mx) * Math.cos(b) - (Y - my) * Math.sin(b);
      const Y2 = my + (X - mx) * Math.sin(b) + (Y - my) * Math.cos(b);
      return [m.x + X2, m.y + Y2];
    });
  }

  function montar(destino, tablero, modo) {
    const G = CK_GEO[tablero];
    const { KEY, MITADES: M, TECLAS } = G;

    /* Rango de columna de cada tecla de la rejilla, de fuera (menique) a
       dentro, igual en las dos mitades: asi el barrido avanza a la vez por
       los dos lados, como los dedos. */
    const xs = [0, 1].map(h => [...new Set(TECLAS.slice(0, G.pulgares).filter(k => k && k[0] === h).map(k => k[1]))].sort((a, b) => a - b));
    const col = k => { const i = xs[k[0]].indexOf(k[1]); return k[0] === 0 ? i : xs[1].length - 1 - i; };

    const pts = TECLAS.filter(Boolean).flatMap(k => esquinas(k, M, KEY));
    const x0 = Math.min(...pts.map(p => p[0])) - 60, x1 = Math.max(...pts.map(p => p[0])) + 60;
    const y0 = Math.min(...pts.map(p => p[1])) - 30, y1 = Math.max(...pts.map(p => p[1])) + 70;

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `${x0} ${y0} ${x1 - x0} ${y1 - y0}`);
    svg.setAttribute("class", "dib");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", G.nombre);

    const id = "s" + Math.random().toString(36).slice(2, 7);
    let html = `<defs><filter id="${id}" x="-10%" y="-10%" width="120%" height="140%">
        <feDropShadow dx="0" dy="22" stdDeviation="20" flood-color="#141828" flood-opacity=".22"/></filter></defs>`;

    [0, 1].forEach(h => {
      const m = M[h], teclas = TECLAS.map((k, i) => [k, i]).filter(([k]) => k && k[0] === h);
      /* Cada tecla (y su trozo de carcasa) gira sobre SU centro: por eso va
         en su propio grupo con el giro, y dentro las coordenadas son las de
         la tecla sin girar. */
      const giro = ([, x, y, rot, ancho]) => rot ? `transform="rotate(${rot} ${x + (ancho || KEY) / 2} ${y + KEY / 2})"` : "";
      const caja = k => { const [, x, y, , ancho] = k, w = ancho || KEY;
        return `<rect x="${x - PAD}" y="${y - PAD}" width="${w + 2 * PAD}" height="${KEY + 2 * PAD}" rx="26" ${giro(k)}/>`; };
      const tecla = (k, i) => { const [, x, y, , ancho] = k, w = ancho || KEY, pulgar = i >= G.pulgares;
        /* La cara de arriba es mas pequena y va un poco mas alta que la base:
           es el hueco del keycap, y es lo que hace que se lea como una tecla
           y no como un cuadrado. */
        return `<g class="dib__tecla${pulgar ? " dib__tecla--pulgar" : ""}" style="--c:${pulgar ? 0 : col(k)}" ${giro(k)}>
          <rect class="dib__base" x="${x}" y="${y}" width="${w}" height="${KEY}" rx="11"/>
          <rect class="dib__cara" x="${x + 7}" y="${y + 4}" width="${w - 14}" height="${KEY - 16}" rx="8"/></g>`; };
      /* El <g> de fuera es el que se desliza (lo mueve el CSS); el de dentro
         lleva el giro de la mitad como atributo. Si el CSS moviera el mismo
         <g>, su `transform` pisaria el giro. */
      html += `<g class="dib__desliza dib__desliza--${h}">
        <g transform="translate(${m.x} ${m.y}) rotate(${m.rot} ${m.w / 2} ${m.h / 2})">
          <g class="dib__caja" filter="url(#${id})">${teclas.map(([k]) => caja(k)).join("")}</g>
          ${teclas.map(([k, i]) => tecla(k, i)).join("")}
        </g></g>`;
    });
    svg.innerHTML = html;
    destino.replaceChildren(svg);

    const api = {
      modo(m) {
        svg.classList.remove("dib--mitades", "dib--columnas", "dib--pulgares");
        if (m) svg.classList.add("dib--" + m);
      },
    };
    api.modo(modo);
    return api;
  }

  return { montar };
})();
