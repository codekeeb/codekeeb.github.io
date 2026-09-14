# Portada (index.html)

> **AVISO (14 sep 2026) — este contrato esta RECHAZADO.**
> Describe la direccion de serigrafia de PCB (soldermask negro, cobre,
> designadores). Ernesto la rechazo: "prefiero una version clara, como la
> que tenia". El CSS de `claude/tienda-clara` ya no la sigue. Se deja aqui
> por lo unico que sigue valiendo: las **restricciones de producto** del
> final, que no dependen de la direccion. El contrato de la version clara
> esta sin escribir y lo escribe el.

Modo: Persuade.

## Direction contract

**THESIS:** la web es la placa. El comprador de Codekeeb lee serigrafia a
diario: designadores, taladros, pistas, soldermask. La portada se traza como
un PCB real donde cada modelo es un componente con su referencia, no una
tarjeta. Rechaza la rejilla de tarjetas iguales de icono + titular + parrafo,
y rechaza el render grande con glow de neon que monta todo el sector.

**OWN-WORLD:** soldermask negro mate como campo que ocupa la pagina entera
(no acento sobre fondo neutro), cobre como unico metalico, serigrafia blanca
fina en versales con tracking abierto. Retícula de pistas de cobre visible,
taladros como puntos de anclaje, designadores (U1, SW14, J2) rotulando de
verdad. Tipografia: Archivo Black para display industrial, Archivo para
texto, Martian Mono para datos reales (referencias, specs, precios, stock).
Prohibido el kicker sobre titular. El degradado naranja-rosa-azul de marca
sobrevive en un solo sitio y con significado: donde dice RGB. Es compromiso
de marca, no decoracion.

**STORY:** el visitante entiende en un vistazo que hay cinco modelos y cuales
estan disponibles; cree que quien hizo esto sabe lo que hace porque la pagina
habla su idioma sin explicarselo; y actua abriendo la ficha o el anuncio.

**FIRST VIEWPORT:** borde de placa arriba con el rotulo CODE/KEEB y los
selectores de idioma como jumpers. Debajo, el modelo con mas stock ocupando
dos tercios, tratado como componente principal con su designador y sus datos
en mono. Pistas de cobre salen de el hacia el borde inferior, donde ya asoman
los footprints del resto del catalogo. Accion primaria sobre el propio
componente.

**FORM:** serigrafia de PCB; candidata 2 de mi lista ordenada, elegida por el
usuario sobre la asignada (candidata 6, la hoja de montaje). Seed c5eecbf4,
tirada degradada: sin retadores y sin tableros de liston.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with
the finish review, the verdict, DESIGN.md, and every shipping raster carrying
its provenance.

## Restricciones que vienen de PRODUCT.md

- Las 64 fotos son producto real. No se generan imagenes.
- Tres idiomas obligatorios; todo texto nuevo va a es/en/fr.
- No inventar numeros de resenas ni de ventas: no los tenemos.
- Las fotos de proceso de montaje existen pero aun no estan en assets/: no
  se pueden mostrar todavia.
- Los 17 repos publicos de firmware si son citables y verificables.
