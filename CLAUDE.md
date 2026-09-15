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
| `index.html` | **Portada de la tienda.** Heroe con foto, las cuatro ventajas funcionando y el carril de los cinco |
| `catalogo.html` | Rejilla de los cinco con precio, stock y filtros |
| `comparar.html` | Los cinco en columnas, fila a fila |
| `modelo.html` | Plantilla **generica** de producto, se abre como `modelo.html?id=<id>` |
| `js/data.js` | **Catalogo: la unica fuente de verdad.** Productos, precios, acabados |
| `js/i18n.js` | Los textos, en es / en / fr |
| `js/tienda.js` | Motor comun de portada, catalogo y comparador: idioma, precios, encuadre de fotos |
| `js/product.js` | Logica de `modelo.html` |
| `css/portada.css` · `css/catalogo.css` · `css/comparar.css` | Una hoja por pagina, independientes |
| `css/style.css` | Sistema de diseno de la web anterior. **Hoy solo lo usa `modelo.html`** |
| `js/main.js` | **Muerto**: movia la landing de un producto que ya no existe. Ver abajo |
| `assets/img/{es,en,fr}/` | Fotos con texto, una por idioma, **mismo nombre** |
| `assets/img/shared/` | Fotos sin texto |
| `keymap-studio/` | Aplicacion aparte, con su propio i18n. No comparte nada |

Anadir un producto a `js/data.js` le da su pagina sin tocar `modelo.html`, y
aparece solo en la portada, el catalogo y el comparador.

### Restos de la landing anterior (15 sep 2026)

La portada dejo de ser una landing de un solo producto. Al sustituirla
quedaron tres cosas colgando, y **ninguna se ha borrado**: hay que decidirlas.

- `js/main.js` ya no lo carga nadie. Es el unico que leia `CK_FLAVORS`, o
  sea que **los sabores de keycaps no se ensenan en ninguna parte**.
- 120 de las 188 claves de `js/i18n.js` no las usa ningun HTML: son las de
  las secciones viejas (`f1.*` a `f4.*`, `specs.*`, `flavors.*`) y las de
  los prototipos (`d.proto*`, `d.backToAll`).
- `assets/img/{es,en,fr}/` son cinco fotos rotuladas por idioma que solo
  usaba la landing. Son **fotos reales de producto**: no se tiran sin que
  Ernesto lo diga.

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

Las capturas salen ya con las **tipografias reales**: `preview.mjs` lanza
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

`main` es produccion: se publica sola. **No empujes a `main` directamente.**
Rama, capturas, revision, y la fusion la hace Ernesto desde la web de GitHub.

Escribe los comentarios de codigo en castellano, como el resto del proyecto,
y explica el *porque*, no el *que*.

## A donde va esto

El objetivo es convertir la web de landing de un producto en tienda real:
rejilla de modelos como portada, configurador de personalizacion (switches,
keycaps, colores, inalambrico), precios sincronizados con Etsy y, mas
adelante, cobro propio con Stripe. Ese ultimo paso sacara el sitio de GitHub
Pages, porque hara falta backend. No lo des por hecho todavia.
