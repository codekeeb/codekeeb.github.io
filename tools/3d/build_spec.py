"""Author the ObjectSculptSpec for the Sofle from the authoritative layout (geo-sofle.json).

The spec is the reconstruction record: key positions come from CK_GEO.sofle (Keymap Studio data),
the case outline is the union of key footprints (+ the medial strip that holds controller and
encoder), traced from a raster. Heights and colours come from the photo analysis. Re-run this
script instead of hand-editing the generated TypeScript.

Units: 1 unit = 100 layout px (~20 mm). Frame: Y up, X right, +Z toward the viewer. Layout y
maps to +Z. Halves rotate about their centres by -rot (SVG rotate is clockwise with y down).
"""
import json, math, copy, sys

G = json.load(open("geo-sofle.json"))
KEY, M, T = G["KEY"], G["MITADES"], G["TECLAS"]
CX, CZ = G["ESCENARIO"]["w"] / 2, G["ESCENARIO"]["h"] / 2
U = 100.0
PAD = 17

# heights (units) — inferred from the photo + typical Choc build, see image-analysis.md L8
H_PLATE, H_PCB, H_TOP, H_SW, H_CAP = 0.10, 0.05, 0.08, 0.12, 0.40
Y_PLATE, Y_PCB = 0.0, H_PLATE
Y_TOP = Y_PCB + H_PCB
Y_SW = Y_TOP + H_TOP
Y_CAP = Y_SW + H_SW

# medial strip features, left-half layout px; the right half is their REFLECTION
CONTROLLER_L = dict(x0=546, x1=620, y0=8, y1=232)
ENCODER_L = dict(cx=585, cy=325, r=34)
INNER_EDGE_L = 450 + KEY          # medial edge of the left matrix (x=536)
INNER_EDGE_R = 134                # medial edge of the right matrix


def mirror_x(x):                  # reflection across the medial gap between the two matrices
    return INNER_EDGE_R - (x - INNER_EDGE_L)


CONTROLLER_R = dict(x0=mirror_x(CONTROLLER_L["x1"]), x1=mirror_x(CONTROLLER_L["x0"]),
                    y0=CONTROLLER_L["y0"], y1=CONTROLLER_L["y1"])
ENCODER_R = dict(cx=mirror_x(ENCODER_L["cx"]), cy=ENCODER_L["cy"], r=ENCODER_L["r"])
assert abs((CONTROLLER_R["x0"] + CONTROLLER_R["x1"]) / 2 - mirror_x((CONTROLLER_L["x0"] + CONTROLLER_L["x1"]) / 2)) < 1e-9
MEDIAL = [CONTROLLER_L | {"enc": ENCODER_L}, CONTROLLER_R | {"enc": ENCODER_R}]


def keys_of(h):
    return [(i, k) for i, k in enumerate(T) if k and k[0] == h]


def sd_round_box(px, py, cx, cy, hw, hh, rot_deg, r):
    a = -math.radians(rot_deg)
    dx, dy = px - cx, py - cy
    lx, ly = dx * math.cos(a) - dy * math.sin(a), dx * math.sin(a) + dy * math.cos(a)
    qx, qy = abs(lx) - (hw - r), abs(ly) - (hh - r)
    return math.hypot(max(qx, 0), max(qy, 0)) + min(max(qx, qy), 0) - r


