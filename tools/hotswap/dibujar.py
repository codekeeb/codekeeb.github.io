"""Genera el dibujo de linea del hotswap de la portada (index.html).

Todo sale de las hojas de datos de Kailh, en milimetros (keyboardio/
keyswitch_documentation, carpeta datasheets/Kailh):
  PG1511   switch MX   (CPG151101D01)  base 13,95 · carcasa 11,70 · vastago 3,60
                                       patas 3,30 en x = -3,81 y +2,54 · poste O3,85 x 2,80
  PG1350   switch Choc (CPG135001D01)  15 x 15 · carcasa 5,00 (2,20 bajo la placa)
                                       vastago 3,00 · patas 3,00 en x = 0 y +5 · poste 2,65
  zocalo MX   CPG151101S11   cuerpo 10,90 x 5,89/4,00 · barriles O2,90 a 6,35 y 2,54
                             grueso 1,80 (3,05 con el barril) · pestanas hasta 14,50
  zocalo Choc CPG135001S30   cuerpo 9,55 x 6,85 · lobulos 4,65 · barriles a 5,00 y 2,20
                             grueso 1,80 (3,05) · pestanas hasta 13,15
PCB de 1,6. Lo que no da la hoja (radios, la forma exacta del vastago del
Choc) esta aproximado y comentado donde se usa.

Uso: python3 tools/hotswap/dibujar.py > /tmp/hot.html  (y se pega en index.html)
"""
E = 8            # unidades SVG por mm
X0, X1 = -9.0, 10.5
Y0, Y1 = -15.2, 22.0   # de abajo arriba, en mm
SUBE = 6.0       # lo que sube el switch al sacarlo

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

def pcb(huecos):
    """La PCB de lado: dos lineas cortadas por los taladros, y sus paredes."""
    s, borde = [], [X0 + .3, X1 - .3]
    cortes = []
    for a, b in sorted((c - r, c + r) for c, r in huecos):   # taladros que se pisan, uno solo
        if cortes and a <= cortes[-1][1]: cortes[-1] = (cortes[-1][0], max(b, cortes[-1][1]))
        else: cortes.append((a, b))
    tramos, x = [], borde[0]
    for a, b in cortes:
        tramos.append((x, a)); x = b
    tramos.append((x, borde[1]))
    for a, b in tramos:
        s.append(rect(a, -1.6, b, 0, "hot__l hot__pcb"))
    return "".join(s)

def zocalo_lado(xa, xb, cuerpo, pestanas):
    s = [rect(pestanas[0], -2.1, pestanas[1], -1.6, "hot__l hot__zocalo")]           # pestanas soldadas a la PCB
    s.append(rect(cuerpo[0], -3.4, cuerpo[1], -1.6, "hot__l hot__zocalo"))          # 1,80 de cuerpo
    for x in (xa, xb):                                                              # barril: 1,25 dentro del taladro
        s.append(rect(x - 1.45, -1.6, x + 1.45, -.35, "hot__l hot__contacto"))
    return "".join(s)

def zocalo_planta(contorno, xa, ya, xb, yb, dy):
    """La cara que va contra la PCB, en planta, bajo el dibujo de lado."""
    mueve = [tuple(v + (dy if i % 2 else 0) for i, v in enumerate(q)) for q in contorno]
    s = [f'<path class="hot__l hot__zocalo" d="{camino(mueve)}"/>']
    for x, y in ((xa, ya + dy), (xb, yb + dy)):
        s.append(circulo(x, y, 1.45, "hot__l hot__contacto"))
        s.append(rect(x - .8, y - .5, x + .8, y + .5, "hot__l hot__contacto"))    # la boca del contacto
        s.append(linea(x, -3.4, x, y + 1.45, "hot__guia"))                         # linea de proyeccion
    return "".join(s)

def camino(p):
    # un punto (x, y) es una recta; (cx, cy, x, y) es una curva con ese punto de
    # control: asi salen las transiciones entre lobulos y las esquinas redondas
    d = f"M{px(p[0][0])} {py(p[0][1])}"
    for q in p[1:]:
        d += (f" L{px(q[0])} {py(q[1])}" if len(q) == 2 else
              f" Q{px(q[0])} {py(q[1])} {px(q[2])} {py(q[3])}")
    return d + " Z"

def desplaza(p, dx):
    return [tuple(v + (dx if i % 2 == 0 else 0) for i, v in enumerate(q)) for q in p]

