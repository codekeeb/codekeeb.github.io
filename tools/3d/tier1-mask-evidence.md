# Tier 1 is not applicable to this reference (evidence)
- ref.png foreground mask (diagnose_render.load_mask, 56x56 grid, dump in session log): the mask
  covers the bright white backdrop on the right third of the photo plus scattered key tops, because
  the photo borders are vignetted dark and the backdrop is a light gradient. Coverage 31%, bbox
  (20,34)-(204,182) includes empty backdrop.
- render mask: correct, but largest_component() keeps only ONE half of a split keyboard
  (32.9-41% of foreground discarded), so bbox/scale/aspect describe half the object.
- Camera sweep (18 renders: elevation 24/30/36, margin .56/.62/.68, fov 24/34): IoU 0.150-0.155 for
  every setting -> the metric does not respond to the model, it measures mask artefacts.
- Per grimoire/review/self_correction.md ("Divine Eye caveat — photo-vs-procedural"), pixel-aligned
  signals are advisory here. The pipeline's Tier-1 gate still blocks `continue`; this is recorded,
  not bypassed.