def outline(h, pad, with_medial=True, cell=3.0):
    """Trace the outer boundary of the union of key footprints (+medial strip) — marching squares."""
    m = M[h]
    shapes = []
    for _, k in keys_of(h):
        _, x, y, rot, *w = k
        w = w[0] if w else KEY
        shapes.append(("box", x + w / 2, y + KEY / 2, w / 2 + pad, KEY / 2 + pad, rot, min(12, pad + 6)))
    if with_medial:
        c = MEDIAL[h]
        shapes.append(("box", (c["x0"] + c["x1"]) / 2, (c["y0"] + c["y1"]) / 2 + 40,
                       (c["x1"] - c["x0"]) / 2 + pad, (c["y1"] - c["y0"]) / 2 + 40 + pad, 0, 12))
        e = c["enc"]

    def sd(px, py):
        best = 1e9
        for s in shapes:
            if s[0] == "box":
                best = min(best, sd_round_box(px, py, *s[1:]))
            else:
                best = min(best, math.hypot(px - s[1], py - s[2]) - s[3])
        return best

    x0, x1, y0, y1 = -60, m["w"] + 60, -60, m["h"] + 60
    nx, ny = int((x1 - x0) / cell) + 1, int((y1 - y0) / cell) + 1
    grid = [[sd(x0 + i * cell, y0 + j * cell) for i in range(nx)] for j in range(ny)]
    # marching squares. Each crossing point is identified by the GRID EDGE it lies on (a sorted pair
    # of corner indices), not by its float coordinates: neighbouring cells compute the same point from
    # opposite corner orders and rounding made them two different points, so no loop ever closed.
    def corner(ci, cj):
        return (x0 + ci * cell, y0 + cj * cell)
    def val(ci, cj):
        return grid[cj][ci]
    point_of = {}
    def crossing(a, b):
        a, b = min(a, b), max(a, b)
        if (a, b) not in point_of:
            va, vb = val(*a), val(*b)
            t = va / (va - vb)
            pa, pb = corner(*a), corner(*b)
            point_of[(a, b)] = (pa[0] + t * (pb[0] - pa[0]), pa[1] + t * (pb[1] - pa[1]))
        return (a, b)
    adj = {}
    def link(e1, e2):
        adj.setdefault(e1, []).append(e2); adj.setdefault(e2, []).append(e1)
    for j in range(ny - 1):
        for i in range(nx - 1):
            cs = [(i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)]
            es = [crossing(cs[a], cs[b]) for a, b in ((0, 1), (1, 2), (2, 3), (3, 0))
                  if (val(*cs[a]) < 0) != (val(*cs[b]) < 0)]
            if len(es) == 2:
                link(es[0], es[1])
            elif len(es) == 4:
                link(es[0], es[1]); link(es[2], es[3])
    seen, loops = set(), []
    for start in adj:
        if start in seen:
            continue
        loop, cur = [start], start
        seen.add(start)
        while True:
            nxt = [n for n in adj[cur] if n not in seen]
            if not nxt:
                break
            cur = nxt[0]
            seen.add(cur); loop.append(cur)
        loops.append([point_of[e] for e in loop])
    loop = max(loops, key=len)
    return simplify(loop, 1.2)


def simplify(pts, eps):
    def dp(p):
        if len(p) < 3:
            return p
        a, b = p[0], p[-1]
        dx, dy = b[0] - a[0], b[1] - a[1]
        L = math.hypot(dx, dy) or 1e-9
        idx, dmax = 0, 0
        for i in range(1, len(p) - 1):
            d = abs(dy * p[i][0] - dx * p[i][1] + b[0] * a[1] - b[1] * a[0]) / L
            if d > dmax:
                idx, dmax = i, d
        if dmax > eps:
            return dp(p[:idx + 1])[:-1] + dp(p[idx:])
        return [a, b]
    # A closed loop starts and ends on the same point, so its chord has zero length and
    # Douglas-Peucker collapsed the whole outline to one point. Split at the vertex farthest
    # from the start and simplify the two open halves.
    far = max(range(len(pts)), key=lambda i: math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]))
    a = dp(pts[:far + 1])
    b = dp(pts[far:] + [pts[0]])
    return a[:-1] + b[:-1]


def to_local(h, x, y):
    m = M[h]
    return ((x - m["w"] / 2) / U, (y - m["h"] / 2) / U)


def shape_points(h, pts):
    # extrude runs along +Z and the node is rotated -90deg about X: shape (sx, sy) -> (sx, z, -sy)
    # so feed sy = -localZ to land the outline on the right side.
    out = []
    for x, y in pts:
        lx, lz = to_local(h, x, y)
        out.append([round(lx, 4), round(-lz, 4)])
    return out


spec = json.load(open("object-sculpt-spec.json"))
root_template = spec["componentTree"][0]


