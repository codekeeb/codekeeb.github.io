"""Dibujo de linea en perspectiva isometrica del hotswap de la portada.

Genera los dos <svg> de index.html (switch Choc y MX sobre su zocalo
Kailh), con las lineas ocultas quitadas de verdad: se monta un modelo 3D
de cada pieza y se dibuja solo la arista que se ve.

Fuentes de las medidas, en mm:
1. Hojas de datos de Kailh (keyboardio/keyswitch_documentation,
   datasheets/Kailh):
     PG1350 Choc (CPG135001D01)  15 x 15 · 13,80 bajo la placa · carcasa 5,00
                                  (2,20 bajo la placa) · vastago 3,00 · patas 3,00
                                  poste 2,65
     PG1511 MX   (CPG151101D01)  base 13,95 · tapa 15,60 · carcasa 11,70
                                  vastago 3,60 (cruz 4,00 x 1,30) · patas 3,30
                                  poste O3,85 x 2,80
     zocalos CPG135001S30 / CPG151101S11: 1,80 de grueso, 3,05 con el barril O2,90
2. Huellas de KiCad de kiswitch (github.com/kiswitch/kiswitch,
   SW_Hotswap_Kailh_{Choc_V1,MX}_1.00u.kicad_mod): contorno del zocalo
   (capa B.Fab), pestanas, y donde caen patas, poste y patillas.

Se mira desde detras, arriba y a la derecha: desde delante las patas
quedan detras del poste. La PCB va en transparencia (discontinua) para
que se vea el zocalo, que esta debajo de ella.

Lo que ninguna fuente da (la forma exacta del vastago del Choc, la cara
de arriba de la tapa del MX) va aproximado.

Uso: python3 tools/hotswap/iso.py   (imprime los dos <svg>)
"""
import math

E = 7.5                    # unidades SVG por mm
SUBE = 8.0                 # lo que sube el switch al sacarlo, en mm
C30 = math.cos(math.pi / 6)
W = (1.0, 1.0, 1.0)        # hacia el que mira: detras, derecha, arriba
PASO = 0.1                 # muestreo de cada arista, en mm

CONT_CHOC = [(7.275, -2.225), (7.575, -2.225), (7.575, -1.425), (3.567, -1.425), (3.276, -1.48), (3.025, -1.636), (2.848, -1.873), (2.769, -2.158), (2.612, -2.729), (2.258, -3.203), (1.756, -3.516), (1.175, -3.625), (-1.45, -3.625), (-2.275, -4.45), (-2.275, -7.45), (-1.45, -8.275), (1.261, -8.275), (1.643, -8.199), (1.968, -7.982), (2.475, -7.475), (2.475, -7.275), (2.566, -6.816), (2.826, -6.426), (3.216, -6.166), (3.675, -6.075), (6.475, -6.075), (6.781, -6.014), (7.041, -5.841), (7.214, -5.581), (7.275, -5.275)]
CONT_MX = [(-2.3, -0.8), (-6.0, -0.8), (-6.0, -4.8), (-5.962, -5.19), (-5.848, -5.565), (-5.663, -5.911), (-5.414, -6.214), (-5.111, -6.463), (-4.765, -6.648), (-4.39, -6.762), (-4.0, -6.8), (4.8, -6.8), (4.8, -2.8), (-0.3, -2.8), (-0.69, -2.762), (-1.065, -2.648), (-1.411, -2.463), (-1.714, -2.214), (-1.963, -1.911), (-2.148, -1.565), (-2.262, -1.19)]

def vista(p):
    """Gira el modelo 90 grados: de las cuatro esquinas, es la que mas
    ensena de las patas de los dos switches (medido con este mismo motor)."""
    return (p[1], -p[0], p[2])

def proy(p):
    x, y, z = p
    return ((x - y) * C30, (x + y) * .5 - z)

def punto(p):          # KiCad (y hacia delante) -> modelo (Y hacia detras)
    return (p[0], -p[1])

