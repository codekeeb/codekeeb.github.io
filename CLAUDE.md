# Codekeeb — notas para Claude

Tienda de teclados split ergonomicos hechos a mano. La web es el catalogo;
hoy el cobro ocurre en Etsy.

## Que es este proyecto

Sitio **estatico puro**: HTML + CSS + JS vanilla. Sin framework, sin bundler,
sin `package.json`, sin paso de compilacion. Se publica solo en GitHub Pages
al empujar a `main`.

No introduzcas un framework, un bundler ni dependencias de npm en el sitio
sin que Ernesto lo pida explicitamente. Es una decision deliberada, no una
carencia.

## Mapa

| Archivo | Que es |
|---|---|
| `index.html` | **La portada es la tienda**: cinco franjas de color, una por modelo, con filtros que pliegan las que no encajan; el aparato de la forma (mitades, columnas, pulgares, hotswap con teclas de modo), el firmware (luz, pantallas, capas), comparacion y confianza |
| `modelo.html` | **Ficha de cada modelo**, `modelo.html?id=<id>`: tira de la familia, barra del producto, configurador en una columna con "tu configuracion incluye", los principios con la forma de ESE teclado, ficha, comparacion y barra de compra fija abajo |
| `comparar.html` | Los cinco en columnas, fila a fila, con "solo lo que cambia" |
| `legal.html` · `js/legal.js` · `js/legal-textos.js` | Aviso legal, privacidad, cookies y compras, en es / en / fr. Los datos del titular salen de `CK_TITULAR` (`js/data.js`) |
| `404.html` · `js/no-encontrada.js` | Pagina de error con los cinco modelos. Rutas **absolutas**: GitHub Pages la sirve en cualquier ruta rota |
| `tools/3d/` | Reconstruccion 3D del Sofle con img2threejs, **parada en la maqueta** (ver su README). No se publica |
| `assets/fonts/` | Las tipografias, servidas desde el sitio (licencia OFL al lado). **Nada de Google Fonts** |
| `catalogo.html` | Solo redirige a `/#tienda`, para no romper enlaces viejos |
| `js/data.js` | **Catalogo: la unica fuente de verdad.** Productos, precios, opciones de montaje (`buildOptions`) |
| `js/i18n.js` | Los textos, en es / en / fr |
| `js/tienda.js` | Motor comun: idioma, precios, niveles de montaje, tabla comparativa, iconos, encuadre de fotos |
| `js/portada.js` · `js/modelo.js` · `js/comparar.js` | La logica de cada pagina |
| `js/geometria.js` | Geometria real de los tres tableros (Sofle, Corne, Totem), copiada del Keymap Studio. `CK_TABLERO` dice que tablero es cada producto |
| `js/dibujo.js` | Dibuja un tablero en SVG desde esa geometria y le da los tres gestos: mitades, columnas, pulgares. **Es un esquema, no una foto**, y lo dice debajo |
| `js/sofle-led.js` | Los 30 LED por mitad del Sofle. Solo hay mapa de luz del Sofle: por eso la luz solo se ensena en sus fichas |
| `js/rgb.js` | Los efectos de luz, portados de `fxFrame` del Studio (30 fps, como el firmware) |
| `js/oled.js` · `js/oled-datos.js` | Las dos OLED con los mapas de bits del firmware |
| `css/aparato.css` | La hoja del mundo "hardware con color" (ver `DESIGN.md`): portada y ficha |
| `css/tienda.css` | La hoja del mundo anterior: comparador, legal y 404, hasta que se migren. **No se mezcla** con `aparato.css` |
| `assets/img/{es,en,fr}/` | Fotos con texto de la landing antigua. **Ya no las usa nadie**, pero son fotos reales: no se tiran sin que Ernesto lo diga |
| `keymap-studio/` | Aplicacion aparte, con su propio i18n. No comparte nada |

Anadir un producto a `js/data.js` le da su ficha sin tocar `modelo.html`, y
aparece solo en la tienda y en el comparador.

### El configurador y de donde sale cada dato