def comp(cid, name, level, role, primitive, parent, pos, rot, dims, material, topo, rationale,
         conf=0.8, scale=None, descriptor=None, features=None, anim="static", fidelity="blockout"):
    c = copy.deepcopy(root_template)
    c.update(id=cid, name=name, level=level, role=role, primitive=primitive, parent=parent,
             confidence=conf, material=material, materialLayers=[material], topologyClass=topo,
             topologyRationale=rationale, fidelityTier=fidelity, importance=0.9 if level != "micro" else 0.6)
    c["dimensions"] = dict(dims, units="unit=100 layout px (~20 mm)", confidence=conf)
    c["transform"] = {"position": [round(v, 4) for v in pos], "rotation": [round(v, 5) for v in rot]}
    if scale is not None:
        c["transform"]["scale"] = scale
    if descriptor:
        c["geometryDescriptor"] = dict(c["geometryDescriptor"], **descriptor)
    c["localFeatures"] = features or []
    ap = c["actionProfile"]
    ap["animationRole"] = anim
    ap["collider"]["scale"] = [dims.get("width", 1), dims.get("height", 1), dims.get("depth", 1)]
    ap["destruction"]["fractureGroup"] = cid
    ap["destruction"]["debrisMaterial"] = material
    c["evidenceRefs"] = ["full-object"]
    return c


comps = [comp("root", "Sofle split keyboard", "macro", "assembly-root", "box", None, [0, 0, 0], [0, 0, 0],
              dict(width=0.01, height=0.01, depth=0.01), "switch-dark", "assembled-solid",
              "Pure pivot for the whole keyboard; its own mesh is a 0.2 mm cube (the generator emits a mesh per component).",
              anim="root")]

