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

## ergodox-ez.com, ya visto de verdad (14 sep, sesion con acceso Completo)

Medido con Chromium, no de memoria. Dos detalles del entorno, por si la
proxima sesion se atasca igual: el proxy corta el ClientHello grande de
TLS 1.3 que manda Chromium (hay que lanzarlo con `--ssl-version-max=tls1.2`),
y los argumentos por omision de Playwright lo vuelven a romper, asi que hay
que lanzar el navegador a mano y conectarse por CDP. `tools/preview.mjs` ya
lo hace, y por eso ahora las capturas salen con las tipografias reales.

### Longitud

| | escritorio 1440 | movil 390 |
|---|---|---|
| Alto | 30.955 px | 40.016 px |
| Pantallas de scroll | **34,4** | **47,4** |
| Secciones dentro de `<main>` | 24 | 24 |
| Texto | 11.398 caracteres | 11.411 |
| Videos | 2 | 2 |

O sea: su referencia hace **34 pantallas de scroll**, no 20. La portada
clara actual hace 20,6. El scroll largo no es lo que le molestaba de la
version PCB; era otra cosa.

### El primer viewport

De arriba abajo: (1) una franja oscura de ZSA con el logo, "A family of
keyboards" y las tres miniaturas — Voyager, Moonlander y ErgoDox EZ, esta
ultima recuadrada en azul por ser la que estas viendo — con un boton
**HIDE** que la pliega; (2) la barra negra de ZSA con el carrito; (3) la
barra clara del producto: ERGODOX EZ, Learn More / Tools / Accessories y
**Buy Now** en azul. El titular del producto ya no cabe: empieza justo
debajo del pliegue.

Es decir: el primer viewport no vende el teclado, **te situa en el catalogo**
y te da el boton de comprar. La foto grande viene despues.

### Oryx: escondido, no arriba

Oryx aparece **a 17.742 px, en la pantalla 19,7 de 34** — pasado el 58% de
la pagina. Y no es un configurador embebido: es una tarjeta azul dentro de
un bloque "Comes with great tools", tres tarjetas iguales (ORYX, KEYMAPP,
TYP.ING) con cuatro lineas de texto y un enlace "TRY IT OUT" que lleva a
/oryx. No hay iframe, no hay demo en vivo, no hay imagen.

