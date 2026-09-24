/* ============================================================
   CODEKEEB — textos legales, en es / en / fr
   ------------------------------------------------------------
   Van aparte de i18n.js porque son largos y se leen en una sola pagina.
   legal.js comprueba que los tres idiomas tienen las mismas secciones y
   lo avisa por consola si no (preview.mjs lo caza como error).

   REGLA: aqui solo se afirma lo que es verdad HOY en el codigo del sitio
   o lo que dice la norma general. Si la web cambia (un formulario, una
   analitica, un servicio de terceros), estos textos cambian ANTES.
   Revisado contra el codigo el 24 sep 2026. Pendiente de revision por
   alguien con formacion juridica: ver el informe de esa fecha.

   Marcadores que rellena legal.js:
     {{TITULAR}}  bloque con los datos de CK_TITULAR (o lo que falta)
     {{TIENDA}}   enlace a la tienda de Etsy
     {{FECHA}}    fecha de la ultima revision de precios
     {{BORRAR}}   botones para borrar lo guardado en el navegador
     {{TABLA}}    tabla de lo que se guarda en el navegador
   ============================================================ */

const CK_LEGAL_ACTUALIZADO = "2026-09-24";

const CK_LEGAL = {
  es: {
    aviso: `
      <p>Esta web es el catálogo de Codekeeb, teclados split hechos a mano. Aquí no se vende ni se cobra nada: cada compra se hace en la tienda CodeKeeb de Etsy.</p>
      <h3>Titular</h3>
      {{TITULAR}}
      <h3>Propiedad intelectual y créditos</h3>
      <p>Las fotografías de producto son fotos propias de los teclados que se venden. Los esquemas de los teclados son dibujos hechos a partir de su geometría, y así lo indica el texto que llevan debajo.</p>
      <p>Los diseños de los teclados son de sus autores: <b>Sofle</b>, de Josef Adamčík (licencia MIT); <b>Corne</b> (crkbd), de foostan; <b>TOTEM</b>, de GEIST (licencia CERN-OHL-P v2). ZMK, QMK, VIA y Vial son proyectos de software libre de sus comunidades. Codekeeb monta, adapta y vende unidades basadas en esos diseños, pero no es su autor.</p>
      <p>Tipografías: Archivo, Inter, Baloo 2 y Space Mono, con licencia SIL Open Font License, servidas desde este mismo sitio.</p>
      <h3>Opiniones</h3>
      <p>Las valoraciones que aparecen aquí son las de Etsy, con su número de reseñas y un enlace al anuncio. No se escriben, no se eligen y no se editan en esta web. Si crees que una reseña no es auténtica, puedes comunicárselo a Etsy o escribirme.</p>
      <h3>Enlaces a otros sitios</h3>
      <p>Los enlaces a Etsy, GitHub y ZMK llevan a sitios con sus propias condiciones y políticas de privacidad.</p>`,

    privacidad: `
      <p class="legal__resumen">En resumen: esta web no te pide datos, no usa cookies, no tiene analítica ni publicidad y no carga nada de otros dominios. Si compras, lo haces en Etsy.</p>
      <h3>Responsable</h3>
      <p>El titular que figura en el <a href="#aviso">aviso legal</a>.</p>
      <h3>Qué datos trata esta web</h3>
      <ul>
        <li><b>Ninguno que tú escribas.</b> No hay formularios, cuentas ni boletín.</li>
        <li><b>Tu dirección IP</b>, que, como en cualquier web, llega al servidor que la aloja: GitHub Pages, de GitHub, Inc. (EE. UU.). GitHub registra las IP de las visitas por motivos de seguridad y las trata según su <a href="https://docs.github.com/es/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">declaración de privacidad</a>. Codekeeb no tiene acceso a esos registros ni a estadísticas de visitas.</li>
        <li><b>Preferencias que guarda tu propio navegador</b>: idioma, pausa de las animaciones y, si usas Keymap Studio, tus mapas de teclas y macros. No salen de tu navegador. El detalle está en <a href="#cookies">cookies</a>.</li>
      </ul>
      <h3>Keymap Studio</h3>
      <p>El editor habla con tu teclado por cable (Web Serial), directamente desde tu navegador. Ni el mapa de teclas ni las macros se envían a ningún servidor. Las macros guardan el texto que tú escribas en ellas: no pongas contraseñas.</p>
      <h3>Si compras en Etsy</h3>
      <p>El pedido, el pago y tus datos de envío los gestiona Etsy según su política de privacidad. Etsy facilita al vendedor lo necesario para preparar y enviar el pedido (tu nombre y dirección de envío) y los mensajes que le mandes. Esos datos se usan solo para enviar el pedido, atender la posventa y cumplir obligaciones legales, como las fiscales. La base legal es la ejecución de la compra y esas obligaciones (art. 6.1.b y 6.1.c del RGPD), y se conservan mientras lo exijan.</p>
      <h3>Tus derechos</h3>
      <p>Puedes pedir acceso, rectificación, supresión, oposición, limitación o portabilidad de tus datos escribiendo al titular. Si crees que no se han respetado, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener">aepd.es</a>) o ante la autoridad de tu país.</p>
      <h3>Seguridad</h3>
      <p>La web se sirve solo por HTTPS y una política de seguridad de contenido le impide cargar código de otros dominios. Como no recoge datos personales, no guarda ninguno que proteger.</p>
      <h3>Cambios</h3>
      <p>Si la web empieza a recoger algún dato o a usar un servicio de terceros, esta política se actualizará antes. Y si hace falta tu consentimiento, se te pedirá antes de activar nada.</p>`,

    cookies: `
      <p class="legal__resumen">Esta web no usa cookies, ni herramientas de analítica, publicidad o seguimiento. Por eso no verás un aviso de cookies: no hay nada que aceptar o rechazar.</p>
      <p>Lo que sí usa es el almacenamiento local de tu navegador (localStorage), para recordar cosas que eliges tú. Se queda en tu dispositivo, no se envía a ningún sitio y no sirve para identificarte.</p>
      {{TABLA}}
      <p>Como es almacenamiento que activas tú al usar una función, no necesita consentimiento previo. Puedes borrarlo aquí o desde los ajustes de tu navegador:</p>
      {{BORRAR}}
      <p>Si un día se añade una herramienta de medición, esta página lo dirá antes y se te pedirá permiso antes de cargarla.</p>`,

    compras: `
      <h3>Dónde se compra</h3>
      <p>Todas las compras se hacen en la tienda CodeKeeb de Etsy ({{TIENDA}}). El contrato y el pago se rigen por las condiciones de Etsy y por lo que dice el anuncio de cada producto.</p>
      <h3>Precios</h3>
      <p>Los precios de esta web son orientativos: se copian de Etsy y llevan la fecha de la última revisión ({{FECHA}}). Los que valen, junto con los gastos de envío, son los que muestra Etsy antes de pagar.</p>
      <h3>Envíos</h3>
      <p>Los pedidos salen desde España. Los plazos y los costes están en cada anuncio de Etsy.</p>
      <h3>Devoluciones y cancelaciones</h3>
      <p>Las condiciones concretas (plazo, quién paga la devolución y qué artículos la admiten) son las que figuran en las políticas de la tienda en Etsy. Consúltalas antes de comprar.</p>
      <h3>Tus derechos como consumidor</h3>
      <p>Si compras como consumidor en la Unión Europea a un vendedor profesional, la ley te reconoce, entre otros:</p>
      <ul>
        <li><b>Desistimiento.</b> Tienes 14 días naturales desde que recibes el pedido para devolverlo sin dar motivos. La ley excluye los productos hechos según tus especificaciones o claramente personalizados, y eso puede afectar a los pedidos a medida (colores, switches o distribución que elijas tú). Si tu pedido es a medida, pregunta antes de comprar.</li>
        <li><b>Garantía legal de conformidad.</b> Si el producto tiene un defecto de origen, puedes pedir que se repare o se sustituya. En la UE dura al menos dos años; en España, tres años desde la entrega.</li>
      </ul>
      <p>Esto resume normas generales. No sustituye a la ley que se aplica a tu compra, que depende de tu país y del tipo de venta, ni amplía esos derechos.</p>
      <h3>Soporte</h3>
      <p>Si algo falla, escribe a través de Etsy.</p>`,
  },

  en: {
    aviso: `
      <p>This website is the catalogue of Codekeeb, handmade split keyboards. Nothing is sold or charged here: every purchase happens in the CodeKeeb shop on Etsy.</p>
      <h3>Owner</h3>
      {{TITULAR}}
      <h3>Intellectual property and credits</h3>
      <p>The product photos are original photos of the keyboards that are sold. The keyboard diagrams are drawings made from each board's geometry, and the caption under each one says so.</p>
      <p>The keyboard designs belong to their authors: <b>Sofle</b>, by Josef Adamčík (MIT licence); <b>Corne</b> (crkbd), by foostan; <b>TOTEM</b>, by GEIST (CERN-OHL-P v2 licence). ZMK, QMK, VIA and Vial are open-source projects run by their communities. Codekeeb builds, adapts and sells units based on those designs, but did not author them.</p>
      <p>Typefaces: Archivo, Inter, Baloo 2 and Space Mono, under the SIL Open Font License, served from this same site.</p>
      <h3>Reviews</h3>
      <p>The ratings shown here are Etsy's, with their number of reviews and a link to the listing. They are not written, selected or edited on this website. If you think a review is not genuine, you can report it to Etsy or message me.</p>
      <h3>Links to other sites</h3>
      <p>Links to Etsy, GitHub and ZMK lead to sites with their own terms and privacy policies.</p>`,

    privacidad: `
      <p class="legal__resumen">In short: this website asks you for no data, uses no cookies, has no analytics or advertising, and loads nothing from other domains. If you buy, you do it on Etsy.</p>
      <h3>Controller</h3>
      <p>The owner named in the <a href="#aviso">legal notice</a>.</p>
      <h3>What data this website handles</h3>
      <ul>
        <li><b>Nothing you type in.</b> There are no forms, accounts or newsletter.</li>
        <li><b>Your IP address</b>, which, as with any website, reaches the server that hosts it: GitHub Pages, run by GitHub, Inc. (USA). GitHub logs visitors' IP addresses for security purposes and handles them under its <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">privacy statement</a>. Codekeeb has no access to those logs or to visitor statistics.</li>
        <li><b>Preferences stored by your own browser</b>: language, paused animations and, if you use Keymap Studio, your keymaps and macros. They never leave your browser. Details under <a href="#cookies">cookies</a>.</li>
      </ul>
      <h3>Keymap Studio</h3>
      <p>The editor talks to your keyboard over a cable (Web Serial), straight from your browser. Neither the keymap nor the macros are sent to any server. Macros store whatever text you type into them: don't put passwords in them.</p>
      <h3>If you buy on Etsy</h3>
      <p>Etsy handles the order, the payment and your shipping details under its privacy policy. Etsy gives the seller what is needed to prepare and ship the order (your name and shipping address) and any messages you send. That data is used only to ship the order, provide after-sales support and meet legal obligations such as tax rules. The legal basis is performing the purchase and those obligations (GDPR art. 6(1)(b) and 6(1)(c)), and the data is kept for as long as they require.</p>
      <h3>Your rights</h3>
      <p>You can ask for access, rectification, erasure, objection, restriction or portability of your data by writing to the owner. If you believe they have not been respected, you can complain to the Spanish Data Protection Agency (<a href="https://www.aepd.es" target="_blank" rel="noopener">aepd.es</a>) or to the authority in your country.</p>
      <h3>Security</h3>
      <p>The site is served over HTTPS only, and a content security policy stops it from loading code from other domains. Since it collects no personal data, it holds none to protect.</p>
      <h3>Changes</h3>
      <p>If the site ever starts collecting data or using a third-party service, this policy will be updated first. And if your consent is needed, you will be asked before anything is switched on.</p>`,

    cookies: `
      <p class="legal__resumen">This website uses no cookies and no analytics, advertising or tracking tools. That is why you won't see a cookie banner: there is nothing to accept or reject.</p>
      <p>It does use your browser's local storage (localStorage) to remember choices you make. It stays on your device, is sent nowhere and can't be used to identify you.</p>
      {{TABLA}}
      <p>Because it is storage you switch on yourself by using a feature, it needs no prior consent. You can clear it here or from your browser settings:</p>
      {{BORRAR}}
      <p>If a measuring tool is ever added, this page will say so first, and you will be asked for permission before it loads.</p>`,

    compras: `
      <h3>Where to buy</h3>
      <p>Every purchase happens in the CodeKeeb shop on Etsy ({{TIENDA}}). The contract and payment are governed by Etsy's terms and by what each product's listing says.</p>
      <h3>Prices</h3>
      <p>Prices on this website are indicative: they are copied from Etsy and carry the date of the last check ({{FECHA}}). The prices that count, with shipping costs, are the ones Etsy shows before you pay.</p>
      <h3>Shipping</h3>
      <p>Orders ship from Spain. Delivery times and costs are in each Etsy listing.</p>
      <h3>Returns and cancellations</h3>
      <p>The specific terms (deadline, who pays for the return shipping and which items can be returned) are the ones in the shop's policies on Etsy. Check them before you buy.</p>
      <h3>Your consumer rights</h3>
      <p>If you buy as a consumer in the European Union from a professional seller, the law gives you, among others:</p>
      <ul>
        <li><b>Right of withdrawal.</b> You have 14 calendar days from receiving the order to return it without giving a reason. The law excludes goods made to your specifications or clearly personalised, which may affect made-to-order builds (colours, switches or layout you choose). If your order is custom, ask before you buy.</li>
        <li><b>Legal guarantee of conformity.</b> If the product has a defect from the start, you can ask for it to be repaired or replaced. In the EU it lasts at least two years; in Spain, three years from delivery.</li>
      </ul>
      <p>This summarises general rules. It does not replace the law that applies to your purchase, which depends on your country and the type of sale, nor does it extend those rights.</p>
      <h3>Support</h3>
      <p>If something fails, get in touch through Etsy.</p>`,
  },

  fr: {
    aviso: `
      <p>Ce site est le catalogue de Codekeeb, claviers split faits à la main. Rien n'y est vendu ni encaissé : chaque achat se fait dans la boutique CodeKeeb sur Etsy.</p>
      <h3>Éditeur du site</h3>
      {{TITULAR}}
      <h3>Propriété intellectuelle et crédits</h3>
      <p>Les photos de produit sont des photos originales des claviers vendus. Les schémas des claviers sont des dessins réalisés à partir de leur géométrie, comme l'indique la légende sous chacun d'eux.</p>
      <p>Les conceptions des claviers appartiennent à leurs auteurs : <b>Sofle</b>, de Josef Adamčík (licence MIT) ; <b>Corne</b> (crkbd), de foostan ; <b>TOTEM</b>, de GEIST (licence CERN-OHL-P v2). ZMK, QMK, VIA et Vial sont des projets de logiciel libre portés par leurs communautés. Codekeeb assemble, adapte et vend des unités basées sur ces conceptions, mais n'en est pas l'auteur.</p>
      <p>Polices : Archivo, Inter, Baloo 2 et Space Mono, sous licence SIL Open Font License, servies depuis ce même site.</p>
      <h3>Avis</h3>
      <p>Les notes affichées ici sont celles d'Etsy, avec leur nombre d'avis et un lien vers l'annonce. Elles ne sont ni rédigées, ni choisies, ni modifiées sur ce site. Si vous pensez qu'un avis n'est pas authentique, vous pouvez le signaler à Etsy ou m'écrire.</p>
      <h3>Liens vers d'autres sites</h3>
      <p>Les liens vers Etsy, GitHub et ZMK mènent à des sites qui ont leurs propres conditions et politiques de confidentialité.</p>`,

    privacidad: `
      <p class="legal__resumen">En bref : ce site ne vous demande aucune donnée, n'utilise pas de cookies, n'a ni mesure d'audience ni publicité, et ne charge rien depuis d'autres domaines. Si vous achetez, c'est sur Etsy.</p>
      <h3>Responsable du traitement</h3>
      <p>L'éditeur indiqué dans les <a href="#aviso">mentions légales</a>.</p>
      <h3>Quelles données ce site traite</h3>
      <ul>
        <li><b>Aucune que vous saisissez.</b> Il n'y a ni formulaire, ni compte, ni newsletter.</li>
        <li><b>Votre adresse IP</b>, qui, comme sur tout site, parvient au serveur qui l'héberge : GitHub Pages, de GitHub, Inc. (États-Unis). GitHub enregistre les adresses IP des visiteurs pour des raisons de sécurité et les traite selon sa <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">déclaration de confidentialité</a>. Codekeeb n'a accès ni à ces journaux ni à des statistiques de visite.</li>
        <li><b>Des préférences enregistrées par votre propre navigateur</b> : langue, pause des animations et, si vous utilisez Keymap Studio, vos keymaps et macros. Elles ne quittent pas votre navigateur. Le détail est dans <a href="#cookies">cookies</a>.</li>
      </ul>
      <h3>Keymap Studio</h3>
      <p>L'éditeur communique avec votre clavier par câble (Web Serial), directement depuis votre navigateur. Ni la keymap ni les macros ne sont envoyées à un serveur. Les macros conservent le texte que vous y tapez : n'y mettez pas de mots de passe.</p>
      <h3>Si vous achetez sur Etsy</h3>
      <p>Etsy gère la commande, le paiement et vos données de livraison selon sa politique de confidentialité. Etsy transmet au vendeur ce qui est nécessaire pour préparer et expédier la commande (votre nom et votre adresse de livraison) ainsi que les messages que vous lui envoyez. Ces données servent uniquement à expédier la commande, assurer le service après-vente et respecter les obligations légales, par exemple fiscales. La base légale est l'exécution de l'achat et ces obligations (art. 6.1.b et 6.1.c du RGPD), et elles sont conservées aussi longtemps que celles-ci l'exigent.</p>
      <h3>Vos droits</h3>
      <p>Vous pouvez demander l'accès, la rectification, l'effacement, l'opposition, la limitation ou la portabilité de vos données en écrivant à l'éditeur. Si vous estimez qu'ils n'ont pas été respectés, vous pouvez saisir l'Agence espagnole de protection des données (<a href="https://www.aepd.es" target="_blank" rel="noopener">aepd.es</a>) ou l'autorité de votre pays.</p>
      <h3>Sécurité</h3>
      <p>Le site est servi uniquement en HTTPS, et une politique de sécurité du contenu l'empêche de charger du code depuis d'autres domaines. Comme il ne collecte aucune donnée personnelle, il n'en conserve aucune à protéger.</p>
      <h3>Modifications</h3>
      <p>Si le site commence un jour à collecter des données ou à utiliser un service tiers, cette politique sera mise à jour avant. Et si votre consentement est nécessaire, il vous sera demandé avant toute activation.</p>`,

    cookies: `
      <p class="legal__resumen">Ce site n'utilise pas de cookies, ni d'outil de mesure d'audience, de publicité ou de suivi. C'est pourquoi vous ne verrez pas de bandeau cookies : il n'y a rien à accepter ni à refuser.</p>
      <p>Il utilise en revanche le stockage local de votre navigateur (localStorage) pour retenir les choix que vous faites. Il reste sur votre appareil, n'est envoyé nulle part et ne permet pas de vous identifier.</p>
      {{TABLA}}
      <p>Comme il s'agit d'un stockage que vous activez vous-même en utilisant une fonction, il ne nécessite pas de consentement préalable. Vous pouvez l'effacer ici ou depuis les réglages de votre navigateur :</p>
      {{BORRAR}}
      <p>Si un outil de mesure est ajouté un jour, cette page le dira avant, et votre accord vous sera demandé avant son chargement.</p>`,

    compras: `
      <h3>Où acheter</h3>
      <p>Tous les achats se font dans la boutique CodeKeeb sur Etsy ({{TIENDA}}). Le contrat et le paiement sont régis par les conditions d'Etsy et par ce qu'indique l'annonce de chaque produit.</p>
      <h3>Prix</h3>
      <p>Les prix de ce site sont indicatifs : ils sont copiés depuis Etsy et portent la date de la dernière vérification ({{FECHA}}). Ceux qui font foi, avec les frais de port, sont ceux qu'Etsy affiche avant le paiement.</p>
      <h3>Livraison</h3>
      <p>Les commandes partent d'Espagne. Délais et frais : dans chaque annonce Etsy.</p>
      <h3>Retours et annulations</h3>
      <p>Les conditions précises (délai, qui paie le retour et quels articles peuvent être retournés) sont celles des politiques de la boutique sur Etsy. Consultez-les avant d'acheter.</p>
      <h3>Vos droits de consommateur</h3>
      <p>Si vous achetez en tant que consommateur dans l'Union européenne auprès d'un vendeur professionnel, la loi vous reconnaît notamment :</p>
      <ul>
        <li><b>Droit de rétractation.</b> Vous disposez de 14 jours calendaires à compter de la réception de la commande pour la renvoyer sans motif. La loi exclut les biens confectionnés selon vos spécifications ou nettement personnalisés, ce qui peut concerner les commandes sur mesure (couleurs, switches ou disposition que vous choisissez). Si votre commande est sur mesure, demandez avant d'acheter.</li>
        <li><b>Garantie légale de conformité.</b> Si le produit présente un défaut d'origine, vous pouvez demander sa réparation ou son remplacement. Dans l'UE, elle dure au moins deux ans ; en Espagne, trois ans à compter de la livraison.</li>
      </ul>
      <p>Ceci résume des règles générales. Cela ne remplace pas la loi applicable à votre achat, qui dépend de votre pays et du type de vente, et n'étend pas ces droits.</p>
      <h3>Support</h3>
      <p>Si quelque chose ne va pas, écrivez via Etsy.</p>`,
  },
};
