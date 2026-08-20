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
*/
const CK_PRODUCTS = [
  {
    id: "sofle-carbon",
    listingId: "4538841345",
    status: "available",
    featured: true,
    name: "Sofle Choc",
    version: "Space Black",
    img: "sofle-carbon.jpg",
    heroImg: "sofle-carbon.jpg",
    gallery: ["sofle-carbon.jpg", "sofle-carbon-2.jpg"],
    titleImg: "title-sofle.svg",
    priceFrom: 200.85,
    priceFull: 230.75,
    priceOriginal: 309.00,
    discountPct: 35,
    stock: 1,
    kicker: { es: "Split · Inalámbrico · 5,3 mm · ZMK", en: "Split · Wireless · 5.3 mm · ZMK", fr: "Split · Sans fil · 5,3 mm · ZMK" },
    desc: {
      es: "El Sofle low profile más fino del mercado: 5,3 mm con la electrónica embebida en un case texturizado de fibra de carbono.",
      en: "The slimmest low profile Sofle on the market: 5.3 mm with the electronics embedded into a carbon fiber textured case.",
      fr: "Le Sofle low profile le plus fin du marché : 5,3 mm avec l'électronique intégrée dans un boîtier texturé fibre de carbone."
    },
    highlights: {
      es: ["5,3 mm de perfil, electrónica embebida en el case", "Motor RGB propio: 10 modos y degradados continuos entre mitades", "OLED dual con firmware propio: batería, capa, WPM y Bongo Cat", "300 mAh · hasta 4 días por carga con RGB apagado"],
      en: ["5.3 mm profile, electronics embedded into the case", "Custom RGB engine: 10 modes, gradients flowing across both halves", "Dual OLED on custom firmware: battery, layer, WPM and Bongo Cat", "300 mAh · up to 4 days per charge with RGB off"],
      fr: ["Profil de 5,3 mm, électronique intégrée au boîtier", "Moteur RGB maison : 10 modes, dégradés continus entre les moitiés", "Double OLED firmware maison : batterie, calque, WPM et Bongo Cat", "300 mAh · jusqu'à 4 jours par charge sans RGB"]
    },
    buildOptions: [
      { name: { es: "Teclado completo", en: "Full Keyboard", fr: "Clavier complet" }, price: 230.75 },
      { name: { es: "Barebones", en: "Barebones", fr: "Barebones" }, price: 200.85 }
    ],
    stats: [
      ["5,3", { es: "mm de perfil", en: "mm profile", fr: "mm de profil" }],
      ["58", { es: "teclas", en: "keys", fr: "touches" }],
      ["BT+5", { es: "perfiles + USB-C", en: "profiles + USB-C", fr: "profils + USB-C" }],
      ["ZMK", { es: "firmware libre", en: "open firmware", fr: "firmware libre" }]
    ],
    caption: "space black · 5,3 mm · BT+5 · ZMK",
    meta: ["58", "BT+5", "ZMK", "RGB", "OLED"],
    url: "https://www.etsy.com/listing/4538841345/"
  },
  {
    id: "sofle-retro",
    listingId: "4542645510",
    status: "available",
    featured: true,
    name: "Sofle Choc",
    version: "Retro",
    img: "sofle-retro.jpg",
    heroImg: "sofle-retro.jpg",
    gallery: ["sofle-retro.jpg", "sofle-retro-2.jpg"],
    titleImg: null,
    priceFrom: 200.85,
    priceOriginal: 309.00,
    discountPct: 35,
    stock: 8,
    kicker: { es: "Split · Inalámbrico · Retro · ZMK", en: "Split · Wireless · Retro · ZMK", fr: "Split · Sans fil · Rétro · ZMK" },
    desc: {
      es: "El mismo Sofle Choc inalámbrico en acabado retro, con varios juegos de keycaps a elegir.",
      en: "The same wireless Sofle Choc in a retro finish, with several keycap sets to choose from.",
      fr: "Le même Sofle Choc sans fil en finition rétro, avec plusieurs jeux de keycaps au choix."
    },
    highlights: {
      es: ["Cuatro juegos de keycaps a elegir (Kea Grey, Kea Play, KeaColor)", "Hotswap Choc: cambia cualquier switch low profile a mano", "RGB per-key y underglow en ambas mitades", "Dos encoders rotatorios clicables"],
      en: ["Four keycap sets to choose from (Kea Grey, Kea Play, KeaColor)", "Choc hotswap: swap any low profile switch by hand", "Per key RGB plus underglow across both halves", "Two clickable rotary encoders"],
      fr: ["Quatre jeux de keycaps au choix (Kea Grey, Kea Play, KeaColor)", "Hotswap Choc : changez n'importe quel switch low profile à la main", "RGB par touche et underglow sur les deux moitiés", "Deux encodeurs rotatifs cliquables"]
    },
    buildOptions: [
      { name: { es: "Barebones", en: "Barebones", fr: "Barebones" }, price: 200.85 },
      { name: { es: "Completo · MTNU", en: "Full · MTNU", fr: "Complet · MTNU" }, sold: true },
      { name: { es: "Completo · Kea Grey", en: "Full · Kea Grey", fr: "Complet · Kea Grey" } },
      { name: { es: "Completo · Kea Play", en: "Full · Kea Play", fr: "Complet · Kea Play" } },
      { name: { es: "Completo · KeaColor", en: "Full · KeaColor", fr: "Complet · KeaColor" } }
    ],
    stats: [
      ["58", { es: "teclas", en: "keys", fr: "touches" }],
      ["4", { es: "sets de keycaps", en: "keycap sets", fr: "jeux de keycaps" }],
      ["BT+5", { es: "perfiles + USB-C", en: "profiles + USB-C", fr: "profils + USB-C" }],
      ["ZMK", { es: "firmware libre", en: "open firmware", fr: "firmware libre" }]
    ],
    caption: "retro · hotswap choc · BT+5 · ZMK",
    meta: ["58", "BT+5", "ZMK", "RGB", "OLED"],
    url: "https://www.etsy.com/listing/4542645510/"
  },
  {
    id: "totem",
    listingId: "4551478025",
    status: "available",
    featured: false,
    name: "Totem",
    version: "38 teclas",
    img: null,                 // PENDIENTE: no hay foto propia del Totem
    heroImg: null,
    gallery: [],
    titleImg: null,
    priceFrom: 26.00,
    priceFull: 152.75,
    priceOriginal: 40.00,
    discountPct: 35,
    stock: 1,
    kicker: { es: "Split · 38 teclas · ZMK", en: "Split · 38 keys · ZMK", fr: "Split · 38 touches · ZMK" },
    desc: {
      es: "El más compacto: 38 teclas, hotswap Choc y case ZMK Bluetooth. Disponible en inalámbrico o cableado.",
      en: "The most compact: 38 keys, Choc hotswap and ZMK Bluetooth case. Available wireless or wired.",
      fr: "Le plus compact : 38 touches, hotswap Choc et boîtier ZMK Bluetooth. Disponible sans fil ou filaire."
    },
    highlights: {
      es: ["38 teclas: el layout más compacto del catálogo", "Inalámbrico o cableado, tú eliges", "Choc Red hotswap", "Personalizable bajo pedido"],
      en: ["38 keys: the most compact layout in the catalogue", "Wireless or wired, your choice", "Choc Red hotswap", "Customisable on request"],
      fr: ["38 touches : le layout le plus compact du catalogue", "Sans fil ou filaire, au choix", "Hotswap Choc Red", "Personnalisable sur demande"]
    },
    buildOptions: [
      { name: { es: "Teclado completo", en: "Full Keyboard", fr: "Clavier complet" }, price: 152.75, priceTo: 187.85 },
      { name: { es: "Barebones", en: "Barebones", fr: "Barebones" }, price: 120.25, priceTo: 155.35 },
      { name: { es: "PCB soldada", en: "Soldered PCB", fr: "PCB soudée" }, price: 71.50 },
      { name: { es: "Solo PCB", en: "PCB Only", fr: "PCB seule" }, price: 26.00 }
    ],
    stats: [
      ["38", { es: "teclas", en: "keys", fr: "touches" }],
      ["BT", { es: "o cableado", en: "or wired", fr: "ou filaire" }],
      ["Choc", { es: "hotswap", en: "hotswap", fr: "hotswap" }],
      ["ZMK", { es: "firmware libre", en: "open firmware", fr: "firmware libre" }]
    ],
    caption: "38 teclas · choc hotswap · ZMK",
    meta: ["38", "BT", "ZMK", "Choc"],
    url: "https://www.etsy.com/listing/4551478025/"
  },
  {
    id: "corne-v4",
    listingId: "4524082170",
    status: "available",
    featured: false,
    name: "Corne RGB",
    version: "v4 MX",
    img: "corne-v4.jpg",
    heroImg: "corne-v4.jpg",
    gallery: ["corne-v4.jpg", "corne-v4-2.jpg"],
    titleImg: null,
    priceFrom: 44.10,
    priceFull: 261.00,
    priceOriginal: 49.00,
    discountPct: 10,
    stock: 2,
    kicker: { es: "Split · 42 teclas · QMK + VIA", en: "Split · 42 keys · QMK + VIA", fr: "Split · 42 touches · QMK + VIA" },
    desc: {
      es: "Corne v4 MX con case naranja a medida. Cableado TRRS y firmware QMK con VIA.",
      en: "Corne v4 MX with a custom orange case. TRRS wired and QMK firmware with VIA.",
      fr: "Corne v4 MX avec boîtier orange sur mesure. Câblé TRRS et firmware QMK avec VIA."
    },
    highlights: {
      es: ["Case naranja impreso a medida", "QMK + VIA: remapea desde el navegador", "Switches MX hotswap", "Cableado TRRS, sin baterías que cargar"],
      en: ["Custom printed orange case", "QMK + VIA: remap from your browser", "MX hotswap switches", "TRRS wired, no batteries to charge"],
      fr: ["Boîtier orange imprimé sur mesure", "QMK + VIA : remappage depuis le navigateur", "Switches MX hotswap", "Câblé TRRS, aucune batterie à charger"]
    },
    buildOptions: [
      { name: { es: "Teclado completo", en: "Full Keyboard", fr: "Clavier complet" }, price: 261.00 },
      { name: { es: "PCB soldada", en: "Soldered PCB", fr: "PCB soudée" }, price: 44.10 }
    ],
    stats: [
      ["42", { es: "teclas", en: "keys", fr: "touches" }],
      ["MX", { es: "hotswap", en: "hotswap", fr: "hotswap" }],
      ["VIA", { es: "remapeo web", en: "web remapping", fr: "remappage web" }],
      ["QMK", { es: "firmware libre", en: "open firmware", fr: "firmware libre" }]
    ],
    caption: "v4 · custom orange · TRRS · QMK",
    meta: ["42", "MX", "QMK", "RGB", "VIA"],
    url: "https://www.etsy.com/listing/4524082170/"
  },
  {
    id: "corne-v3",
    listingId: "4526929358",
    status: "available",
    featured: false,
    name: "Corne RGB",
    version: "v3 MX",
    img: "corne-v3.jpg",
    heroImg: "corne-v3.jpg",
    gallery: ["corne-v3.jpg"],
    titleImg: null,
    priceFrom: 40.50,
    priceOriginal: 45.00,
    discountPct: 10,
    stock: null,
    rating: 5.0,
    reviews: 1,
    kicker: { es: "Split · 42 teclas · QMK + Vial", en: "Split · 42 keys · QMK + Vial", fr: "Split · 42 touches · QMK + Vial" },
    desc: {
      es: "Corne HAL v3 RGB MX cableado por USB-C. Disponible como barebones o PCB.",
      en: "Corne HAL v3 RGB MX wired over USB-C. Available as barebones or PCB.",
      fr: "Corne HAL v3 RGB MX câblé en USB-C. Disponible en barebones ou PCB."
    },
    highlights: {
      es: ["Cableado por USB-C entre mitades", "QMK + Vial: remapeo en caliente", "RGB per-key", "El primer modelo de la tienda, con reseña de 5 estrellas"],
      en: ["USB-C wired between halves", "QMK + Vial: live remapping", "Per key RGB", "The shop's first model, with a 5 star review"],
      fr: ["Câblé en USB-C entre les moitiés", "QMK + Vial : remappage à chaud", "RGB par touche", "Le premier modèle de la boutique, noté 5 étoiles"]
    },
    buildOptions: [
      { name: { es: "Teclado completo", en: "Full Keyboard", fr: "Clavier complet" }, sold: true },
      { name: { es: "Barebones", en: "Barebones", fr: "Barebones" }, price: 171.00 },
      { name: { es: "PCB soldada", en: "Soldered PCB", fr: "PCB soudée" }, price: 135.00 },
      { name: { es: "Solo PCB", en: "PCB Only", fr: "PCB seule" }, price: 40.50 }
    ],
    stats: [
      ["42", { es: "teclas", en: "keys", fr: "touches" }],
      ["USB-C", { es: "entre mitades", en: "between halves", fr: "entre moitiés" }],
      ["Vial", { es: "remapeo live", en: "live remapping", fr: "remappage live" }],
      ["QMK", { es: "firmware libre", en: "open firmware", fr: "firmware libre" }]
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