Esto contradice lo que dice PRODUCT.md de Keymap Studio ("el diferencial
mas fuerte y el mas infrautilizado: hoy la web solo lo enlaza como un item
de menu"). ZSA, con la herramienta mas conocida del sector, **tambien la
entierra**. Que su referencia lo haga no significa que sea lo correcto,
pero si significa que "ponerlo arriba" no es lo que hace la web que a el
le funciona.

### Las fotos

**Nada de fotografia de ambiente a sangre.** Lo que hay son renders 3D del
teclado **recortados sobre fondo plano de color**, enormes, saliendose por
los bordes de su seccion. La foto real de escritorio aparece dos veces en
34 pantallas. Los fondos se alternan entre `#f2f2f2` y blanco seccion a
seccion; tres secciones rompen con color pleno (un azul `#98d0df`, un
verde `#23797e`, un negro `#0b0b0c` para el bloque de iluminacion RGB).

Solo 4 de 24 secciones llevan imagen a sangre. La media de area de imagen
por seccion va del 0% (dos secciones de puro texto) al 99,9%.

### Paleta y tipografia

- Fondo: blanco (7,5 M px2) y `#f2f2f2`. Es una web **clara**.
- Texto: `rgb(50,53,70)`, un gris azulado, no negro.
- Acento: azul `#3f52e4` / `#5f70f3`. Un solo acento.
- Barra ZSA: `#22262b`.
- **Una sola familia: Inter.** Pesos 300, 400 y 700. Una sola woff2
  descargada en toda la pagina. Tamanos: 18 px domina, luego 14 y 16.
- Texto por seccion: mediana ~300 caracteres. La mas larga, 1.534.

### Las ANIMACIONES — lo que ninguna captura ensena

Esta es la parte que importa, y el resultado es contundente.

**No hay ni una sola entrada al hacer scroll.** Marcamos los 3.000 y pico
elementos de la pagina, recorrimos los 31.000 px enteros y volvimos a
medir: solo **dos** elementos cambiaron de opacidad o transform, y los dos
son la barra de navegacion pegajosa. Cero fade-up, cero translateY, cero
AOS, cero GSAP, cero ScrollTrigger. Los cuatro IntersectionObserver que
crea son para cargar imagenes en diferido (`rootMargin: 200px`) y para
marcar el enlace activo del menu (`rootMargin: -50% 0% -50% 0%`).

El inventario del CSS (200 KB, 84 `transition` y 13 `animation`):

| Duracion | Usos |
|---|---|
| **200 ms** | **90** |
| 250 ms | 6 |
| 400 ms | 5 |
| 100 / 300 / 500 ms | 9 entre las tres |
| 1 s, 2 s, 12 s, 15 s | bucles |

| Curva | Usos |
|---|---|
| **ease-in-out** | **96** |
| linear | 10 (solo bucles) |
| cubic-bezier(.4,0,.2,1) | 3 |
| ease-in / ease-out sueltas | 4 |

**Una duracion y una curva.** El 73% de las duraciones son 200 ms y el 85%
de las curvas son ease-in-out. Todo lo que responde al raton es
`.2s ease-in-out`: color, fondo, borde, opacity, transform. Medido en
vivo: 50 elementos con `color .2s`, 29 con `opacity .2s`, 14 con
`transform .2s`. El hover de un boton es un cambio de fondo en 200 ms y
nada mas; el de un enlace, color y borde en 200 ms.

Las unicas animaciones en bucle son **doce, y todas ensenan el producto**:

- `rotate-fade-in-out` 12 s ease-in-out — el brillo del RGB, x6.
- `tile2/tile3-slide` 15 s ease-in-out — la demo de Smart Layers.
- `bar-small`, `bar-big`, `z-keycap`, `ctrl-keycap` 2 s **linear** — las
  teclas que se pulsan solas en el bloque de personalizacion.
- `Typewriter-cursor` 1 s — el cursor que parpadea.

Ninguna es decorativa. Ninguna mancha de color flotando, ningun icono
girando, ningun elemento haciendo float. **Nada se mueve si no esta
demostrando algo del teclado.**

Tampoco hay `prefers-reduced-motion` (0 apariciones) ni
`scroll-behavior: smooth`. Hay 7 `position: sticky`.

### Lo que me llevo de todo esto

1. El movimiento de su referencia es **una duracion, una curva, y cero
   entradas al scroll**. La direccion de "dos duraciones y una curva" no
   solo es correcta: se queda corta por el lado generoso.
2. El scroll largo no es el problema. 34 pantallas y a el "le funciona".
3. La imagen de ambiente a sangre no hace falta para vender: producto
   recortado sobre color plano, grande, saliendose del marco.
4. Una sola familia tipografica le basta. Codekeeb usa tres.
5. Un solo acento de color. Codekeeb tiene un degradado de cuatro.

## Sistema de movimiento — HECHO (14 sep)

Como estaba:

- **9 duraciones distintas** (.25 .3 .35 .4 .5 .7 .8 .9 2,4 7 s)
- **29 usos de `ease`**, la curva por defecto del navegador
- **1 solo uso** de la curva propia `cubic-bezier(.16,1,.3,1)`
- `.reveal` aplicaba la misma entrada (translateY 28px, .9s) a casi todo

Como esta ahora, medido en el navegador sobre la pagina viva:

| | antes | ahora |
|---|---|---|
| Duraciones | 9 | **2** (`--t-tap` 180 ms, `--t-enter` 420 ms) |
| Curvas | 4 (`ease` x29) | **1** (`cubic-bezier(.16,1,.3,1)`) |
| Bucles infinitos | 6 | **1** (y solo con el raton encima) |
| Entradas distintas | 1 para todo | **6, por papel** |
| Retardos a mano | 10 valores sueltos | 1 escalon (`--stagger` 60 ms) |

Los seis papeles de entrada, en `css/style.css`:

| Papel | De donde viene | Por que |
|---|---|---|
| `--label` | de ningun sitio, solo opacidad | un rotulo es una etiqueta pegada, no un objeto que llega |
| `--title` | 10 px abajo | un titular se asienta |
| `--text` | 16 px abajo | sigue a su titular, es lo que vas a leer |
| `--media` | la imagen escala de 1.03; **el marco no se mueve** | mover el marco descuadra la rejilla |
| `--row` | 14 px a la izquierda | una tabla se rellena como se lee |
| `--cta` | escala de .97, sin desplazarse | lo que vas a pulsar ya esta donde vas a pulsar |

Dos decisiones que costaron un rato y conviene no deshacer:

1. **Las entradas van en `@keyframes`, no en `transition`.** La tarjeta de
   modelo entra y ademas responde al raton; con `transition` las dos cosas
   se pelean por la misma propiedad y gana la ultima regla del archivo —
   la tarjeta entraba en 180 ms porque su propio hover pisaba la entrada.
   Una animacion de una pasada con `animation-fill-mode: backwards` no
   toca `transition`, asi que cada cosa conserva su velocidad, y al acabar
   suelta el control para que el hover pueda mover el elemento.
2. **Los bucles decorativos se han ido**: las dos manchas `aura` de 18 s y
   14 s, el `float` de 7 s que hacia flotar la foto del carrusel, el
   `pulseline` de 2,4 s del "SCROLL" y el `spin` de 24 s de la mirilla.
   El criterio es el de ergodox: **si no ensena algo del teclado, no se
   mueve**. El unico bucle que queda es el degradado RGB del boton de
   compra, que solo corre con el raton encima y dice "este teclado lleva
   RGB". Va en `linear` a proposito: con una curva, la costura del bucle
   da un tiron.

`tools/check-movimiento.py` vigila que esto no se deshaga solo: falla si
aparece una duracion escrita a mano, una curva que no sea `--ease`, un
retardo en segundos o un bucle sin justificar.

## Cosas que me he encontrado y NO he tocado

Son decisiones suyas, no mias:

1. **Los 9 `kicker` estan en `display:none`.** La regla es
   `.kicker,.manifesto__label{display:none}` con el comentario "El kicker
   sobre titular sigue fuera del sistema" — viene del contrato de la
   direccion PCB, que el rechazo. O sea: hay 9 parrafos con sus claves en
   los tres idiomas que se descargan y no se ven nunca. O vuelven, o se
   borran con sus claves.
2. **`.impeccable/surfaces/home.md` sigue describiendo la direccion PCB**
   (soldermask negro, cobre, designadores) como si fuera el contrato
   vigente. Esa direccion esta rechazada y el CSS ya no la sigue. Le he
   puesto un aviso arriba, pero el contrato nuevo de la version clara lo
   tiene que escribir el.
3. **La flecha `<` del carrusel se come el principio del parrafo** en
   escritorio: `.carousel__arrow--prev{left:-6px}` cae encima del texto
   del slide. En la captura de 1440 se lee "...smo Sofle Choc" en vez de
   "El mismo Sofle Choc". Es de layout, no de movimiento.

## Red

El entorno `home` paso a acceso **Completo** el 14 sep. Las sesiones
anteriores a ese cambio no lo tienen. En una sesion nueva ergodox-ez.com
deberia abrirse; conviene comprobarlo antes de opinar sobre esa web.

---

# 14 sep · la portada, revisada con las skills

Las tres skills que pidio que usara: `impeccable` y `emil-design-eng`
estan instaladas en `.claude/skills/`. **`taste` no esta instalada**, ni
como skill del proyecto ni como plugin. Lo que sigue sale de las dos que
si estan, mas medicion en navegador.

## La foto vertical: la causa era una linea que falta

Las cuatro hojas de las direcciones tenian el reinicio de imagen a medias:

```css
img{display:block;max-width:100%}          /* direcciones/*.css */
img{display:block;max-width:100%;height:auto}   /* css/style.css */
```

Los atributos `width="1200" height="900"` del HTML **se traducen a CSS** y
ganan a `aspect-ratio` si nadie pone `height:auto`. O sea que cada foto del
carril se dibujaba de 320x900 — vertical, con el teclado convertido en una
franja — y ademas `encuadrar()` se rendia, porque el marco le salia mas
alto que la foto y en ese caso no hay recorte que calcular. No era el
encuadre: era el reinicio.

## Lo demas que se ha corregido en el mismo lote

- **El heroe.** Foto del Retro enmarcada (aire a los cuatro lados), marco
  16/10 y el texto encima, apoyado en la banda de mesa de arriba. El
  recorte sale del `foco` medido (63%) por la formula de `encuadrar()`,
  no a ojo. En movil la foto va entera, sin recortar, y el texto pasa
  debajo dentro de la misma pieza: la foto es apaisada (1,43) y cualquier
  marco vertical se come una mitad del teclado a lo ancho.
- **Nada de rotulo sobre el titular.** `craft-floor.md` lo prohibe sin
  excepciones. Se ha quitado `p.heroKicker` de los tres idiomas.
- **Comprar lleva al anuncio.** El boton de cabecera apuntaba a
  `CK_SHOP_URL` (la tienda generica) en las cuatro paginas, justo lo que
  `js/data.js` dice que perdia la venta. Ahora la chapa del heroe lleva al
  anuncio del modelo que se ve, y las cabeceras llevan al catalogo o al
  comparador, que es lo que de verdad hacen.
- **El precio dice "desde".** Se ensenaba `priceFrom`, que muchas veces es
  la PCB suelta: 26 € no compra un Totem. `CK.precioHTML()` pone la
  palabra delante cuando hay dos precios.
- **Contraste.** `--gris` daba 4,40:1 y `--tenue` 2,32:1 sobre el papel.
  Medidos y corregidos a 5,50:1 y 4,60:1 en la portada, y a 4,9/4,7 en el
  comparador y en la ficha por pantalla. Los cuatro argumentos apagados de
  la region RGB pasan de 2,28:1 a 5,3:1 y el encendido a blanco se sigue
  notando igual.
- **El anillo de foco era invisible en 5 de 20 botones**: `currentColor`
  sobre un boton oscuro dibuja papel claro encima de papel claro. Ahora lo
  pone el suelo.
- **Cuatro tamanos de rotulo (.56/.58/.60/.62rem) pasan a uno** de 11 px.
- **Los tres botones de idioma median 25x21 px**; ahora 40x44.
- **`loading="lazy"` dentro de un `overflow-x:auto`**: cuatro de las cinco
  fotos del carril no se cargaban nunca, y lo mismo en la cabecera del
  comparador. Fuera.
- **El halo azul de 64 px sin desplazamiento de la OLED**, fuera: la luz
  cae hacia algun lado o no es luz.
- **`check-i18n.py` no miraba las direcciones**: usan `data-t`, no
  `data-i18n`, asi que un prototipo podia ensenar la clave cruda sin que
  nadie se enterase. Ya mira las dos.

## Un fallo de la herramienta, no de la web

`preview.mjs` mandaba capturas completas con media pagina en blanco. La
causa: la portada lleva `html{scroll-behavior:smooth}`, asi que cada
`window.scrollTo(0,y)` del recorrido abria una animacion y la llamada
siguiente la reiniciaba antes de llegar. La pagina no se movia, el
`IntersectionObserver` no veia pasar nada y los 24 elementos con entrada se
quedaban en `opacity:0`. Ahora el recorrido usa `behavior:"instant"` y, por
si acaso, la herramienta cuenta los elementos que no han entrado y lo
avisa: una captura en blanco que parece un fallo real es la peor clase de
fallo.

## Lo que sigue abierto (no lo he tocado por mi cuenta)

- La pagina mide **9.700 px**: once pantallas. Tres de ellas —OLED, capas
  y hotswap— son la misma composicion (rotulo, titular centrado, demo,
  parrafo) repetida, casi 2.700 px de meseta. Si lo del "scroll infinito"
  le sigue molestando, ahi es donde esta.
- **"17 repositorios publicos"** se afirma y no se enlaza.
- Las fotos de Keymap Studio que menciono estan en `X:\ADEUKB\...`, una
  ruta de su Windows: desde este contenedor no existe. Tienen que entrar al
  repositorio o pegarlas en el chat.
