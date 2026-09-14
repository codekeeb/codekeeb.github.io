#!/usr/bin/env python3
"""
Verifica que los tres idiomas de js/i18n.js siguen cuadrando.

Falla (codigo 1) si:
  - una clave existe en un idioma y falta en otro
  - el HTML usa un data-i18n que no esta traducido

Uso:  python3 tools/check-i18n.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
I18N = ROOT / "js" / "i18n.js"
# Todo el HTML del sitio menos keymap-studio, que lleva su propio I18N
# autocontenido. Se busca solo, para que una pagina nueva quede cubierta
# sin tener que acordarse de anadirla a esta lista.
HTML = sorted(
    str(r.relative_to(ROOT))
    for r in ROOT.rglob("*.html")
    if "keymap-studio" not in r.parts and ".preview" not in str(r)
)

# Una clave puede ir junto a otras en la misma linea:
#     "f1.c1": "Perfil MA", "f1.c2": "EN / EN+IC / ES",
KEY = re.compile(r'"([A-Za-z0-9_.\-]+)"\s*:')
BLOCK = re.compile(r"^  (es|en|fr): \{")
END = re.compile(r"^  \},?\s*$")


def leer_bloques(texto):
    bloques, actual = {}, None
    for linea in texto.split("\n"):
        m = BLOCK.match(linea)
        if m:
            actual = m.group(1)
            bloques[actual] = set()
            continue
        if actual and END.match(linea):
            actual = None
            continue
        if actual:
            bloques[actual].update(KEY.findall(linea))
    return bloques


def main():
    if not I18N.exists():
        print(f"no encuentro {I18N}", file=sys.stderr)
        return 1

    bloques = leer_bloques(I18N.read_text(encoding="utf-8"))
    faltan = [i for i in ("es", "en", "fr") if i not in bloques]
    if faltan:
        print(f"FALLO  bloques de idioma ausentes en i18n.js: {', '.join(faltan)}")
        return 1

    problemas = 0
    todas = set().union(*bloques.values())

    print("claves por idioma:")
    for idioma in ("es", "en", "fr"):
        print(f"  {idioma}: {len(bloques[idioma])}")

    for idioma in ("en", "fr"):
        ausentes = sorted(bloques["es"] - bloques[idioma])
        sobrantes = sorted(bloques[idioma] - bloques["es"])
        if ausentes:
            problemas += len(ausentes)
            print(f"FALLO  {idioma}: {len(ausentes)} claves sin traducir -> {', '.join(ausentes[:10])}")
        if sobrantes:
            problemas += len(sobrantes)
            print(f"FALLO  {idioma}: {len(sobrantes)} claves que no existen en es -> {', '.join(sobrantes[:10])}")

    usadas, imagenes = set(), set()
    for nombre in HTML:
        ruta = ROOT / nombre
        if not ruta.exists():
            continue
        texto = ruta.read_text(encoding="utf-8")
        usadas.update(re.findall(r'data-i18n(?:-html)?="([^"]+)"', texto))
        imagenes.update(re.findall(r'data-i18n-img="([^"]+)"', texto))

    # data-i18n-img no es una clave: es un archivo que debe existir en los 3 idiomas
    for archivo in sorted(imagenes):
        ausentes = [i for i in ("es", "en", "fr")
                    if not (ROOT / "assets" / "img" / i / archivo).exists()]
        if ausentes:
            problemas += 1
            print(f"FALLO  falta la imagen {archivo} en: {', '.join(ausentes)}")

    huerfanas = sorted(usadas - todas)
    if huerfanas:
        problemas += len(huerfanas)
        print(f"FALLO  el HTML usa {len(huerfanas)} claves que no existen -> {', '.join(huerfanas[:10])}")

    if problemas:
        print(f"\n{problemas} problema(s). El sitio se romperia en algun idioma.")
        return 1

    print(f"\nOK  {len(bloques['es'])} claves cuadradas en es/en/fr, "
          f"{len(usadas)} usadas en el HTML, {len(imagenes)} imagenes por idioma presentes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