class Modelo:
    def __init__(self):
        self.caras, self.extra = [], []

    def cara(self, pts, clase="", suaves=()):
        # normal por Newell: los puntos van en el sentido que la deja hacia fuera
        pts = [vista(p) for p in pts]
        n = [0.0, 0.0, 0.0]
        for i, a in enumerate(pts):
            b = pts[(i + 1) % len(pts)]
            n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1])
        m = math.sqrt(sum(v * v for v in n)) or 1
        n = tuple(v / m for v in n)
        p2 = [proy(p) for p in pts]
        self.caras.append({"pts": pts, "n": n, "c": sum(n[i] * pts[0][i] for i in range(3)),
                           "fr": sum(n[i] * W[i] for i in range(3)) > 1e-9, "p2": p2,
                           "bb": (min(q[0] for q in p2), min(q[1] for q in p2), max(q[0] for q in p2), max(q[1] for q in p2)),
                           "clase": clase, "suaves": set(suaves)})

    def prisma(self, poli, z0, z1, clase="", suave=False):
        """Extruye un poligono del plano de z0 a z1."""
        if area(poli) < 0: poli = poli[::-1]
        k = len(poli)
        self.cara([(x, y, z1) for x, y in poli], clase)
        self.cara([(x, y, z0) for x, y in poli[::-1]], clase)
        # Una arista vertical es "suave" si alli el contorno gira poco: es
        # una curva hecha a tramos (un cilindro, el arco del zocalo) y solo
        # se dibuja cuando hace de silueta. Si no, salian rayas verticales.
        blanda = [suave or giro(poli[i - 1], poli[i], poli[(i + 1) % k]) < 25 for i in range(k)]
        for i in range(k):
            (ax, ay), (bx, by) = poli[i], poli[(i + 1) % k]
            # los lados de la cara: 0 abajo, 1 vertical en b, 2 arriba, 3 vertical en a
            sv = tuple(j for j, v in ((1, blanda[(i + 1) % k]), (3, blanda[i])) if v)
            self.cara([(ax, ay, z0), (bx, by, z0), (bx, by, z1), (ax, ay, z1)], clase, suaves=sv)

    def caja(self, x0, y0, x1, y1, z0, z1, clase=""):
        self.prisma([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], z0, z1, clase)

    def cilindro(self, cx, cy, r, z0, z1, clase="", n=40):
        self.prisma([(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)],
                    z0, z1, clase, suave=True)

    def tronco(self, abajo, arriba, z0, z1, clase=""):
        """Tronco de piramide entre dos rectangulos centrados (semiejes x, y)."""
        (ax, ay), (bx, by) = abajo, arriba
        A = [(-ax, -ay), (ax, -ay), (ax, ay), (-ax, ay)]
        B = [(-bx, -by), (bx, -by), (bx, by), (-bx, by)]
        self.cara([(x, y, z1) for x, y in B], clase)
        self.cara([(x, y, z0) for x, y in A[::-1]], clase)
        for i in range(4):
            j = (i + 1) % 4
            self.cara([(*A[i], z0), (*A[j], z0), (*B[j], z1), (*B[i], z1)], clase)

    def linea(self, pts, clase=""):
        # detalle dibujado sobre una cara (la boca del contacto)
        pts = [vista(p) for p in pts]
        for i in range(len(pts)):
            self.extra.append((pts[i], pts[(i + 1) % len(pts)], clase))

def giro(a, b, c):
    """Grados que gira el contorno en b."""
    u, v = (b[0] - a[0], b[1] - a[1]), (c[0] - b[0], c[1] - b[1])
    nu, nv = math.hypot(*u), math.hypot(*v)
    if nu < 1e-9 or nv < 1e-9: return 0
    return math.degrees(math.acos(max(-1, min(1, (u[0] * v[0] + u[1] * v[1]) / (nu * nv)))))

def area(p):
    return sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p))) / 2

def dentro(q, poli):
    x, y, d = q[0], q[1], False
    for i in range(len(poli)):
        (ax, ay), (bx, by) = poli[i], poli[i - 1]
        if (ay > y) != (by > y) and x < (bx - ax) * (y - ay) / (by - ay) + ax:
            d = not d
    return d

def oculto(p, caras, propias):
    q = proy(p)
    for i, f in enumerate(caras):
        if not f["fr"] or i in propias: continue
        bb = f["bb"]
        if q[0] < bb[0] or q[0] > bb[2] or q[1] < bb[1] or q[1] > bb[3]: continue
        s = (f["c"] - sum(f["n"][k] * p[k] for k in range(3))) / sum(f["n"][k] * W[k] for k in range(3))
        if s > 1e-4 and dentro(q, f["p2"]):
            return True
    return False

def aristas(m):
    """Cada arista una vez, con las caras que la comparten."""
    tabla = {}
    clave = lambda p: tuple(round(v, 4) for v in p)
    for i, f in enumerate(m.caras):
        k = len(f["pts"])
        for j in range(k):
            a, b = f["pts"][j], f["pts"][(j + 1) % k]
            key = tuple(sorted((clave(a), clave(b))))
            e = tabla.setdefault(key, {"a": a, "b": b, "caras": [], "suave": True, "clase": ""})
            e["caras"].append(i)
            if j not in f["suaves"]: e["suave"] = False
            if f["clase"]: e["clase"] = f["clase"]
    return tabla.values()

