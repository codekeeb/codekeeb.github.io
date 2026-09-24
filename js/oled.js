/* ============================================================
   CODEKEEB — las dos OLED, pixel a pixel
   ------------------------------------------------------------
   Las nice!view del Sofle son dos pantallas de 68x160 y un bit por pixel,
   y cada mitad ensena una cosa distinta: la izquierda el estado (conexion,
   bateria, modificadores, perfil, capa) con una vista de velocidad
   encima, y la derecha una animacion.

   Antes la portada ensenaba una sola caja azulada con cuatro textos
   cambiando. Ahora son las dos pantallas de verdad, con los mapas de bits
   del firmware y la misma composicion que usa el editor: mismas
   coordenadas, misma fuente, mismo escalon de velocidad para el gato.

   El dibujo se hace en un buffer de 68x160 pixeles y se vuelca a un canvas
   sin suavizado. No se escala el dibujo: se escala el canvas, para que el
   pixel siga siendo un pixel.
   ============================================================ */

const CK_OLED = (() => {
  const W = 68, H = 160;
  const A = CK_OLED_DATOS;

  /* --- descompresion ------------------------------------------------
     Los mapas vienen empaquetados a bit, el mas significativo primero,
     igual que los graba el driver. */
  const IMGS = {};
  const dec = s => { const b = atob(s), u = new Uint8Array(b.length);
    for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
  for (const [n, im] of Object.entries(A.imgs)) IMGS[n] = { w: im.w, h: im.h, bits: dec(im.d) };

  const bit = (im, x, y) => (x < 0 || y < 0 || x >= im.w || y >= im.h) ? 0
    : (im.bits[y * ((im.w + 7) >> 3) + (x >> 3)] >> (7 - (x & 7))) & 1;

  /* El nice!view monta la pantalla girada, asi que los sprites se guardan
     girados y el driver los endereza. Aqui se hace lo mismo, 90 grados en
     sentido antihorario, o el gato sale de lado. */
  function girar(im) {
    const out = { w: im.h, h: im.w, bits: new Uint8Array(((im.h + 7) >> 3) * im.w) };
    const paso = (im.h + 7) >> 3;
    for (let y = 0; y < im.w; y++) for (let x = 0; x < im.h; x++)
      if (bit(im, im.w - 1 - y, x)) out.bits[y * paso + (x >> 3)] |= 0x80 >> (x & 7);
    return out;
  }
  const BONGO = {};
  for (const n of Object.keys(IMGS)) if (n.startsWith("bongo_cat_")) BONGO[n] = girar(IMGS[n]);
  for (const n of Object.keys(IMGS))
    if (/^(crystal|head|spaceman|control|shift|opt|cmd)_/.test(n)) IMGS[n] = girar(IMGS[n]);

  /* --- lienzo de 68x160 --------------------------------------------- */
  const lienzo = yoff => ({ d: new Uint8Array(W * H), yoff });
  const px = (s, x, y, v) => { y += s.yoff;
    if (x >= 0 && x < W && y >= 0 && y < H) s.d[y * W + x] = v ? 1 : 0; };
  const imagen = (s, im, x, y) => { if (!im) return;
    for (let r = 0; r < im.h; r++) for (let c = 0; c < im.w; c++) if (bit(im, c, r)) px(s, x + c, y + r, 1); };
  const caja = (s, x, y, w, h, lleno) => {
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++)
      if (lleno || r === 0 || r === h - 1 || c === 0 || c === w - 1) px(s, x + c, y + r, 1); };
  function linea(s, x0, y0, x1, y1, grueso) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      px(s, x0, y0, 1);
      if (grueso > 1) px(s, x0 + 1, y0, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  function texto(s, fuente, x, y, str) {
    const F = A.fonts[fuente]; let pluma = x;
    for (const ch of str) {
      const g = F.g[ch];
      if (!g) { pluma += (F.g[" "] && F.g[" "][4]) || 4; continue; }
      const [bw, bh, ox, oy, adv, b64] = g;
      if (b64) { const bin = atob(b64);
        for (let i = 0; i < bw * bh; i++)
          if (bin.charCodeAt(i >> 3) & (0x80 >> (i & 7))) px(s, pluma + ox + (i % bw), y + oy + ((i / bw) | 0), 1); }
      pluma += adv;
    }
  }
  const ancho = (fuente, str) => {
    const F = A.fonts[fuente]; let w = 0;
    for (const ch of str) { const g = F.g[ch]; w += g ? g[4] : ((F.g[" "] && F.g[" "][4]) || 4); }
    return w;
  };
  const centrado = (s, fuente, y, str) => texto(s, fuente, Math.max(0, (W - ancho(fuente, str)) >> 1), y, str);

  /* --- piezas de estado, con las medidas del firmware ---------------- */
  function bateria(s, nivel) {
    const x0 = (W - 24) >> 1;
    caja(s, x0, 52, 22, 12, false);
    caja(s, x0 + 22, 55, 2, 6, true);
    const w = Math.round(18 * Math.max(0, Math.min(100, nivel)) / 100);
    if (w > 0) caja(s, x0 + 2, 54, w, 8, true);
  }
  function perfiles(s, activo) {
    const x0 = (W - 31) >> 1;
    for (let i = 0; i < 5; i++) caja(s, x0 + i * 7, 137, 3, 3, i === activo);
  }
  function conexion(s, perfil) {
    const num = String(perfil + 1);
    const w = IMGS.bt.w + 4 + ancho("8", num);
    const x0 = (W - w) >> 1;
    imagen(s, IMGS.bt, x0, 32);
    texto(s, "8", x0 + IMGS.bt.w + 4, 32, num);
  }
  function modificadores(s, activos) {
    const x0 = (W - 30) >> 1;
    [["control", 0, 0], ["shift", 1, 0], ["opt", 0, 1], ["cmd", 1, 1]].forEach(([n, cx, cy], i) => {
      imagen(s, IMGS[n + (activos[i] ? "_white_0" : "_0")] || IMGS[n + "_0"], x0 + cx * 16, 100 + cy * 16);
    });
  }

  /* --- las cinco vistas del OLED izquierdo --------------------------- */
  const VISTAS = ["bongo", "luna", "number", "speedometer", "graph"];
  /* El gato y la luna cambian de estado por tramos de pulsaciones por
     minuto, exactamente igual que el firmware: <5 quieto, <30 lento,
     <70 medio, y a partir de ahi rapido. */
  const tramo = w => w < 5 ? "idle" : w < 30 ? "slow" : w < 70 ? "mid" : "fast";
  function sprite(nombre, wpm, ahora, est) {
    const a = A.anims[nombre][tramo(wpm)];
    if (!a || !a.f.length) return null;
    const t = tramo(wpm);
    if (t !== est.t) { est.t = t; est.t0 = ahora; }
    const i = Math.floor((ahora - est.t0) / (a.ms / a.f.length)) % a.f.length;
    return nombre === "bongo" ? BONGO[a.f[i]] : IMGS[a.f[i]];
  }

  function montar(cvIzq, cvDer) {
    const izq = lienzo(-14), der = lienzo(-7);
    const ctxI = cvIzq.getContext("2d"), ctxD = cvDer.getContext("2d");
    /* Quieto si el sistema pide poco movimiento o el visitante ha pulsado
       pausa: entonces se pinta un solo fotograma y se para. */
    const quieto = () => CK.quieto();

    /* Un tecleo simulado: sube y baja entre 20 y 95 ppm en un ciclo lento,
       que es lo que hace que el gato cambie de ritmo y la grafica tenga
       forma. Sin alguien escribiendo, estas pantallas no dicen nada. */
    const hist = new Array(10).fill(40);
    let ultimaMuestra = 0, wpm = 40;
    const estBongo = { t: "", t0: 0 }, estLuna = { t: "", t0: 0 };
    let vista = 0, anim = 0, capa = 0, tVista = 0, tAnim = 0, tCapa = 0, visible = false, rid = 0;

    function vistaIzquierda(ahora) {
      const v = VISTAS[vista];
      if (v === "bongo")  { const f = sprite("bongo", wpm, ahora, estBongo); if (f) imagen(izq, f, (W - f.w) >> 1, 70); return; }
      if (v === "luna")   { const f = sprite("luna",  wpm, ahora, estLuna);  if (f) imagen(izq, f, (W - f.w) >> 1, 78); return; }
      if (v === "number") { centrado(izq, "16", 84, String(Math.round(wpm))); centrado(izq, "8", 104, "WPM"); return; }
      if (v === "speedometer") {
        imagen(izq, IMGS.gauge, (W - IMGS.gauge.w) >> 1, 86);
        const max = Math.max(...hist, 0) || 100;
        const ang = (225 + Math.min(wpm, max) / max * 90) * Math.PI / 180;
        const cx = W >> 1, cy = 96;
        linea(izq, cx + 5 * Math.cos(ang), cy + 5 * Math.sin(ang),
                   cx + 25 * Math.cos(ang), cy + 25 * Math.sin(ang), 1);
        return;
      }
      const gr = IMGS.grid, gy = 72;
      imagen(izq, gr, 0, gy);
      const max = Math.max(...hist), min = Math.min(...hist), rango = (max - min) || 1;
      const alto = (gr ? gr.h : 33) - 4, arriba = gy + 2;
      let ax = null, ay = null;
      for (let i = 0; i < 10; i++) {
        const x = i * 7.4, y = arriba + alto - (hist[i] - min) * alto / rango;
        if (ax !== null) linea(izq, ax, ay, x, y, 2);
        ax = x; ay = y;
      }
    }

    /* El volcado: un pixel encendido es un pixel, sin suavizar. El grano
       de 1,2% imita el parpadeo real de una OLED monocroma. */
    function volcar(s, ctx) {
      const img = ctx.createImageData(W, H), d = img.data;
      for (let i = 0; i < W * H; i++) {
        let v = s.d[i] ? 232 : 0;
        if (v && Math.random() < 0.012) v = 0;
        const o = i * 4; d[o] = d[o + 1] = d[o + 2] = v; d[o + 3] = 255;
      }
      const tmp = volcar._t || (volcar._t = document.createElement("canvas"));
      tmp.width = W; tmp.height = H;
      tmp.getContext("2d").putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(tmp, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function cuadro(ahora) {
      /* el tecleo simulado, y una muestra por segundo para la grafica */
      wpm = 57 + Math.sin(ahora / 5200) * 38;
      if (ahora - ultimaMuestra > 1000) { ultimaMuestra = ahora; hist.shift(); hist.push(Math.round(wpm)); }
      /* cada vista y cada animacion aguanta cuatro segundos */
      if (ahora - tVista > 4000) { tVista = ahora; vista = (vista + 1) % VISTAS.length; }
      if (ahora - tAnim > 4000) { tAnim = ahora; anim = (anim + 1) % 4; }
      /* La capa va por su cuenta y mas despacio: cambiar de vista de
         velocidad no cambia de capa, y verlas saltar a la vez sugeriria
         que una cosa depende de la otra. */
      if (ahora - tCapa > 7000) { tCapa = ahora; capa = (capa + 1) % 4; }

      izq.d.fill(0);
      conexion(izq, 1); bateria(izq, 82); vistaIzquierda(ahora);
      modificadores(izq, [0, wpm > 70, 0, 0]);
      perfiles(izq, 1);
      centrado(izq, "16", 146, ["BASE", "LOWER", "RAISE", "ADJUST"][capa]);

      der.d.fill(0);
      conexion(der, 1); bateria(der, 74);
      const nombreAnim = ["crystal", "head", "spaceman", "logo"][anim];
      const a = A.anims[nombreAnim];
      const f = IMGS[a.f[Math.floor((ahora - tAnim) / (a.ms / a.f.length)) % a.f.length]];
      if (f) imagen(der, f, (W - f.w) >> 1, 73);

      volcar(izq, ctxI); volcar(der, ctxD);
      if (visible && !quieto()) rid = requestAnimationFrame(cuadro);
    }

    /* Dos pantallas repintandose a 60 fps fuera de la vista es gastar
       bateria para nada. */
    new IntersectionObserver(es => {
      visible = es[0].isIntersecting;
      if (visible && !quieto()) rid = requestAnimationFrame(cuadro);
      else cancelAnimationFrame(rid);
    }, { rootMargin: "120px" }).observe(cvIzq);
    /* pausa o reanuda al pulsar el boton de la cabecera */
    document.addEventListener("ck-movimiento", () => {
      cancelAnimationFrame(rid);
      if (visible && !quieto()) rid = requestAnimationFrame(cuadro);
    });

    cuadro(performance.now());
    return { VISTAS };
  }

  return { W, H, montar, VISTAS };
})();
