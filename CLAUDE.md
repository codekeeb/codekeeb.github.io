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
| `index.html` | Portada |
| `modelo.html` | Plantilla **generica** de producto, se abre como `modelo.html?id=<id>` |
| `js/data.js` | **Catalogo: la unica fuente de verdad.** Productos, precios, acabados |
| `js/i18n.js` | Los textos, en es / en / fr |
| `js/main.js` | Portada: idioma, animaciones, render |
| `js/product.js` | Logica de `modelo.html` |
| `css/style.css` | Sistema de diseno completo |
| `assets/img/{es,en,fr}/` | Fotos con texto, una por idioma, **mismo nombre** |
| `assets/img/shared/` | Fotos sin texto |
| `keymap-studio/` | Aplicacion aparte, con su propio i18n. No comparte nada |

Anadir un producto a `js/data.js` le da su pagina sin tocar `modelo.html`.

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
python3 tools/check-i18n.py     # los 3 idiomas siguen cuadrando
node tools/preview.mjs          # capturas movil + escritorio, 3 idiomas
node tools/preview.mjs --all    # + la pagina de cada producto
```

`preview.mjs` deja las capturas en `tools/.preview/` y avisa de
desbordamientos horizontales, errores de JavaScript, recursos que no cargan
y textos sin traducir. **Manda las capturas** antes de decir que algo
funciona: Ernesto suele revisar desde el movil.

Aviso sobre las capturas: en el contenedor de Claude, Google Fonts esta
bloqueado por el proxy de red. Las capturas salen con tipografias de
respaldo, asi que no juzgues el interletrado ni la altura de linea a partir
de ellas. Todo lo demas es fiel.

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