Las opciones de montaje salen de `buildOptions` y se ordenan en cuatro
niveles por su nombre (`tienda.js`, `niveles()`): Solo PCB, PCB soldada,
Barebones, Completo. Lo que incluye cada nivel es la definicion del nivel
(la tabla `LLEVA`), no un dato por producto.

Lo que **no** esta en los datos y por eso no se inventa:
- **Switches a elegir.** Ningun anuncio los trae con precio. La ficha dice
  cual monta (o con cual es compatible). Si se anade
  `switches: [{name:{es,en,fr}, price}]` a un producto, sale como selector.
- **Precio de los completos del Sofle Retro** (Kea Grey, Kea Play,
  KeaColor): sale "precio en Etsy".
- **Que decide el rango del Totem** (152,75 – 187,85): sale el rango.
- `CK_FLAVORS` (los acabados) no se ensena en ninguna parte.

## Privacidad y legal: lo que no se puede romper sin avisar

Desde el 24 sep 2026 la web **no pide nada a otros dominios**, no usa
cookies ni analitica, y por eso no lleva banner de cookies. Tres cosas
lo sostienen, y si una cambia hay que cambiar las otras:

- **La CSP** (`<meta http-equiv="Content-Security-Policy">` en cada
  pagina) solo deja cargar lo propio. `preview.mjs` avisa de cualquier
  peticion a un tercero ("pide a un tercero: ...").
- **`legal-textos.js`** promete exactamente eso. Anadir una analitica,
  un mapa, un video incrustado o un formulario obliga a reescribir la
  politica ANTES, y si es no esencial, a pedir consentimiento antes de
  cargarlo. No se anade sin que Ernesto lo pida.
- **Lo que se guarda en el navegador** esta listado en `tabla()` de
  `js/legal.js`. Una clave nueva de localStorage va tambien ahi.

`CK_TITULAR` (datos del aviso legal) esta a `null` hasta que Ernesto los
de. **Nunca se inventan ni se rellenan con ejemplos.**

Stock y descuentos caducan con los precios: pasados 14 dias desde
`CK_PRICES_UPDATED`, la web deja de decir "ultima unidad" o "-35%" y
manda a comprobarlo en Etsy (`datosFrescos()` en `tienda.js`). Se
arregla solo al revisar los datos y cambiar la fecha.

Accesibilidad: todo lo que se mueve solo mas de 5 s se para con el boton
de pausa de la cabecera (`CK.quieto()`; clase `.sin-movimiento`). Un
bucle nuevo tiene que respetarlo.

## Skills de diseno: quien manda

Cuatro fuentes de criterio y una jerarquia, para que no se contradigan
(instaladas el 24 sep 2026, a peticion de Ernesto):

1. **Este CLAUDE.md** manda sobre todas. Fotos reales, tres idiomas,
   sin terceros, dos duraciones y una curva.
2. **`impeccable`** (`.claude/skills/impeccable`): la skill principal de
   diseno. Direccion, craft, auditoria.
3. **`emil-design-eng`**: detalles de interaccion y movimiento, siempre
   dentro de `--t-tap` / `--t-enter` / `--ease`.
4. **`taste-redesign`** (`.claude/skills/taste-redesign`, de
   Leonxlnx/taste-skill, MIT, commit `c184364`): solo como lista de
   auditoria. **No se aplican** sus consejos de fotos de relleno
   (picsum.photos: rompe la regla 2 y la CSP), de "cifras organicas" y
   "fechas aleatorias para que parezcan reales" (es inventar datos), ni
   vidrio o grano como decoracion (impeccable lo prohibe).

Referencias, **para consultar, nunca para copiar** la marca de otro:
`.claude/referencias/apple-DESIGN.md` y `tesla-DESIGN.md`
(VoltAgent/awesome-design-md, MIT, commit `f696123`): paginas de
producto y configurador.

