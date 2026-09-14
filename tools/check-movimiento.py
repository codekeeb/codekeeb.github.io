#!/usr/bin/env python3
"""
CODEKEEB — el sistema de movimiento sigue siendo el que se acordo.

El movimiento se degrada solo: alguien anade un `transition: .3s ease`
para salir del paso y a los tres meses hay nueve duraciones y la curva
por defecto del navegador en treinta sitios. Eso ya paso una vez.

El acuerdo es:
  - DOS duraciones, y las dos salen de una variable: --t-tap y --t-enter.
  - UNA curva, --ease, para todo lo que empieza y termina.
  - linear solo en bucles, y cada uno rotulado con por que existe.

Uso:  python3 tools/check-movimiento.py
Sale con 1 si algo se ha salido del sistema.
"""

import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CSS = RAIZ / "css" / "style.css"

# Un bucle sin principio ni fin necesita linear: con una curva, la costura
# del bucle da un tiron. Cada excepcion se apunta aqui, con su motivo.
BUCLES_PERMITIDOS = {
    "btnCycle": "degradado RGB del boton de compra, solo mientras el raton esta encima",
}


def sin_comentarios(texto):
    """Los comentarios citan duraciones viejas al explicarse; no son codigo."""
    return re.sub(r"/\*.*?\*/", "", texto, flags=re.S)


def main():
    if not CSS.exists():
        print(f"No encuentro {CSS}")
        return 1

    bruto = CSS.read_text(encoding="utf-8")
    css = sin_comentarios(bruto)
    fallos = []

    # 1. Las dos duraciones existen y son las unicas declaradas en :root.
    tokens = dict(re.findall(r"--(t-tap|t-enter|stagger)\s*:\s*([^;]+);", css))
    for t in ("t-tap", "t-enter", "stagger"):
        if t not in tokens:
            fallos.append(f"falta la variable --{t} en :root")
    curva = re.search(r"--ease\s*:\s*([^;]+);", css)
    if not curva:
        fallos.append("falta la variable --ease en :root")

    # 2. Ninguna transicion con la duracion escrita a mano.
    for decl in re.findall(r"transition(?:-duration)?\s*:\s*([^;}]+)", css):
        crudas = re.findall(r"(?<![\w-])\d*\.?\d+m?s", decl)
        if crudas:
            fallos.append(
                f"duracion a mano en una transicion: {decl.strip()[:70]}  "
                f"({', '.join(crudas)}) — usa var(--t-tap) o var(--t-enter)"
            )

    # 3. Ninguna curva que no sea la nuestra.
    for decl in re.findall(
        r"(?:transition|animation)(?:-timing-function)?\s*:\s*([^;}]+)", css
    ):
        for c in re.findall(r"cubic-bezier\([^)]*\)|ease-in-out|ease-out|ease-in|(?<![\w-])ease(?![\w-])", decl):
            fallos.append(f"curva fuera del sistema: `{c}` en `{decl.strip()[:60]}` — usa var(--ease)")

    # 4. linear solo en los bucles apuntados arriba.
    for decl in re.findall(r"animation\s*:\s*([^;}]+)", css):
        if "linear" not in decl:
            continue
        nombre = next((b for b in BUCLES_PERMITIDOS if b in decl), None)
        if not nombre:
            fallos.append(f"linear en una animacion no declarada como bucle: {decl.strip()[:70]}")

    # 5. Los retardos se cuentan en pasos de --stagger, no en segundos.
    for decl in re.findall(r"transition-delay\s*:\s*([^;}]+)|animation-delay\s*:\s*([^;}]+)", css):
        d = (decl[0] or decl[1]).strip()
        if "--stagger" not in d and re.search(r"\d", d):
            fallos.append(f"retardo a mano: `{d[:50]}` — cuentalo en pasos de var(--stagger)")

    # 6. Toda animacion en bucle tiene que estar justificada.
    for nombre, dur, resto in re.findall(
        r"animation\s*:\s*([\w-]+)\s+([\d.]+m?s)([^;}]*)", css
    ):
        if "infinite" in resto and nombre not in BUCLES_PERMITIDOS:
            fallos.append(f"bucle infinito sin justificar: {nombre} ({dur})")

    # --- resumen ---
    duraciones = sorted(set(re.findall(r"var\(--t-(tap|enter)\)", css)))
    print("sistema de movimiento")
    print(f"  duraciones: --t-tap {tokens.get('t-tap','?').strip()} · "
          f"--t-enter {tokens.get('t-enter','?').strip()}")
    print(f"  curva:      {curva.group(1).strip() if curva else '?'}")
    print(f"  escalon:    {tokens.get('stagger','?').strip()}")
    papeles = sorted(set(re.findall(r"\.reveal--([\w-]+)", css)))
    print(f"  papeles de entrada: {', '.join(papeles) if papeles else 'ninguno'}")
    bucles = re.findall(r"animation\s*:\s*([\w-]+)[^;}]*infinite", css)
    print(f"  bucles en marcha: {', '.join(sorted(set(bucles))) or 'ninguno'}")

    if fallos:
        print(f"\n{len(fallos)} cosa(s) fuera del sistema:")
        for f in dict.fromkeys(fallos):
            print("  " + f)
        return 1
    print("\nOK  dos duraciones, una curva, y los bucles justificados.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
