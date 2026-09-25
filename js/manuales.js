/* ============================================================
   CODEKEEB — el contenido de los manuales
   ------------------------------------------------------------
   Un manual por firmware, no por producto: el Sofle Carbon y el Sofle
   Retro llevan el mismo (sofle-choc-rgb-zmk) y lo que cambia entre ellos
   (las pantallas) lo decide la ficha del producto en data.js.

   LA FUENTE ES EL FIRMWARE, NO EL README. Todo lo que dice que tecla hace
   que sale del .keymap de cada repositorio, que es lo que corre en el
   teclado. Donde el README decia otra cosa, gana el keymap:
     - Sofle: "RAISE + G = Caps Word" ya no existe (esa tecla es
       transparente desde que RAISE es la capa de raton), y el encoder
       derecho pulsado en la capa base es Play/Pausa, no EP_TOG.
     - Totem: las capas se llaman NAV (mantener TAB) y SYM (mantener ESC),
       no LOWER y RAISE en los pulgares.
   Revisado contra sofle-choc-rgb-zmk v1.7.0 y totem-zmk v1.0.0
   (25 sep 2026). Si cambia un keymap, se cambia aqui.

   Los Corne no tienen manual: sus repositorios estan vacios y no se
   inventan pasos (Ernesto, 25 sep 2026).

   Marcado de los textos: [TECLA] sale como una tecla; **texto** en negrita.
   ============================================================ */

/* Todo dentro de una funcion: los atajos (t, K, f...) no salen al resto
   de la pagina, que tiene sus propios nombres cortos. */
