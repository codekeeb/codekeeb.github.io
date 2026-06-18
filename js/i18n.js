/* ============================================================
   CODEKEEB — i18n
   Para añadir un idioma: duplica un bloque, traduce las claves
   y añade su carpeta de imágenes en assets/img/<lang>/.
   Las claves *_html admiten <em> para la palabra en serif/degradado.
   ============================================================ */

const CK_I18N = {
  es: {
    "nav.features": "Características",
    "nav.specs": "Specs",
    "nav.flavors": "Sabores",
    "nav.models": "Modelos",
    "nav.buy": "Comprar",

    "hero.kicker": "Split · Ergonómico · 60% · ZMK",
    "hero.title1": "Sofle",
    "hero.title2": "RGB",
    "hero.sub": "Teclado split ergonómico, presoldado, inalámbrico y completamente hotswap. Diseñado para programar, escribir y durar. Abre la caja y escribe.",
    "hero.buy": "Comprar en Etsy",
    "hero.discover": "Descubrir el teclado",
    "hero.s1": "teclas",
    "hero.s2": "perfiles BT + USB-C",
    "hero.s3": "mAh por mitad",
    "hero.s4": "firmware libre",
    "hero.cap": "v3.2 · presoldado · BT+5 · ZMK",
    "hero.scroll": "scroll",

    "marquee": "SPLIT ✦ ERGONÓMICO ✦ HOTSWAP ✦ INALÁMBRICO ✦ OPEN-SOURCE ✦ PRESOLDADO ✦ RGB ✦ OLED ✦ ",

    "manifesto.label": "Manifiesto",
    "manifesto.text": "Creemos que un teclado no se compra: <em>se elige</em>. Cada Sofle sale del taller presoldado, probado y afinado. Sin soldador. Sin esperas. <em>Sin compromisos.</em>",

    "glance.label": "De un vistazo",
    "g1": "Split ergonómico",
    "g2": "Hotswap total",
    "g3": "BT ×5 + USB-C",
    "g4": "OLED ×2 custom",
    "g5": "RGB per-key",
    "g6": "Batería 1200 mAh",
    "g7": "2× encoders",
    "g8": "NRF52840 en socket",
    "g9": "ZMK open-source",
    "g10": "Presoldado",

    "features.label": "El teclado",
    "features.title": "Cada detalle, <em>bajo la mirilla</em>.",

    "f1.kicker": "Keycaps · OLED",
    "f1.title": "Perfil MA, sabor <em>Retro</em>.",
    "f1.text": "58 teclas con keycaps perfil MA en acabado retro y leyendas en EN, EN+IC o ES. Dos pantallas OLED custom muestran en todo momento la capa activa, WPM, batería y perfil Bluetooth.",
    "f1.c1": "Perfil MA", "f1.c2": "EN / EN+IC / ES", "f1.c3": "OLED ×2 custom",

    "f2.kicker": "Case custom · Hotswap",
    "f2.title": "Un case <em>custom</em>, abierto por diseño.",
    "f2.text": "Frame impreso en 3D en PLA blanco hueso con acrílico transparente. Sockets hotswap Kailh compatibles MX — con switches MMD Holy Panda incluidos — y dos encoders rotatorios pulsables, personalizables vía ZMK Studio.",
    "f2.c1": "Acrílico + PLA", "f2.c2": "Hotswap Kailh MX", "f2.c3": "2× encoders",

    "f3.kicker": "RGB personalizable",
    "f3.title": "Luz <em>per-key</em> + underglow.",
    "f3.text": "Retroiluminación RGB direccionable en cada tecla y underglow perimetral. Efectos, brillo y color se configuran desde el propio teclado o desde ZMK Studio.",
    "f3.c1": "Per-key", "f3.c2": "Underglow", "f3.c3": "ZMK Studio",

    "f4.kicker": "Conectividad",
    "f4.title": "Bluetooth <em>de verdad</em>.",
    "f4.text": "Hasta 5 perfiles Bluetooth para saltar entre ordenador, tablet y móvil sin emparejar de nuevo. ¿Prefieres cable? USB-C con latencia cero.",
    "f4.c1": "BT · 5 perfiles", "f4.c2": "USB-C", "f4.c3": "Latencia cero",

    "f5.kicker": "Batería · MCU",
    "f5.title": "1200 mAh. <em>Semanas</em> de uso.",
    "f5.text": "Batería Li-ion de 1200 mAh con conector JST intercambiable e interruptor físico ON/OFF en cada mitad. Y el cerebro, un NRF52840 en socket: sustituible y actualizable sin soldar.",
    "f5.c1": "1200 mAh Li-ion", "f5.c2": "JST intercambiable", "f5.c3": "NRF52840 en socket",

    "specs.label": "Ficha técnica",
    "specs.title": "Specs, <em>sin letra pequeña</em>.",
    "specs.items": [
      ["Formato", "Split ergonómico · 60%"],
      ["Teclas", "58 · perfil MA Retro"],
      ["Leyendas", "EN · EN+IC · ES"],
      ["Switches", "Hotswap Kailh (MX) · MMD Holy Panda"],
      ["MCU", "NRF52840 en socket"],
      ["Firmware", "ZMK · open-source · ZMK Studio"],
      ["Conexión", "Bluetooth ×5 perfiles + USB-C"],
      ["Batería", "1200 mAh Li-ion · JST"],
      ["Pantallas", "OLED ×2 custom · capa / WPM / batería / BT"],
      ["RGB", "Per-key + underglow"],
      ["Encoders", "2× rotatorios pulsables"],
      ["Case", "Frame 3D PLA + acrílico · ON/OFF físico"]
    ],

    "flavors.label": "Sabores",
    "flavors.title": "Hoy, <em>Retro</em>.<br>Mañana, más.",
    "flavors.text": "Cada Sofle se sirve en un sabor: una combinación de keycaps, acentos y carácter. El primero es Retro — crema, gris y un toque de verde salvia. Los siguientes ya están en el taller.",
    "flavors.available": "Disponible",
    "flavors.soon": "Próximamente",
    "flavors.ghostName": "¿El siguiente?",

    "models.label": "Modelos",
    "models.title": "Una familia <em>que crece</em>.",
    "models.available": "Disponible",
    "models.soon": "En el taller",
    "models.view": "Ver en Etsy",
    "models.ghostTitle": "Próximo modelo",
    "models.ghostText": "Nuevos formatos están tomando forma en el taller. Pronto, aquí.",

    "t1.title": "Presoldado y probado",
    "t1.text": "Listo nada más abrir la caja. Cero soldador.",
    "t2.title": "Hotswap total",
    "t2.text": "Switches y MCU intercambiables sin herramientas.",
    "t3.title": "ZMK open-source",
    "t3.text": "Firmware libre. Tu keymap, tuyo para siempre.",
    "t4.title": "Series pequeñas",
    "t4.text": "Montado y revisado a mano, unidad a unidad.",

    "cta.title": "¿Listo para <em>escribir mejor</em>?",
    "cta.sub": "Sofle RGB v3.2 — presoldado, inalámbrico, tuyo.",
    "cta.buy": "Comprar en Etsy",

    "footer.tag": "Teclados split ergonómicos, hechos con mirilla.",
    "footer.explore": "Explorar",
    "footer.shop": "Tienda",
    "footer.lang": "Idioma",
    "footer.copy": "© 2026 Codekeeb — Diseñado y montado a mano."
  },

  en: {
    "nav.features": "Features",
    "nav.specs": "Specs",
    "nav.flavors": "Flavors",
    "nav.models": "Models",
    "nav.buy": "Buy",

    "hero.kicker": "Split · Ergonomic · 60% · ZMK",
    "hero.title1": "Sofle",
    "hero.title2": "RGB",
    "hero.sub": "An ergonomic split keyboard — presoldered, wireless and fully hotswap. Built to code, write and last. Open the box and type.",
    "hero.buy": "Buy on Etsy",
    "hero.discover": "Discover the keyboard",
    "hero.s1": "keys",
    "hero.s2": "BT profiles + USB-C",
    "hero.s3": "mAh per half",
    "hero.s4": "open firmware",
    "hero.cap": "v3.2 · presoldered · BT+5 · ZMK",
    "hero.scroll": "scroll",

    "marquee": "SPLIT ✦ ERGONOMIC ✦ HOTSWAP ✦ WIRELESS ✦ OPEN-SOURCE ✦ PRESOLDERED ✦ RGB ✦ OLED ✦ ",

    "manifesto.label": "Manifesto",
    "manifesto.text": "We believe a keyboard isn't bought: <em>it's chosen</em>. Every Sofle leaves the workshop presoldered, tested and tuned. No soldering iron. No waiting. <em>No compromises.</em>",

    "glance.label": "At a glance",
    "g1": "Ergonomic split",
    "g2": "Fully hotswap",
    "g3": "BT ×5 + USB-C",
    "g4": "2× custom OLED",
    "g5": "Per-key RGB",
    "g6": "1200 mAh battery",
    "g7": "2× encoders",
    "g8": "Socketed NRF52840",
    "g9": "ZMK open-source",
    "g10": "Presoldered",

    "features.label": "The keyboard",
    "features.title": "Every detail, <em>under the crosshair</em>.",

    "f1.kicker": "Keycaps · OLED",
    "f1.title": "MA profile, <em>Retro</em> flavor.",
    "f1.text": "58 keys with MA-profile keycaps in a retro finish, with EN, EN+IC or ES legends. Two custom OLED displays always show the active layer, WPM, battery and Bluetooth profile.",
    "f1.c1": "MA profile", "f1.c2": "EN / EN+IC / ES", "f1.c3": "2× custom OLED",

    "f2.kicker": "Custom case · Hotswap",
    "f2.title": "A <em>custom</em> case, open by design.",
    "f2.text": "3D-printed frame in bone-white PLA with clear acrylic plates. Kailh MX-compatible hotswap sockets — MMD Holy Panda switches included — and two clickable rotary encoders, customizable via ZMK Studio.",
    "f2.c1": "Acrylic + PLA", "f2.c2": "Kailh MX hotswap", "f2.c3": "2× encoders",

    "f3.kicker": "Customizable RGB",
    "f3.title": "<em>Per-key</em> light + underglow.",
    "f3.text": "Addressable RGB backlight on every key plus perimeter underglow. Effects, brightness and color are set from the keyboard itself or from ZMK Studio.",
    "f3.c1": "Per-key", "f3.c2": "Underglow", "f3.c3": "ZMK Studio",

    "f4.kicker": "Connectivity",
    "f4.title": "Bluetooth, <em>done right</em>.",
    "f4.text": "Up to 5 Bluetooth profiles to jump between desktop, tablet and phone without re-pairing. Prefer a cable? USB-C with zero latency.",
    "f4.c1": "BT · 5 profiles", "f4.c2": "USB-C", "f4.c3": "Zero latency",

    "f5.kicker": "Battery · MCU",
    "f5.title": "1200 mAh. <em>Weeks</em> of use.",
    "f5.text": "A 1200 mAh Li-ion battery with swappable JST connector and a physical ON/OFF switch on each half. And the brain, a socketed NRF52840: replaceable and upgradeable without soldering.",
    "f5.c1": "1200 mAh Li-ion", "f5.c2": "Swappable JST", "f5.c3": "Socketed NRF52840",

    "specs.label": "Tech sheet",
    "specs.title": "Specs, <em>no fine print</em>.",
    "specs.items": [
      ["Format", "Ergonomic split · 60%"],
      ["Keys", "58 · MA Retro profile"],
      ["Legends", "EN · EN+IC · ES"],
      ["Switches", "Kailh hotswap (MX) · MMD Holy Panda"],
      ["MCU", "Socketed NRF52840"],
      ["Firmware", "ZMK · open-source · ZMK Studio"],
      ["Connection", "Bluetooth ×5 profiles + USB-C"],
      ["Battery", "1200 mAh Li-ion · JST"],
      ["Displays", "2× custom OLED · layer / WPM / battery / BT"],
      ["RGB", "Per-key + underglow"],
      ["Encoders", "2× clickable rotary"],
      ["Case", "3D frame PLA + acrylic · physical ON/OFF"]
    ],

    "flavors.label": "Flavors",
    "flavors.title": "Today, <em>Retro</em>.<br>Tomorrow, more.",
    "flavors.text": "Every Sofle is served in a flavor: a combination of keycaps, accents and character. The first one is Retro — cream, grey and a touch of sage green. The next ones are already in the workshop.",
    "flavors.available": "Available",
    "flavors.soon": "Coming soon",
    "flavors.ghostName": "The next one?",

    "models.label": "Models",
    "models.title": "A family <em>that grows</em>.",
    "models.available": "Available",
    "models.soon": "In the workshop",
    "models.view": "View on Etsy",
    "models.ghostTitle": "Next model",
    "models.ghostText": "New layouts are taking shape in the workshop. Soon, right here.",

    "t1.title": "Presoldered & tested",
    "t1.text": "Ready out of the box. Zero soldering.",
    "t2.title": "Fully hotswap",
    "t2.text": "Switches and MCU swappable, no tools needed.",
    "t3.title": "ZMK open-source",
    "t3.text": "Free firmware. Your keymap, yours forever.",
    "t4.title": "Small batches",
    "t4.text": "Hand-assembled and inspected, one by one.",

    "cta.title": "Ready to <em>type better</em>?",
    "cta.sub": "Sofle RGB v3.2 — presoldered, wireless, yours.",
    "cta.buy": "Buy on Etsy",

    "footer.tag": "Ergonomic split keyboards, made with a crosshair.",
    "footer.explore": "Explore",
    "footer.shop": "Shop",
    "footer.lang": "Language",
    "footer.copy": "© 2026 Codekeeb — Designed and hand-assembled."
  },

  fr: {
    "nav.features": "Caractéristiques",
    "nav.specs": "Specs",
    "nav.flavors": "Saveurs",
    "nav.models": "Modèles",
    "nav.buy": "Acheter",

    "hero.kicker": "Split · Ergonomique · 60% · ZMK",
    "hero.title1": "Sofle",
    "hero.title2": "RGB",
    "hero.sub": "Clavier split ergonomique, présoudé, sans fil et entièrement hotswap. Conçu pour coder, écrire et durer. Ouvrez la boîte et tapez.",
    "hero.buy": "Acheter sur Etsy",
    "hero.discover": "Découvrir le clavier",
    "hero.s1": "touches",
    "hero.s2": "profils BT + USB-C",
    "hero.s3": "mAh par moitié",
    "hero.s4": "firmware libre",
    "hero.cap": "v3.2 · présoudé · BT+5 · ZMK",
    "hero.scroll": "scroll",

    "marquee": "SPLIT ✦ ERGONOMIQUE ✦ HOTSWAP ✦ SANS FIL ✦ OPEN-SOURCE ✦ PRÉSOUDÉ ✦ RGB ✦ OLED ✦ ",

    "manifesto.label": "Manifeste",
    "manifesto.text": "Un clavier ne s'achète pas : <em>il se choisit</em>. Chaque Sofle quitte l'atelier présoudé, testé et réglé. Sans fer à souder. Sans attente. <em>Sans compromis.</em>",

    "glance.label": "En un coup d'œil",
    "g1": "Split ergonomique",
    "g2": "Hotswap intégral",
    "g3": "BT ×5 + USB-C",
    "g4": "OLED ×2 custom",
    "g5": "RGB per-key",
    "g6": "Batterie 1200 mAh",
    "g7": "2× encodeurs",
    "g8": "NRF52840 sur socket",
    "g9": "ZMK open-source",
    "g10": "Présoudé",

    "features.label": "Le clavier",
    "features.title": "Chaque détail, <em>dans le viseur</em>.",

    "f1.kicker": "Keycaps · OLED",
    "f1.title": "Profil MA, saveur <em>Retro</em>.",
    "f1.text": "58 touches avec keycaps profil MA en finition rétro et légendes EN, EN+IC ou ES. Deux écrans OLED custom affichent en permanence la couche active, le WPM, la batterie et le profil Bluetooth.",
    "f1.c1": "Profil MA", "f1.c2": "EN / EN+IC / ES", "f1.c3": "OLED ×2 custom",

    "f2.kicker": "Boîtier custom · Hotswap",
    "f2.title": "Un boîtier <em>custom</em>, ouvert par conception.",
    "f2.text": "Châssis imprimé en 3D en PLA blanc os avec plaques en acrylique transparent. Sockets hotswap Kailh compatibles MX — switches MMD Holy Panda inclus — et deux encodeurs rotatifs cliquables, personnalisables via ZMK Studio.",
    "f2.c1": "Acrylique + PLA", "f2.c2": "Hotswap Kailh MX", "f2.c3": "2× encodeurs",

    "f3.kicker": "RGB personnalisable",
    "f3.title": "Lumière <em>per-key</em> + underglow.",
    "f3.text": "Rétroéclairage RGB adressable sur chaque touche et underglow périphérique. Effets, luminosité et couleur se règlent depuis le clavier ou depuis ZMK Studio.",
    "f3.c1": "Per-key", "f3.c2": "Underglow", "f3.c3": "ZMK Studio",

    "f4.kicker": "Connectivité",
    "f4.title": "Du Bluetooth, <em>du vrai</em>.",
    "f4.text": "Jusqu'à 5 profils Bluetooth pour passer de l'ordinateur à la tablette et au téléphone sans réappairage. Vous préférez le câble ? USB-C à latence nulle.",
    "f4.c1": "BT · 5 profils", "f4.c2": "USB-C", "f4.c3": "Latence nulle",

    "f5.kicker": "Batterie · MCU",
    "f5.title": "1200 mAh. Des <em>semaines</em> d'usage.",
    "f5.text": "Batterie Li-ion de 1200 mAh avec connecteur JST interchangeable et interrupteur physique ON/OFF sur chaque moitié. Et le cerveau, un NRF52840 sur socket : remplaçable et évolutif sans soudure.",
    "f5.c1": "1200 mAh Li-ion", "f5.c2": "JST interchangeable", "f5.c3": "NRF52840 sur socket",

    "specs.label": "Fiche technique",
    "specs.title": "Les specs, <em>sans petites lignes</em>.",
    "specs.items": [
      ["Format", "Split ergonomique · 60%"],
      ["Touches", "58 · profil MA Retro"],
      ["Légendes", "EN · EN+IC · ES"],
      ["Switches", "Hotswap Kailh (MX) · MMD Holy Panda"],
      ["MCU", "NRF52840 sur socket"],
      ["Firmware", "ZMK · open-source · ZMK Studio"],
      ["Connexion", "Bluetooth ×5 profils + USB-C"],
      ["Batterie", "1200 mAh Li-ion · JST"],
      ["Écrans", "OLED ×2 custom · couche / WPM / batterie / BT"],
      ["RGB", "Per-key + underglow"],
      ["Encodeurs", "2× rotatifs cliquables"],
      ["Boîtier", "Châssis 3D PLA + acrylique · ON/OFF physique"]
    ],

    "flavors.label": "Saveurs",
    "flavors.title": "Aujourd'hui, <em>Retro</em>.<br>Demain, plus.",
    "flavors.text": "Chaque Sofle est servi dans une saveur : une combinaison de keycaps, d'accents et de caractère. La première est Retro — crème, gris et une touche de vert sauge. Les suivantes sont déjà à l'atelier.",
    "flavors.available": "Disponible",
    "flavors.soon": "Bientôt",
    "flavors.ghostName": "La prochaine ?",

    "models.label": "Modèles",
    "models.title": "Une famille <em>qui grandit</em>.",
    "models.available": "Disponible",
    "models.soon": "À l'atelier",
    "models.view": "Voir sur Etsy",
    "models.ghostTitle": "Prochain modèle",
    "models.ghostText": "De nouveaux formats prennent forme à l'atelier. Bientôt, ici même.",

    "t1.title": "Présoudé et testé",
    "t1.text": "Prêt dès la sortie de la boîte. Zéro soudure.",
    "t2.title": "Hotswap intégral",
    "t2.text": "Switches et MCU interchangeables, sans outils.",
    "t3.title": "ZMK open-source",
    "t3.text": "Firmware libre. Votre keymap, à vous pour toujours.",
    "t4.title": "Petites séries",
    "t4.text": "Assemblé et contrôlé à la main, pièce par pièce.",

    "cta.title": "Prêt à <em>mieux écrire</em> ?",
    "cta.sub": "Sofle RGB v3.2 — présoudé, sans fil, à vous.",
    "cta.buy": "Acheter sur Etsy",

    "footer.tag": "Claviers split ergonomiques, faits au viseur.",
    "footer.explore": "Explorer",
    "footer.shop": "Boutique",
    "footer.lang": "Langue",
    "footer.copy": "© 2026 Codekeeb — Conçu et assemblé à la main."
  }
};
