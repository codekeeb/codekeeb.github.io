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

const CK_PRODUCTS = [
  {
    id: "sofle-rgb",
    status: "available",          // "available" | "soon"
    name: "Sofle RGB",
    version: "v3.2",
    // imagen por idioma: assets/img/<lang>/<img>
    img: "hero.jpg",
    desc: {
      es: "Split ergonómico 60% · 58 teclas · presoldado, inalámbrico y hotswap total.",
      en: "60% ergonomic split · 58 keys · presoldered, wireless and fully hotswap.",
      fr: "Split ergonomique 60% · 58 touches · présoudé, sans fil et hotswap intégral."
    },
    meta: ["58", "BT+5", "ZMK", "RGB", "OLED"],
    url: null // null → usa CK_SHOP_URL
  }
  // Ejemplo de próximo modelo (descomenta y completa cuando toque):
  // {
  //   id: "corne",
  //   status: "soon",
  //   name: "Corne",
  //   version: "v3 choc",
  //   img: "hero.jpg",
  //   desc: { es: "…", en: "…", fr: "…" },
  //   meta: ["42", "choc", "ZMK"],
  //   url: null
  // }
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