const CK_MANUALES = (() => {
const t = (es, en, fr) => ({ es, en, fr });

/* ---- etiquetas de tecla que dependen del idioma ---- */
const K = {
  luz: t("Luz", "Light", "Lum."),
  modo: t("Modo+", "Mode+", "Mode+"),
  tonoM: t("Tono−", "Hue−", "Teinte−"),
  tonoP: t("Tono+", "Hue+", "Teinte+"),
  brM: t("Brillo−", "Bright−", "Lum−"),
  brP: t("Brillo+", "Bright+", "Lum+"),
  btC: t("BT borrar", "BT clear", "BT effacer"),
  silencio: t("Silencio", "Mute", "Muet"),
  play: t("Play", "Play", "Play"),
  deshacer: t("Deshacer", "Undo", "Annuler"),
  cortar: t("Cortar", "Cut", "Couper"),
  copiar: t("Copiar", "Copy", "Copier"),
  pegar: t("Pegar", "Paste", "Coller"),
  clicI: t("Clic izq.", "L click", "Clic G"),
  clicM: t("Clic cen.", "M click", "Clic M"),
  clicD: t("Clic der.", "R click", "Clic D"),
  ratU: t("Ratón ↑", "Mouse ↑", "Souris ↑"),
  ratD: t("Ratón ↓", "Mouse ↓", "Souris ↓"),
  ratL: t("Ratón ←", "Mouse ←", "Souris ←"),
  ratR: t("Ratón →", "Mouse →", "Souris →"),
  rueU: t("Rueda ↑", "Wheel ↑", "Molette ↑"),
  rueD: t("Rueda ↓", "Wheel ↓", "Molette ↓"),
  anim: t("Anim.", "Anim.", "Anim."),
  rePag: t("RePág", "PgUp", "PgPréc"),
  avPag: t("AvPág", "PgDn", "PgSuiv"),
  mayus: t("Bloq Mayús", "Caps", "Verr Maj"),
  volM: t("Vol−", "Vol−", "Vol−"),
  volP: t("Vol+", "Vol+", "Vol+"),
  ant: t("Anterior", "Prev", "Préc."),
  sig: t("Siguiente", "Next", "Suiv."),
  usbBt: t("USB/BT", "USB/BT", "USB/BT"),
  btAnt: t("BT ←", "BT ←", "BT ←"),
  btSig: t("BT →", "BT →", "BT →"),
  reinicio: t("Reinicio", "Reset", "Reset"),
  boot: t("Flasheo", "Boot", "Flash"),
};

/* Cada capa: dos mitades. Una mitad es una rejilla (null = hueco) y una
   fila de pulgares que empieza en la columna `desde`. Una tecla es un
   texto, un {es,en,fr}, o un objeto:
     {t, h}     toque / mantener (home row mods, capas en un pulgar)
     {f: true}  tecla con funcion de esta capa: se enciende
     {m: true}  la tecla que se esta manteniendo para entrar en la capa
     {e: true}  el encoder (se pulsa)
   "·" es transparente: hace lo mismo que en la capa de abajo. */
const f = (x) => ({ t: x, f: true });
const m = (x) => ({ t: x, m: true });
const e = (x, fx) => ({ t: x, e: true, f: !!fx });
/* tecla que solo tiene sentido con pantallas: en el Sofle Retro sale "·" */
const ep = x => ({ t: x, e: true, f: true, pant: true });

const CAPAS_SOFLE = {
  code: {
    nombre: "CODE",
    izq: { filas: [
      ["Esc", "1", "2", "3", "4", "5", null],
      ["Tab", "Q", "W", "E", "R", "T", null],
      ["⇧", "A", "S", "D", "F", "G", null],
      ["Ctrl", "Z", "X", "C", "V", "B", e(K.silencio)],
    ], pulgares: { desde: 2, teclas: ["GUI", "Alt", "Ctrl", "LOWER", "␣"] } },
    der: { filas: [
      [null, "6", "7", "8", "9", "0", "Del"],
      [null, "Y", "U", "I", "O", "P", "⌫"],
      [null, "H", "J", "K", "L", ";", "'"],
      [e(K.play), "N", "M", ",", ".", "/", "⇧"],
    ], pulgares: { desde: 0, teclas: ["↵", "RAISE", "Ctrl", "Alt", "GUI"] } },
  },
  lower: {
    nombre: "LOWER",
    izq: { filas: [
      ["·", f("F1"), f("F2"), f("F3"), f("F4"), f("F5"), null],
      [f("`"), f("F11"), f("F12"), f("€"), f(K.luz), f(K.modo), null],
      ["·", "·", f("{"), f("}"), f(K.tonoM), f(K.tonoP), null],
      ["·", f("Studio"), "·", "·", f(K.brM), f(K.brP), ep("WPM")],
    ], pulgares: { desde: 2, teclas: ["·", "·", "·", m("LOWER"), "·"] } },
    der: { filas: [
      [null, f("F6"), f("F7"), f("F8"), f("F9"), f("F10"), f("Del")],
      [null, "·", "·", f("↑"), "·", "·", f("⌫")],
      [null, "·", f("←"), f("↓"), f("→"), "·", f("|")],
      [ep(K.anim), "·", "·", "·", "·", f("\\"), "·"],
    ], pulgares: { desde: 0, teclas: ["·", "·", "·", "·", "·"] } },
  },
  raise: {
    nombre: "RAISE",
    izq: { filas: [
      [f(K.btC), f("BT1"), f("BT2"), f("BT3"), f("BT4"), f("BT5"), null],
      ["·", "·", f(K.ratU), "·", f(K.rueU), "·", null],
      ["·", f(K.ratL), f(K.ratD), f(K.ratR), f(K.rueD), "·", null],
      ["·", f(K.deshacer), f(K.cortar), f(K.copiar), f(K.pegar), "·", e("·")],
    ], pulgares: { desde: 2, teclas: [f(K.clicI), f(K.clicM), f(K.clicD), "·", "·"] } },
    der: { filas: [
      [null, "·", f("["), f("]"), f("("), f(")"), f("Del")],
      [null, f(K.rePag), f("7"), f("8"), f("9"), f("%"), f("⌫")],
      [null, f(K.avPag), f("4"), f("5"), f("6"), f("+"), f("×")],
      [e(K.luz, true), "·", f("1"), f("2"), f("3"), f("−"), f("/")],
    // el 0 esta en la posicion de la propia tecla RAISE: no se puede pulsar
    ], pulgares: { desde: 0, teclas: ["·", m("RAISE"), f("."), f("="), "·"] } },
  },
};

const ht = (x, h) => ({ t: x, h });
const CAPAS_TOTEM = {
  base: {
    nombre: "BASE",
    izq: { filas: [
      [null, "Q", "W", "E", "R", "T"],
      [null, ht("A", "GUI"), ht("S", "Alt"), ht("D", "Ctrl"), ht("F", "⇧"), "G"],
      ["Esc", "Z", "X", "C", "V", "B"],
    ], pulgares: { desde: 3, teclas: ["Del", ht("Tab", "NAV"), "␣"] } },
    der: { filas: [
      ["Y", "U", "I", "O", "P", null],
      ["H", ht("J", "⇧"), ht("K", "Ctrl"), ht("L", "Alt"), ht(";", "GUI"), null],
      ["N", "M", ",", ".", "/", "'"],
    ], pulgares: { desde: 0, teclas: ["↵", ht("Esc", "SYM"), "⌫"] } },
  },
  nav: {
    nombre: "NAV",
    izq: { filas: [
      [null, f("Esc"), f("Del"), f("↑"), f("="), f("{")],
      [null, f("⇧"), f("←"), f("↓"), f("→"), f("[")],
      ["·", f("Studio"), f(K.rePag), f(K.mayus), f(K.avPag), f("(")],
    ], pulgares: { desde: 3, teclas: ["·", m("NAV"), "·"] } },
    der: { filas: [
      [f("}"), f("7"), f("8"), f("9"), f("+"), null],
      [f("]"), f("4"), f("5"), f("6"), f("−"), null],
      [f(")"), f("1"), f("2"), f("3"), f("*"), "·"],
    ], pulgares: { desde: 0, teclas: [f("ADJ"), f("0"), f("Del")] } },
  },
  sym: {
    nombre: "SYM",
    izq: { filas: [
      [null, f("!"), f("@"), f("#"), f("$"), f("%")],
      [null, f("_"), f("-"), f("="), f("+"), f("\\")],
      ["·", f("`"), f("~"), f("|"), f("<"), f(">")],
    ], pulgares: { desde: 3, teclas: ["·", f("ADJ"), "·"] } },
    der: { filas: [
      [f("^"), f("&"), f("*"), f("'"), f('"'), null],
      [f(K.silencio), f("("), f(")"), f("["), f("]"), null],
      [f(K.volM), f(K.volP), f(K.ant), f(K.sig), f("?"), "·"],
    ], pulgares: { desde: 0, teclas: ["·", m("SYM"), f(K.play)] } },
  },
  adj: {
    nombre: "ADJ",
    izq: { filas: [
      [null, f(K.reinicio), f(K.btC), f(K.usbBt), "·", "·"],
      [null, f(K.boot), f("BT1"), f("BT2"), f("BT3"), f("BT4")],
      ["·", "·", f(K.btAnt), f(K.btSig), "·", "·"],
    ], pulgares: { desde: 3, teclas: ["·", "·", "·"] } },
    der: { filas: [
      ["·", f("F7"), f("F8"), f("F9"), f("F12"), null],
      ["·", f("F4"), f("F5"), f("F6"), f("F11"), null],
      ["·", f("F1"), f("F2"), f("F3"), f("F10"), "·"],
    ], pulgares: { desde: 0, teclas: ["·", "·", "·"] } },
  },
};

/* ---- los manuales ----
   Cada capitulo: id, titulo y bloques. Un bloque es uno de:
     {p}               parrafo
     {pasos: [...]}    pasos numerados
     {tabla: {cab, filas}}
     {capa: id}        el dibujo de una capa
     {nota}            aviso
     {enlaces: [[texto, url], ...]}
   `solo: "pantallas"` en un capitulo o bloque, `pant` en una tecla o en
   una celda: solo si el producto tiene pantallas en su ficha (el Sofle
   Retro no); si no, la tecla sale "·" y la celda "—". */
return {
  "sofle-zmk": {
    firmware: "ZMK v0.3",
    controlador: "nice!nano v2",
    repo: "https://github.com/codekeeb/sofle-choc-rgb-zmk",
    releases: "https://github.com/codekeeb/sofle-choc-rgb-zmk/releases",
    capas: CAPAS_SOFLE,
    capitulos: [
      { id: "empezar", titulo: t("Primeros pasos", "Getting started", "Premiers pas"), bloques: [
        { p: t(
          "Cada mitad lleva su propio controlador y su batería. La **mitad izquierda** es la que habla con el ordenador; la derecha se conecta sola a la izquierda.",
          "Each half has its own controller and battery. The **left half** is the one that talks to your computer; the right half connects to the left one on its own.",
          "Chaque moitié a son propre contrôleur et sa batterie. La **moitié gauche** parle à l'ordinateur ; la droite se connecte toute seule à la gauche.") },
        { pasos: [
          t("Carga las dos mitades con un cable USB-C, una a una.", "Charge both halves with a USB-C cable, one at a time.", "Chargez les deux moitiés avec un câble USB-C, l'une après l'autre."),
          t("Pulsa cualquier tecla para despertarlo.", "Press any key to wake it up.", "Appuyez sur n'importe quelle touche pour le réveiller."),
          t("Mantén [RAISE] y pulsa [1]: eliges el perfil Bluetooth 1.", "Hold [RAISE] and press [1]: this selects Bluetooth profile 1.", "Maintenez [RAISE] et appuyez sur [1] : vous choisissez le profil Bluetooth 1."),
          t("En tu ordenador, abre los ajustes de Bluetooth y conecta el teclado nuevo que aparece.", "On your computer, open the Bluetooth settings and connect the new keyboard that shows up.", "Sur votre ordinateur, ouvrez les réglages Bluetooth et connectez le nouveau clavier qui apparaît."),
          t("La luz arranca apagada: enciéndela con [LOWER] + [R].", "The lights start off: turn them on with [LOWER] + [R].", "La lumière démarre éteinte : allumez-la avec [LOWER] + [R]."),
        ] },
        { p: t(
          "Si conectas la mitad izquierda por USB a un ordenador, también escribe por el cable.",
          "If you plug the left half into a computer over USB, it also types through the cable.",
          "Si vous branchez la moitié gauche en USB sur un ordinateur, il tape aussi par le câble.") },
      ] },
      { id: "capas", titulo: t("Capas", "Layers", "Couches"), bloques: [
        { p: t(
          "Tres capas. **CODE** es la de escribir. Mientras mantienes [LOWER] (pulgar izquierdo) o [RAISE] (pulgar derecho), las teclas cambian de función; al soltar, vuelven.",
          "Three layers. **CODE** is for typing. While you hold [LOWER] (left thumb) or [RAISE] (right thumb), the keys change function; let go and they come back.",
          "Trois couches. **CODE** sert à écrire. Tant que vous maintenez [LOWER] (pouce gauche) ou [RAISE] (pouce droit), les touches changent de fonction ; en relâchant, elles reviennent.") },
        { capa: "code" },
        { capa: "lower", p: t(
          "LOWER: teclas de función, flechas en I J K L y los controles de la luz.",
          "LOWER: function keys, arrows on I J K L and the lighting controls.",
          "LOWER : touches de fonction, flèches sur I J K L et les commandes de la lumière.") },
        { capa: "raise", p: t(
          "RAISE: la mitad izquierda es un ratón (puntero, rueda y clics en los pulgares) y la derecha un teclado numérico. Arriba a la izquierda, los perfiles Bluetooth.",
          "RAISE: the left half is a mouse (pointer, wheel and clicks on the thumbs) and the right half a number pad. Top left, the Bluetooth profiles.",
          "RAISE : la moitié gauche est une souris (pointeur, molette et clics sur les pouces) et la droite un pavé numérique. En haut à gauche, les profils Bluetooth.") },
      ] },
      { id: "bluetooth", titulo: t("Bluetooth", "Bluetooth", "Bluetooth"), bloques: [
        { p: t(
          "Recuerda hasta **cinco ordenadores**, uno por perfil. Cambias de uno a otro sin volver a emparejar.",
          "It remembers up to **five computers**, one per profile. You switch between them without pairing again.",
          "Il mémorise jusqu'à **cinq ordinateurs**, un par profil. Vous passez de l'un à l'autre sans réappairer.") },
        { tabla: { cab: [t("Pulsa", "Press", "Appuyez"), t("Hace", "Does", "Effet")], filas: [
          [t("[RAISE] + [1] … [5]", "[RAISE] + [1] … [5]", "[RAISE] + [1] … [5]"), t("Elige el perfil 1 a 5", "Selects profile 1 to 5", "Choisit le profil 1 à 5")],
          [t("[RAISE] + [Esc]", "[RAISE] + [Esc]", "[RAISE] + [Esc]"), t("Borra el emparejamiento del perfil activo", "Clears the pairing of the active profile", "Efface l'appairage du profil actif")],
        ] } },
        { p: t(
          "Para emparejar de nuevo un perfil que ya usabas: bórralo con [RAISE] + [Esc], quita también el teclado de la lista de Bluetooth del ordenador y vuelve a conectarlo.",
          "To pair a profile you already used again: clear it with [RAISE] + [Esc], remove the keyboard from the computer's Bluetooth list too, and connect it again.",
          "Pour réappairer un profil déjà utilisé : effacez-le avec [RAISE] + [Esc], retirez aussi le clavier de la liste Bluetooth de l'ordinateur et reconnectez-le.") },
      ] },
      { id: "luz", titulo: t("Luz", "Lighting", "Éclairage"), bloques: [
        { p: t(
          "Treinta LED por mitad y diez modos, escritos en el firmware. El color cruza de una mitad a otra sin cortarse. Lo que eliges (modo, tono, brillo, velocidad) se guarda aunque apagues; el encendido no: la luz arranca apagada.",
          "Thirty LEDs per half and ten modes, written in the firmware. The colour flows across both halves without a break. What you choose (mode, hue, brightness, speed) is saved when you power off; on/off is not: the lights start off.",
          "Trente LED par moitié et dix modes, écrits dans le firmware. La couleur passe d'une moitié à l'autre sans coupure. Vos choix (mode, teinte, luminosité, vitesse) restent enregistrés ; l'allumage non : la lumière démarre éteinte.") },
        { tabla: { cab: [t("Pulsa o gira", "Press or turn", "Appuyez ou tournez"), t("Hace", "Does", "Effet")], filas: [
          [t("[LOWER] + [R]", "[LOWER] + [R]", "[LOWER] + [R]"), t("Enciende o apaga la luz", "Turns the lights on or off", "Allume ou éteint la lumière")],
          [t("[RAISE] + encoder derecho pulsado", "[RAISE] + press the right encoder", "[RAISE] + appui sur l'encodeur droit"), t("Enciende o apaga la luz", "Turns the lights on or off", "Allume ou éteint la lumière")],
          [t("[LOWER] + [T], o [LOWER] + girar el encoder izquierdo", "[LOWER] + [T], or [LOWER] + turn the left encoder", "[LOWER] + [T], ou [LOWER] + tourner l'encodeur gauche"), t("Cambia de modo", "Changes mode", "Change de mode")],
          [t("[LOWER] + [F] / [G], o [LOWER] + girar el encoder derecho", "[LOWER] + [F] / [G], or [LOWER] + turn the right encoder", "[LOWER] + [F] / [G], ou [LOWER] + tourner l'encodeur droit"), t("Gira el tono de 20 en 20 grados", "Shifts the hue in 20° steps", "Tourne la teinte par pas de 20°")],
          [t("[LOWER] + [V] / [B], o [RAISE] + girar el encoder izquierdo", "[LOWER] + [V] / [B], or [RAISE] + turn the left encoder", "[LOWER] + [V] / [B], ou [RAISE] + tourner l'encodeur gauche"), t("Brillo, en cinco pasos", "Brightness, in five steps", "Luminosité, en cinq pas")],
          [t("[RAISE] + girar el encoder derecho", "[RAISE] + turn the right encoder", "[RAISE] + tourner l'encodeur droit"), t("Velocidad, de 0,25× a 4×", "Speed, from 0.25× to 4×", "Vitesse, de 0,25× à 4×")],
        ] } },
        { tabla: { cab: [t("Modo", "Mode", "Mode"), t("Cómo es", "What it looks like", "À quoi il ressemble")], filas: [
          ["1 · Gradient", t("Degradado de tres colores que se mueve en diagonal", "Three-colour gradient moving diagonally", "Dégradé de trois couleurs qui se déplace en diagonale")],
          ["2 · Ripple", t("Ondas azules que salen de cada tecla que pulsas", "Blue waves from every key you press", "Ondes bleues qui partent de chaque touche pressée")],
          ["3 · Sparkle", t("Destellos cian y magenta", "Cyan and magenta sparkles", "Étincelles cyan et magenta")],
          ["4 · Solid", t("Un solo color que va del ámbar al rosa", "A single colour cycling amber to pink", "Une seule couleur qui passe de l'ambre au rose")],
          ["5 · Fire", t("Rojo, naranja y amarillo en vertical, rápido", "Red, orange and yellow vertically, fast", "Rouge, orange et jaune à la verticale, rapide")],
          ["6 · Ocean", t("Azul, cian y verde, muy lento", "Blue, cyan and green, very slow", "Bleu, cyan et vert, très lent")],
          ["7 · Gold sparkle", t("Destellos dorados rápidos", "Fast golden sparkles", "Étincelles dorées rapides")],
          ["8 · Pink ripple", t("Ondas rosas, más rápidas y anchas", "Pink waves, faster and wider", "Ondes roses, plus rapides et larges")],
          ["9 · Sunset", t("Fijo: naranja, coral, rosa, morado y azul", "Static: orange, coral, pink, purple and blue", "Fixe : orange, corail, rose, violet et bleu")],
          ["10 · Heatmap", t("Cada tecla se enciende al pulsarla y se apaga en un segundo", "Each key lights up when pressed and fades in about a second", "Chaque touche s'allume quand on l'appuie et s'éteint en une seconde")],
        ] } },
        { p: t(
          "Con [LOWER] mantenido, los pulgares se ponen rosas y las flechas se marcan en naranja. Con [RAISE], los pulgares se ponen morados y los perfiles Bluetooth se ven en las teclas: el activo en verde.",
          "While [LOWER] is held, the thumb keys turn pink and the arrows are marked in orange. With [RAISE], the thumbs turn purple and the Bluetooth profiles show on the keys: the active one in green.",
          "Avec [LOWER] maintenu, les pouces deviennent roses et les flèches sont marquées en orange. Avec [RAISE], les pouces deviennent violets et les profils Bluetooth s'affichent sur les touches : l'actif en vert.") },
        { p: t(
          "Tras un minuto sin tocarlo la luz se apaga para ahorrar batería; vuelve con la primera tecla.",
          "After a minute without use the lights go off to save battery; they come back with the first key press.",
          "Après une minute sans utilisation, la lumière s'éteint pour économiser la batterie ; elle revient à la première touche.") },
      ] },
      { id: "pantallas", solo: "pantallas", titulo: t("Pantallas", "Displays", "Écrans"), bloques: [
        { tabla: { cab: [t("Pantalla", "Display", "Écran"), t("Muestra", "Shows", "Affiche")], filas: [
          [t("Izquierda", "Left", "Gauche"), t("Batería, salida (Bluetooth o USB), capa, perfil y el Bongo Cat, que toca al ritmo de lo que escribes", "Battery, output (Bluetooth or USB), layer, profile and Bongo Cat, drumming along to your typing", "Batterie, sortie (Bluetooth ou USB), couche, profil et le Bongo Cat, qui tape au rythme de votre écriture")],
          [t("Derecha", "Right", "Droite"), t("Batería y una animación a elegir: cristal, gato, cabeza 3D, astronauta, Pokémon o el logo de CODE/KEEB", "Battery and an animation of your choice: crystal, cat, 3D head, spaceman, Pokémon or the CODE/KEEB logo", "Batterie et une animation au choix : cristal, chat, tête 3D, astronaute, Pokémon ou le logo CODE/KEEB")],
        ] } },
        { tabla: { cab: [t("Pulsa", "Press", "Appuyez"), t("Hace", "Does", "Effet")], filas: [
          [t("[LOWER] + encoder derecho pulsado", "[LOWER] + press the right encoder", "[LOWER] + appui sur l'encodeur droit"), t("Siguiente animación de la derecha (se guarda)", "Next animation on the right (saved)", "Animation suivante à droite (enregistrée)")],
          [t("[LOWER] + encoder izquierdo pulsado", "[LOWER] + press the left encoder", "[LOWER] + appui sur l'encodeur gauche"), t("Cambia la vista de pulsaciones por minuto de la izquierda", "Toggles the words-per-minute view on the left", "Change la vue des mots par minute à gauche")],
        ] } },
      ] },
      { id: "encoders", titulo: t("Encoders", "Encoders", "Encodeurs"), bloques: [
        { tabla: { cab: [t("Encoder", "Encoder", "Encodeur"), "CODE", "LOWER", "RAISE"], filas: [
          [t("Izquierdo, girar", "Left, turn", "Gauche, tourner"), t("Volumen", "Volume", "Volume"), t("Modo de luz", "Light mode", "Mode lumière"), t("Brillo", "Brightness", "Luminosité")],
          [t("Derecho, girar", "Right, turn", "Droit, tourner"), t("Rueda del ratón", "Mouse wheel", "Molette"), t("Tono", "Hue", "Teinte"), t("Velocidad de la luz", "Light speed", "Vitesse")],
          [t("Izquierdo, pulsar", "Left, press", "Gauche, appui"), t("Silencio", "Mute", "Muet"), { pant: t("Vista WPM", "WPM view", "Vue WPM") }, "—"],
          [t("Derecho, pulsar", "Right, press", "Droit, appui"), t("Play / pausa", "Play / pause", "Lecture / pause"), { pant: t("Animación", "Animation", "Animation") }, t("Luz on/off", "Lights on/off", "Lumière on/off")],
        ] } },
      ] },
      { id: "keymap", titulo: t("Cambiar las teclas", "Remapping keys", "Changer les touches"), bloques: [
        { p: t(
          "Puedes cambiar cualquier tecla en vivo, sin flashear, con **Keymap Studio** o con **ZMK Studio**. Los cambios se guardan en el teclado.",
          "You can change any key live, without flashing, with **Keymap Studio** or **ZMK Studio**. Changes are saved on the keyboard.",
          "Vous pouvez changer n'importe quelle touche en direct, sans flasher, avec **Keymap Studio** ou **ZMK Studio**. Les changements sont enregistrés dans le clavier.") },
        { pasos: [
          t("Conecta la **mitad izquierda** por USB. Solo ella lleva Studio.", "Plug the **left half** in over USB. Only it runs Studio.", "Branchez la **moitié gauche** en USB. Elle seule a Studio."),
          t("Abre Keymap Studio (o zmk.studio) en Chrome o Edge y conéctalo.", "Open Keymap Studio (or zmk.studio) in Chrome or Edge and connect.", "Ouvrez Keymap Studio (ou zmk.studio) dans Chrome ou Edge et connectez-vous."),
          t("Desbloquéalo en el teclado: mantén [LOWER] y pulsa [Z].", "Unlock it on the keyboard: hold [LOWER] and press [Z].", "Déverrouillez-le sur le clavier : maintenez [LOWER] et appuyez sur [Z]."),
        ] },
        { enlaces: [[t("Abrir Keymap Studio", "Open Keymap Studio", "Ouvrir Keymap Studio"), "keymap-studio/"], ["zmk.studio", "https://zmk.studio"]] },
      ] },
      { id: "firmware", titulo: t("Actualizar el firmware", "Updating the firmware", "Mettre à jour le firmware"), bloques: [
        { p: t(
          "El firmware compilado está en la página de versiones del repositorio: un archivo .uf2 para cada mitad y otro, settings_reset, para empezar de cero.",
          "The compiled firmware is on the repository's releases page: one .uf2 file per half, plus settings_reset to start from scratch.",
          "Le firmware compilé est sur la page des versions du dépôt : un fichier .uf2 par moitié, plus settings_reset pour repartir de zéro.") },
        { pasos: [
          t("Conecta una mitad por USB.", "Plug one half in over USB.", "Branchez une moitié en USB."),
          t("Pulsa **dos veces seguidas** el botón de reset de esa mitad. Aparece como una unidad USB (NICENANO).", "Press that half's reset button **twice quickly**. It shows up as a USB drive (NICENANO).", "Appuyez **deux fois de suite** sur le bouton reset de cette moitié. Elle apparaît comme un lecteur USB (NICENANO)."),
          t("Copia en ella el archivo de esa mitad: sofle_left para la izquierda, sofle_right para la derecha.", "Copy that half's file onto it: sofle_left for the left, sofle_right for the right.", "Copiez-y le fichier de cette moitié : sofle_left pour la gauche, sofle_right pour la droite."),
          t("La unidad se desconecta sola y la mitad se reinicia. Repite con la otra.", "The drive disconnects by itself and the half restarts. Repeat with the other one.", "Le lecteur se déconnecte seul et la moitié redémarre. Recommencez avec l'autre."),
        ] },
        { nota: t(
          "Flashea siempre **las dos mitades** con la misma versión: se hablan entre ellas.",
          "Always flash **both halves** with the same version: they talk to each other.",
          "Flashez toujours **les deux moitiés** avec la même version : elles communiquent entre elles.") },
        { enlaces: [[t("Descargar el firmware", "Download the firmware", "Télécharger le firmware"), "@releases"], [t("Código fuente", "Source code", "Code source"), "@repo"]] },
      ] },
      { id: "bateria", titulo: t("Batería y reposo", "Battery and sleep", "Batterie et veille"), bloques: [
        { p: t(
          "Tras un minuto sin usarlo se apaga la luz; tras **30 minutos**, entra en reposo profundo. Cualquier tecla lo despierta.",
          "After a minute idle the lights go off; after **30 minutes**, it goes into deep sleep. Any key wakes it up.",
          "Après une minute sans utilisation, la lumière s'éteint ; après **30 minutes**, il passe en veille profonde. N'importe quelle touche le réveille.") },
        { p: t(
          "La luz es lo que más gasta: con ella encendida el porcentaje baja unos puntos y se recupera al apagarla. Con el cable USB puesto la batería marca casi el 100 %: es normal, lee la tensión del cargador.",
          "The lights are what use the most power: with them on, the percentage drops a few points and recovers when you turn them off. With the USB cable in, the battery reads close to 100 %: that's normal, it's reading the charger's voltage.",
          "La lumière est ce qui consomme le plus : allumée, le pourcentage baisse de quelques points et remonte en l'éteignant. Avec le câble USB branché, la batterie affiche presque 100 % : c'est normal, elle lit la tension du chargeur.") },
      ] },
      { id: "problemas", titulo: t("Si algo falla", "Troubleshooting", "En cas de problème"), bloques: [
        { tabla: { cab: [t("Pasa", "Problem", "Problème"), t("Qué hacer", "What to do", "Que faire")], filas: [
          [t("La mitad derecha no escribe", "The right half doesn't type", "La moitié droite ne tape pas"), t("Flashea settings_reset en las dos mitades y después el firmware normal. Hazlo con cualquier otro teclado ZMK apagado.", "Flash settings_reset on both halves, then the normal firmware. Do it with any other ZMK keyboard switched off.", "Flashez settings_reset sur les deux moitiés, puis le firmware normal. Faites-le avec tout autre clavier ZMK éteint.")],
          [t("No se conecta a un ordenador de antes", "It won't connect to a computer it knew", "Il ne se connecte plus à un ancien ordinateur"), t("Borra el perfil con [RAISE] + [Esc], quítalo también del ordenador y vuelve a emparejar.", "Clear the profile with [RAISE] + [Esc], remove it from the computer too, and pair again.", "Effacez le profil avec [RAISE] + [Esc], retirez-le aussi de l'ordinateur et réappairez.")],
          [t("La luz no se enciende", "The lights don't turn on", "La lumière ne s'allume pas"), t("Arranca apagada: [LOWER] + [R]. Si sigue negra, flashea settings_reset en las dos mitades.", "It starts off: [LOWER] + [R]. If it stays dark, flash settings_reset on both halves.", "Elle démarre éteinte : [LOWER] + [R]. Si elle reste noire, flashez settings_reset sur les deux moitiés.")],
          [t("Studio se conecta pero no deja cambiar nada", "Studio connects but won't change anything", "Studio se connecte mais ne change rien"), t("Desbloquéalo con [LOWER] + [Z], con el USB en la mitad izquierda.", "Unlock it with [LOWER] + [Z], with USB on the left half.", "Déverrouillez-le avec [LOWER] + [Z], avec l'USB sur la moitié gauche.")],
        ] } },
        { nota: t(
          "settings_reset borra también los emparejamientos Bluetooth: después hay que volver a emparejar.",
          "settings_reset also clears the Bluetooth pairings: you'll need to pair again afterwards.",
          "settings_reset efface aussi les appairages Bluetooth : il faudra réappairer ensuite.") },
      ] },
    ],
  },

  "totem-zmk": {
    firmware: "ZMK v0.3",
    controlador: "Seeed XIAO nRF52840",
    repo: "https://github.com/codekeeb/totem-zmk",
    releases: "https://github.com/codekeeb/totem-zmk/releases",
    capas: CAPAS_TOTEM,
    capitulos: [
      { id: "empezar", titulo: t("Primeros pasos", "Getting started", "Premiers pas"), bloques: [
        { p: t(
          "Cada mitad lleva su controlador y su batería. La **mitad izquierda** es la que habla con el ordenador. Por Bluetooth aparece como **TOTEM**.",
          "Each half has its own controller and battery. The **left half** is the one that talks to your computer. Over Bluetooth it shows up as **TOTEM**.",
          "Chaque moitié a son contrôleur et sa batterie. La **moitié gauche** parle à l'ordinateur. En Bluetooth, il apparaît comme **TOTEM**.") },
        { pasos: [
          t("Carga las dos mitades con un cable USB-C.", "Charge both halves with a USB-C cable.", "Chargez les deux moitiés avec un câble USB-C."),
          t("Entra en la capa ADJ: mantén [Tab] y después [↵].", "Enter the ADJ layer: hold [Tab] and then [↵].", "Entrez dans la couche ADJ : maintenez [Tab] puis [↵]."),
          t("Sin soltar, pulsa [S]: eliges el perfil Bluetooth 1.", "Without letting go, press [S]: this selects Bluetooth profile 1.", "Sans relâcher, appuyez sur [S] : vous choisissez le profil Bluetooth 1."),
          t("En tu ordenador, conecta TOTEM desde los ajustes de Bluetooth.", "On your computer, connect TOTEM from the Bluetooth settings.", "Sur votre ordinateur, connectez TOTEM depuis les réglages Bluetooth."),
        ] },
      ] },
      { id: "capas", titulo: t("Capas", "Layers", "Couches"), bloques: [
        { p: t(
          "Cuatro capas. Los pulgares y la fila central hacen dos cosas: una al tocarlos y otra al mantenerlos. En la fila central, al mantener, **A S D F** y **J K L ;** son los modificadores.",
          "Four layers. The thumbs and the home row do two things: one when tapped, another when held. On the home row, when held, **A S D F** and **J K L ;** are the modifiers.",
          "Quatre couches. Les pouces et la rangée de repos font deux choses : une en tapant, une autre en maintenant. Sur la rangée de repos, maintenues, **A S D F** et **J K L ;** sont les modificateurs.") },
        { capa: "base" },
        { capa: "nav", p: t(
          "NAV (mantén [Tab]): flechas, números, paréntesis y el desbloqueo de Studio.",
          "NAV (hold [Tab]): arrows, numbers, brackets and the Studio unlock.",
          "NAV (maintenez [Tab]) : flèches, chiffres, parenthèses et le déverrouillage de Studio.") },
        { capa: "sym", p: t(
          "SYM (mantén [Esc] en el pulgar derecho): símbolos y multimedia.",
          "SYM (hold [Esc] on the right thumb): symbols and media.",
          "SYM (maintenez [Esc] au pouce droit) : symboles et multimédia.") },
        { capa: "adj", p: t(
          "ADJ (desde NAV mantén [↵], o desde SYM mantén [Tab]): Bluetooth, teclas F y los reinicios.",
          "ADJ (from NAV hold [↵], or from SYM hold [Tab]): Bluetooth, F keys and the resets.",
          "ADJ (depuis NAV maintenez [↵], ou depuis SYM maintenez [Tab]) : Bluetooth, touches F et les redémarrages.") },
      ] },
      { id: "bluetooth", titulo: t("Bluetooth", "Bluetooth", "Bluetooth"), bloques: [
        { p: t(
          "Recuerda hasta **cuatro ordenadores**. Todo está en la capa ADJ.",
          "It remembers up to **four computers**. Everything is on the ADJ layer.",
          "Il mémorise jusqu'à **quatre ordinateurs**. Tout est sur la couche ADJ.") },
        { tabla: { cab: [t("En ADJ, pulsa", "On ADJ, press", "Sur ADJ, appuyez"), t("Hace", "Does", "Effet")], filas: [
          ["[S] [D] [F] [G]", t("Elige el perfil 1, 2, 3 o 4", "Selects profile 1, 2, 3 or 4", "Choisit le profil 1, 2, 3 ou 4")],
          ["[X] / [C]", t("Perfil anterior / siguiente", "Previous / next profile", "Profil précédent / suivant")],
          ["[W]", t("Borra el emparejamiento del perfil activo", "Clears the pairing of the active profile", "Efface l'appairage du profil actif")],
          ["[E]", t("Cambia entre USB y Bluetooth", "Switches between USB and Bluetooth", "Bascule entre USB et Bluetooth")],
        ] } },
      ] },
      { id: "keymap", titulo: t("Cambiar las teclas", "Remapping keys", "Changer les touches"), bloques: [
        { p: t(
          "El keymap se cambia en vivo con **Keymap Studio** o **ZMK Studio**, sin flashear. El teclado arranca bloqueado para que una conexión perdida no te lo cambie.",
          "The keymap is changed live with **Keymap Studio** or **ZMK Studio**, without flashing. The keyboard starts locked so a stray connection can't change it.",
          "Le keymap se modifie en direct avec **Keymap Studio** ou **ZMK Studio**, sans flasher. Le clavier démarre verrouillé pour qu'une connexion égarée ne le modifie pas.") },
        { pasos: [
          t("Conecta la **mitad izquierda** por USB.", "Plug the **left half** in over USB.", "Branchez la **moitié gauche** en USB."),
          t("Abre Keymap Studio (o zmk.studio) en Chrome o Edge y conéctalo.", "Open Keymap Studio (or zmk.studio) in Chrome or Edge and connect.", "Ouvrez Keymap Studio (ou zmk.studio) dans Chrome ou Edge et connectez-vous."),
          t("Desbloquéalo: mantén [Tab] y pulsa [Z].", "Unlock it: hold [Tab] and press [Z].", "Déverrouillez-le : maintenez [Tab] et appuyez sur [Z]."),
        ] },
        { p: t(
          "El bloqueo vuelve al reiniciar el teclado.",
          "The lock comes back when the keyboard restarts.",
          "Le verrou revient au redémarrage du clavier.") },
        { enlaces: [[t("Abrir Keymap Studio", "Open Keymap Studio", "Ouvrir Keymap Studio"), "keymap-studio/"], ["zmk.studio", "https://zmk.studio"]] },
      ] },
      { id: "firmware", titulo: t("Actualizar el firmware", "Updating the firmware", "Mettre à jour le firmware"), bloques: [
        { p: t(
          "Descarga el zip de la última versión: trae un .uf2 para cada mitad y settings_reset.",
          "Download the latest release zip: it has one .uf2 per half plus settings_reset.",
          "Téléchargez le zip de la dernière version : il contient un .uf2 par moitié et settings_reset.") },
        { pasos: [
          t("Conecta una mitad por USB.", "Plug one half in over USB.", "Branchez une moitié en USB."),
          t("Pulsa **dos veces seguidas** su botón de reset (o, en la izquierda, [A] en la capa ADJ). Aparece una unidad USB llamada XIAO-SENSE.", "Press its reset button **twice quickly** (or, on the left half, [A] on the ADJ layer). A USB drive called XIAO-SENSE appears.", "Appuyez **deux fois de suite** sur son bouton reset (ou, à gauche, [A] sur la couche ADJ). Un lecteur USB nommé XIAO-SENSE apparaît."),
          t("Copia el archivo de esa mitad: totem_left para la izquierda, totem_right para la derecha.", "Copy that half's file: totem_left for the left, totem_right for the right.", "Copiez le fichier de cette moitié : totem_left pour la gauche, totem_right pour la droite."),
          t("La unidad se desconecta sola y la mitad se reinicia. Repite con la otra.", "The drive disconnects by itself and the half restarts. Repeat with the other one.", "Le lecteur se déconnecte seul et la moitié redémarre. Recommencez avec l'autre."),
        ] },
        { nota: t(
          "Flashea **las dos mitades** con la misma versión: con firmwares distintos no se entienden.",
          "Flash **both halves** with the same version: with different firmware they won't get along.",
          "Flashez **les deux moitiés** avec la même version : avec des firmwares différents, elles ne s'entendent pas.") },
        { enlaces: [[t("Descargar el firmware", "Download the firmware", "Télécharger le firmware"), "@releases"], [t("Código fuente", "Source code", "Code source"), "@repo"]] },
      ] },
      { id: "bateria", titulo: t("Batería y reposo", "Battery and sleep", "Batterie et veille"), bloques: [
        { p: t(
          "Tras **30 minutos** sin usarlo entra en reposo para ahorrar batería. Cualquier tecla lo despierta.",
          "After **30 minutes** idle it goes to sleep to save battery. Any key wakes it up.",
          "Après **30 minutes** sans utilisation, il se met en veille pour économiser la batterie. N'importe quelle touche le réveille.") },
      ] },
      { id: "problemas", titulo: t("Si algo falla", "Troubleshooting", "En cas de problème"), bloques: [
        { tabla: { cab: [t("Pasa", "Problem", "Problème"), t("Qué hacer", "What to do", "Que faire")], filas: [
          [t("Las mitades no se conectan entre ellas", "The halves don't connect to each other", "Les moitiés ne se connectent pas entre elles"), t("Comprueba que las dos llevan la misma versión. Si ya la llevan, flashea settings_reset en las dos y después el firmware normal.", "Check both run the same version. If they do, flash settings_reset on both, then the normal firmware.", "Vérifiez que les deux ont la même version. Si c'est le cas, flashez settings_reset sur les deux, puis le firmware normal.")],
          [t("No se conecta a un ordenador de antes", "It won't connect to a computer it knew", "Il ne se connecte plus à un ancien ordinateur"), t("En ADJ, borra el perfil con [W], quítalo del ordenador y vuelve a emparejar.", "On ADJ, clear the profile with [W], remove it from the computer, and pair again.", "Sur ADJ, effacez le profil avec [W], retirez-le de l'ordinateur et réappairez.")],
          [t("Escribe por USB y no por Bluetooth (o al revés)", "It types over USB and not Bluetooth (or the other way round)", "Il tape en USB et pas en Bluetooth (ou l'inverse)"), t("En ADJ, pulsa [E] para cambiar de salida.", "On ADJ, press [E] to switch output.", "Sur ADJ, appuyez sur [E] pour changer de sortie.")],
          [t("Studio se conecta pero no deja cambiar nada", "Studio connects but won't change anything", "Studio se connecte mais ne change rien"), t("Desbloquéalo con [Tab] + [Z], con el USB en la mitad izquierda.", "Unlock it with [Tab] + [Z], with USB on the left half.", "Déverrouillez-le avec [Tab] + [Z], avec l'USB sur la moitié gauche.")],
        ] } },
        { nota: t(
          "settings_reset borra también los emparejamientos Bluetooth: después hay que volver a emparejar.",
          "settings_reset also clears the Bluetooth pairings: you'll need to pair again afterwards.",
          "settings_reset efface aussi les appairages Bluetooth : il faudra réappairer ensuite.") },
      ] },
    ],
  },
};
})();
