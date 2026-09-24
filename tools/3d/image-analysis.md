# Image analysis — ref.png (Sofle Choc Retro, Codekeeb)

## L1 Identification
- Work type: split ergonomic mechanical keyboard (two mirrored halves). Broad class: computer input
  device / mechanical assembly. primaryDomain: object. Confidence 0.97.

## L2 Form & silhouette
- Two separate thin slabs, each an extruded polygon (plate stack) ~ 150 x 110 mm footprint, total
  height with keycaps ~ 20 mm. Low-profile slab + dense grid of cuboid-ish keycaps.
- Symmetry: bilateral BETWEEN halves (right half = mirror of left, reflection across the
  medial plane), each half asymmetric internally (thumb arc on the medial side).
- Shape language: geometric. Halves splayed: each rotated ~7 degrees (inner edges closer at the
  top than the bottom — "tented outward" in plan view, not in elevation).

## L3 Macro → meso → micro
- macro: half-left, half-right (mirror pair).
- meso per half: case stack (bottom plate + PCB + top edge), key matrix (6 columns x 4 rows,
  column-staggered), thumb cluster (4 keys + 1 rotary encoder in an arc), controller/OLED module
  (vertical module at the medial top edge), rotary encoder knob.
- micro: keycap dish (concave top), keycap legends, knurled knob grooves, OLED pixel display,
  underglow light at PCB edge, keycap homing/accent colours.

## L4 Spatial relationships
- <keycap, attached-to (socket), switch/PCB top> — each keycap sits above the plate, gap visible.
- <encoder knob, embedded-in, thumb-cluster slot at medial-top of the thumb arc>.
- <controller module, attached-to (butt), PCB top face at medial top corner>, standing proud.
- <PCB, sandwiched-between, bottom plate and nothing on top (open top)>; PCB edge visible as a
  magenta band.
- <thumb keys, rotated-about, arc centre below the matrix>, outer thumb key rotated most.

## L5 Materials (PBR)
- Keycaps: PBT plastic, dielectric, metalness 0, roughness ~0.55, albedo off-white/cream.
- Accent keycaps (HOME, up arrow): same material, albedo near-black.
- Bottom plate: matte light grey acrylic/FR4, roughness ~0.7, albedo light grey.
- PCB edge: FR4 with magenta soldermask, satin (roughness ~0.45); emissive magenta underglow
  bleeding below.
- Encoder knob: black anodized aluminium, metalness ~0.6, roughness ~0.4, knurled.
- OLED: black glass, low roughness ~0.1, emissive white pixels.

## L6 Colour & finish
- Keycaps: hue warm-neutral (cream), high value, low saturation; matte.
- Accent keys: near-black, low value.
- Case: light grey, high value, matte. PCB: vivid magenta, mid value, satin.
- Underglow: magenta emission, gradient from PCB edge fading outwards (inference: RGB LEDs).

## L7 Identity-defining features
- Column stagger (middle/ring columns higher) — defines Sofle.
- Thumb arc with encoder knob in the cluster — defines Sofle.
- Two halves splayed ~7 degrees.
- Vertical controller/OLED module at the medial top.
- Cream tall keycaps with 2-3 black accent keys.
- Magenta PCB layer between light plates.

## L8 Uncertainty / single-view limits
- hidden: underside, back edge, exact plate thickness, feet/tenting hardware (a dark round object
  under the left half may be a tenting puck — uncertain).
- uncertain: keycap profile height (keycaps look taller than true Choc low-profile caps; inference:
  MX-height-looking caps on a Choc board — would need confirmation).
- Key positions: NOT measured from the photo (perspective distortion); taken from the
  authoritative layout in js/geometria.js (CK_GEO.sofle), which comes from the Keymap Studio.
- Legends: not reconstructed (text on keycaps omitted in a code-only model).