def visibles(m):
    trazos, lista = {}, []
    for e in aristas(m):
        fr = [m.caras[i]["fr"] for i in e["caras"]]
        if e["suave"]:
            if not (len(fr) == 2 and fr[0] != fr[1]): continue
        elif not any(fr): continue
        lista.append((e["a"], e["b"], e["clase"], set(e["caras"])))
    for a, b, clase in m.extra:
        # las lineas de detalle van sobre la cara de arriba del barril
        propias = {i for i, f in enumerate(m.caras) if abs(f["n"][2] - 1) < 1e-9 and abs(f["c"] - a[2]) < 1e-6}
        lista.append((a, b, clase, propias))
    for a, b, clase, propias in lista:
        n = max(2, int(math.dist(a, b) / PASO) + 1)
        # de las patas se guarda tambien lo que tapa el cuerpo: va en
        # discontinua, como en un plano de despiece, para que se vean las dos
        tramo, estado = None, None
        for k in range(n + 1):
            t = k / n
            p = tuple(a[i] + (b[i] - a[i]) * t for i in range(3))
            e = clase if not oculto(p, m.caras, propias) else (clase + "-oculta" if clase == "pata" else None)
            if e != estado or tramo is None:
                if tramo and estado is not None: trazos.setdefault(estado, []).append(tramo)
                tramo, estado = [p, p], e
            tramo[1] = p
        if tramo and estado is not None: trazos.setdefault(estado, []).append(tramo)
    return trazos

# ---- las piezas ----

def zocalo(m, h):
    cont = [punto(p) for p in h["contorno"]]
    for x, y in h["pestanas"]:                       # pestanas soldadas: 2,55 x 2,5
        X, Y = punto((x, y))
        m.caja(X - 1.275, Y - 1.25, X + 1.275, Y + 1.25, -1.9, -1.6)
    m.prisma(cont, -3.4, -1.6)                         # cuerpo de 1,80, pegado bajo la PCB
    for x, y in h["barriles"]:                        # barril O2,90 que sube 1,25 dentro del taladro
        X, Y = punto((x, y))
        m.cilindro(X, Y, 1.45, -1.6, -.35, "contacto")
        m.linea([(X - .8, Y - .5, -.35), (X + .8, Y - .5, -.35), (X + .8, Y + .5, -.35), (X - .8, Y + .5, -.35)], "contacto")

def pata(m, x, y, largo):
    X, Y = punto((x, y))
    m.caja(X - .4, Y - .15, X + .4, Y + .15, -largo, 0, "pata")

def choc(m, h):
    m.cilindro(0, 0, 1.6, -2.65, 0)                    # poste
    for s in (-1, 1):                                  # patillas de plastico O1,8
        m.cilindro(s * 5.5, 0, .9, -2.65, 0)
    for x, y in h["barriles"]: pata(m, x, y, 3.0)
    m.caja(-6.9, -6.9, 6.9, 6.9, 0, 2.2)               # lo que va bajo la placa
    m.caja(-7.5, -7.5, 7.5, 7.5, 2.2, 3.0)             # la pestana de la placa
    m.caja(-7.5, -7.5, 7.5, 7.5, 3.0, 4.5)
    m.tronco((7.5, 7.5), (7.0, 7.0), 4.5, 5.0)         # chaflan de la tapa
    m.caja(-4.4, -3.4, 4.4, 3.4, 5.0, 5.6)             # corredera (aproximada)
    for s in (-1, 1):                                  # dos patillas de 3,00 x 1,20 a 5,70
        m.caja(-1.5, s * 2.85 - .6, 1.5, s * 2.85 + .6, 5.6, 8.0)

def mx(m, h):
    m.cilindro(0, 0, 1.925, -2.8, 0)                   # poste O3,85
    for x, y in h["barriles"]: pata(m, x, y, 3.3)
    m.caja(-6.975, -6.975, 6.975, 6.975, 0, 5.0)       # base 13,95
    m.caja(-7.8, -7.8, 7.8, 7.8, 5.0, 6.9)             # tapa de 15,60
    m.tronco((7.8, 7.8), (4.75, 5.3), 6.9, 11.7)       # cara de arriba aproximada
    cruz = [(-2, -.65), (-.65, -.65), (-.65, -2), (.65, -2), (.65, -.65), (2, -.65),
            (2, .65), (.65, .65), (.65, 2), (-.65, 2), (-.65, .65), (-2, .65)]
    m.prisma(cruz, 11.7, 15.3)                         # vastago en cruz, 3,60 sobre la tapa

