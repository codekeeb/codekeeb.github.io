# Tríptico de la caja · Sofle Choc Space Black

La hoja que va dentro de la caja: A4 apaisado, a doble cara, plegado en
tres hacia dentro. En inglés, en blanco y negro, pensado para una
impresora de casa (nada a menos de 7 mm del borde, nada de negro a sangre).

- `triptico.pdf`: lo que se imprime. Página 1, fuera; página 2, dentro.
- `triptico.html`: la fuente. Se abre en el navegador para verla.
- `generar.py`: regenera los QR y el PDF.
- `qr/`: los cuatro QR, generados aquí (sin servicios de terceros).

## Imprimir

1. A4, orientación horizontal, **escala 100 %** (no "ajustar a la página":
   descuadra los pliegues).
2. A doble cara, **voltear por el lado corto**.
3. Plegar por las rayitas de arriba y abajo: primero la solapa estrecha
   ("Online") hacia dentro, luego la portada encima.

Papel de 120 a 160 g si la impresora lo acepta: el de 80 g transparenta.
Antes de imprimir la tanda, escanea los cuatro QR con el móvil.

## Regenerar

```bash
pip install segno                 # solo para los QR; no va en la web
python3 tools/triptico/generar.py
```

Deja `triptico.pdf` y dos PNG (`cara-1.png`, `cara-2.png`) para revisar
sin abrir el PDF; los PNG no se suben.

## De dónde sale cada cosa

El papel no se actualiza, así que aquí solo va lo que hace falta para
empezar, y lo que puede cambiar va por QR al manual.

- **Primeros pasos, teclas y encoders**: del manual del Sofle
  (`js/manuales.js`), que sale del `.keymap` del firmware, no de su README.
- **En la caja** y **batería de 2000 mAh por mitad**: dicho por Ernesto el
  26 sep 2026.
- **El dibujo del teclado**: `js/geometria.js` y `js/dibujo.js`, los mismos
  de la web. Las pantallas y el hueco del encoder, con las coordenadas de
  Keymap Studio.

Si cambia el keymap (por ejemplo, las teclas de los perfiles Bluetooth o
de la luz), hay que cambiar también este papel.
