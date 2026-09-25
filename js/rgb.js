/* ============================================================
   CODEKEEB — los modos de iluminacion, portados del firmware
   ------------------------------------------------------------
   La primera version de este archivo calculaba un color por tecla a
   partir de su posicion x,y. Estaba mal, y se veia: el Sofle no lleva un
   LED por tecla, lleva **30 de underglow por mitad** y varias teclas
   comparten LED (ver `js/sofle-led.js`). Sesenta valores independientes
   convertian un degradado en confeti.

   Asi que esto ya no es una aproximacion: es el mismo algoritmo que corre
   el editor, `fxFrame`, con sus mismas constantes — 30 fotogramas por
   segundo, las mismas coordenadas de LED, la misma interpolacion en HSL y
   los mismos colores y duraciones del array FX del firmware.

   Y lo que se dibuja tambien cambia: un LED apagado NO pinta halo. Antes
   un ripple fuera de la onda dibujaba un resplandor negro alrededor de la
   tecla; ahora simplemente no hay luz, que es lo que hace que las teclas
   se vean negras como el fondo.
   ============================================================ */

const CK_RGB = (() => {
  const FPS = 30;                       /* el firmware va a 30, no a 60 */

  /* Los cinco efectos, copiados del array FX del Studio. */
  const FX = [
    { id: "gradient", tipo: "lg", cols: [[160,100,50],[280,100,50],[20,100,50]], ang: 15, dur: 8,   w: 255 },
    { id: "ripple",   tipo: "rp", cols: [[200,100,50]],                          dur: 800, w: 30 },
    { id: "fire",     tipo: "lg", cols: [[0,100,45],[25,100,50],[45,100,55]],    ang: 90, dur: 4,   w: 255 },
    { id: "sunset",   tipo: "lg", cols: [[25,100,50],[355,100,50],[330,100,50],[285,100,50],[235,100,50]], ang: 0, dur: 0, w: 300 },
    { id: "heatmap",  tipo: "hm", cols: [[190,100,55]],                          dur: 1200 },
  ];
  const porId = Object.fromEntries(FX.map(f => [f.id, f]));

  const lim = (v, a, b) => Math.min(b, Math.max(a, v));
  /* Interpola en HSL por el camino corto del tono: por el largo pasaria
     por el gris y el degradado se ensuciaria en el medio. */
  function lerp(c0, c1, t) {
    let dh = c1[0] - c0[0];
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;
    return [c0[0] + dh * t, c0[1] + (c1[1] - c0[1]) * t, c0[2] + (c1[2] - c0[2]) * t];
  }
  function hsl2rgb(h, s, l) {
    h = ((h % 360) + 360) % 360; s = lim(s, 0, 100) / 100; l = lim(l, 0, 100) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; } else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; } else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; } else { r = c; g = 0; b = x; }
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
  }

  /* --- dibujo del teclado ------------------------------------------- */
  function dibujar(destino) {
    const S = CK_SOFLE;
    destino.innerHTML = "";
    const escena = document.createElement("div");
    escena.className = "kb__escena";
    escena.style.width = S.ESCENARIO.w + "px";
    escena.style.height = S.ESCENARIO.h + "px";
    const mitades = S.MITADES.map(m => {
      const d = document.createElement("div");
      d.className = "kb__mitad";
      d.style.cssText = `left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;transform:rotate(${m.rot}deg)`;
      escena.appendChild(d);
      return d;
    });
    /* Un elemento por posicion del keymap, con hueco para los dos clicks
       de encoder, que ocupan posicion pero no son teclas. Sin encoders
       dibujados: no aportan nada a lo que cuenta esta region. */
    const teclas = S.TECLAS.map((g, i) => {
      if (!g) return null;
      const [mitad, x, y, rot, ancho] = g;
      const el = document.createElement("i");
      el.className = "kb__tecla";
      el.style.cssText = `left:${x}px;top:${y}px;width:${ancho || S.KEY}px;height:${S.KEY}px`
        + (rot ? `;transform:rotate(${rot}deg)` : "");
      mitades[mitad].appendChild(el);
      return { el, mitad, led: (mitad ? CK_LED.KP_R : CK_LED.KP_L)[i] };
    });
    destino.appendChild(escena);
    return { escena, teclas: teclas.filter(Boolean) };
  }

  /* --- el motor de efectos, portado de fxFrame ----------------------- */
  const estadoMitad = () => ({ off: 0, evs: [], calor: new Float32Array(30) });

  function montar(destino) {
    const { escena, teclas } = dibujar(destino);
    /* Quieto si el sistema pide poco movimiento o el visitante ha pulsado
       pausa: entonces se pinta un solo fotograma y se para. */
    const quieto = () => CK.quieto();
    let fx = null, est = [estadoMitad(), estadoMitad()];
    let visible = false, rid = 0, ultimo = 0, proxima = 0;
    const ultimoColor = new Array(teclas.length).fill("");

    function fotograma() {
      const salida = [[], []];
      for (let m = 0; m < 2; m++) {
        const s = est[m], PIX = m ? CK_LED.PIX_R : CK_LED.PIX_L, C = salida[m], n = PIX.length;
        if (fx.tipo === "lg") {
          const a = fx.ang * Math.PI / 180, cos = Math.cos(a), sin = Math.sin(a);
          const gw = fx.w, nc = fx.cols.length, cw = gw / nc;
          if (fx.dur > 0) s.off = (s.off + gw / (fx.dur * FPS)) % gw;
          for (let i = 0; i < n; i++) {
            const x = PIX[i][0] * cos + PIX[i][1] * sin;
            const d = ((gw + x - s.off) % gw + gw) % gw;
            const desde = Math.floor(d / cw) % nc, paso = (d - Math.floor(d / cw) * cw) / cw;
            C[i] = lerp(fx.cols[desde], fx.cols[(desde + 1) % nc], paso);
          }
        } else if (fx.tipo === "rp") {
          const dpf = (255 * 1000 / fx.dur) / FPS, rw = fx.w / 2, marco = Math.round(255 / dpf);
          for (let i = 0; i < n; i++) C[i] = null;
          s.evs.forEach(ev => {
            if (ev.f >= marco) return;
            const ed = dpf * ev.f, p = PIX[ev.led];
            for (let i = 0; i < n; i++) {
              const dx = PIX[i][0] - p[0], dy = PIX[i][1] - p[1];
              const dif = Math.abs(Math.sqrt(dx * dx + dy * dy) - ed);
              if (dif < rw) {
                const base = C[i] || [fx.cols[0][0], fx.cols[0][1], 0];
                C[i] = [base[0], base[1], Math.min(100, base[2] + fx.cols[0][2] * (1 - dif / rw))];
              }
            }
            ev.f++;
          });
          s.evs = s.evs.filter(ev => ev.f < marco);
          for (let i = 0; i < n; i++) if (!C[i]) C[i] = [fx.cols[0][0], fx.cols[0][1], 0];
        } else {                                        /* heatmap */
          const baja = (1000 / FPS) / fx.dur;
          for (let i = 0; i < n; i++) {
            s.calor[i] = Math.max(0, s.calor[i] - baja);
            C[i] = [fx.cols[0][0], fx.cols[0][1], fx.cols[0][2] * s.calor[i]];
          }
        }
      }
      return salida;
    }

    /* Ripple y heatmap no existen sin alguien escribiendo, asi que se
       teclea a un ritmo humano en teclas al azar. */
    function tecleaAlgo(ahora) {
      if (!fx || (fx.tipo !== "rp" && fx.tipo !== "hm") || ahora < proxima) return;
      proxima = ahora + 130 + Math.random() * 120;
      const k = teclas[(Math.random() * teclas.length) | 0];
      const s = est[k.mitad];
      if (fx.tipo === "rp") { s.evs.push({ led: k.led, f: 0 }); if (s.evs.length > 6) s.evs.shift(); }
      else s.calor[k.led] = 1;
    }

    function apaga(k, i) {
      if (ultimoColor[i] === "") return;
      ultimoColor[i] = "";
      k.el.style.removeProperty("--luz");
      k.el.style.boxShadow = "";
    }

    function pinta(ahora) {
      /* A 30 fotogramas por segundo, que es a lo que corre el firmware:
         a 60 los efectos irian al doble de velocidad que en el teclado. */
      if (ahora - ultimo >= 1000 / FPS) {
        ultimo = ahora;
        if (!fx) { teclas.forEach(apaga); }
        else {
          tecleaAlgo(ahora);
          const cols = fotograma();
          teclas.forEach((k, i) => {
            const hsl = cols[k.mitad][k.led];
            const [r, g, b] = hsl2rgb(hsl[0], hsl[1], Math.min(62, hsl[2] * 1.08));
            /* Un LED apagado no pinta nada. Pintarlo igual dibujaba un
               halo NEGRO alrededor de la tecla; lo correcto es que no
               haya luz y la tecla se quede del color del fondo. */
            const lum = Math.max(r, g, b) / 255;
            if (lum < 0.02) return apaga(k, i);
            const col = `${r | 0},${g | 0},${b | 0}`;
            if (col === ultimoColor[i]) return;
            ultimoColor[i] = col;
            /* El resplandor sale FUERA del keycap: el `spread` negativo
               impide que el difuminado se meta hacia dentro y se coma la
               tecla, que es lo que la volvia un cuadrado de color.
               Radios de unas 2,5 veces los de antes (Ernesto, 25 sep 2026:
               el brillo se veia poco). Van en unidades del escenario, que se
               escala a ~0,45 en escritorio y ~0,2 en movil: 130 aqui son
               ~58 px y ~26 px en pantalla. */
            k.el.style.setProperty("--luz", `rgb(${col})`);
            k.el.style.boxShadow =
              `inset 0 2px 0 rgba(255,255,255,.06), inset 0 -4px 7px rgba(0,0,0,.7)`
              + `,0 30px 70px -18px rgba(${col},${(0.6 * lum).toFixed(2)})`
              + `,0 0 60px -10px rgba(${col},${(0.85 * lum).toFixed(2)})`
              + `,0 0 130px -20px rgba(${col},${(0.6 * lum).toFixed(2)})`;
          });
        }
      }
      if (visible && !quieto()) rid = requestAnimationFrame(pinta);
    }

    function escalar() {
      const w = destino.clientWidth;
      if (w) escena.style.transform = `scale(${w / CK_SOFLE.ESCENARIO.w})`;
    }
    escalar();
    let temp;
    addEventListener("resize", () => { clearTimeout(temp); temp = setTimeout(escalar, 120); }, { passive: true });

    new IntersectionObserver(es => {
      visible = es[0].isIntersecting;
      if (visible && !quieto()) rid = requestAnimationFrame(pinta);
      else cancelAnimationFrame(rid);
    }, { rootMargin: "120px" }).observe(destino);
    /* pausa o reanuda al pulsar el boton de la cabecera */
    document.addEventListener("ck-movimiento", () => {
      cancelAnimationFrame(rid);
      if (visible && !quieto()) rid = requestAnimationFrame(pinta);
    });

    pinta(performance.now());

    return {
      /* `null` apaga el RGB del todo y deja las teclas negras, que es como
         empieza la region: primero el teclado, y luego la luz. */
      modo(id) {
        const nuevo = id ? porId[id] : null;
        if (nuevo === fx) return;
        fx = nuevo;
        est = [estadoMitad(), estadoMitad()];
        ultimo = 0;
        if (quieto() || !visible) pinta(performance.now());
      },
    };
  }

  return { FX, montar };
})();
