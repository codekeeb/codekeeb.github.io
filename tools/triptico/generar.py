#!/usr/bin/env python3
"""
Genera el triptico que va en la caja del Sofle Choc Space Black.

Hace tres cosas:
  1. Los cuatro QR (qr/*.svg), con segno. Se generan aqui y no con un
     servicio de la red porque un QR de un tercero puede cambiar de
     destino, y este papel no se puede actualizar una vez impreso.
  2. Abre triptico.html en Chromium, que dibuja el Sofle con la geometria
     real de la web (js/geometria.js + js/dibujo.js).
  3. Lo imprime a triptico.pdf (A4 apaisado, dos paginas: fuera y dentro)
     y deja dos PNG al lado para revisarlo sin abrir el PDF.

Uso:
  pip install segno              # solo para generar, no va en la web
  python3 tools/triptico/generar.py
"""
import http.server
import socketserver
import subprocess
import sys
import threading
from functools import partial
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[1]

# Lo que abre cada QR. Solo direcciones que controla Codekeeb o que son
# la documentacion oficial: si una cambia, el papel ya impreso queda roto.
QR = {
    "manual": "https://codekeeb.github.io/manual.html?id=sofle-carbon",
    "studio": "https://codekeeb.github.io/keymap-studio/",
    "firmware": "https://github.com/codekeeb/sofle-choc-rgb-zmk",
    "zmk": "https://zmk.dev/docs",
}


def qrs():
    try:
        import segno
    except ImportError:
        sys.exit("Falta segno:  pip install segno")
    (AQUI / "qr").mkdir(exist_ok=True)
    for nombre, url in QR.items():
        # Correccion de errores M: aguanta un doblez o una mancha sin
        # hacer el codigo tan denso que una impresora de casa lo empaste.
        q = segno.make(url, error="m", micro=False)
        q.save(str(AQUI / "qr" / f"{nombre}.svg"), kind="svg", scale=1, border=0,
               dark="#000", xmldecl=False, svgns=True, omitsize=True, nl=False)
        print(f"qr/{nombre}.svg  {q.version}  {url}")


def pdf():
    class Callado(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    manejador = partial(Callado, directory=str(RAIZ))
    with socketserver.TCPServer(("127.0.0.1", 0), manejador) as srv:
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        url = f"http://127.0.0.1:{srv.server_address[1]}/tools/triptico/triptico.html"
        r = subprocess.run(["node", str(AQUI / "pdf.mjs"), url, str(AQUI)])
        srv.shutdown()
    if r.returncode:
        sys.exit(r.returncode)


if __name__ == "__main__":
    qrs()
    pdf()
