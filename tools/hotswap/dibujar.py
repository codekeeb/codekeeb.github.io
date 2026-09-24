"""Genera el dibujo de linea del hotswap de la portada (index.html).

Dos fuentes, y nada inventado donde ellas dan el dato:

1. Las hojas de datos de Kailh (keyboardio/keyswitch_documentation,
   datasheets/Kailh), en mm, para el ALZADO de los switches:
     PG1511  MX   (CPG151101D01)  base 13,95 · carcasa 11,70 · vastago 3,60
                                  patas 3,30 · poste O3,85 x 2,80
     PG1350  Choc (CPG135001D01)  15 x 15 · carcasa 5,00 (2,20 bajo la placa)
                                  vastago 3,00 · patas 3,00 · poste 2,65
     zocalos CPG151101S11 / CPG135001S30: 1,80 de grueso, 3,05 con el barril
2. Las huellas de KiCad de kiswitch (github.com/kiswitch/kiswitch,
   SW_Hotswap_Kailh_{MX,Choc_V1}_1.00u.kicad_mod) para la PLANTA: el
   contorno del zocalo (capa B.Fab), sus pestanas y donde caen patas,
   poste y taladros. Coordenadas de KiCad: vista desde arriba, y hacia abajo.

Vistas: el alzado es desde DETRAS del teclado. Desde delante las patas
quedan detras del poste (estan 2,5 a 5,9 mm hacia atras) y en el Choc una
se tapa entera. La planta va debajo del alzado, girada a juego (primer
diedro): cada barril cae justo bajo su pata.

Lo que ninguna fuente da (el reparto del vastago del Choc entre corredera
y patillas, las ventanas de los enganches del MX) va aproximado.

Uso: python3 tools/hotswap/dibujar.py   (imprime los dos <svg> para index.html)
"""
E = 8            # unidades SVG por mm
X0, X1 = -10.5, 10.5
Y0, Y1 = -14.5, 22.0   # de abajo arriba, en mm
PCB = 1.6

# ---- huellas (kiswitch), en coordenadas de KiCad ----
CHOC = {
    "contorno": [(7.275, -2.225), (7.575, -2.225), (7.575, -1.425), (3.567, -1.425), (3.276, -1.48), (3.025, -1.636), (2.848, -1.873), (2.769, -2.158), (2.612, -2.729), (2.258, -3.203), (1.756, -3.516), (1.175, -3.625), (-1.45, -3.625), (-2.275, -4.45), (-2.275, -7.45), (-1.45, -8.275), (1.261, -8.275), (1.643, -8.199), (1.968, -7.982), (2.475, -7.475), (2.475, -7.275), (2.566, -6.816), (2.826, -6.426), (3.216, -6.166), (3.675, -6.075), (6.475, -6.075), (6.781, -6.014), (7.041, -5.841), (7.214, -5.581), (7.275, -5.275)],
    "barriles": [(0, -5.9), (5, -3.8)],          # taladros de 3,05: aqui entran las patas
    "pestanas": [(-3.5, -6), (8.5, -3.8)],        # pads de 2,55 x 2,5
    "poste": 3.45, "laterales": (5.5, 1.9),       # taladros del poste y de las dos patillas de plastico
}
MX = {
    "contorno": [(-2.3, -0.8), (-6.0, -0.8), (-6.0, -4.8), (-5.962, -5.19), (-5.848, -5.565), (-5.663, -5.911), (-5.414, -6.214), (-5.111, -6.463), (-4.765, -6.648), (-4.39, -6.762), (-4.0, -6.8), (4.8, -6.8), (4.8, -2.8), (-0.3, -2.8), (-0.69, -2.762), (-1.065, -2.648), (-1.411, -2.463), (-1.714, -2.214), (-1.963, -1.911), (-2.148, -1.565), (-2.262, -1.19)],
    "barriles": [(-3.81, -2.54), (2.54, -5.08)],
    "pestanas": [(-7.085, -2.54), (5.842, -5.08)],
    "poste": 4.0, "laterales": None,               # el Holy Panda es de tres patas: sin patillas laterales
}

def px(x): return round((x - X0) * E, 2)
def py(y): return round((Y1 - y) * E, 2)
def pts(lista): return " ".join(f"{px(x)},{py(y)}" for x, y in lista)
def poli(lista, c="hot__l"): return f'<polygon class="{c}" points="{pts(lista)}"/>'
def rect(x0, y0, x1, y1, c="hot__l"):
    return poli([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], c)
def linea(x0, y0, x1, y1, c="hot__l"):
    return f'<line class="{c}" x1="{px(x0)}" y1="{py(y0)}" x2="{px(x1)}" y2="{py(y1)}"/>'
def circulo(x, y, r, c="hot__l"):
    return f'<circle class="{c}" cx="{px(x)}" cy="{py(y)}" r="{round(r*E,2)}"/>'
def pata(x, largo):
    # pata metalica de 0,8 con punta
    return poli([(x-.4, .2), (x+.4, .2), (x+.4, -largo+.5), (x, -largo), (x-.4, -largo+.5)])
def espiga(x, d, largo):
    # poste o patilla de plastico, con el chaflan de la punta
    r = d / 2
    return poli([(x-r, .2), (x+r, .2), (x+r, -largo+.4), (x+r-.4, -largo), (x-r+.4, -largo), (x-r, -largo+.4)])

