# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Entusiastas de teclados mecanicos que **ya conocen el terreno**: distinguen
un Sofle de un Corne, saben que es hotswap, low profile o Choc, y comparan
fichas tecnicas antes de comprar. No necesitan que se les explique que es un
teclado split; necesitan saber que trae exactamente este, con que switches,
que firmware y que pueden cambiar despues.

Llegan buscando un montaje bien hecho **sin tener que soldar** y sin renunciar
al control: quieren la pieza montada por alguien que sabe, no un kit.

Explicar lo basico a este publico le hace perder el tiempo. La jerga del
catalogo (hotswap, ZMK, barebones, BT+5, perfil MA) es vocabulario compartido,
no una barrera: se mantiene.

## Product Purpose

Vender teclados split ergonomicos construidos a mano, uno a uno, montados y
probados antes de salir del taller. La web es el catalogo y el lugar donde el
comprador entiende que esta comprando; el cobro ocurre hoy en Etsy.

Exito es que un entusiasta encuentre el modelo, entienda la configuracion
exacta y compre sin escribir un mensaje preguntando.

## Positioning

**El teclado es tuyo hasta el fondo: nada esta cerrado.**

Los cuatro hechos que lo sostienen, y que un competidor de Etsy no puede
copiar sin construirlos:

1. **Firmware propio.** Motor RGB con 10 modos y degradados continuos entre
   las dos mitades, y OLED dual con firmware propio (bateria, capa, WPM,
   Bongo Cat). No es una pieza que se compra: esta escrito aqui.
2. **Editor de keymaps propio** (`keymap-studio/`, 372 KB): editor visual
   ZMK con **edicion en vivo por USB** via ZMK Studio RPC, simulacion de
   underglow RGB y OLED animados, capas, macros, combos y encoders, y
   exportacion del `.keymap`. Es el diferencial mas fuerte y el mas
   infrautilizado: hoy la web solo lo enlaza como un item de menu.
3. **Personalizacion total**: colores, switches, keycaps y layout a medida.
4. **Todos los componentes reemplazables.** Hotswap real, firmware abierto,
   nada soldado que el usuario no pueda cambiar despues.

Lo que conecta los cuatro no es la especificacion: es que el comprador manda.

## Operating Context

El comprador compara en Etsy y en foros antes de llegar. Suele entrar desde el
movil. La compra se cierra en Etsy, con su proteccion al comprador; la web
tiene que llevarle al anuncio y la variante correctos.

Despues de comprar, el usuario vuelve a la web a usar Keymap Studio con el
teclado conectado por USB: es una herramienta de postventa, no solo de venta.

## Capabilities and Constraints

- Sitio **estatico puro**: HTML + CSS + JS vanilla, sin framework, sin
  bundler, sin `package.json`. Publicado en GitHub Pages desde `main`.
- **Tres idiomas obligatorios**: es / en / fr, 117 claves en `js/i18n.js`.
  Un texto en un solo idioma rompe la web en los otros dos.
- `js/data.js` es la unica fuente de verdad del catalogo: 5 modelos, 3
  acabados, precios, stock, opciones de montaje y enlace directo a cada
  anuncio de Etsy con su `listingId`.
- `modelo.html?id=` es plantilla generica: anadir un producto a `data.js` le
  da su pagina sin tocar codigo.
- Los precios son **informativos** y llevan fecha (`CK_PRICES_UPDATED`). El
  precio que se cobra es el de Etsy.
- **Sin decidir todavia**: el cobro propio con Stripe esta elegido como
  destino pero no implementado, y sacara el sitio de GitHub Pages porque
  hara falta backend. El configurador de personalizacion (switches, keycaps,
  colores como opciones con precio) tampoco existe aun.

## Brand Commitments

- Nombre y logotipo **CODE/KEEB**, rotulado en tres niveles: modelo en negro,
  rasgo en gris oscuro, y acento en degradado solo cuando lleva RGB.
- Degradado de marca naranja -> rosa -> azul.
- Las 64 imagenes de `assets/` son **fotografias de producto real**, de
  teclados construidos y vendidos. Nunca se sustituyen por imagenes
  generadas: la web enlaza a anuncios de venta.
- Voz en castellano, directa y sin superlativos de folleto.

## Evidence on Hand

- **Resenas y valoraciones de Etsy**: existen y son la prueba social mas
  fuerte disponible. **La web no las usa en ningun sitio.** Faltan los
  numeros concretos (ventas, estrellas); no inventarlos.
- **Fotos del proceso de montaje**: existen (taller, soldadura, impresion del
  case). Aun no estan en `assets/`; hay que incorporarlas.
- **Repositorios de firmware publicos**: 17 repos con el ZMK/QMK de cada
  teclado bajo `github.com/codekeeb`. Prueba verificable y citable de que el
  firmware es propio y abierto.
- `keymap-studio/` funciona y es demostrable en vivo desde el navegador.
- No hay testimonios, benchmarks ni menciones de prensa citables.

## Product Principles

1. **Hablar de tu a tu.** El publico sabe. Ficha tecnica antes que promesa.
2. **Demostrar, no afirmar.** Firmware abierto, editor en vivo, fotos de
   proceso y resenas reales. Cada afirmacion con algo detras.
3. **El catalogo primero.** Lo que vendes se ve antes que lo que opinas.
4. **Nada cerrado.** Cada decision de producto y de web debe dejar al
   comprador la posibilidad de cambiarlo despues.
5. **El precio no miente.** Fecha visible, stock real, y el enlace lleva a la
   variante exacta.
