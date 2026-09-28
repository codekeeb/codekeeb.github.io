/* ============================================================
   CODEKEEB — las dos OLED, pixel a pixel
   ------------------------------------------------------------
   Cada mitad del Sofle ensena una cosa distinta: la izquierda el estado
   (conexion, bateria, modificadores, perfil, capa) con una vista de
   velocidad, y la derecha una animacion.

   Las dos son el panel real: un SSD1306 de 128x32 en vertical. El
   firmware dibuja en un lienzo de 68x160 y lo gira, y de el solo se ve la
   franja x 0..31, y 32..159; se pinta con las posiciones de su Kconfig y
   se recorta a esa franja. La conexion y la bateria salen de las mismas
   funciones en las dos mitades, asi que miden lo mismo y estan a la misma
   altura, como en el teclado. Antes se dibujaba centrada en 68 px, un layout
   que no existe en el teclado, con la luna tumbada y la grafica encima de
   los modificadores.

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
  /* La luna tambien se guarda girada (dog_*_90); sin esto salia tumbada. */
  const LUNA = {};
  for (const n of Object.keys(IMGS)) if (/^dog_\w+_90$/.test(n)) LUNA[n] = girar(IMGS[n]);
  for (const n of Object.keys(IMGS))
    if (/^(crystal|head|spaceman|control|shift|opt|cmd)_/.test(n)) IMGS[n] = girar(IMGS[n]);
  /* El logo se guardo sin girar; en el teclado es un widget en coordenadas
     del panel como las demas animaciones, asi que sale en vertical (y por
     eso cabe en 32 px). Se gira igual para ensenarlo como alli. */
  if (IMGS.codekeeb_logo) IMGS.codekeeb_logo = girar(IMGS.codekeeb_logo);

  /* --- lienzo de 68x160 --------------------------------------------- */
  const lienzo = yoff => ({ d: new Uint8Array(W * H), yoff });
  const px = (s, x, y, v) => { y += s.yoff;
    if (x >= 0 && x < W && y >= 0 && y < H) s.d[y * W + x] = v ? 1 : 0; };
  const caja = (s, x, y, w, h, lleno) => {
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++)
      if (lleno || r === 0 || r === h - 1 || c === 0 || c === w - 1) px(s, x + c, y + r, 1); };
  const ancho = (fuente, str) => {
    const F = A.fonts[fuente]; let w = 0;
    for (const ch of str) { const g = F.g[ch]; w += g ? g[4] : ((F.g[" "] && F.g[" "][4]) || 4); }
    return w;
  };

  /* --- las cinco vistas del OLED izquierdo --------------------------- */
  const VISTAS = ["bongo", "luna", "number", "speedometer", "graph"];
  /* El gato y la luna cambian de estado por tramos de pulsaciones por
     minuto, exactamente igual que el firmware: <5 quieto, <30 lento,
     <70 medio, y a partir de ahi rapido. */
  const tramo = w => w < 5 ? "idle" : w < 30 ? "slow" : w < 70 ? "mid" : "fast";
  /* La luna no comparte escalon con el gato: sentada hasta 15 (luna.c). */
  const tramoLuna = w => w < 15 ? "idle" : w < 30 ? "slow" : w < 70 ? "mid" : "fast";
  function sprite(nombre, wpm, ahora, est) {
    const t = nombre === "luna" ? tramoLuna(wpm) : tramo(wpm);
    const a = A.anims[nombre][t];
    if (!a || !a.f.length) return null;
    if (t !== est.t) { est.t = t; est.t0 = ahora; }
    const i = Math.floor((ahora - est.t0) / (a.ms / a.f.length)) % a.f.length;
    return (nombre === "bongo" ? BONGO : LUNA)[a.f[i]];
  }

  /* --- la pantalla izquierda, como la dibuja el firmware ------------- */
  /* Defaults de Kconfig.defconfig de codekeeb/zmk-nice-oled (selectable);
     los mismos que usa el Keymap Studio. */
  const FW = { BT_X: 4, BT_Y: 32, PROF_TXT_X: 25, PROF_TXT_Y: 32, PROF_X: 0, PROF_Y: 137,
    BAT_X: 0, BAT_Y: 50, LAYER_X: 0, LAYER_Y: 146, MOD_X: 0, MOD_Y: 100,
    GAUGE_X: -1, GAUGE_Y: 70, NEEDLE_X: 15, NEEDLE_Y: 92, NEEDLE_R: 18,
    GRAPH_X: -1, GRAPH_Y: 65, GRAPH_W: 32, LABEL_X: 0, LABEL_Y: 70, LABEL_W: 32,
    LUNA_X: 65, LUNA_Y: 0, BONGO_X: 64, BONGO_Y: -9, ANIM_X: 18, ANIM_Y: -18 };
  const VIS = { x: 0, y: 32, w: 32, h: 128 };
  /* Imagen opaca, como lv_img: tambien copia los pixeles apagados. */
  const opaca = (s, im, x, y) => { if (!im) return;
    for (let r = 0; r < im.h; r++) for (let c = 0; c < im.w; c++) px(s, x + c, y + r, bit(im, c, r)); };
  /* Texto como lv_canvas_draw_text: la y es el techo de la linea y el
     glifo baja lh - base_line - alto - ofs_y. */
  function textoFw(s, fuente, x, y, str, anchoMax) {
    const F = A.fonts[fuente];
    let pluma = x + (anchoMax != null ? Math.floor((anchoMax - ancho(fuente, str)) / 2) : 0);
    for (const ch of str) {
      const g = F.g[ch]; if (!g) { pluma += 4; continue; }
      const [bw, bh, ox, oy, adv, b64] = g, techo = y + (F.lh - F.bl) - bh - oy;
      if (b64) { const bin = atob(b64);
        for (let i = 0; i < bw * bh; i++)
          if (bin.charCodeAt(i >> 3) & (0x80 >> (i & 7))) px(s, pluma + ox + (i % bw), techo + ((i / bw) | 0), 1); }
      pluma += adv;
    }
  }
  /* Linea de trazo cuadrado entre varios puntos. */
  function trazo(s, pts, grueso) {
    for (let k = 1; k < pts.length; k++) {
      const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
      for (let i = 0; i <= n; i++) {
        const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
        for (let dx = 0; dx < grueso; dx++) for (let dy = 0; dy < grueso; dy++) px(s, x + dx, y + dy, 1);
      }
    }
  }
  /* El gato y la luna son widgets aparte que el firmware coloca en
     coordenadas del PANEL; w es el ancho de la imagen sin girar. */
  const delPanel = (X, Y, w) => [Y, 160 - X - w];

  /* Conexion y bateria (output.c, battery.c): las mismas en las dos. */
  function estado(s, nivel) {
    opaca(s, IMGS.bt, FW.BT_X, FW.BT_Y);
    const bx = FW.BAT_X, by = FW.BAT_Y + 2;
    caja(s, bx, by, 22, 12, false); caja(s, bx + 22, by + 3, 2, 6, true);
    const bw = Math.floor(Math.min(nivel, 100) * 18 / 100);
    if (bw > 0) caja(s, bx + 2, by + 2, bw, 8, true);
  }
  /* La derecha (screen_peripheral.c): sin numero de perfil, y la animacion
     como widget en coordenadas del panel. */
  function componerDer(s, nivel, f) {
    s.d.fill(0);
    estado(s, nivel);
    if (f) { const [x, y] = delPanel(FW.ANIM_X, FW.ANIM_Y, f.h); opaca(s, f, x, y); }
  }

  function componerIzq(s, e) {
    s.d.fill(0);
    estado(s, e.bateria);
    const v = VISTAS[e.vista], ultimo = e.hist[9];
    if (v === "bongo" || v === "luna") {
      const f = sprite(v, e.wpm, e.ahora, v === "bongo" ? e.estBongo : e.estLuna);
      if (f) { const [x, y] = v === "bongo" ? delPanel(FW.BONGO_X, FW.BONGO_Y, f.h)
                                            : delPanel(FW.LUNA_X, FW.LUNA_Y, f.h);
               opaca(s, f, x, y); }
    } else if (v === "number") {
      textoFw(s, "16", FW.LABEL_X, FW.LABEL_Y, String(ultimo), FW.LABEL_W);
      textoFw(s, "8", FW.LABEL_X, FW.LABEL_Y + 16, "WPM", FW.LABEL_W);
    } else if (v === "speedometer") {
      opaca(s, IMGS.gauge, FW.GAUGE_X, FW.GAUGE_Y);
      const a = (225 + Math.max(0, Math.min(ultimo, 100)) / 100 * 90) * Math.PI / 180;
      trazo(s, [[FW.NEEDLE_X + Math.trunc(5 * Math.cos(a)), FW.NEEDLE_Y + Math.trunc(5 * Math.sin(a))],
                [FW.NEEDLE_X + Math.trunc(FW.NEEDLE_R * Math.cos(a)), FW.NEEDLE_Y + Math.trunc(FW.NEEDLE_R * Math.sin(a))]], 1);
    } else {
      opaca(s, IMGS.grid, FW.GRAPH_X, FW.GRAPH_Y);
      trazo(s, e.hist.map((w, i) => [FW.GRAPH_X + 1 + Math.floor(i * (FW.GRAPH_W - 2) / 9),
                                     FW.GRAPH_Y + 32 - Math.floor(Math.min(w, 100) * 32 / 100)]), 2);
    }
    textoFw(s, "8", FW.PROF_TXT_X, FW.PROF_TXT_Y, String(e.perfil + 1));
    opaca(s, IMGS.profiles, FW.PROF_X, FW.PROF_Y);
    caja(s, FW.PROF_X + e.perfil * 7, FW.PROF_Y, 3, 3, true);
    /* La capa, con la mayor fuente que quepa y la linea base de la de 16:
       con la de 16 solo caben 4 letras (layer.c). */
    const F16 = A.fonts["16"], base = FW.LAYER_Y + F16.lh - F16.bl;
    const f = ["16", "12", "8"].find(n => ancho(n, e.capa) <= VIS.w) || "8";
    textoFw(s, f, FW.LAYER_X, base - (A.fonts[f].lh - A.fonts[f].bl), e.capa);
    [["control", 0, 0], ["shift", 1, 0], ["opt", 0, 1], ["cmd", 1, 1]].forEach(([n, cx, cy], i) =>
      opaca(s, IMGS["fw_" + n + (e.mods[i] ? "_white_0" : "_0")], FW.MOD_X + cx * 16, FW.MOD_Y + cy * 16));
  }

  function montar(cvIzq, cvDer) {
    const izq = lienzo(0), der = lienzo(0);
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

    /* El volcado: un pixel encendido es un pixel, sin suavizar. El grano
       de 1,2% imita el parpadeo real de una OLED monocroma. */
    function volcar(s, ctx, ven) {
      const v0 = ven || { x: 0, y: 0, w: W, h: H };
      const img = ctx.createImageData(v0.w, v0.h), d = img.data;
      for (let y = 0; y < v0.h; y++) for (let x = 0; x < v0.w; x++) {
        let v = s.d[(y + v0.y) * W + (x + v0.x)] ? 232 : 0;
        if (v && Math.random() < 0.012) v = 0;
        const o = (y * v0.w + x) * 4; d[o] = d[o + 1] = d[o + 2] = v; d[o + 3] = 255;
      }
      const tmp = volcar._t || (volcar._t = document.createElement("canvas"));
      tmp.width = v0.w; tmp.height = v0.h;
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

      componerIzq(izq, { ahora, wpm, hist, vista, estBongo, estLuna, perfil: 1, bateria: 82,
                         mods: [0, wpm > 70, 0, 0], capa: ["BASE", "LOWER", "RAISE", "ADJUST"][capa] });

      const nombreAnim = ["crystal", "head", "spaceman", "logo"][anim];
      const a = A.anims[nombreAnim];
      componerDer(der, 74, IMGS[a.f[Math.floor((ahora - tAnim) / (a.ms / a.f.length)) % a.f.length]]);

      volcar(izq, ctxI, VIS); volcar(der, ctxD, VIS);
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
