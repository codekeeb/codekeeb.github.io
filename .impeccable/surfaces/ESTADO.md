# Estado del rediseno — 14 sep 2026

Notas para la siguiente sesion. Lo que el repo no cuenta por si solo.

## Ramas

| Rama | Que es | Veredicto |
|---|---|---|
| `claude/github-app-iphone-error-qgiuux` | Herramientas + catalogo delante + PRODUCT.md | vale |
| `claude/redisenio-tienda` | Serigrafia de PCB, fondo negro | **rechazada** |
| `claude/tienda-clara` | Clara con sistema de rigor | **en curso** |

## Que rechazo Ernesto de la version PCB, con sus palabras

- "hay lineas que cortan a otras, eso en pcbs no suele darse" — cierto y era
  un error: en una placa real las pistas de una misma capa no se cruzan.
- "una pagina que hace scroll infinito no se si me gusta del todo"
- "busco una tienda elegante, mas util, y sutil"
- "poco impresionado, no creo que haya mejorado el diseno anterior"
- "prefiero una version clara, como la que tenia"

## Que SI le gusta, confirmado por el

- La tipografia nueva: Archivo Black, Archivo, Martian Mono.
- El catalogo tecnico con densidad de datos (specs, opciones, stock).
- Su referencia: **ergodox-ez.com**. "esta bastante bien, funciona".
  Observo el mismo que no usa imagenes a sangre y aun asi funciona.

## Material disponible: solo lo que hay en el repo

64 imagenes, **cero videos**. Confirmado por el.

Autorizo marcos de imagen vacios rotulados con la foto que falta. Lo que
NO se hace, y es regla suya en PRODUCT.md: generar fotos de producto. La
web enlaza a anuncios de venta reales.

## Medidas de la portada (rama clara, 390 px)

| | |
|---|---|
| Regiones | 8 |
| Scroll | 20,6 pantallas |
| Texto | 6.133 caracteres |
| Area de imagen | 30,6% |
| Videos | 0 |

Fuera ya: marquee, manifiesto, trust (duplicaba confianza) y vistazo
(repetia la tabla de specs). El bulto que queda es `caracteristicas`:
cinco bloques que contienen las unicas cinco fotos de ambiente.

## Lo siguiente: sistema de movimiento

Auditoria del CSS actual:

- **9 duraciones distintas** (.25 .3 .35 .4 .5 .7 .8 .9 2,4 7 s)
- **29 usos de `ease`**, la curva por defecto del navegador
- **1 solo uso** de la curva propia `cubic-bezier(.16,1,.3,1)`
- `.reveal` aplica la misma entrada (translateY 28px, .9s) a casi todo

Objetivo: dos duraciones y una curva. ~180 ms para lo que responde al
dedo, ~420 ms para lo que entra en escena, salida exponencial. Y que las
entradas se diferencien por papel: una foto no entra como entra un precio.

## Red

El entorno `home` paso a acceso **Completo** el 14 sep. Las sesiones
anteriores a ese cambio no lo tienen. En una sesion nueva ergodox-ez.com
deberia abrirse; conviene comprobarlo antes de opinar sobre esa web.
