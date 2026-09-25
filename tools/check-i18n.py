#!/usr/bin/env python3
"""
Verifica que los dos idiomas (es, en) siguen cuadrando.

Falla (codigo 1) si:
  - una clave de js/i18n.js existe en un idioma y falta en otro
  - el HTML usa un data-i18n que no esta traducido
  - un texto {es, en} del catalogo, los manuales o los textos legales
    trae el espanol y no el ingles (CK.L() cae al espanol sin avisar, asi
    que la web en ingles lo ensenaria en espanol sin que nada se rompa)

El frances se quito el 25 sep 2026, a peticion de Ernesto.

Uso:  python3 tools/check-i18n.py
"""
import json
import re
import shutil
import subprocess
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
IDIOMAS = ("es", "en")
BLOCK = re.compile(r"^  ([a-z]{2}): \{")
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


# Los textos de los datos no son claves: van como {es, en} dentro de
# objetos JavaScript. Se cargan con node, que ya hace falta para
# preview.mjs, y se recorren enteros buscando objetos con "es".
DATOS = ["js/data.js", "js/manuales.js", "js/legal-textos.js"]
RECORRE = r"""
const vm = require("vm"), fs = require("fs");
const ctx = vm.createContext({});
const nombres = [];
for (const f of process.argv.slice(1)) {
  const src = fs.readFileSync(f, "utf8");
  vm.runInContext(src, ctx, { filename: f });
  for (const m of src.matchAll(/^const (CK_[A-Z_]+)/gm)) nombres.push(m[1]);
}
const raiz = vm.runInContext("({" + nombres.join(",") + "})", ctx);
const malos = [];
(function ir(v, ruta) {
  if (!v || typeof v !== "object") return;
  if ("es" in v && !Array.isArray(v)) {
    const sobran = Object.keys(v).filter(k => k.length === 2 && !["es", "en"].includes(k));
    if (!("en" in v) || v.en === "" || sobran.length)
      malos.push({ ruta, es: JSON.stringify(v.es).slice(0, 70), sobran });
  }
  for (const [k, x] of Object.entries(v)) ir(x, ruta + "." + k);
})(raiz, "");
console.log(JSON.stringify(malos));
"""


def textos_de_datos():
    if not shutil.which("node"):
        print("AVISO  sin node no se comprueban los textos de data.js, manuales.js y legal-textos.js")
        return 0
    r = subprocess.run(["node", "-e", RECORRE, *[str(ROOT / d) for d in DATOS]],
                       capture_output=True, text=True)
    if r.returncode:
        print(f"FALLO  no se pudieron cargar los datos:\n{r.stderr}")
        return 1
    malos = json.loads(r.stdout)
    for m in malos[:15]:
        que = f"trae {', '.join(m['sobran'])}" if m["sobran"] else "sin ingles"
        print(f"FALLO  {m['ruta'][1:]} {que}: {m['es']}")
    if len(malos) > 15:
        print(f"       ... y {len(malos) - 15} mas")
    return len(malos)


def main():
    if not I18N.exists():
        print(f"no encuentro {I18N}", file=sys.stderr)
        return 1

    bloques = leer_bloques(I18N.read_text(encoding="utf-8"))
    faltan = [i for i in IDIOMAS if i not in bloques]
    if faltan:
        print(f"FALLO  bloques de idioma ausentes en i18n.js: {', '.join(faltan)}")
        return 1

    problemas = 0
    otros = sorted(set(bloques) - set(IDIOMAS))
    if otros:
        problemas += 1
        print(f"FALLO  i18n.js trae idiomas que la web ya no ofrece: {', '.join(otros)}")
    todas = set().union(*bloques.values())

    print("claves por idioma:")
    for idioma in IDIOMAS:
        print(f"  {idioma}: {len(bloques[idioma])}")

    for idioma in IDIOMAS[1:]:
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
        # `data-i18n` es la web; `data-t` es el motor de las direcciones.
        # Los dos acaban buscando la misma clave en el mismo i18n.js, asi
        # que los dos tienen que estar cubiertos o un prototipo puede
        # ensenar la clave cruda sin que nadie se entere.
        usadas.update(re.findall(r'data-i18n(?:-html)?="([^"]+)"', texto))
        usadas.update(re.findall(r'data-t(?:-html|-aria)?="([^"]+)"', texto))
        imagenes.update(re.findall(r'data-i18n-img="([^"]+)"', texto))

    # data-i18n-img no es una clave: es un archivo que debe existir en cada idioma
    for archivo in sorted(imagenes):
        ausentes = [i for i in IDIOMAS
                    if not (ROOT / "assets" / "img" / i / archivo).exists()]
        if ausentes:
            problemas += 1
            print(f"FALLO  falta la imagen {archivo} en: {', '.join(ausentes)}")

    problemas += textos_de_datos()

    huerfanas = sorted(usadas - todas)
    if huerfanas:
        problemas += len(huerfanas)
        print(f"FALLO  el HTML usa {len(huerfanas)} claves que no existen -> {', '.join(huerfanas[:10])}")

    if problemas:
        print(f"\n{problemas} problema(s). El sitio se romperia en algun idioma.")
        return 1

    print(f"\nOK  {len(bloques['es'])} claves cuadradas en es/en, "
          f"{len(usadas)} usadas en el HTML, {len(imagenes)} imagenes por idioma presentes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
