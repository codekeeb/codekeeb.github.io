---
version: 1
slug: "modelo-html"
primary_target: "modelo.html"
related_targets: ["js/modelo.js","css/aparato.css"]
---

# Ficha de modelo (modelo.html?id=)

Modo: Persuade. El entusiasta decide la configuracion exacta y va a Etsy a comprarla.
Publico: ya sabe que es hotswap, ZMK, barebones; entra desde el movil comparando con Etsy.
Prueba disponible: fotos reales (flojas), ficha tecnica, firmware propio (RGB, OLED), Keymap Studio.
Restricciones: 3 idiomas, sin terceros (CSP), datos solo de js/data.js, precio con fecha.
Rechazado por el usuario: la version ergodox (tres barras apiladas, nombre gigante en 3 lineas, foto flotando, precio de anuncio).

## Direction contract

THESIS: Cada teclado es un aparato con su color y su etiqueta, no un anuncio. Rechaza la ficha de e-commerce (galeria a la izquierda, titulo gigante y lista de ventajas a la derecha).
OWN-WORLD: Bloques planos saturados, un color por modelo (Sofle Carbon ultramar, Retro magenta, Totem amarillo, Corne v4 naranja, Corne v3 menta) sobre gris claro de carcasa; tinta negra o blanca por contraste. Doto (matriz de puntos) solo para el nombre del modelo y la pantalla de precio; Schibsted Grotesk para todo lo demas. Controles como teclas de aparato: cuadradas, con un LED que se enciende en el color del modelo. Raises: datasheet (asignada) -> ficha como hoja de datos parametro/valor/unidad; six-pack -> cada dato clave en su indicador, uno por indicador; emission rail -> una familia, jerarquia por peso y tracking.
STORY: Veo que teclado es y su caracter en un vistazo, leo sus cuatro datos clave, elijo modulo a modulo y la pantalla me dice el precio; compro en Etsy sabiendo lo que llega.
FIRST VIEWPORT: Una sola barra fina arriba (logo, selector de modelos como fichas de color con su codigo, idioma). Debajo, el bloque de color del modelo a sangre: nombre en Doto en una linea, rasgo en etiqueta, foto en una ventana gris a la derecha (debajo en movil), fila de 4 indicadores, pantalla de precio y boton Configurar.
FORM: Hardware con color, fijado por el usuario (sustituye al puesto 4 asignado, datasheet, que queda como raise). Semilla 44c71bbb.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