`img2threejs` (img2threejs/img2threejs, Apache-2.0, commit `6e60b5e`)
no va en el repositorio: son 5,5 MB de herramienta, no de web. Se
instala en `~/.claude/skills/img2threejs` con
`git clone https://github.com/img2threejs/img2threejs ~/.claude/skills/img2threejs && git -C ~/.claude/skills/img2threejs checkout 6e60b5e`.
Un modelo 3D sacado de una foto es una **representacion generada**: va
rotulado como orientativo, igual que los esquemas, y three.js se sirve
desde el sitio (`assets/vendor/`), no desde un CDN.

## Las tres reglas que se rompen solas

**1. Tres idiomas, siempre.** `js/i18n.js` tiene 117 claves en es, en y fr.
Si anades un texto en uno y olvidas los otros, la web en ese idioma muestra
la clave cruda (`nav.features`) en vez del texto. Lo mismo con
`data-i18n-img`: el archivo tiene que existir en las tres carpetas.
En el catalogo los textos van como `{es, en, fr}`.

**2. Las fotos son de producto real.** Los 64 archivos de `assets/` son
fotografias de teclados que Ernesto ha construido y vende. **Nunca** los
sustituyas por imagenes generadas: la web enlaza a anuncios de venta y eso
seria tergiversar el producto.

**3. Los precios caducan.** `CK_PRICES_UPDATED` en `js/data.js` es la fecha
de la ultima revision y se muestra al usuario. Si tocas cualquier precio,
actualizala. Si esta a mas de dos semanas, avisa.

## Antes de dar nada por bueno

```bash
python3 tools/check-i18n.py        # los 3 idiomas siguen cuadrando
python3 tools/check-movimiento.py  # dos duraciones, una curva, bucles justificados
node tools/preview.mjs             # portada, catalogo y comparador, 3 idiomas
node tools/preview.mjs --all       # + la pagina de cada producto
```

`preview.mjs` deja las capturas en `tools/.preview/` y avisa de
desbordamientos horizontales, errores de JavaScript, recursos que no cargan
y textos sin traducir. **Manda las capturas** antes de decir que algo
funciona: Ernesto suele revisar desde el movil.

Las tipografias se sirven desde `assets/fonts/`, asi que las capturas son
fieles aunque falle la red. `preview.mjs` lanza
Chromium tras el proxy del contenedor y lo capa a TLS 1.2, que es lo que
hace falta para que Google Fonts cargue (el relay corta el ClientHello
grande de TLS 1.3, y los argumentos por omision de Playwright lo vuelven a
romper, por eso el navegador se lanza a mano y se conduce por CDP). Si algo
de eso falla lo dice al final: "(con tipografias de respaldo)", y entonces
no juzgues el interletrado a partir de ellas.

`check-movimiento.py` es la red que evita que el sistema de movimiento se
deshaga solo. El acuerdo es **dos duraciones** (`--t-tap` para lo que
responde al dedo, `--t-enter` para lo que entra en escena) y **una curva**
(`--ease`). Si necesitas un bucle, tiene que ensenar algo del teclado y
hay que apuntarlo en `BUCLES_PERMITIDOS` con su motivo.

## Como se trabaja

`main` es produccion: se publica sola. **Desde el 15 sep 2026 se trabaja
directamente sobre `main`**, por decision expresa de Ernesto: quiere ver
cada cambio en la pagina de verdad en vez de en capturas. Antes la regla
era la contraria; si vuelve a cambiar, se cambia aqui.

Eso quita la red de la revision, asi que la pone el que empuja:
**los tres validadores en verde y las capturas mandadas ANTES de empujar.**
Nada de empujar a ver que pasa.

Escribe los comentarios de codigo en castellano, como el resto del proyecto,
y explica el *porque*, no el *que*.

## A donde va esto

El objetivo es convertir la web de landing de un producto en tienda real:
rejilla de modelos como portada, configurador de personalizacion (switches,
keycaps, colores, inalambrico), precios sincronizados con Etsy y, mas
adelante, cobro propio con Stripe. Ese ultimo paso sacara el sitio de GitHub
Pages, porque hara falta backend. No lo des por hecho todavia.
