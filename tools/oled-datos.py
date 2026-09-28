#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenera js/oled-datos.js a partir de OLED_ASSETS del Keymap Studio.

    python3 tools/oled-datos.py

La portada y las fichas ensenan las dos OLED con los mismos mapas de bits
que el editor. El editor es la fuente (sus assets salen del firmware), asi
que los datos de la portada se sacan de el en vez de editarlos a mano: si
el Studio corrige un icono, esto lo arrastra.

Solo se copia lo que la portada usa. `pokemon` se queda fuera: son 48
fotogramas y 38 KB para ensenar lo mismo que las otras animaciones.
"""
import io
import json
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STUDIO = os.path.join(RAIZ, "keymap-studio", "index.html")
SALIDA = os.path.join(RAIZ, "js", "oled-datos.js")

SUELTAS = ("bt", "bt_no_signal", "bt_unbonded", "usb", "bolt", "gauge", "grid",
           "profiles")
# Modificadores: los de la web vieja (girados) y los del firmware tal cual,
# que son los que usa la OLED izquierda.
MODS = ("control", "shift", "opt", "cmd")
ANIMS = ("bongo", "luna", "crystal", "head", "spaceman", "logo")

CABECERA = """/* ============================================================
   CODEKEEB — los mapas de bits de las OLED, tal cual
   ------------------------------------------------------------
   Esto NO es un dibujo de una pantalla: son los mismos fotogramas que
   graba el firmware, sacados de `keymap-studio/index.html`.

   Va solo lo que la portada ensena, no todas las imagenes del editor:
   las cinco vistas del OLED izquierdo (bongo, luna, numero, velocimetro y
   grafica), cuatro animaciones del derecho (crystal, head, spaceman y el
   logotipo), los iconos de estado y las dos fuentes.

   Se regenera con `python3 tools/oled-datos.py`; no se edita a mano.
   ============================================================ */
"""


def main():
    src = io.open(STUDIO, encoding="utf8").read()
    m = re.search(r"const OLED_ASSETS=(\{.*?\});\n", src)
    if not m:
        raise SystemExit("No encuentro OLED_ASSETS en el Studio")
    todo = json.loads(m.group(1))

    anims = {k: todo["anims"][k] for k in ANIMS if k in todo["anims"]}
    # Los fotogramas: exactamente los que nombran esas animaciones (el
    # gato y la luna las anidan por tramo de velocidad).
    usadas = set()
    for a in anims.values():
        for tramo in ([a] if "f" in a else a.values()):
            usadas.update(tramo["f"])
    usadas.update(SUELTAS)
    usadas.update(p + m + s for m in MODS for p in ("", "fw_") for s in ("_0", "_white_0"))
    faltan = sorted(n for n in usadas if n not in todo["imgs"])
    if faltan:
        raise SystemExit("Faltan en el Studio: %s" % ", ".join(faltan))
    imgs = {n: todo["imgs"][n] for n in sorted(usadas)}
    datos = {"imgs": imgs, "anims": anims, "fonts": todo["fonts"]}

    js = CABECERA + "const CK_OLED_DATOS = " + json.dumps(datos, separators=(",", ":")) + ";\n"
    io.open(SALIDA, "w", encoding="utf8", newline="\n").write(js)
    print("js/oled-datos.js: %d imagenes, %d animaciones, %.1f KB"
          % (len(imgs), len(anims), len(js.encode("utf8")) / 1024))


if __name__ == "__main__":
    main()
