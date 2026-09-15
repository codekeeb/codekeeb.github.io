/* ============================================================
   CODEKEEB — la forma real del Sofle Choc
   ------------------------------------------------------------
   Estas coordenadas NO son un dibujo aproximado: salen tal cual de
   `keymap-studio/index.html`, que a su vez las tiene del layout fisico
   del shield. Por eso el teclado que se ve en la portada tiene el splay
   de las columnas, la caida del menique y los pulgares en abanico, en vez
   de la rejilla ortogonal que habia antes.

   Cada entrada es  [mitad, x, y, rotacion]  y un quinto valor opcional
   con el ancho cuando la tecla no es de 1u. Los dos `null` son los clicks
   de encoder, que ocupan posicion en el keymap pero no son teclas.

   Si el layout cambia en el Studio, esto se regenera desde alli; no se
   edita a mano.
   ============================================================ */

const CK_SOFLE = {
  /* tamano de tecla y paso entre centros, en las mismas unidades que las
     coordenadas: el escenario se escala entero con un `transform`. */
  KEY: 86,
  PASO: 90,
  ESCENARIO: { w: 1520, h: 666 },
  /* Cada mitad es una caja girada 7 grados: es el angulo real del case. */
  MITADES: [
    { x: 80,  y: 24, rot:  7, w: 661, h: 528 },
    { x: 770, y: 24, rot: -7, w: 670, h: 528 },
  ],
  ENCODERS: [{ x: 551, y: 287 }, { x: 9, y: 287 }],
  TECLAS: [
  [0, 0, 43, 0],
  [0, 90, 43, 0],
  [0, 180, 14, 0],
  [0, 270, 0, 0],
  [0, 360, 14, 0],
  [0, 450, 29, 0],
  [1, 134, 29, 0],
  [1, 224, 14, 0],
  [1, 314, 0, 0],
  [1, 404, 14, 0],
  [1, 494, 43, 0],
  [1, 584, 43, 0],
  [0, 0, 133, 0],
  [0, 90, 133, 0],
  [0, 180, 104, 0],
  [0, 270, 90, 0],
  [0, 360, 104, 0],
  [0, 450, 119, 0],
  [1, 134, 119, 0],
  [1, 224, 104, 0],
  [1, 314, 90, 0],
  [1, 404, 104, 0],
  [1, 494, 133, 0],
  [1, 584, 133, 0],
  [0, 0, 223, 0],
  [0, 90, 223, 0],
  [0, 180, 194, 0],
  [0, 270, 180, 0],
  [0, 360, 194, 0],
  [0, 450, 209, 0],
  [1, 134, 209, 0],
  [1, 224, 194, 0],
  [1, 314, 180, 0],
  [1, 404, 194, 0],
  [1, 494, 223, 0],
  [1, 584, 223, 0],
  [0, 0, 313, 0],
  [0, 90, 313, 0],
  [0, 180, 284, 0],
  [0, 270, 270, 0],
  [0, 360, 284, 0],
  [0, 450, 299, 0],
  null,
  null,
  [1, 134, 299, 0],
  [1, 224, 284, 0],
  [1, 314, 270, 0],
  [1, 404, 284, 0],
  [1, 494, 313, 0],
  [1, 584, 313, 0],
  [0, 180, 374, 0],
  [0, 270, 360, 0],
  [0, 360, 374, 0],
  [0, 460, 399, 15],
  [0, 542, 432, -65, 108],
  [1, 20, 432, 65, 108],
  [1, 124, 399, -15],
  [1, 224, 374, 0],
  [1, 314, 360, 0],
  [1, 404, 374, 0]
  ],
};
