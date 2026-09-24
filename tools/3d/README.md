# Sofle en 3D con img2threejs — estado y como retomarlo

**Estado (24 sep 2026): parado en la maqueta (blockout), a la espera de una foto mejor.**
No se publica en la web: una maqueta gris sin validar no va a la tienda.

## Que hay aqui

| Archivo | Que es |
|---|---|
| `build_spec.py` | Genera la especificacion (`object-sculpt-spec.json`) desde los datos reales. **Se edita esto, no el TypeScript generado** |
| `geo-sofle.json` | Copia de `CK_GEO.sofle` (js/geometria.js): la posicion de cada tecla sale de aqui, no de la foto |
| `object-sculpt-spec.json` | La especificacion validada en modo estricto, con su revision (`reviewHistory`) |
| `material-regions.json` · `material-evidence.json` | Recortes de la foto por material y la paleta medida en cada uno |
| `image-analysis.md` · `suitability.md` | Analisis por capas y veredicto (condicional: una sola vista) |
| `tier1-mask-evidence.md` | Por que el diagnostico automatico no puede aprobar con esta foto |
| `src/visor.ts` · `src/revision.ts` · `src/pagina.ts` | Visor (escena, luces, suelo, controles), entrada de revision y entrada de pagina |
| `revision/` | Hoja comparativa foto/render y un primer plano de la maqueta |

## Lo que salio bien y lo que no

- Bien: las dos mitades con su giro medido, el escalonado de columnas, el arco del pulgar, el
  encoder y el modulo en la franja interior, y el contorno de la caja trazado desde las teclas.
  Colores medidos en la foto con balance de blancos sacado del fondo.
- Falta: keycaps con su forma (en la foto son altas y concavas, aqui bloques), el modulo
  controlador es demasiado largo, las placas no se distinguen.
- Bloqueo: la foto tiene el fondo en degradado y los bordes oscurecidos, asi que la mascara
  automatica toma el fondo como objeto. En 18 encuadres distintos el solapamiento se quedo en
  0,15: mide la mascara, no el modelo. El proceso exige ese diagnostico aprobado para seguir, y
  no se ha saltado.

## Para seguir hace falta

1. Una foto del teclado sobre fondo liso, sin sombras duras, que no toque los bordes.
2. Una foto de perfil (para el grosor y la altura real de las keycaps).

## Como se reconstruye

img2threejs no va en el repositorio (ver CLAUDE.md, "Skills de diseno"). Con la skill instalada:

```bash
cd <espacio de trabajo> && cp tools/3d/* .   # build_spec.py lee geo-sofle.json y material-analysis.json
python3 build_spec.py                         # sobre el esqueleto de new_sculpt_spec.py
python3 ~/.claude/skills/img2threejs/forge/stage3_build/generate_threejs_factory.py object-sculpt-spec.json --out src/createSofleModel.ts
esbuild src/pagina.ts --bundle --format=esm --minify --outfile=js/sofle-3d.js   # three.js va dentro: nada de CDN
```

`three` y `esbuild` se descargan con `npm pack` en una carpeta de trabajo, fuera del sitio: la web
no tiene `package.json` ni dependencias de npm.
