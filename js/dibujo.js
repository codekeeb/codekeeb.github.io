/* ============================================================
   CODEKEEB — el teclado dibujado, para explicarlo
   ------------------------------------------------------------
   Para explicar cada principio (split, columnas, pulgares) hace falta
   el teclado con la parte que cuenta encendida. No tenemos renders, y
   las fotos no sirven para eso: estan hechas sobre mesas con vineteado
   y no hay forma de recortarlas limpias. Asi que se dibuja a partir de
   la geometria REAL de cada teclado (js/geometria.js), y la foto se
   queda para lo que hace mejor: probar que el teclado existe.

   Solo las teclas, sin carcasa: el contorno negro alrededor de cada
   tecla pesaba mas que las teclas y ensuciaba la forma (Ernesto, 24 sep
   2026).

   Tres cosas que se pueden encender, cada una con su clase en el <svg>:
     dib--mitades   las dos mitades se juntan y se separan
     dib--columnas  las columnas se encienden de fuera adentro
     dib--pulgares  la fila de los pulgares
   ============================================================ */

const CK_DIBUJO = (() => {
  const NS = "http://www.w3.org/2000/svg";
  /* Hueco entre las dos mitades cuando se juntan, en unidades del Studio
     (una tecla mide 86 y entre teclas hay 4): lo justo para que se lea
     como un teclado de una pieza sin que se toque nada. */
  const HUECO = 10;
  /* Cuanto se abren respecto a la posicion del editor. */
  const ABRE = 50;

  /* Esquinas de una tecla, ya giradas y llevadas al escenario. Sirven
     para ajustar el viewBox al teclado (el lienzo del Studio tiene mucho
     aire) y para calcular cuanto se pueden juntar las mitades. */
  function esquinas(g, M, KEY) {
    const [mitad, x, y, rot, ancho] = g, w = ancho || KEY, h = KEY;
    const m = M[mitad];
    const cx = x + w / 2, cy = y + h / 2;
    const a = rot * Math.PI / 180, b = m.rot * Math.PI / 180;
    const pts = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
    return pts.map(([px, py]) => {
      /* la tecla gira sobre su centro */
      const X = cx + px * Math.cos(a) - py * Math.sin(a);
      const Y = cy + px * Math.sin(a) + py * Math.cos(a);
      /* y la mitad gira sobre el suyo */
      const mx = m.w / 2, my = m.h / 2;
      const X2 = mx + (X - mx) * Math.cos(b) - (Y - my) * Math.sin(b);
      const Y2 = my + (X - mx) * Math.sin(b) + (Y - my) * Math.cos(b);
      return [m.x + X2, m.y + Y2];
    });
  }

  /* Dos cuadrilateros convexos se tocan si ninguno de sus lados los
     separa (teorema del eje separador). */
  function chocan(p, q) {
    for (const poli of [p, q]) for (let i = 0; i < poli.length; i++) {
      const [x1, y1] = poli[i], [x2, y2] = poli[(i + 1) % poli.length];
      const nx = y1 - y2, ny = x2 - x1;
      const proy = pts => pts.map(([x, y]) => x * nx + y * ny);
      const a = proy(p), b = proy(q);
      if (Math.max(...a) <= Math.min(...b) || Math.max(...b) <= Math.min(...a)) return false;
    }
    return true;
  }

  /* Lo que cada mitad puede acercarse hacia el centro sin que ninguna
     tecla de una toque a una de la otra. Con un numero fijo (antes 90)
     los pulgares del Sofle se montaban, porque las mitades estan giradas
     y es abajo donde se encuentran. */
  function juntar(izq, der) {
    const mueve = (poli, dx) => poli.map(([x, y]) => [x + dx, y]);
    const choca = t => izq.some(p => der.some(q =>
      chocan(mueve(p, t + HUECO / 2), mueve(q, -t - HUECO / 2))));
    let lejos = -400, cerca = 400;               // lejos no choca, cerca si
    for (let i = 0; i < 40; i++) {
      const t = (lejos + cerca) / 2;
      if (choca(t)) cerca = t; else lejos = t;
    }
    return Math.floor(lejos);
  }

  function montar(destino, tablero, modo) {
    const G = CK_GEO[tablero];
    const { KEY, MITADES: M, TECLAS } = G;

    /* Rango de columna de cada tecla de la rejilla, de fuera (menique) a
       dentro, igual en las dos mitades: asi el barrido avanza a la vez por
       los dos lados, como los dedos. */
    const xs = [0, 1].map(h => [...new Set(TECLAS.slice(0, G.pulgares).filter(k => k && k[0] === h).map(k => k[1]))].sort((a, b) => a - b));
    const col = k => { const i = xs[k[0]].indexOf(k[1]); return k[0] === 0 ? i : xs[1].length - 1 - i; };

    const polis = [0, 1].map(h => TECLAS.filter(k => k && k[0] === h).map(k => esquinas(k, M, KEY)));
    const junto = juntar(polis[0], polis[1]);

    /* El viewBox cubre las dos posiciones extremas (abiertas del todo), y
       un poco de aire abajo para la sombra de las teclas. */
    const pts = polis.flat(2);
    const x0 = Math.min(...pts.map(p => p[0])) - ABRE - 20, x1 = Math.max(...pts.map(p => p[0])) + ABRE + 20;
    const y0 = Math.min(...pts.map(p => p[1])) - 20, y1 = Math.max(...pts.map(p => p[1])) + 30;

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `${x0} ${y0} ${x1 - x0} ${y1 - y0}`);
    svg.setAttribute("class", "dib");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", G.nombre);
    /* el CSS mueve las mitades entre estas dos distancias */
    svg.style.setProperty("--junto", `${junto}px`);
    svg.style.setProperty("--abre", `${-ABRE}px`);

    let html = "";
    [0, 1].forEach(h => {
      const m = M[h], teclas = TECLAS.map((k, i) => [k, i]).filter(([k]) => k && k[0] === h);
      const giro = ([, x, y, rot, ancho]) => rot ? `transform="rotate(${rot} ${x + (ancho || KEY) / 2} ${y + KEY / 2})"` : "";
      const tecla = (k, i) => { const [, x, y, , ancho] = k, w = ancho || KEY, pulgar = i >= G.pulgares;
        /* La cara de arriba es mas pequena y va un poco mas alta que la base:
           es el hueco del keycap, y es lo que hace que se lea como una tecla
           y no como un cuadrado. */
        return `<g class="dib__tecla${pulgar ? " dib__tecla--pulgar" : ""}" style="--c:${pulgar ? 0 : col(k)}" ${giro(k)}>
          <rect class="dib__base" x="${x}" y="${y}" width="${w}" height="${KEY}" rx="12"/>
          <rect class="dib__cara" x="${x + 8}" y="${y + 5}" width="${w - 16}" height="${KEY - 18}" rx="8"/></g>`; };
      /* El <g> de fuera es el que se desliza (lo mueve el CSS); el de dentro
         lleva el giro de la mitad como atributo. Si el CSS moviera el mismo
         <g>, su `transform` pisaria el giro. */
      html += `<g class="dib__desliza dib__desliza--${h}">
        <g transform="translate(${m.x} ${m.y}) rotate(${m.rot} ${m.w / 2} ${m.h / 2})">
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
