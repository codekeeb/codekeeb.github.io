---
name: Codekeeb
description: Teclados split hechos a mano. Cada modelo es un aparato con su color y su etiqueta.
colors:
  carcasa: "#e8e9eb"
  panel: "#f7f7f8"
  blanco: "#ffffff"
  tinta: "#111111"
  tinta-2: "#3b3e45"
  linea: "#c6c9cf"
  linea-2: "#9a9ea7"
  lcd: "#d4dacb"
  lcd-tinta: "#161a10"
  ventana: "#15161a"
  ok: "#176b43"
  aviso: "#8a4f0c"
  modelo-sofle-carbon: "#2b3bf5"
  modelo-sofle-retro: "#f0469a"
  modelo-totem: "#ffd21f"
  modelo-corne-v4: "#ff6b1a"
  modelo-corne-v3: "#2bd98a"
typography:
  nombre:
    fontFamily: "Doto, Schibsted Grotesk, monospace"
    fontSize: "clamp(3.4rem, 11vw, 8.5rem)"
    fontWeight: 900
    lineHeight: 0.82
    letterSpacing: "-0.02em"
  pantalla:
    fontFamily: "Doto, Schibsted Grotesk, monospace"
    fontSize: "clamp(1.9rem, 4vw, 2.6rem)"
    fontWeight: 900
    lineHeight: 1
  titulo:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3.4vw, 2.25rem)"
    fontWeight: 800
    letterSpacing: "-0.025em"
  cuerpo:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  etiqueta:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  s: "8px"
  m: "12px"
spacing:
  canal: "clamp(16px, 4vw, 40px)"
  maxw: "1240px"
components:
  tecla-modelo:
    backgroundColor: "{colors.modelo-sofle-carbon}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.s}"
    height: "52px"
    padding: "0 1.4em"
  tecla-tinta:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.s}"
    height: "52px"
  pantalla:
    backgroundColor: "{colors.lcd}"
    textColor: "{colors.lcd-tinta}"
    typography: "{typography.pantalla}"
    rounded: "{rounded.s}"
    padding: "8px 16px 10px"
  opcion:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.s}"
    padding: "14px 16px"
  modulo:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.m}"
    padding: "18px"
---

# Design System: Codekeeb

## Overview

**Creative North Star: "Hardware con color"**

Cada teclado se presenta como un aparato, no como un anuncio. El modelo
llena su placa con un color plano y saturado, y lleva su nombre en
letras de matriz de puntos, como la etiqueta de una maquina. Alrededor,
la pagina es la carcasa: gris claro, paneles casi blancos y tinta negra.
Los controles se comportan como teclas, y las cifras que importan salen
en una pantalla de cristal liquido.

**Alcance, a 24 sep 2026:** este sistema cubre la portada (`index.html`)
y la ficha (`modelo.html`), las dos con la hoja `css/aparato.css`. El
comparador, las paginas legales y la 404 siguen con `css/tienda.css`, del
mundo anterior. Hasta que se migren, las dos hojas conviven y **no se
mezclan**: una pagina carga una o la otra.

**Key Characteristics:**
- Un color por modelo, a sangre, en su placa. Ese color no aparece en ningun otro modelo.
- Dos tipografias: Doto solo para el nombre y las cifras de pantalla, y Schibsted Grotesk para todo lo demas.
- La jerarquia sale del peso y el tracking, no de una escalera de tamanos.
- Los datos van en filas con regla, como una hoja de datos: parametro y valor.
- Fotos reales en una ventana oscura, nunca recortadas ni sustituidas.

## Colors

### Primary
- **Color del modelo** (`modelo-*`): cada producto trae `color.fondo` y
  `color.tinta` en `js/data.js`, y `modelo.js` los vuelca en las
  variables `--modelo` y `--modelo-tinta`. Rellena la placa, el boton de
  compra, el LED encendido y la ficha de color del selector. La tinta se
  elige por contraste: blanco sobre el ultramar del Sofle Carbon y negro
  sobre los demas, siempre a 5,4:1 o mas.

