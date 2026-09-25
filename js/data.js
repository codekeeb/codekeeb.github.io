/* ============================================================
   CODEKEEB — datos de catálogo
   ------------------------------------------------------------
   Fuente: anuncios reales de Etsy, capturados el 2026-08-14
   (ver data/etsy/listings/*.md en la raíz del proyecto).

   AL ACTUALIZAR PRECIOS O STOCK:
   - price / priceFrom son EUROS y solo informativos. El precio que
     cobra es el de Etsy; por eso cada tarjeta enlaza a su anuncio.
   - Si una opción se agota, marca sold:true en esa variante: la web
     la muestra tachada en vez de ocultarla (genera menos preguntas
     que hacerla desaparecer).
   - status: "available" | "soldout" | "soon"
   ============================================================ */

const CK_SHOP_URL = "https://www.etsy.com/shop/CodeKeeb";

/* Fecha de la última revisión de precios. Se muestra junto a los
   precios para no aparentar que están al minuto. */
const CK_PRICES_UPDATED = "2026-08-14";

/* Datos del titular para el aviso legal (en Espana, art. 10 de la LSSI:
   nombre o razon social, NIF, domicilio y un correo de contacto; el
   registro solo si es una sociedad inscrita). Los pone Ernesto: NUNCA se
   inventan ni se rellenan con ejemplos. Mientras falte alguno, legal.html
   dice que se estan completando y da Etsy como via de contacto. */
const CK_TITULAR = {
  nombre: null,      // "Nombre Apellidos" o razon social
  nif: null,
  domicilio: null,
  email: null,
  registro: null,
};

