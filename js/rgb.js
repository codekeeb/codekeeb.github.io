/* ============================================================
   CODEKEEB — los modos de iluminacion, sobre el teclado real
   ------------------------------------------------------------
   Antes esta region ensenaba una rejilla ortogonal de cuadraditos con un
   degradado borroso detras. No era el Sofle: no tenia splay, ni caida de
   menique, ni pulgares. Ahora dibuja `CK_SOFLE`, que es la geometria del
   shield, y le corre por encima los efectos que lleva el firmware.

   Los cinco modos, sus colores y sus duraciones salen del array `FX` de
   `keymap-studio/index.html`, que es lo que la placa ejecuta de verdad.
   Se han elegido los cinco que menos se parecen entre si; los otros cinco
   (sparkle, solid, ocean, sparkle oro, ripple rosa) se nombran en el
   texto sin animarse, para no repetir cinco veces lo mismo.

   El color por tecla se calcula en JavaScript y no en CSS a proposito:
   `ripple` y `heatmap` dependen de que tecla se pulsa, y eso no se puede
   escribir como un @keyframes. El bucle solo corre cuando la region esta
   en pantalla.
   ============================================================ */

const CK_RGB = (() => {
  /* Los cinco efectos, copiados del firmware. `tipo` dice como se calcula:
       lg = rampa lineal que recorre el teclado en un angulo
       rp = onda circular desde la tecla pulsada
       hm = mapa de calor: la tecla se enciende al pulsarla y se enfria  */
  const FX = [
    { id: "gradient", tipo: "lg", colores: [[160,100,50],[280,100,50],[20,100,50]], angulo: 15, dur: 8,   ancho: 255 },
    { id: "ripple",   tipo: "rp", colores: [[200,100,50]],                          dur: 800, ancho: 30 },
    { id: "fire",     tipo: "lg", colores: [[0,100,45],[25,100,50],[45,100,55]],    angulo: 90, dur: 4,  ancho: 255 },
    { id: "sunset",   tipo: "lg", colores: [[25,100,50],[355,100,50],[330,100,50],[285,100,50],[235,100,50]], angulo: 0, dur: 0, ancho: 300 },
    { id: "heatmap",  tipo: "hm", colores: [[190,100,55]],                          dur: 1200 },
  ];
  const porId = Object.fromEntries(FX.map(f => [f.id, f]));

  /* --- dibujo ------------------------------------------------------
     Cada mitad es una caja girada; las teclas van dentro con su propia
     rotacion. Es exactamente como lo monta el Studio, para que la forma
     no se vaya separando de la del editor. */
  function dibujar(destino) {
    const S = CK_SOFLE;
    destino.innerHTML = "";
    const escenario = document.createElement("div");
    escenario.className = "kb__escena";
    escenario.style.width = S.ESCENARIO.w + "px";
    escenario.style.height = S.ESCENARIO.h + "px";

    const mitades = S.MITADES.map(m => {
      const d = document.createElement("div");
      d.className = "kb__mitad";
      d.style.cssText = `left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;transform:rotate(${m.rot}deg)`;
      escenario.appendChild(d);
      return d;
    });

    const teclas = [];
    S.TECLAS.forEach((g, i) => {
      if (!g) { teclas.push(null); return; }           /* los dos encoders */
      const [mitad, x, y, rot, ancho] = g;
      const el = document.createElement("i");
      el.className = "kb__tecla";
      el.style.cssText = `left:${x}px;top:${y}px;width:${ancho || S.KEY}px;height:${S.KEY}px`
        + (rot ? `;transform:rotate(${rot}deg)` : "");
      mitades[mitad].appendChild(el);
      /* El centro en coordenadas del escenario: hace falta para las
         rampas y las ondas, que no saben de mitades. */
      const m = S.MITADES[mitad], a = m.rot * Math.PI / 180;
      const cx = x + (ancho || S.KEY) / 2, cy = y + S.KEY / 2;
      teclas.push({
        el, i,
        X: m.x + cx * Math.cos(a) - cy * Math.sin(a),
        Y: m.y + cx * Math.sin(a) + cy * Math.cos(a),
      });
    });

    S.ENCODERS.forEach((e, n) => {
      const d = document.createElement("i");
      d.className = "kb__encoder";
      d.style.cssText = `left:${e.x + 7}px;top:${e.y + 7}px`;
      mitades[n].appendChild(d);
    });

    destino.appendChild(escenario);
    return { escenario, teclas: teclas.filter(Boolean) };
  }

  /* --- color -------------------------------------------------------- */
  const hsl = (h, s, l, a) => `hsl(${h.toFixed(0)} ${s}% ${l}% / ${a.toFixed(2)})`;

  /* Interpola la lista de colores del efecto en la posicion 0..1 de la
     rampa, dando la vuelta al final para que el bucle no de un tirón. */
  function rampa(cols, t) {
    const n = cols.length, p = ((t % 1) + 1) % 1 * n;
    const a = cols[Math.floor(p) % n], b = cols[(Math.floor(p) + 1) % n], f = p % 1;
    /* el tono se interpola por el camino corto, si no pasa por el gris */
    let dh = b[0] - a[0];
    if (dh > 180) dh -= 360; if (dh < -180) dh += 360;
    return [a[0] + dh * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }

  /* --- el bucle ------------------------------------------------------ */
  function montar(destino) {
    const { escenario, teclas } = dibujar(destino);
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fx = FX[0], t0 = performance.now(), rid = 0, visible = false;
    let ondas = [], calor = new Float32Array(teclas.length), proxima = 0;

    const diagonal = Math.hypot(CK_SOFLE.ESCENARIO.w, CK_SOFLE.ESCENARIO.h);

    function pinta(ahora) {
      const t = (ahora - t0) / 1000;

      /* Pulsaciones simuladas: ripple y heatmap no existen sin alguien
         escribiendo, asi que se teclea a un ritmo humano (unas 6 por
         segundo) en teclas al azar. */
      if ((fx.tipo === "rp" || fx.tipo === "hm") && ahora > proxima) {
        proxima = ahora + 110 + Math.random() * 90;
        const k = teclas[(Math.random() * teclas.length) | 0];
        if (fx.tipo === "rp") { ondas.push({ x: k.X, y: k.Y, t: ahora }); if (ondas.length > 5) ondas.shift(); }
        else calor[k.i] = 1;
      }
      ondas = ondas.filter(o => ahora - o.t < fx.dur * 2.2);

      const ang = (fx.angulo || 0) * Math.PI / 180;
      const ux = Math.cos(ang), uy = Math.sin(ang);

      for (const k of teclas) {
        let h, s, l, a = 1;
        if (fx.tipo === "lg") {
          const d = (k.X * ux + k.Y * uy) / fx.ancho;
          const avance = fx.dur ? t / fx.dur : 0;
          [h, s, l] = rampa(fx.colores, d - avance);
        } else if (fx.tipo === "rp") {
          [h, s, l] = fx.colores[0]; a = 0.08;
          for (const o of ondas) {
            const edad = (ahora - o.t) / fx.dur;
            const radio = edad * diagonal * 0.55;
            const dist = Math.abs(Math.hypot(k.X - o.x, k.Y - o.y) - radio);
            if (dist < fx.ancho * 3) a = Math.max(a, (1 - dist / (fx.ancho * 3)) * (1 - edad));
          }
        } else {                                     /* heatmap */
          calor[k.i] = Math.max(0, calor[k.i] - 16 / fx.dur);
          const c = calor[k.i];
          h = fx.colores[0][0] - c * 190;            /* de cian a rojo */
          s = 100; l = 30 + c * 30; a = 0.1 + c * 0.9;
        }
        k.el.style.setProperty("--luz", hsl(h, s, l, a));
      }
      if (!quieto && visible) rid = requestAnimationFrame(pinta);
    }

    /* Solo corre lo que se ve: cinco teclados animandose a la vez fuera
       de pantalla es gastar bateria para nada. */
    new IntersectionObserver(es => {
      visible = es[0].isIntersecting;
      if (visible && !quieto) { rid = requestAnimationFrame(pinta); }
      else { cancelAnimationFrame(rid); }
    }, { rootMargin: "120px" }).observe(destino);

    /* El escenario mide 1520x666 fijos, que son las unidades del layout.
       Se escala entero en vez de recalcular cada tecla: asi las
       coordenadas siguen siendo las del shield y no se deforman. */
    function escalar() {
      const w = destino.clientWidth;
      if (w) escenario.style.transform = `scale(${w / CK_SOFLE.ESCENARIO.w})`;
    }
    escalar();
    let temp;
    addEventListener("resize", () => { clearTimeout(temp); temp = setTimeout(escalar, 120); }, { passive: true });

    pinta(performance.now());

    return {
      escenario,
      /* cambiar de modo reinicia el reloj: si no, un efecto lento entra
         por la mitad y parece que se ha saltado el principio */
      modo(id) {
        if (!porId[id] || fx === porId[id]) return;
        fx = porId[id]; t0 = performance.now(); ondas = []; calor.fill(0);
        if (quieto || !visible) pinta(performance.now());
      },
    };
  }

  return { FX, montar };
})();
