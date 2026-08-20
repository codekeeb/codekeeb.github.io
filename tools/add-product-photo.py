#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Genera las imagenes web de un producto a partir de una foto original.

    python tools/add-product-photo.py <id> <ruta-foto> [<ruta-foto-2> ...]

Ejemplo:
    python tools/add-product-photo.py totem "X:/ADEUKB/Codekeeb/Productos/Totem/foto.jpg"

Crea en web/assets/img/products/:
    <id>.jpg      1200 px de ancho   (tarjetas, carrusel, pagina de producto)
    <id>-sm.jpg    640 px de ancho   (movil, via srcset)
y si pasas mas de una foto, tambien <id>-2.jpg / <id>-2-sm.jpg, etc.

Despues hay que apuntar la foto en web/js/data.js:
    img: "<id>.jpg",
    heroImg: "<id>.jpg",
    gallery: ["<id>.jpg", "<id>-2.jpg"],
"""
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Falta Pillow. Instalalo con:  pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "assets", "img", "products")

# Anchos que consume la web. El -sm lo elige el navegador en moviles.
SIZES = [("", 1200), ("-sm", 640)]


def build(pid, src, index):
    if not os.path.exists(src):
        print("  NO EXISTE: %s" % src)
        return False
    try:
        im = Image.open(src)
    except Exception as e:
        print("  No se pudo abrir (%s): %s" % (e, src))
        return False

    # Las fotos de movil suelen traer rotacion en los metadatos EXIF; sin
    # esto salen tumbadas en el navegador.
    try:
        from PIL import ImageOps
        im = ImageOps.exif_transpose(im)
    except Exception:
        pass

    im = im.convert("RGB")
    suffix = "" if index == 0 else "-%d" % (index + 1)
    ratio = im.width / float(im.height)
    print("  origen %sx%s (ratio %.2f)" % (im.width, im.height, ratio))
    if ratio > 2.0:
        print("  AVISO: muy panoramica; en las tarjetas se vera recortada.")

    os.makedirs(OUT, exist_ok=True)
    for tag, w in SIZES:
        c = im.copy()
        if c.width > w:
            c = c.resize((w, max(1, round(c.height * w / float(c.width)))), Image.LANCZOS)
        name = "%s%s%s.jpg" % (pid, suffix, tag)
        path = os.path.join(OUT, name)
        c.save(path, quality=86, optimize=True, progressive=True)
        print("  %-24s %sx%s  %s KB" % (name, c.width, c.height,
                                        os.path.getsize(path) // 1024))
    return True


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    pid, srcs = sys.argv[1], sys.argv[2:]
    print("Producto: %s" % pid)
    made = [build(pid, s, i) for i, s in enumerate(srcs)]
    ok = sum(1 for m in made if m)
    print("\n%d de %d foto(s) generadas." % (ok, len(srcs)))
    if ok:
        gal = ", ".join('"%s%s.jpg"' % (pid, "" if i == 0 else "-%d" % (i + 1))
                        for i in range(ok))
        print("\nEn web/js/data.js, en el producto '%s':" % pid)
        print('    img: "%s.jpg",' % pid)
        print('    heroImg: "%s.jpg",' % pid)
        print('    gallery: [%s],' % gal)


if __name__ == "__main__":
    main()