for h, hid in ((0, "half-left-hand"), (1, "half-right-hand")):
    m = M[h]
    hx, hz = (m["x"] + m["w"] / 2 - CX) / U, (m["y"] + m["h"] / 2 - CZ) / U
    comps.append(comp(hid, f"{'Left' if h == 0 else 'Right'}-hand half", "macro", "assembly", "box", "root",
                      [hx, 0, hz], [0, -math.radians(m["rot"]), 0], dict(width=0.01, height=0.01, depth=0.01),
                      "switch-dark", "assembled-solid",
                      f"Pivot of one half at its layout centre, rotated {m['rot']} deg in plan (measured case angle).",
                      anim="halves-splay", features=[{"id": "splay-angle", "description": f"rotated {m['rot']} deg about Y at the half centre"}]))
    plate = outline(h, PAD)
    comps.append(comp(f"{hid}-plate", "Bottom plate", "meso", "structure", "extrude", hid, [0, Y_PLATE, 0],
                      [-math.pi / 2, 0, 0], dict(width=1, height=1, depth=1), "plate", "assembled-solid",
                      "Flat acrylic/FR4 plate: a closed 2D outline extruded by its thickness.",
                      scale=[1, 1, 1], descriptor={"profile2D": {"points": shape_points(h, plate), "depth": H_PLATE}},
                      features=[{"id": "case-outline", "description": "union of key footprints + medial strip, traced from layout"}]))
    pcb = outline(h, PAD - 1)
    comps.append(comp(f"{hid}-pcb", "PCB (magenta soldermask)", "meso", "structure", "extrude", hid, [0, Y_PCB, 0],
                      [-math.pi / 2, 0, 0], dict(width=1, height=1, depth=1), "pcb", "assembled-solid",
                      "FR4 board almost flush (1 px inset): in the photo it reads as a thin magenta line between the two light plates.",
                      scale=[1, 1, 1], descriptor={"profile2D": {"points": shape_points(h, pcb), "depth": H_PCB}},
                      features=[{"id": "pcb-magenta-edge", "description": "magenta band between the light plates"}]))
    comps.append(comp(f"{hid}-top-plate", "Top plate", "meso", "structure", "extrude", hid, [0, Y_TOP, 0],
                      [-math.pi / 2, 0, 0], dict(width=1, height=1, depth=1), "plate", "assembled-solid",
                      "Light switch plate above the PCB: the light surface visible around the keys (zoomC).",
                      scale=[1, 1, 1], descriptor={"profile2D": {"points": shape_points(h, plate), "depth": H_TOP}}))
    sw = outline(h, 5, with_medial=False)   # 5 px bridges the 4 px gaps between caps: one slab, not islands
    comps.append(comp(f"{hid}-switches", "Switch housings layer", "meso", "structure", "extrude", hid, [0, Y_SW, 0],
                      [-math.pi / 2, 0, 0], dict(width=1, height=1, depth=1), "switch-dark", "assembled-solid",
                      "The dark switch bodies visible under the caps, as one slab following the key footprints (one draw call instead of 58).",
                      scale=[1, 1, 1], descriptor={"profile2D": {"points": shape_points(h, sw), "depth": H_SW}}))
    for i, k in keys_of(h):
        _, x, y, rot, *w = k
        w = w[0] if w else KEY
        lx, lz = to_local(h, x + w / 2, y + KEY / 2)
        thumb = i >= G["pulgares"]
        accent = abs(rot) == 15   # HOME (left) and the up-arrow (right): the rotated inner thumb key
        comps.append(comp(f"key-{i:02d}", f"Keycap {i}{' (thumb)' if thumb else ''}", "micro", "keycap", "box", hid,
                          [lx, Y_CAP + H_CAP / 2, lz], [0, -math.radians(rot), 0],
                          dict(width=(w - 6) / U, height=H_CAP, depth=(KEY - 6) / U),
                          "keycap-black" if accent else "keycap-cream", "assembled-solid",
                          "Keycap block at its authoritative layout position (CK_GEO.sofle index %d)." % i,
                          conf=0.9, anim="press-translate-y",
                          features=[{"id": "column-stagger" if not thumb else "thumb-arc", "description": f"layout ({x},{y}) rot {rot}"},
                                    {"id": "keycap-dish", "description": "concave top; blockout keeps a flat top"}]))
    c = MEDIAL[h]
    cx, cz = to_local(h, (c["x0"] + c["x1"]) / 2, (c["y0"] + c["y1"]) / 2)
    cw, cd = (c["x1"] - c["x0"]) / U, (c["y1"] - c["y0"]) / U
    comps.append(comp(f"{hid}-controller", "Controller module", "meso", "electronics", "box", hid,
                      [cx, Y_SW + 0.06, cz], [0, 0, 0], dict(width=cw, height=0.12, depth=cd), "pcb", "assembled-solid",
                      "Vertical controller board standing proud of the PCB at the medial top."))
    comps.append(comp(f"{hid}-oled", "OLED display", "micro", "display", "box", f"{hid}-controller",
                      [0, 0.075, -cd * 0.12], [0, 0, 0], dict(width=cw * 0.72, height=0.03, depth=cd * 0.62), "oled",
                      "assembled-solid", "Glass display on top of the controller; emissive pixels.",
                      features=[{"id": "oled-emissive", "description": "white pixels on black glass"}]))
    e = c["enc"]
    bx, bz = to_local(h, e["cx"], e["cy"] - 58)
    comps.append(comp(f"{hid}-encoder-cover", "Blank cap behind the knob", "micro", "cover", "box", hid,
                      [bx, Y_SW + 0.16, bz], [0, 0, 0], dict(width=0.74, height=0.32, depth=0.48), "keycap-cream",
                      "assembled-solid", "Cream blank block between the OLED and the knob, seen in zoomA; purpose inferred (cover)."))
    ex, ez = to_local(h, e["cx"], e["cy"])
    enc = comp(f"{hid}-encoder", "Rotary encoder knob", "meso", "control", "cylinder", hid,
               [ex, Y_SW, ez], [0, 0, 0], dict(width=2 * e["r"] / U, height=0.60, depth=2 * e["r"] / U),
               "knob", "assembled-solid", "Knurled aluminium knob: a cylinder standing on the switch layer, rotates about its own Y axis.",
               anim="rotate-y", features=[{"id": "knurl-grooves", "description": "vertical grooves, see repetition knurl"}])
    enc["attachment"] = {"parentId": hid, "parentSocket": "encoder-shaft", "localStart": [round(ex, 4), Y_SW, round(ez, 4)],
                         "localEnd": [round(ex, 4), round(Y_SW + 0.60, 4), round(ez, 4)], "contactType": "socket",
                         "embedDepth": 0.02, "gapTolerance": 0.01, "baseRadius": e["r"] / U, "endRadius": e["r"] / U * 0.96,
                         "contactNormal": [0, 1, 0], "evidenceRefs": ["full-object"]}
    comps.append(enc)
    # pivot at the knob's mid-height: the radial knurl instances are centred on their parent's origin
    comps.append(comp(f"{hid}-knurl-hub", "Knurl hub (pivot)", "micro", "pivot", "box", hid,
                      [ex, Y_SW + 0.30, ez], [0, 0, 0], dict(width=0.01, height=0.01, depth=0.01), "knob",
                      "assembled-solid", "Pivot so the knurl ring sits at the knob's mid-height; own mesh is a 0.2 mm cube."))

