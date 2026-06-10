# Codekeeb — Web

Sitio estático de Codekeeb construido alrededor del **Sofle RGB v3.2**.
Sin frameworks ni build: HTML + CSS + JS vanilla. Se puede alojar en
cualquier hosting estático (GitHub Pages, Netlify, Cloudflare Pages…).

## Ver en local

Abre `index.html` directamente en el navegador, o sirve la carpeta:

```powershell
# con Python
python -m http.server 8080
# o con Node
npx serve .
```

## Estructura

```
web/
├── index.html          # única página (landing)
├── css/style.css       # sistema de diseño completo
├── js/
│   ├── i18n.js         # textos en ES / EN / FR
│   ├── data.js         # ★ catálogo: tienda, modelos y sabores
│   └── main.js         # animaciones, idioma, render dinámico
└── assets/
    ├── img/es|en|fr/   # fotos de producto por idioma (mismo nombre de archivo)
    ├── img/shared/     # fotos sin texto (válidas para todos los idiomas)
    ├── logo-dark.svg   # logo para fondos claros (barra en degradado)
    ├── logo-light.svg  # logo para fondos oscuros
    └── favicon.svg     # mirilla de la marca
```

## Cómo escalar la web

### 1. Conectar la tienda
En `js/data.js`, cambia `CK_SHOP_URL` por la URL real de Etsy.
Todos los botones de compra (`data-shop`) la usan automáticamente.

### 2. Añadir un modelo
Añade un objeto a `CK_PRODUCTS` en `js/data.js`:

```js
{
  id: "corne",
  status: "soon",            // "soon" → aparece "En el taller", sin botón
  name: "Corne",             // "available" → con botón de compra
  version: "v3 choc",
  img: "corne-hero.jpg",     // colócala en assets/img/es|en|fr/
  desc: { es: "…", en: "…", fr: "…" },
  meta: ["42", "choc", "ZMK"],
  url: null                  // o URL de listing específica
}
```

La tarjeta aparece sola en la sección **Modelos**, en los 3 idiomas.

### 3. Añadir un sabor
Añade un objeto a `CK_FLAVORS` en `js/data.js`:

```js
{ id: "ocean", status: "soon", name: "Ocean", swatches: ["#dfe9f0", "#9db8c9", "#46708c"] }
```

### 4. Añadir un idioma
1. En `js/i18n.js`, duplica el bloque `fr:` como nuevo código (p. ej. `de:`) y traduce.
2. Crea `assets/img/de/` con las mismas imágenes (mismos nombres de archivo).
3. Añade el botón en los dos selectores de `index.html`:
   `<button class="lang__btn" data-setlang="de">DE</button>`

### 5. Cambiar las fotos
Las imágenes por idioma comparten nombre de archivo:
`hero.jpg`, `feature-keycaps.jpg`, `feature-case.jpg`, `feature-rgb.jpg`,
`feature-bluetooth.jpg`, `feature-battery.jpg`. Para renovar una foto,
sustitúyela en las tres carpetas (`es/`, `en/`, `fr/`) con el mismo nombre.

## Pendiente / TODO

- [ ] Poner la URL real de Etsy en `js/data.js`
- [ ] Confirmar el email de contacto del footer (`hola@codekeeb.com` es placeholder)
- [ ] Opcional: añadir el precio en los botones de compra (claves `hero.buy` / `cta.buy` de `js/i18n.js`)
- [ ] Opcional: añadir Open Graph image dedicada (1200×630)
