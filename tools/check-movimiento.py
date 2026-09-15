#!/usr/bin/env python3
"""
CODEKEEB — el sistema de movimiento sigue siendo el que se acordo.

El movimiento se degrada solo: alguien anade un `transition: .3s ease`
para salir del paso y a los tres meses hay nueve duraciones y la curva
por defecto del navegador en treinta sitios. Eso ya paso una vez.

El acuerdo, para todo lo que EMPIEZA Y TERMINA (hover, foco, un estado
que cambia, una entrada):
  - DOS duraciones, y las dos salen de una variable: --t-tap y --t-enter.
  - UNA curva, --ease.
  - Los retardos se cuentan en pasos de --stagger / --paso.

Un BUCLE es otra cosa y se juzga aparte: no es una transicion, es una
demostracion. Para que valga tiene que estar apuntado abajo con su
motivo. Ese es el criterio que sigue ergodox-ez.com, medido con el
navegador: sus doce bucles ensenan el producto y ninguno decora.

Uso:  python3 tools/check-movimiento.py
Sale con 1 si algo se ha salido del sistema.
"""

import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
HOJAS = sorted((RAIZ / "css").glob("*.css"))

# Cada bucle, con por que existe. Si no esta aqui, no pasa.
BUCLES = {
    "btnCycle": "degradado RGB del boton de compra; solo con el raton encima",
    "fluye":    "el degradado recorriendo las dos mitades: ensena el motor RGB propio",
    "vistas":   "las cuatro vistas del OLED: bateria, capa, WPM y Bongo Cat",
    "golpea":   "las patas del Bongo Cat, que es una de las cuatro vistas",
    "capaA":    "la capa 1 de las leyendas: ensena que las teclas cambian",
    "capaB":    "la capa 2 de las leyendas",
    "pulsada":  "la tecla que se mantiene pulsada para saltar de capa",
    "saca":     "el switch saliendo del zocalo: ensena el hotswap real",
}


def sin_comentarios(texto):
    """Los comentarios citan duraciones viejas al explicarse; no son codigo."""
    return re.sub(r"/\*.*?\*/", "", texto, flags=re.S)


def revisar(ruta):
    bruto = ruta.read_text(encoding="utf-8")
    css = sin_comentarios(bruto)
    fallos = []
    nombre = ruta.relative_to(RAIZ)

    # 1. Las variables del sistema existen.
    tokens = dict(re.findall(r"--(t-tap|t-enter|stagger|paso)\s*:\s*([^;]+);", css))
    if "t-tap" not in tokens or "t-enter" not in tokens:
        fallos.append(f"{nombre}: faltan --t-tap y/o --t-enter en :root")
    if not re.search(r"--ease\s*:\s*[^;]+;", css):
        fallos.append(f"{nombre}: falta la variable --ease en :root")

    # 2. Ninguna transicion con la duracion o la curva escritas a mano.
    for decl in re.findall(r"transition(?:-duration)?\s*:\s*([^;}]+)", css):
        crudas = re.findall(r"(?<![\w-])\d*\.?\d+m?s", decl)
        if crudas:
            fallos.append(f"{nombre}: duracion a mano en `{decl.strip()[:60]}` "
                          f"({', '.join(crudas)}) — usa var(--t-tap) o var(--t-enter)")
        for c in re.findall(r"cubic-bezier\([^)]*\)|ease-in-out|ease-out|ease-in|(?<![\w-])ease(?![\w-])", decl):
            fallos.append(f"{nombre}: curva fuera del sistema `{c}` en `{decl.strip()[:50]}` — usa var(--ease)")

    # 3. Los retardos se cuentan en pasos, no en segundos.
    for a, b in re.findall(r"transition-delay\s*:\s*([^;}]+)|animation-delay\s*:\s*([^;}]+)", css):
        d = (a or b).strip()
        if re.search(r"\d", d) and not any(v in d for v in ("--stagger", "--paso", "--loop-")):
            fallos.append(f"{nombre}: retardo a mano `{d[:44]}` — cuentalo en pasos de var(--stagger)")

    # 4. Todo BUCLE, justificado. Una entrada de una sola pasada no lo es:
    #    empieza y termina, y ya la cubren las reglas de arriba. Lo que hay
    #    que justificar es lo que no para nunca.
    PALABRAS = {"infinite", "both", "backwards", "forwards", "none", "alternate",
                "alternate-reverse", "linear", "ease", "ease-in", "ease-out",
                "ease-in-out", "normal", "reverse", "paused", "running"}
    bucles = set()
    for decl in re.findall(r"animation\s*:\s*([^;}]+)", css):
        if "infinite" not in decl:
            continue
        for tok in re.sub(r"\b(?:var|calc|steps|cubic-bezier)\([^)]*\)", " ", decl).split():
            if re.fullmatch(r"[A-Za-z][\w-]*", tok) and tok not in PALABRAS:
                bucles.add(tok)
    # Y el caso del longhand con iteracion infinita en el mismo bloque.
    for bloque in re.findall(r"\{([^{}]*)\}", css):
        if "infinite" not in bloque:
            continue
        m = re.search(r"animation-name\s*:\s*([\w-]+)", bloque)
        if m:
            bucles.add(m.group(1))

    for n in sorted(bucles):
        if n not in BUCLES:
            fallos.append(f"{nombre}: bucle `{n}` sin justificar — apuntalo en BUCLES con su motivo")

    # 5. Los bucles tambien miden en variables: un `.34s` suelto es el
    #    principio de la cuesta abajo de la que venimos.
    for decl in re.findall(r"animation\s*:\s*([^;}]+)", css):
        if "infinite" not in decl:
            continue
        crudas = re.findall(r"(?<![\w-])\d*\.?\d+m?s", re.sub(r"steps\([^)]*\)", " ", decl))
        if crudas:
            fallos.append(f"{nombre}: duracion de bucle a mano `{', '.join(crudas)}` "
                          f"en `{decl.strip()[:50]}` — dale su propia variable --loop-*")

    return fallos, tokens, sorted(bucles)


def main():
    todos, hubo = [], False
    print("sistema de movimiento")
    for ruta in HOJAS:
        if not ruta.exists():
            continue
        fallos, tokens, nombres = revisar(ruta)
        bucles = [n for n in nombres if n in BUCLES]
        print(f"  {ruta.relative_to(RAIZ)}")
        print(f"      --t-tap {tokens.get('t-tap','?').strip()} · --t-enter {tokens.get('t-enter','?').strip()}"
              f" · bucles: {', '.join(bucles) or 'ninguno'}")
        todos += fallos
        hubo = True

    if not hubo:
        print("  no encuentro ninguna hoja de estilo")
        return 1
    if todos:
        print(f"\n{len(todos)} cosa(s) fuera del sistema:")
        for f in dict.fromkeys(todos):
            print("  " + f)
        return 1
    print("\nOK  dos duraciones, una curva, y todos los bucles justificados.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