spec["componentTree"] = comps

# the assessment travels inside the spec: fix score scale and give every detail a kind and a link
pa = spec["preSpecAssessment"]
pa["complexity"]["scores"] = {"silhouetteComplexity": 2, "componentCount": 3, "hierarchyDepth": 2, "repetitionDensity": 3,
                              "materialLayerCount": 2, "localDetailDensity": 2, "occlusionRisk": 1, "actionReadinessNeed": 1}
LINKS = {"column-stagger": ("contour", "column-stagger"), "thumb-arc": ("contour", "thumb-arc"),
         "encoder-in-thumb-row": ("contour", "half-left-hand-encoder"), "knurl-grooves": ("groove", "knurl-grooves"),
         "controller-module": ("contour", "half-left-hand-controller"), "oled-emissive": ("emissive", "oled-emissive"),
         "pcb-magenta-edge": ("linework", "pcb-magenta-edge"), "underglow": ("emissive", "pcb/underglow"),
         "accent-keycaps": ("decal", "keycap-black/accent-keycaps"), "keycap-dish": ("contour", "keycap-dish"),
         "splay-angle": ("contour", "splay-angle")}
for d in pa["detailInventory"]["details"]:
    kind, ref = LINKS[d["id"]]
    d["kind"] = kind
    d["mapsTo"] = {"ref": ref}

# De-lighting: the photo is under-exposed; the white backdrop measures #878983 -> gain ~1.74,
# applied to every material-analysis palette (material-analysis.json) and clamped.
# Per-channel white balance from the white backdrop (#878983 -> neutral 235).
WB = (235 / 0x87, 235 / 0x89, 235 / 0x83)
def delit(hexcol, neutral=False):
    """neutral=True drops the hue: plate and knob pixels are tinted by the RGB underglow
    (magenta/blue LED light), which is lighting, not albedo. Keeps the measured luminance."""
    r, g, b = (int(hexcol[i:i + 2], 16) * k for i, k in zip((1, 3, 5), WB))
    if neutral:
        y = 0.2126 * r + 0.7152 * g + 0.0722 * b
        r = g = b = y
    return "#%02X%02X%02X" % tuple(min(255, round(v)) for v in (r, g, b))
_REG = json.load(open("material-analysis.json"))["regions"]
MA = {r["materialSpecId"]: r["assignment"]["evidence"]["pbr"]["palette"][1] for r in _REG}
# knob: the darkest palette entry is the anodized body; the brighter ones are LED reflections
MA_DARK = {r["materialSpecId"]: min(r["assignment"]["evidence"]["pbr"]["palette"], key=lambda c: sum(int(c[i:i+2], 16) for i in (1, 3, 5))) for r in _REG}
MAT = {
    "keycap-cream": (delit(MA["keycap-cream"]), 0.55, 0.0, None), "keycap-black": (delit(MA["keycap-black"]), 0.55, 0.0, None),
    "plate": (delit(MA["plate"], neutral=True), 0.7, 0.0, None), "pcb": (delit(MA["pcb"]), 0.45, 0.0, ("#B0287E", 0.35)),
    "switch-dark": (delit(MA["switch-dark"]), 0.6, 0.0, None), "knob": (delit(MA_DARK["knob"], neutral=True), 0.38, 0.55, None),
    "oled": ("#0B0B0E", 0.1, 0.0, ("#E8E8F0", 0.6)),
}
print({k: v[0] for k, v in MAT.items()})
base = spec["materials"][0]
mats = []
for mid, (col, rough, metal, emi) in MAT.items():
    mm = copy.deepcopy(base)
    mm.update(id=mid, name=mid, baseColor=col, color=col, notes="Solid albedo (flat finish); sampled from lit, legend-free zones of ref.png and de-lit by eye.")
    mm["albedo"] = {"dominant": col, "secondary": [col], "samplingNotes": "lit legend-free zones of ref.png"}
    mm["colorVariation"] = {"palette": [col], "pattern": "none", "amplitude": 0.0, "heightCorrelation": 0.0}
    mm["roughness"] = dict(mm["roughness"], base=rough, variation=0.05)
    mm["metalness"] = {"base": metal, "variation": 0.0}
    mm["normal"] = dict(mm["normal"], pattern="none", strength=0.0)
    if emi:
        mm["emissive"] = {"color": emi[0], "intensity": emi[1]}
        mm["localOverrides"] = [{"id": "underglow" if mid == "pcb" else "oled-pixels", "effect": "emissive", "color": emi[0], "intensity": emi[1]}]
    if mid == "keycap-black":
        mm["localOverrides"] = [{"id": "accent-keycaps", "effect": "albedo-swap", "color": col, "appliesTo": "rotated inner thumb key of each half"}]
    mats.append(mm)