HUELLAS = {
    "choc": {"contorno": CONT_CHOC, "barriles": [(0, -5.9), (5, -3.8)], "pestanas": [(-3.5, -6), (8.5, -3.8)],
             "taladros": [(0, 0, 1.725), (-5.5, 0, .95), (5.5, 0, .95)]},
    "mx": {"contorno": CONT_MX, "barriles": [(-3.81, -2.54), (2.54, -5.08)], "pestanas": [(-7.085, -2.54), (5.842, -5.08)],
           "taladros": [(0, 0, 2.0)]},
}

def pcb(h):
    """La PCB en transparencia: el canto de un trozo de 19,05 (el paso de
    tecla) y sus taladros, en discontinua."""
    a, t = 9.525, -1.6
    arriba = [(-a, -a, 0), (a, -a, 0), (a, a, 0), (-a, a, 0)]
    trazos = [[arriba[i], arriba[(i + 1) % 4]] for i in range(4)]
    for x, y in ((a, -a), (a, a), (-a, a)):          # los tres cantos que miran al observador
        trazos.append([(x, y, 0), (x, y, t)])
    trazos += [[(a, -a, t), (a, a, t)], [(a, a, t), (-a, a, t)]]
    trazos = [[vista(p) for p in tr] for tr in trazos]
    taladros = [(*punto((x, y)), 1.525) for x, y in h["barriles"]] + [(*punto((x, y)), r) for x, y, r in h["taladros"]]
    circulos = [[vista((X + r * math.cos(2 * math.pi * i / 40), Y + r * math.sin(2 * math.pi * i / 40), 0)) for i in range(41)]
                for X, Y, r in taladros]
    return trazos, circulos

def svg(nombre, clave, cuerpo):
    h = HUELLAS[clave]
    z, s = Modelo(), Modelo()
    zocalo(z, h); cuerpo(s, h)
    tz, ts = visibles(z), visibles(s)
    pcb_l, pcb_c = pcb(h)
    x0, y0, x1, y1 = MARCO
    f = lambda p: (round((proy(p)[0] - x0) * E, 1), round((proy(p)[1] - y0) * E, 1))
    camino = lambda trazos: " ".join("M{} {}L{} {}".format(*f(a), *f(b)) for a, b in trazos)
    def relleno(m):
        # las caras de delante, del color de la ventana: tapan lo que queda detras
        return "".join('<polygon points="{}"/>'.format(" ".join("{},{}".format(*f(p)) for p in c["pts"]))
                       for c in m.caras if c["fr"])
    w, hh = round((x1 - x0) * E), round((y1 - y0) * E)
    # lineas de despiece: de la boca de cada barril a la punta de su pata, ya sacada
    largo = {"choc": 3.0, "mx": 3.3}[clave]
    despiece = [[vista((*punto(b), -.35)), vista((*punto(b), SUBE - largo))] for b in h["barriles"]]
    guia = (camino(pcb_l) + " " + camino(despiece) + " "
            + " ".join("M" + "L".join("{} {}".format(*f(p)) for p in c) for c in pcb_c))
    fijo = (f'<g class="hot__tapa">{relleno(z)}</g>'
            f'<path class="hot__l" d="{camino(tz.get("", []))}"/>'
            f'<path class="hot__l hot__contacto" d="{camino(tz.get("contacto", []))}"/>'
            f'<path class="hot__guia" d="{guia}"/>')
    pieza = (f'<g class="hot__tapa">{relleno(s)}</g><path class="hot__l" d="{camino(ts.get("", []))}"/>'
             f'<path class="hot__l" d="{camino(ts.get("pata", []))}"/>'
             f'<path class="hot__oculta" d="{camino(ts.get("pata-oculta", []))}"/>')
    return (f'<svg class="hot__sw" viewBox="0 0 {w} {hh}" role="img" aria-label="{nombre}">'
            f'<g class="hot__fijo">{fijo}</g><g class="hot__pieza">{pieza}</g></svg>')

def caja_comun():
    """El mismo encuadre para los dos: asi estan a la misma escala."""
    xs, ys = [], []
    for clave, cuerpo in (("choc", choc), ("mx", mx)):
        h = HUELLAS[clave]
        for pieza, dz in ((zocalo, 0), (cuerpo, SUBE)):
            m = Modelo(); pieza(m, h)
            for c in m.caras:
                for p in c["pts"]:
                    q = proy((p[0], p[1], p[2] + dz)); xs.append(q[0]); ys.append(q[1])
        for tr in pcb(h)[0]:
            for p in tr:
                q = proy(p); xs.append(q[0]); ys.append(q[1])
    return (min(xs) - .6, min(ys) - .6, max(xs) + .6, max(ys) + .6)

MARCO = caja_comun()

if __name__ == "__main__":
    print(svg("Kailh Choc Red", "choc", choc))
    print(svg("MMD Holy Panda", "mx", mx))
    print(f"SUBE={round(SUBE * E, 1)}")