def mx():
    xa, xb = -3.81, 2.54
    cuerpo_x = (xa - 2.275, xb + 2.275)                  # 10,90 con los barriles centrados
    pest = (cuerpo_x[0] - 1.8, cuerpo_x[1] + 1.8)       # 14,50
    fijo = pcb([(xa, 1.5), (xb, 1.5), (0, 2.0)]) + zocalo_lado(xa, xb, cuerpo_x, pest)
    # planta: A en (xa, 0), B 6,35 a la derecha y 2,54 arriba; parte izquierda 5,89 de alto,
    # derecha 4,00, con los bordes de arriba alineados (radios aproximados)
    # (coordenadas con A en el origen; las curvas siguen el dibujo de Kailh)
    c = desplaza([(-2.275, -1.68), (2.6, -1.68), (3.4, -1.68, 3.6, -.9), (3.85, .21, 4.8, .21),
                  (7.4, .21), (8.625, .21, 8.625, 1.4), (8.625, 2.9), (8.625, 4.21, 7.3, 4.21),
                  (-2.275, 4.21)], xa)
    dy = -12.4
    planta = zocalo_planta(c, xa, 0, xb, 2.54, dy)
    planta += rect(xa - 2.275 - 1.8, -1.25 + dy, xa - 2.275, 1.25 + dy, "hot__l hot__zocalo")
    planta += rect(xb + 2.275, 2.54 - 1.25 + dy, xb + 2.275 + 1.8, 2.54 + 1.25 + dy, "hot__l hot__zocalo")
    pieza = (pata(xa, 3.3) + pata(xb, 3.3)
             + poli([(-1.925, .2), (1.925, .2), (1.925, -2.4), (1.5, -2.8), (-1.5, -2.8), (-1.925, -2.4)])  # poste O3,85
             + rect(-6.975, 0, 6.975, 5.0)                                          # base 13,95
             + poli([(-7.435, 5.0), (7.435, 5.0), (7.435, 6.9), (4.75, 11.7), (-4.75, 11.7), (-7.435, 6.9)])  # tapa
             + rect(-2.3, 6.9, -.4, 10.6) + rect(.4, 6.9, 2.3, 10.6)                # ventanas de los enganches
             + rect(-2.0, 11.7, 2.0, 15.3)                                          # vastago 3,60 sobre la tapa
             + linea(-.65, 11.7, -.65, 15.3) + linea(.65, 11.7, .65, 15.3))         # el brazo de la cruz
    return fijo, planta, pieza

def choc():
    xa, xb = 0.0, 5.0
    cuerpo_x = (2.5 - 4.775, 2.5 + 4.775)               # 9,55
    pest = (cuerpo_x[0] - 1.8, cuerpo_x[1] + 1.8)       # 13,15
    fijo = pcb([(xa, 1.5), (xb, 1.5), (0, 1.7)]) + zocalo_lado(xa, xb, cuerpo_x, pest)
    # planta: dos lobulos de 4,65 en S, B 5,00 a la derecha y 2,20 arriba (6,85 en total)
    l, r, h = cuerpo_x[0], cuerpo_x[1], 2.325
    c = [(l + .4, -h), (2.0, -h), (2.7, -h, 2.9, -h + .7), (3.1, -.125, 3.8, -.125), (r - .4, -.125),
         (r, -.125, r, .275), (r, 4.125), (r, 4.525, r - .4, 4.525), (3.0, 4.525), (2.3, 4.525, 2.1, 3.825),
         (1.9, 2.325, 1.2, 2.325), (l + .4, 2.325), (l, 2.325, l, 1.925), (l, -h + .4), (l, -h, l + .4, -h)]
    dy = -11.6
    planta = zocalo_planta(c, xa, 0, xb, 2.2, dy)
    planta += rect(l - 1.8, -1.1 + dy, l, 1.1 + dy, "hot__l hot__zocalo")
    planta += rect(r, 2.2 - 1.1 + dy, r + 1.8, 2.2 + 1.1 + dy, "hot__l hot__zocalo")
    pieza = (pata(xa, 3.0) + pata(xb, 3.0)
             + poli([(-1.6, .2), (1.6, .2), (1.6, -2.3), (1.25, -2.65), (-1.25, -2.65), (-1.6, -2.3)])  # poste: tapa la pata de x=0
             + rect(-6.9, 0, 6.9, 2.2)                                              # la parte bajo la placa
             + poli([(-7.5, 2.2), (7.5, 2.2), (7.5, 4.5), (7.0, 5.0), (-7.0, 5.0), (-7.5, 4.5)])  # tapa de 15
             + linea(-7.5, 3.0, 7.5, 3.0)                                           # la pestana de la placa
             # vastago: la hoja da 3,00 sobre la carcasa; el reparto entre corredera y
             # patillas es aproximado
             + rect(-4.4, 5.0, 4.4, 5.6) + rect(-1.5, 5.6, 1.5, 8.0)
             + linea(-.6, 5.6, -.6, 8.0) + linea(.6, 5.6, .6, 8.0))
    return fijo, planta, pieza

def svg(nombre, partes):
    fijo, planta, pieza = partes
    w, h = round((X1 - X0) * E), round((Y1 - Y0) * E)
    return (f'<svg class="hot__sw" viewBox="0 0 {w} {h}" role="img" aria-label="{nombre}">'
            f'<g class="hot__fijo">{fijo}{planta}</g><g class="hot__pieza">{pieza}</g></svg>')

if __name__ == "__main__":
    print(svg("Kailh Choc Red", choc()))
    print(svg("MMD Holy Panda", mx()))
    print(f"SUBE_UNIDADES={SUBE*E}")