spec["materials"] = mats

# colour recipe per component, derived from its material (evidence: material-analysis.json)
CLASS = {"keycap-cream": "plastic", "keycap-black": "plastic", "plate": "plastic", "pcb": "plastic",
         "switch-dark": "plastic", "knob": "metal", "oled": "glass"}
def rgba(hexcol, a=1.0):
    return "rgba(%d, %d, %d, %s)" % (int(hexcol[1:3], 16), int(hexcol[3:5], 16), int(hexcol[5:7], 16), a)
for c in comps:
    col = MAT[c["material"]][0]
    c["colorMaterialRecipe"] = {"dominantAlbedo": rgba(col), "secondaryAlbedo": rgba(col, 0.9),
                                "materialClass": CLASS[c["material"]], "materialClassConfidence": 0.8,
                                "evidenceRefs": ["material-analysis.json"]}

spec["lightingFromPhoto"] = [
    {"id": "key", "type": "directional", "color": "#FFFFFF", "intensity": 2.2, "direction": [-0.5, -1.0, -0.35],
     "evidence": "hard highlights on the upper-left edges of the caps, shadows falling to the front-right"},
    {"id": "fill", "type": "hemisphere", "skyColor": "#E8ECF4", "groundColor": "#6E6A66", "intensity": 0.7,
     "evidence": "cool grey ambient: shadowed cap fronts stay readable, backdrop is a soft white sweep"},
    {"id": "rim-underglow", "type": "point", "color": "#E040B0", "intensity": 0.8, "position": "under each half, near the thumb cluster",
     "evidence": "magenta light spilling from under the PCB onto the desk and the lower cap edges"},
    {"id": "exposure-and-ground", "type": "render-settings", "toneMapping": "ACES filmic", "exposure": 1.0,
     "groundShadow": "soft contact shadow on a white ground plane under each half",
     "evidence": "the photo is a low-key shot on a white sweep; the halves cast a soft ground shadow to the front"},
]
pa["unknownsToResolveBeforeImplementation"] = []
pa["acceptedUnknowns"] = [
    {"unknown": u, "resolution": "accepted: orientative model, labelled on the page as 'modelo 3D orientativo, no es una fotografía'"}
    for u in ["underside/back edge hidden; plate thicknesses inferred", "keycap profile approximate (tall MT3-like caps)",
              "possible tenting puck under the left half omitted", "legends not modelled"]]