/*
  Campos de cada producto:
  - img/heroImg: assets/img/products/<archivo>. Hay versión -sm para
    móvil (srcset), generada al mismo tiempo que la grande.
  - priceFrom: precio de entrada (la opción más barata, normalmente
    la PCB suelta). priceFull: el teclado montado.
  - buildOptions: las variantes reales del anuncio, con su precio.
  - specs: fichas de la sección de producto.
  - url: enlace DIRECTO al anuncio. Nunca null: mandar a la tienda
    genérica perdía la venta.
  - title: cómo se rotula el nombre, en 3 niveles como el logotipo:
      model  → negro        (el modelo: Sofle, Corne, Totem)
      trait  → gris oscuro  (lo característico: versión, acabado)
      accent → degradado    (solo cuando lleva RGB)
    Si falta, se cae a name + version en negro.
*/
/*
  foco: donde esta el teclado dentro de la foto, en % del alto. Es un dato
  de la imagen, no del diseno, y por eso vive aqui: lo usan la portada, el
  catalogo y el comparador para recortar sin cortar el producto.

  Medido, no estimado: se dibuja cada foto en un canvas y se busca la banda
  de filas con mas varianza de brillo — el teclado tiene teclas y sombras,
  la mesa es un degradado liso. En las cinco fotos sobra mesa por arriba
  (entre un 11% y un 33%), asi que recortar por el centro cortaba el
  teclado y ensenaba el mantel.
*/
const CK_PRODUCTS = [
  {
    id: "sofle-carbon",
    manual: "sofle-zmk",      // js/manuales.js: el manual de su firmware
    color: { fondo: "#2B3BF5", tinta: "#FFFFFF" },   // bloque de la ficha; tinta elegida por contraste (>= 4,5:1)
    corto: "Sofle Carbon",
    listingId: "4538841345",
    status: "available",
    featured: true,
    title: { model: "Sofle", trait: "Choc · Space Black", accent: "RGB" },
    name: "Sofle Choc",
    version: "Space Black",
    img: "sofle-carbon.jpg",
    foco: 58,   // el teclado ocupa del 33% al 84%
    heroImg: "sofle-carbon.jpg",
    gallery: ["sofle-carbon.jpg", "sofle-carbon-2.jpg"],
    titleImg: null,   // el SVG rotulado dice "RETRO": solo vale para ese
    priceFrom: 200.85,
    priceFull: 230.75,
    priceOriginal: 309.00,
    discountPct: 35,
    stock: 1,
    kicker: { es: "Split · Inalámbrico · 5,3 mm · ZMK", en: "Split · Wireless · 5.3 mm · ZMK" },
    desc: {
      es: "Sofle low profile de 5,3 mm de perfil, con la electrónica embebida en un case texturizado de fibra de carbono.",
      en: "A 5.3 mm low profile Sofle, with the electronics embedded into a carbon fiber textured case."
    },
    highlights: {
      es: ["5,3 mm de perfil, electrónica embebida en el case", "Motor RGB propio: 10 modos y degradados continuos entre mitades", "OLED dual con firmware propio: batería, capa, WPM y Bongo Cat", "300 mAh · hasta 4 días por carga con RGB apagado"],
      en: ["5.3 mm profile, electronics embedded into the case", "Custom RGB engine: 10 modes, gradients flowing across both halves", "Dual OLED on custom firmware: battery, layer, WPM and Bongo Cat", "300 mAh · up to 4 days per charge with RGB off"]
    },
    specs: [
      [{es:"Teclas",en:"Keys"}, "58"],
      [{es:"Perfil",en:"Profile"}, {es:"5,3 mm",en:"5.3 mm"}],
      [{es:"Switches",en:"Switches"}, {es:"Choc low profile, hotswap",en:"Choc low profile, hotswap"}],
      [{es:"Conexión",en:"Connectivity"}, {es:"Bluetooth (5 perfiles) + USB-C",en:"Bluetooth (5 profiles) + USB-C"}],
      [{es:"Batería",en:"Battery"}, {es:"300 mAh · hasta 4 días sin RGB",en:"300 mAh · up to 4 days with RGB off"}],
      [{es:"Pantallas",en:"Displays"}, {es:"OLED dual, firmware propio",en:"Dual OLED, custom firmware"}],
      [{es:"Iluminación",en:"Lighting"}, {es:"RGB per-key + underglow, 10 modos",en:"Per-key RGB + underglow, 10 modes"}],
      [{es:"Encoders",en:"Encoders"}, {es:"2 rotatorios clicables",en:"2 clickable rotary"}],
      [{es:"Case",en:"Case"}, {es:"Fibra de carbono texturizada, impreso a medida",en:"Carbon fiber textured, printed in house"}],
      [{es:"Firmware",en:"Firmware"}, "ZMK + ZMK Studio"]
    ],
    buildOptions: [
      { name: { es: "Teclado completo", en: "Full Keyboard" }, price: 230.75 },
      { name: { es: "Barebones", en: "Barebones" }, price: 200.85 }
    ],
    stats: [
      [{ es: "5,3", en: "5.3" }, { es: "mm de perfil", en: "mm profile" }],
      ["58", { es: "teclas", en: "keys" }],
      ["BT+5", { es: "perfiles + USB-C", en: "profiles + USB-C" }],
      ["ZMK", { es: "firmware libre", en: "open firmware" }]
    ],
    caption: "space black · 5,3 mm · BT+5 · ZMK",
    meta: ["58", "BT+5", "ZMK", "RGB", "OLED"],
    url: "https://www.etsy.com/listing/4538841345/"
  },
  {
    id: "sofle-retro",
    manual: "sofle-zmk",      // js/manuales.js: el manual de su firmware
    color: { fondo: "#F0469A", tinta: "#111111" },   // bloque de la ficha; tinta elegida por contraste (>= 4,5:1)
    corto: "Sofle Retro",
    listingId: "4542645510",
    status: "available",
    featured: true,
    title: { model: "Sofle", trait: "Choc · Retro", accent: "RGB" },
    name: "Sofle Choc",
    version: "Retro",
    img: "sofle-retro.jpg",
    foco: 63,   // del 27% al 99%
    heroImg: "sofle-retro.jpg",
    gallery: ["sofle-retro.jpg", "sofle-retro-2.jpg"],
    titleImg: "title-sofle.svg",   // el rotulo dice SOFLE RGB v3.2 RETRO
    priceFrom: 200.85,
    priceOriginal: 309.00,
    discountPct: 35,
    stock: 8,
    kicker: { es: "Split · Inalámbrico · Retro · ZMK", en: "Split · Wireless · Retro · ZMK" },
    desc: {
      es: "El mismo Sofle Choc inalámbrico en acabado retro, con varios juegos de keycaps a elegir.",
      en: "The same wireless Sofle Choc in a retro finish, with several keycap sets to choose from."
    },
    highlights: {
      es: ["Cuatro juegos de keycaps a elegir (Kea Grey, Kea Play, KeaColor)", "Hotswap Choc: cambia cualquier switch low profile a mano", "RGB per-key y underglow en ambas mitades", "Dos encoders rotatorios clicables"],
      en: ["Four keycap sets to choose from (Kea Grey, Kea Play, KeaColor)", "Choc hotswap: swap any low profile switch by hand", "Per key RGB plus underglow across both halves", "Two clickable rotary encoders"]
    },
    specs: [
      [{es:"Teclas",en:"Keys"}, "58"],
      [{es:"Switches",en:"Switches"}, {es:"Choc low profile, hotswap",en:"Choc low profile, hotswap"}],
      [{es:"Conexión",en:"Connectivity"}, {es:"Bluetooth (5 perfiles) + USB-C",en:"Bluetooth (5 profiles) + USB-C"}],
      [{es:"Keycaps",en:"Keycaps"}, {es:"Kea Grey · Kea Play · KeaColor · MTNU",en:"Kea Grey · Kea Play · KeaColor · MTNU"}],
      [{es:"Iluminación",en:"Lighting"}, {es:"RGB per-key + underglow",en:"Per-key RGB + underglow"}],
      [{es:"Encoders",en:"Encoders"}, {es:"2 rotatorios clicables",en:"2 clickable rotary"}],
      [{es:"Firmware",en:"Firmware"}, "ZMK + ZMK Studio"]
    ],
    buildOptions: [
      { name: { es: "Barebones", en: "Barebones" }, price: 200.85 },
      { name: { es: "Completo · MTNU", en: "Full · MTNU" }, sold: true },
      { name: { es: "Completo · Kea Grey", en: "Full · Kea Grey" } },
      { name: { es: "Completo · Kea Play", en: "Full · Kea Play" } },
      { name: { es: "Completo · KeaColor", en: "Full · KeaColor" } }
    ],
    stats: [
      ["58", { es: "teclas", en: "keys" }],
      ["4", { es: "sets de keycaps", en: "keycap sets" }],
      ["BT+5", { es: "perfiles + USB-C", en: "profiles + USB-C" }],
      ["ZMK", { es: "firmware libre", en: "open firmware" }]
    ],
    caption: "retro · hotswap choc · BT+5 · ZMK",
    meta: ["58", "BT+5", "ZMK", "RGB", "OLED"],
    url: "https://www.etsy.com/listing/4542645510/"
  },
  {
    id: "totem",
    manual: "totem-zmk",      // js/manuales.js: el manual de su firmware
    color: { fondo: "#FFD21F", tinta: "#111111" },   // bloque de la ficha; tinta elegida por contraste (>= 4,5:1)
    corto: "Totem",
    listingId: "4551478025",
    status: "available",
    featured: true,
    title: { model: "Totem", trait: { es: "38 teclas", en: "38 keys" } },
    name: "Totem",
    version: { es: "38 teclas", en: "38 keys" },
    img: "totem.jpg",
    foco: 61,   // del 29% al 93%
    heroImg: "totem.jpg",
    gallery: ["totem.jpg", "totem-2.jpg"],
    titleImg: null,
    priceFrom: 26.00,
    priceFull: 152.75,
    priceOriginal: 40.00,
    discountPct: 35,
    stock: 1,
    kicker: { es: "Split · 38 teclas · ZMK", en: "Split · 38 keys · ZMK" },
    desc: {
      es: "El más compacto: 38 teclas, hotswap Choc y case ZMK Bluetooth. Disponible en inalámbrico o cableado.",
      en: "The most compact: 38 keys, Choc hotswap and ZMK Bluetooth case. Available wireless or wired."
    },
    highlights: {
      es: ["38 teclas: el layout más compacto del catálogo", "Inalámbrico o cableado, tú eliges", "Choc Red hotswap", "Personalizable bajo pedido"],
      en: ["38 keys: the most compact layout in the catalogue", "Wireless or wired, your choice", "Choc Red hotswap", "Customisable on request"]
    },
    specs: [
      [{es:"Teclas",en:"Keys"}, "38"],
      [{es:"Switches",en:"Switches"}, {es:"Choc Red, hotswap",en:"Choc Red, hotswap"}],
      [{es:"Conexión",en:"Connectivity"}, {es:"Inalámbrico o cableado",en:"Wireless or wired"}],
      [{es:"Case",en:"Case"}, {es:"ZMK Bluetooth",en:"ZMK Bluetooth"}],
      [{es:"Firmware",en:"Firmware"}, "ZMK"],
      [{es:"Personalización",en:"Customisation"}, {es:"Bajo pedido",en:"On request"}]
    ],
    buildOptions: [
      { name: { es: "Teclado completo", en: "Full Keyboard" }, price: 152.75, priceTo: 187.85 },
      { name: { es: "Barebones", en: "Barebones" }, price: 120.25, priceTo: 155.35 },
      { name: { es: "PCB soldada", en: "Soldered PCB" }, price: 71.50 },
      { name: { es: "Solo PCB", en: "PCB Only" }, price: 26.00 }
    ],
    stats: [
      ["38", { es: "teclas", en: "keys" }],
      ["BT", { es: "o cableado", en: "or wired" }],
      ["Choc", { es: "hotswap", en: "hotswap" }],
      ["ZMK", { es: "firmware libre", en: "open firmware" }]
    ],
    caption: "38 teclas · choc hotswap · ZMK",
    meta: ["38", "BT", "ZMK", "Choc"],
    url: "https://www.etsy.com/listing/4551478025/"
  },
  {
    id: "corne-v4",
    color: { fondo: "#FF6B1A", tinta: "#111111" },   // bloque de la ficha; tinta elegida por contraste (>= 4,5:1)
    corto: "Corne v4",
    listingId: "4524082170",
    status: "available",
    featured: true,
    title: { model: "Corne", trait: "v4 MX", accent: "RGB" },
    name: "Corne RGB",
    version: "v4 MX",
    img: "corne-v4.jpg",
    foco: 48,   // del 11% al 86%
    heroImg: "corne-v4.jpg",
    gallery: ["corne-v4.jpg", "corne-v4-2.jpg"],
    titleImg: null,
    priceFrom: 44.10,
    priceFull: 261.00,
    priceOriginal: 49.00,
    discountPct: 10,
    stock: 2,
    kicker: { es: "Split · 42 teclas · QMK + VIA", en: "Split · 42 keys · QMK + VIA" },
    desc: {
      es: "Corne v4 MX con case naranja a medida. Cableado TRRS y firmware QMK con VIA.",
      en: "Corne v4 MX with a custom orange case. TRRS wired and QMK firmware with VIA."
    },
    highlights: {
      es: ["Case naranja impreso a medida", "QMK + VIA: remapea desde el navegador", "Switches MX hotswap", "Cableado TRRS, sin baterías que cargar"],
      en: ["Custom printed orange case", "QMK + VIA: remap from your browser", "MX hotswap switches", "TRRS wired, no batteries to charge"]
    },
    specs: [
      [{es:"Teclas",en:"Keys"}, "42"],
      [{es:"Switches",en:"Switches"}, {es:"MX, hotswap",en:"MX, hotswap"}],
      [{es:"Conexión",en:"Connectivity"}, {es:"Cableado TRRS",en:"TRRS wired"}],
      [{es:"Iluminación",en:"Lighting"}, {es:"RGB per-key",en:"Per-key RGB"}],
      [{es:"Case",en:"Case"}, {es:"Naranja, impreso a medida",en:"Orange, printed in house"}],
      [{es:"Firmware",en:"Firmware"}, "QMK + VIA"]
    ],
    buildOptions: [
      { name: { es: "Teclado completo", en: "Full Keyboard" }, price: 261.00 },
      { name: { es: "PCB soldada", en: "Soldered PCB" }, price: 44.10 }
    ],
    stats: [
      ["42", { es: "teclas", en: "keys" }],
      ["MX", { es: "hotswap", en: "hotswap" }],
      ["VIA", { es: "remapeo web", en: "web remapping" }],
      ["QMK", { es: "firmware libre", en: "open firmware" }]
    ],
    caption: "v4 · custom orange · TRRS · QMK",
    meta: ["42", "MX", "QMK", "RGB", "VIA"],
    url: "https://www.etsy.com/listing/4524082170/"
  },
  {
    id: "corne-v3",
    color: { fondo: "#2BD98A", tinta: "#111111" },   // bloque de la ficha; tinta elegida por contraste (>= 4,5:1)
    corto: "Corne v3",
    listingId: "4526929358",
    status: "available",
    featured: true,
    title: { model: "Corne", trait: "v3 MX", accent: "RGB" },
    name: "Corne RGB",
    version: "v3 MX",
    img: "corne-v3.jpg",
    foco: 56,   // del 13% al 99%
    heroImg: "corne-v3.jpg",
    gallery: ["corne-v3.jpg", "corne-v3-2.jpg"],
    titleImg: null,
    priceFrom: 40.50,
    priceOriginal: 45.00,
    discountPct: 10,
    stock: null,
    rating: 5.0,
    reviews: 1,
    kicker: { es: "Split · 42 teclas · QMK + Vial", en: "Split · 42 keys · QMK + Vial" },
    desc: {
      es: "Corne HAL v3 RGB MX cableado por USB-C. Disponible como barebones o PCB.",
      en: "Corne HAL v3 RGB MX wired over USB-C. Available as barebones or PCB."
    },
    highlights: {
      es: ["Cableado por USB-C entre mitades", "QMK + Vial: remapeo en caliente", "RGB per-key", "El primer modelo de la tienda, con reseña de 5 estrellas"],
      en: ["USB-C wired between halves", "QMK + Vial: live remapping", "Per key RGB", "The shop's first model, with a 5 star review"]
    },
    specs: [
      [{es:"Teclas",en:"Keys"}, "42"],
      [{es:"Switches",en:"Switches"}, {es:"MX, hotswap",en:"MX, hotswap"}],
      [{es:"Conexión",en:"Connectivity"}, {es:"Cableado USB-C entre mitades",en:"USB-C wired between halves"}],
      [{es:"Iluminación",en:"Lighting"}, {es:"RGB per-key",en:"Per-key RGB"}],
      [{es:"Firmware",en:"Firmware"}, "QMK + Vial"]
    ],
    buildOptions: [
      { name: { es: "Teclado completo", en: "Full Keyboard" }, sold: true },
      { name: { es: "Barebones", en: "Barebones" }, price: 171.00 },
      { name: { es: "PCB soldada", en: "Soldered PCB" }, price: 135.00 },
      { name: { es: "Solo PCB", en: "PCB Only" }, price: 40.50 }
    ],
    stats: [
      ["42", { es: "teclas", en: "keys" }],
      ["USB-C", { es: "entre mitades", en: "between halves" }],
      ["Vial", { es: "remapeo live", en: "live remapping" }],
      ["QMK", { es: "firmware libre", en: "open firmware" }]
    ],
    caption: "v3 · usb-c · vial · QMK",
    meta: ["42", "MX", "QMK", "RGB", "Vial"],
    url: "https://www.etsy.com/listing/4526929358/"
  }
];

/* Sabores / colorways. Los que no están publicados como anuncio
   propio van con status "soon". */
const CK_FLAVORS = [
  {
    id: "space-black",
    status: "available",
    name: "Space Black",
    swatches: ["#1a1a1c", "#2e2e33", "#4a4a52"]
  },
  {
    id: "retro",
    status: "available",
    name: "Retro",
    swatches: ["#f1ede2", "#b9b9b2", "#b7c9b4"]
  },
  {
    id: "orange",
    status: "available",
    name: "Custom Orange",
    swatches: ["#e8a33d", "#1c1c1e", "#d9d3c4"]
  }
];