### Neutral
- **Carcasa** (`carcasa`): el fondo de la pagina.
- **Panel** (`panel`): los modulos del configurador y la cabecera.
- **Tinta** (`tinta`) y **tinta secundaria** (`tinta-2`, 9,9:1 sobre el panel).
- **Reglas** (`linea`, `linea-2`): separan filas, nunca encierran tarjetas.
- **Pantalla LCD** (`lcd` / `lcd-tinta`): gris verdoso de cristal liquido, solo para cifras.
- **Ventana** (`ventana`): el marco oscuro de las fotos. Tapa que las fotos tengan fondos distintos.

### Named Rules
**The One Model Rule.** En la ficha solo hay un color de modelo encendido; los otros cuatro aparecen solo como muestras en el selector. La portada es la excepcion: enseña los cinco, pero cada uno en su franja y nunca mezclado con otro.
**The Contrast-Picked Ink Rule.** Un producto nuevo trae su tinta elegida por contraste medido (4,5:1 como minimo), nunca a ojo.

## Typography

**Display:** Doto 900, una fuente de matriz de puntos alojada en `assets/fonts/`.
**Texto:** Schibsted Grotesk, de 400 a 800, tambien alojada en el sitio.

### Hierarchy
- **Nombre** (Doto 900, clamp 3,4–8,5rem, interlineado 0,82): el nombre del modelo, en una sola linea.
- **Pantalla** (Doto 900, clamp 1,9–2,6rem): precios y totales dentro de la pantalla LCD. Tambien las cuatro lecturas de la placa.
- **Titulo** (Schibsted Grotesk 800, clamp 1,6–2,25rem, −0,025em): los titulos de seccion.
- **Cuerpo** (Schibsted Grotesk 400, 1,0625rem, interlineado 1,55): hasta 60–62 caracteres por linea.
- **Etiqueta** (Schibsted Grotesk 700, 0,8125rem, +0,06em, en mayusculas): solo dentro de pantallas y en la cabecera de la ficha tecnica.

### Named Rules
**The Doto Is A Screen Rule.** Doto solo aparece donde habria una pantalla o una etiqueta de maquina: el nombre, los precios y las lecturas. Nunca se usa en parrafos, botones ni titulos.
**The No Tabular Figures Rule.** Schibsted Grotesk no lleva `tabular-nums`: esa opcion tambien da ancho fijo a las comas y los dos puntos, y salia "120 , 25 €". Las cifras que se comparan ya van en Doto, que es de ancho fijo.

## Layout

- La cabecera es una sola barra fina y fija: logo, selector de modelos y ajustes. Por debajo de 640px se parte en dos pisos, y los modelos se desplazan en horizontal.
- La placa ocupa todo el ancho con el color del modelo. En escritorio van dos columnas (texto y ventana de fotos). Por debajo de 960px la ventana pasa arriba.
- El configurador tiene los modulos a la izquierda y el resumen fijo a la derecha. Por debajo de 960px pasa a una sola columna.
- La barra de compra se fija abajo cuando la placa sale de la vista. En movil, si el precio es un rango, la cifra baja a dos lineas y el boton no se parte nunca.
- Contenedor de hasta 1240px y canal lateral de 16 a 40px.

## Elevation & Depth

El mundo es plano: la profundidad solo describe objetos fisicos.
- Las **teclas** llevan un canto inferior (una sombra interior de 3px) que desaparece al pulsarlas.
- La **pantalla LCD** va hundida, con una sombra interior.
- La **ventana** de fotos lleva una unica sombra difusa que la separa de la placa.

### Named Rules
**The Only Physical Things Rule.** Solo tienen relieve las teclas, la pantalla y la ventana. Las secciones, los modulos y las filas son planos.

## Shapes

Dos radios: 8px para las piezas que se pulsan o se leen (teclas, opciones, pantallas y fichas) y 12px para los contenedores (modulos, ventana y resumen). El LED es un circulo de 12px.

## Components