spec["repetitionSystems"] = [
    {"id": "knurl-left", "level": "micro", "parent": "half-left-hand-knurl-hub", "count": 24, "primitive": "box",
     "material": "knob", "instanceScale": [0.03, 0.58, 0.05], "placement": {"mode": "radial", "axis": [0, 1, 0], "radius": 0.68, "startAngleDeg": 0}},
    {"id": "knurl-right", "level": "micro", "parent": "half-right-hand-knurl-hub", "count": 24, "primitive": "box",
     "material": "knob", "instanceScale": [0.03, 0.58, 0.05], "placement": {"mode": "radial", "axis": [0, 1, 0], "radius": 0.68, "startAngleDeg": 0}},
    {"id": "keycap-array", "level": "micro", "parent": "root", "count": len([k for k in T if k]), "primitive": "box",
     "material": "keycap-cream", "elementComponentIds": [c["id"] for c in comps if c["id"].startswith("key-")],
     "placement": {"mode": "explicit", "source": "CK_GEO.sofle layout, one authored component per key"}},
]

spec["assumptions"] = [
    "Key positions/rotations are the authoritative layout (js/geometria.js, CK_GEO.sofle), not measured from the photo.",
    "Halves are named by the typist's hands; the typist faces -Z, so this is the opposite of the character convention in forge/_shared/chirality.py. -l/-r suffixes are therefore not used. The only hand-mirrored parts (controller, encoder) are reflected with mirror_x() and asserted in build_spec.py.",
    "Heights (plate 2 mm, PCB 1.6 mm, switch 3 mm, cap 6 mm) are inferred: underside and profile are not visible.",
    "Keycap legends and dish are not modelled in blockout; caps are blocks.",
]
spec["coordinateFrame"] = {"front": "+Z (edge nearest the typist)", "up": "+Y", "scaleReference": "1 unit = 100 layout px ~ 20 mm; key pitch 0.9"}
spec["silhouette"] = {"boundingShape": "two splayed flat slabs, each ~6.6 x 5.3 units, 0.63 tall", "aspectRatios": [2.3, 0.1],
                      "symmetry": "bilateral between halves (reflection), each half internally asymmetric",
                      "dominantCurves": ["thumb arc on the medial side"], "negativeSpaces": ["gap between halves, wider at the bottom"],
                      "landmarks": ["column stagger", "thumb arc", "encoder knob", "controller module"]}
spec["viewEvidence"][0]["observations"] = ["3/4 front view from above", "both halves visible", "underside hidden"]
spec["viewEvidence"][0]["confidence"] = 0.8
spec["featureReviewTargets"] = [
    {"id": "overall-silhouette", "name": "Two splayed halves, plan outline", "tier": "critical", "passIds": ["blockout"], "minimumScore": 0.8, "mustPass": True, "componentRefs": ["half-left-hand-plate", "half-right-hand-plate"], "evidenceRefs": ["full-object"]},
    {"id": "column-stagger", "name": "Column stagger of the 6x4 matrix", "tier": "critical", "passIds": ["blockout", "structural-pass"], "minimumScore": 0.8, "mustPass": True, "componentRefs": ["key-02", "key-03"], "evidenceRefs": ["full-object"]},
    {"id": "thumb-arc", "name": "Thumb arc with encoder", "tier": "critical", "passIds": ["structural-pass", "form-refinement"], "minimumScore": 0.8, "mustPass": True, "componentRefs": ["key-53", "key-54", "half-left-hand-encoder"], "evidenceRefs": ["full-object"]},
    {"id": "layer-stack", "name": "Light plate / magenta PCB / dark switches / cream caps stack", "tier": "important", "passIds": ["material-pass"], "minimumScore": 0.7, "mustPass": False, "componentRefs": ["half-left-hand-pcb"], "evidenceRefs": ["full-object"]},
    {"id": "controller-oled", "name": "Controller module with OLED at the medial top", "tier": "important", "passIds": ["structural-pass"], "minimumScore": 0.7, "mustPass": False, "componentRefs": ["half-left-hand-controller"], "evidenceRefs": ["full-object"]},
]
spec["performanceBudget"] = {"qualityPriority": "real-time browser prop", "targetTriangles": 40000, "maxDrawCalls": 90, "textureSize": 0, "fpsTarget": 60,
                             "optimizationPolicy": "No textures. One mesh per keycap (58), slabs as single extrusions."}
spec["risks"] = ["Photo shows taller caps than stock Choc; profile is approximate.", "Single view: underside and back edge invented from typical builds."]
json.dump(spec, open("object-sculpt-spec.json", "w"), indent=1, ensure_ascii=False)
print("components", len(comps), "materials", len(mats))