def vista(h):
    """Pasa la huella a la vista: x en espejo (se mira desde detras)."""
    return {
        "contorno": [(-x, y) for x, y in h["contorno"]],
        "barriles": [(-x, y) for x, y in h["barriles"]],
        "pestanas": [(-x, y) for x, y in h["pestanas"]],
        "poste": h["poste"], "laterales": h["laterales"],
    }

def pcb(h):
    """La PCB, cortada por todos sus taladros (vista en seccion)."""
    huecos = [(x, 1.525) for x, _ in h["barriles"]] + [(0, h["poste"] / 2)]
    if h["laterales"]:
        huecos += [(s * h["laterales"][0], h["laterales"][1] / 2) for s in (-1, 1)]
    cortes = []
    for a, b in sorted((c - r, c + r) for c, r in huecos):   # taladros que se pisan, uno solo
        if cortes and a <= cortes[-1][1]: cortes[-1] = (cortes[-1][0], max(b, cortes[-1][1]))
        else: cortes.append((a, b))
    s, x = [], X0 + .3
    for a, b in cortes:
        s.append(rect(x, -PCB, a, 0, "hot__l hot__pcb")); x = b
    s.append(rect(x, -PCB, X1 - .3, 0, "hot__l hot__pcb"))
    return "".join(s)

def zocalo(h, dy):
    xs = [x for x, _ in h["contorno"]]
    tab = lambda x: (x - 1.275, x + 1.275)
    s = []
    # alzado, bajo la PCB: pestanas soldadas, el cuerpo de 1,80 y los barriles
    # que suben 1,25 dentro de su taladro
    for x, _ in h["pestanas"]:
        s.append(rect(tab(x)[0], -2.1, tab(x)[1], -PCB, "hot__l hot__zocalo"))
    s.append(rect(min(xs), -PCB - 1.8, max(xs), -PCB, "hot__l hot__zocalo"))
    for x, _ in h["barriles"]:
        s.append(rect(x - 1.45, -PCB, x + 1.45, -.35, "hot__l hot__contacto"))
    # planta, debajo: pestanas, contorno real y barriles con la boca del contacto
    for x, y in h["pestanas"]:
        s.append(rect(tab(x)[0], y - 1.25 + dy, tab(x)[1], y + 1.25 + dy, "hot__l hot__zocalo"))
    s.append(poli([(x, y + dy) for x, y in h["contorno"]], "hot__l hot__zocalo"))
    for x, y in h["barriles"]:
        s.append(linea(x, -PCB - 1.8, x, y + dy + 1.45, "hot__guia"))   # linea de proyeccion
        s.append(circulo(x, y + dy, 1.45, "hot__l hot__contacto"))
        s.append(rect(x - .8, y - .5 + dy, x + .8, y + .5 + dy, "hot__l hot__contacto"))
    return "".join(s)

def plano(huella, cuerpo, largo_pata):
    h = vista(huella)
    dy = -5.8 - max(y for _, y in h["contorno"])     # la planta empieza 2,4 bajo el zocalo
    fijo = pcb(h) + zocalo(h, dy)
    # las patas van DELANTE del poste en esta vista: se dibujan despues
    pieza = cuerpo(h) + "".join(pata(x, largo_pata) for x, _ in h["barriles"])
    return fijo, pieza

def cuerpo_choc(h):
    return (espiga(0, 3.2, 2.65)                                                   # poste
            + "".join(espiga(s * h["laterales"][0], 1.8, 2.65) for s in (-1, 1))  # patillas de plastico
            + rect(-6.9, 0, 6.9, 2.2)                                            # la parte bajo la placa
            + poli([(-7.5, 2.2), (7.5, 2.2), (7.5, 4.5), (7.0, 5.0), (-7.0, 5.0), (-7.5, 4.5)])  # tapa de 15
            + linea(-7.5, 3.0, 7.5, 3.0)                                         # la pestana de la placa
            + rect(-4.4, 5.0, 4.4, 5.6) + rect(-1.5, 5.6, 1.5, 8.0)              # vastago: 3,00 sobre la tapa
            + linea(-.6, 5.6, -.6, 8.0) + linea(.6, 5.6, .6, 8.0))

def cuerpo_mx(h):
    return (espiga(0, 3.85, 2.8)                                                  # poste O3,85
            + rect(-6.975, 0, 6.975, 5.0)                                        # base 13,95
            + poli([(-7.435, 5.0), (7.435, 5.0), (7.435, 6.9), (4.75, 11.7), (-4.75, 11.7), (-7.435, 6.9)])  # tapa
            + rect(-2.3, 6.9, -.4, 10.6) + rect(.4, 6.9, 2.3, 10.6)              # ventanas de los enganches
            + rect(-2.0, 11.7, 2.0, 15.3)                                        # vastago: 3,60 sobre la tapa
            + linea(-.65, 11.7, -.65, 15.3) + linea(.65, 11.7, .65, 15.3))       # el brazo de la cruz

def svg(nombre, partes):
    fijo, pieza = partes
    w, h = round((X1 - X0) * E), round((Y1 - Y0) * E)
    return (f'<svg class="hot__sw" viewBox="0 0 {w} {h}" role="img" aria-label="{nombre}">'
            f'<g class="hot__fijo">{fijo}</g><g class="hot__pieza">{pieza}</g></svg>')

if __name__ == "__main__":
    print(svg("Kailh Choc Red", plano(CHOC, cuerpo_choc, 3.0)))
    print(svg("MMD Holy Panda", plano(MX, cuerpo_mx, 3.3)))
