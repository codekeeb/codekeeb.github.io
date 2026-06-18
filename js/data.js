/* ============================================================
   CODEKEEB — datos de catálogo
   AQUÍ se escala la web:
   - Cambia CK_SHOP_URL por tu URL real de Etsy.
   - Para añadir un modelo: añade un objeto a CK_PRODUCTS
     (status "available" o "soon") y sus imágenes.
   - Para añadir un sabor: añade un objeto a CK_FLAVORS
     con sus colores de muestra (swatches).
   ============================================================ */

const CK_SHOP_URL = "https://www.etsy.com/shop/CodeKeeb"; // URL de Etsy

/*
  Campos de cada producto:
  - img:      foto para la tarjeta de la sección "Modelos" (assets/img/<lang>/<img>)
  - heroImg:  foto grande para el carrusel del inicio (assets/img/<lang>/<heroImg>)
  - titleImg: (opcional) SVG del nombre rotulado en assets/<titleImg>. Si falta,
              el carrusel muestra el nombre como texto con degradado.
  - kicker:   línea superior por idioma en el slide.
  - stats:    hasta 4 cifras destacadas en el slide [valor, etiqueta por idioma].
  - caption:  pie mono del slide (mismo en los 3 idiomas).
*/
const CK_PRODUCTS = [
  {
    id: "sofle-rgb",
    status: "available",          // "available" | "soon"
    name: "Sofle RGB",
    version: "v3.2",
    img: "hero.jpg",
    heroImg: "hero.jpg",
    titleImg: "title-sofle.svg",
    kicker: { es: "Split · Ergonómico · 60% · ZMK", en: "Split · Ergonomic · 60% · ZMK", fr: "Split · Ergonomique · 60% · ZMK" },
    desc: {
      es: "Split ergonómico 60% · 58 teclas · presoldado, inalámbrico y hotswap total.",
      en: "60% ergonomic split · 58 keys · presoldered, wireless and fully hotswap.",
      fr: "Split ergonomique 60% · 58 touches · présoudé, sans fil et hotswap intégral."
    },
    stats: [
      ["58", { es: "teclas", en: "keys", fr: "touches" }],
      ["BT+5", { es: "perfiles + USB-C", en: "profiles + USB-C", fr: "profils + USB-C" }],
      ["1200", { es: "mAh por mitad", en: "mAh per half", fr: "mAh par moitié" }],
      ["ZMK", { es: "firmware libre", en: "open firmware", fr: "firmware libre" }]
    ],
    caption: "v3.2 · presoldado · BT+5 · ZMK",
    meta: ["58", "BT+5", "ZMK", "RGB", "OLED"],
    url: null // null → usa CK_SHOP_URL
  },
  {
    id: "corne-v4-orange",
    status: "available",
    name: "Corne v4",
    version: "Custom Orange",
    img: "corne-hero.jpg",
    heroImg: "corne-hero.jpg",
    titleImg: null,
    kicker: { es: "Split · Ergonómico · 40% · ZMK", en: "Split · Ergonomic · 40% · ZMK", fr: "Split · Ergonomique · 40% · ZMK" },
    desc: {
      es: "Split ergonómico 40% · 42 teclas · case naranja, presoldado, inalámbrico y hotswap.",
      en: "40% ergonomic split · 42 keys · orange case, presoldered, wireless and hotswap.",
      fr: "Split ergonomique 40% · 42 touches · boîtier orange, présoudé, sans fil et hotswap."
    },
    stats: [
      ["42", { es: "teclas", en: "keys", fr: "touches" }],
      ["BT+5", { es: "perfiles + USB-C", en: "profiles + USB-C", fr: "profils + USB-C" }],
      ["RGB", { es: "per-key", en: "per-key", fr: "per-key" }],
      ["ZMK", { es: "firmware libre", en: "open firmware", fr: "firmware libre" }]
    ],
    caption: "v4 · custom orange · BT+5 · ZMK",
    meta: ["42", "BT+5", "ZMK", "RGB", "OLED"],
    url: null // null → usa CK_SHOP_URL; pon aquí el enlace directo al listing si lo tienes
  }
];

const CK_FLAVORS = [
  {
    id: "retro",
    status: "available",
    name: "Retro",
    // muestras de color del sabor (keycaps crema / gris / salvia)
    swatches: ["#f1ede2", "#b9b9b2", "#b7c9b4"]
  }
  // Para añadir un sabor: { id, status: "soon", name: "…", swatches: [...] }
];