### Buttons
Teclas cuadradas de 52px de alto, en Schibsted Grotesk 800. Hay tres variantes: la **tecla de placa** (tinta del modelo sobre su color, "Configurar"), la **tecla de modelo** (color del modelo, "Comprar en Etsy") y la **tecla de tinta** (negra, para lo secundario). Al pulsar bajan 2px en `--t-tap`.

### Chips
El selector de modelos: una muestra cuadrada de 14px con el color de cada modelo y su nombre corto. El modelo actual se llena de su color.

### Cards / Containers
Los modulos del configurador son paneles planos con radio de 12px, sin borde ni sombra. **No hay tarjetas de icono, titulo y texto repetidas:** esas respuestas van en filas con regla.

### Inputs / Fields
Las opciones del configurador (`opcion`) son radios con aspecto de tecla. Llevan un LED gris que se enciende en el color del modelo, con un brillo interior y sin halo. La seleccion se marca con un contorno interior de 2px en tinta. El foco de teclado lleva un contorno de 2,5px separado 3px.

### Navigation
La barra superior y el pie. El pie es negro, con la fecha de los precios, los enlaces de la tienda y los enlaces legales.

### Pantalla LCD
La unica superficie donde van cifras grandes: "desde" en la placa, el total en el resumen y el precio en la barra de compra. Lleva una etiqueta en mayusculas arriba, la cifra en Doto y, si hace falta, una nota pequeña debajo.

### Franja de modelo
La portada es un muestrario: cinco franjas a toda altura, cada una del color de su modelo. Llevan el nombre en Doto, la version, la foto en su ventana, cuatro lecturas, la pantalla "desde" y la tecla Configurar. Toda la franja lleva a la ficha. Los filtros no quitan modelos: **pliegan** los que no encajan, que se quedan de canto con su nombre en vertical. Por debajo de 1080px las franjas pasan a bandas apiladas.

### Teclas de modo
Teclas con un LED gris que se pone blanco sobre la tecla negra cuando estan activas. Se usan en los filtros de la portada y en el aparato de la forma (mitades, columnas, pulgares, hotswap). Un solo aparato con teclas de modo sustituye a una seccion por cada principio. El LED activo no usa ningun color de modelo: esos colores son de los modelos.

### Hoja de datos
Una tabla de parametro y valor. La cabecera es negra, los grupos (Generales, Componentes) van en etiqueta y las filas se separan con reglas de 1px. La lista de confianza sigue el mismo patron: icono, lo que se promete y la explicacion.

### Manual
`manual.html?id=`: una placa corta del color del modelo, un índice de capítulos numerados fijo a la izquierda (tira deslizable en móvil) y el texto en una columna de 64 caracteres. Las teclas del texto son `kbd` con su canto; los pasos se numeran en pequeñas pantallas LCD. Cada capa del teclado es una **lámina** en la ventana oscura: teclas en línea clara, las que cambian en esa capa rellenas del color del modelo, la que se mantiene con borde discontinuo y los encoders redondos. En móvil las dos mitades se apilan.

## Do's and Don'ts

### Do:
- **Do** sacar el color, el nombre corto y los datos de `js/data.js`. Un producto nuevo tiene ficha sin tocar el CSS.
- **Do** usar el color del modelo solo en su placa, en su boton de compra y en su LED.
- **Do** poner los datos comparables en filas con regla, no en tarjetas.
- **Do** mostrar las fotos reales dentro de la ventana oscura.
- **Do** mover las cosas solo con `--t-tap` (140ms) o `--t-enter` (380ms) y con la curva `--ease`.

### Don't:
- **Don't** usar Doto en parrafos, botones o titulos de seccion.
- **Don't** poner `tabular-nums` sobre Schibsted Grotesk.
- **Don't** poner etiquetas pequeñas encima de los titulos, ni texto con degradado.
- **Don't** repetir tarjetas iguales de icono, titulo y texto como estructura de seccion.
- **Don't** mezclar `tienda.css` y `aparato.css` en una misma pagina.
- **Don't** usar colores de modelo que no esten en `data.js`, ni inventarlos para otras partes de la web.
