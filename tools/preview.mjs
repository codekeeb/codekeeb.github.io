/* ============================================================
   CODEKEEB — previsualizacion y revision automatica
   ------------------------------------------------------------
   Levanta el sitio, lo abre en Chromium en movil y escritorio,
   en los tres idiomas, y saca capturas. De paso avisa de:
     - desbordamiento horizontal (la web se va a los lados)
     - errores de JavaScript en consola
     - imagenes o recursos que no cargan

   Uso:
     node tools/preview.mjs              # portada, ficha del Totem y comparador
     node tools/preview.mjs --all        # + la pagina de cada producto
     node tools/preview.mjs --lang es    # solo un idioma

   Requiere Playwright. Si no lo tienes:  npm i -D playwright
   Las capturas van a tools/.preview/ (ignorado por git).
   ============================================================ */

import { createServer } from "node:http";
import { readFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync, spawn } from "node:child_process";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SALIDA = join(RAIZ, "tools", ".preview");
const PUERTO = 8099;
const PUERTO_CDP = 9411;

/* Playwright puede estar instalado en el proyecto o a nivel global
   (en el contenedor de Claude viene global). Lo buscamos en los dos. */
async function cargarPlaywright() {
  try {
    return await import("playwright");
  } catch {}
  try {
    const global = execSync("npm root -g", { encoding: "utf8" }).trim();
    return await import(join(global, "playwright", "index.mjs"));
  } catch {}
  console.error("No encuentro Playwright.  Instalalo con:  npm i -D playwright");
  process.exit(2);
}

const TIPOS = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json",
};

function servidor() {
  return createServer(async (req, res) => {
    const ruta = decodeURIComponent(req.url.split("?")[0]);
    const archivo = join(RAIZ, ruta === "/" ? "index.html" : ruta);
    if (!archivo.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
    try {
      const datos = await readFile(archivo);
      res.writeHead(200, { "content-type": TIPOS[extname(archivo)] || "application/octet-stream" });
      res.end(datos);
    } catch {
      res.writeHead(404).end("no encontrado");
    }
  });
}

/* Chromium tras el proxy del contenedor, para que Google Fonts cargue de
   verdad y las capturas sean fieles. Dos detalles que cuestan una tarde:
   el proxy corta el ClientHello grande de TLS 1.3 que manda Chromium (hay
   que capar a TLS 1.2), y los argumentos por omision de Playwright vuelven
   a romperlo, asi que lanzamos el navegador a mano y nos conectamos por
   CDP. Si algo de esto falla, arrancamos normal: las capturas salen con
   tipografia de respaldo, pero salen. */
async function abrirNavegador(chromium) {
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const binario = process.env.PLAYWRIGHT_BROWSERS_PATH
    ? join(process.env.PLAYWRIGHT_BROWSERS_PATH, "chromium")
    : null;
  if (proxy && binario && existsSync(binario)) {
    try {
      const proc = spawn(binario, [
        "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
        `--user-data-dir=${join(SALIDA, ".chrome")}`,
        `--proxy-server=${proxy}`,
        "--ssl-version-max=tls1.2",
        `--remote-debugging-port=${PUERTO_CDP}`,
        "--hide-scrollbars",
      ], { stdio: "ignore" });
      await new Promise(r => setTimeout(r, 3500));
      const navegador = await chromium.connectOverCDP(`http://127.0.0.1:${PUERTO_CDP}`);
      return { navegador, fieles: true, cerrar: async () => { await navegador.close(); proc.kill(); } };
    } catch {
      console.warn("Aviso: no pude abrir Chromium tras el proxy; sigo sin el.");
    }
  }
  const navegador = await chromium.launch();
  return { navegador, fieles: false, cerrar: () => navegador.close() };
}

const VISTAS = [
  { nombre: "movil", width: 390, height: 844, dsf: 3, movil: true },
  { nombre: "escritorio", width: 1440, height: 900, dsf: 2, movil: false },
  /* Por encima de 1448 px la pagina ya no la limita el canalon sino
     --maxw, y ahi se ven fallos de columna que a 1440 no existen. */
  { nombre: "ancho", width: 1920, height: 1080, dsf: 1, movil: false },
];

/* Estos dominios externos estan bloqueados en el contenedor de Claude.
   No son fallos del sitio, pero en las capturas la tipografia sera la de
   respaldo: no juzgues el interletrado a partir de ellas. */
const EXTERNOS = ["fonts.googleapis.com", "fonts.gstatic.com"];

async function main() {
  const args = process.argv.slice(2);
  const idiomas = args.includes("--lang")
    ? [args[args.indexOf("--lang") + 1]]
    : ["es", "en", "fr"];

  /* Las tres paginas de la tienda. Dejaron de ser prototipos el 15 de
     septiembre: la portada es `/`, y el catalogo y el comparador cuelgan
     de ella, asi que las tres entran en la tanda normal. */
  /* La portada (que es la tienda), una ficha con configurador y el
     comparador. La ficha de la tanda normal es la del Totem porque es la
     mas dificil: cuatro niveles de montaje y precios en rango. `--all`
     anade las cinco. catalogo.html ya solo redirige a la portada. */
  const paginas = [
    { id: "portada",   url: "/index.html" },
    { id: "modelo",    url: "/modelo.html?id=totem" },
    { id: "comparar",  url: "/comparar.html" },
  ];
  if (args.includes("--all")) {
    const data = await readFile(join(RAIZ, "js", "data.js"), "utf8");
    const bloque = data.slice(data.indexOf("const CK_PRODUCTS"), data.indexOf("const CK_FLAVORS"));
    for (const m of bloque.matchAll(/\n    id: "([^"]+)"/g)) {
      paginas.push({ id: m[1], url: `/modelo.html?id=${m[1]}` });
    }
  }

  const { chromium } = await cargarPlaywright();
  await rm(SALIDA, { recursive: true, force: true });
  await mkdir(SALIDA, { recursive: true });

  const srv = servidor();
  await new Promise(r => srv.listen(PUERTO, r));
  const { navegador, cerrar, fieles } = await abrirNavegador(chromium);
  const problemas = [];
  let capturas = 0;

  for (const pagina of paginas) {
    for (const idioma of idiomas) {
      for (const vista of VISTAS) {
        const etiqueta = `${pagina.id}/${idioma}/${vista.nombre}`;
        const ctx = await navegador.newContext({
          viewport: { width: vista.width, height: vista.height },
          deviceScaleFactor: vista.dsf,
          isMobile: vista.movil,
          hasTouch: vista.movil,
          locale: idioma,
        });
        /* El sitio lee el idioma de localStorage antes de pintar. */
        await ctx.addInitScript(`localStorage.setItem("ck-lang", ${JSON.stringify(idioma)})`);
        const page = await ctx.newPage();

        page.on("pageerror", e => problemas.push(`${etiqueta}  error JS: ${e.message}`));
        page.on("console", m => {
          if (m.type() !== "error") return;
          /* El origen real del error va en location(), no en el texto: los
             fallos de red llegan como "Failed to load resource" a secas. */
          const origen = (m.location() && m.location().url) || "";
          if (EXTERNOS.some(d => origen.includes(d) || m.text().includes(d))) return;
          /* Los recursos que no cargan ya los reporta requestfailed, con su URL. */
          if (m.text().startsWith("Failed to load resource")) return;
          problemas.push(`${etiqueta}  consola: ${m.text().slice(0, 160)}`);
        });
        page.on("requestfailed", r => {
          if (!EXTERNOS.some(d => r.url().includes(d))) {
            problemas.push(`${etiqueta}  no carga: ${r.url().replace(`http://127.0.0.1:${PUERTO}`, "")}`);
          }
        });

        await page.goto(`http://127.0.0.1:${PUERTO}${pagina.url}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(900);
        /* Bajar del todo para disparar las animaciones al entrar en vista.
           A saltos de media pantalla y esperando un fotograma de verdad:
           con saltos de 600 px cada 50 ms el IntersectionObserver no
           llegaba a disparar y la captura completa salia con la mitad de
           la pagina en blanco — un fallo de la captura, no de la web,
           que es la peor clase de fallo porque parece real. */
        await page.evaluate(async () => {
          /* `behavior: "instant"` es lo que hacia falta: la portada lleva
             `html{scroll-behavior:smooth}`, asi que cada `scrollTo` abria
             una animacion y la siguiente llamada la reiniciaba antes de
             llegar. La pagina se quedaba arriba y el observador no veia
             pasar nada. */
          const cuadro = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
          const paso = Math.round(innerHeight / 2);
          for (let y = 0; y < document.body.scrollHeight; y += paso) {
            window.scrollTo({ top: y, behavior: "instant" });
            await cuadro();
            await new Promise(r => setTimeout(r, 60));
          }
          window.scrollTo({ top: 0, behavior: "instant" });
        });
        await page.waitForTimeout(900);
        /* Si algo se quedo invisible, es que la entrada no llego a
           dispararse: mejor decirlo que mandar una captura en blanco. */
        const sinEntrar = await page.evaluate(() =>
          document.querySelectorAll(".entra:not(.dentro),.reveal:not(.is-in)").length);
        if (sinEntrar) problemas.push(`${etiqueta}  ${sinEntrar} elemento(s) sin entrar en vista`);

        const base = `${pagina.id}-${idioma}-${vista.nombre}`;
        await page.screenshot({ path: join(SALIDA, `${base}.png`) });
        await page.screenshot({ path: join(SALIDA, `${base}-completa.png`), fullPage: true });
        capturas += 2;

        const desb = await page.evaluate(() => {
          const d = document.documentElement;
          if (d.scrollWidth <= d.clientWidth + 1) return null;
          const culpables = [...document.querySelectorAll("*")]
            .filter(e => e.getBoundingClientRect().right > d.clientWidth + 1)
            .filter(e => getComputedStyle(e).position !== "absolute")
            .slice(0, 3)
            .map(e => e.tagName.toLowerCase() + (e.className ? "." + String(e.className).split(" ")[0] : ""));
          return { ancho: d.scrollWidth, visible: d.clientWidth, culpables };
        });
        if (desb) {
          problemas.push(`${etiqueta}  se sale a lo ancho: ${desb.ancho}px en ${desb.visible}px  (${desb.culpables.join(", ") || "?"})`);
        }

        /* Todo bloque de una region tiene que empezar en el mismo sitio.
           `main > section > *` les da `margin-inline:auto`, pero basta un
           `margin` en atajo (`margin:0`, `margin:18px 0 36px`) en una regla
           posterior para anularlo, y el bloque se va al canalon sin que
           nadie se entere. Paso tres veces. */
        const fugas = await page.evaluate(() => {
          const avisos = [];
          for (const sec of document.querySelectorAll("main > section")) {
            const anchoSec = sec.getBoundingClientRect().width;
            const bloques = [...sec.children].filter(e => {
              const cs = getComputedStyle(e);
              if (cs.display === "none" || cs.position === "absolute" || cs.position === "fixed") return false;
              /* Solo los elementos de bloque: la columna se los reparte a
                 ellos. Un boton es inline-flex y lo coloca el text-align,
                 asi que en frances, con el texto mas largo, empieza donde
                 le toca aunque mida mas de media region. */
              if (/^inline/.test(cs.display)) return false;
              /* Y tampoco cuenta lo que esta centrado a proposito: si el
                 hueco de la izquierda y el de la derecha son iguales, el
                 bloque no se ha escapado de la columna, esta centrado
                 dentro de ella. Es lo que hace una foto mas estrecha que
                 su region. */
              const r = e.getBoundingClientRect(), sr = sec.getBoundingClientRect();
              const izq = r.left - sr.left, der = sr.right - r.right;
              if (Math.abs(izq - der) <= 2) return false;
              return r.width > anchoSec * 0.5;
            });
            if (bloques.length < 2) continue;
            const izq = bloques.map(e => Math.round(e.getBoundingClientRect().left));
            const comun = izq.sort((a, b) =>
              izq.filter(v => v === b).length - izq.filter(v => v === a).length)[0];
            for (const e of bloques) {
              const x = Math.round(e.getBoundingClientRect().left);
              if (Math.abs(x - comun) > 1) {
                avisos.push(`${sec.className.split(" ")[0] || sec.id} > ${e.className.split(" ")[0] || e.tagName.toLowerCase()}`
                  + ` empieza en ${x}px y el resto de la region en ${comun}px`);
              }
            }
          }
          return avisos;
        });
        for (const f of fugas) problemas.push(`${etiqueta}  fuera de la columna: ${f}`);

        /* Un texto sin traducir aparece como la clave cruda: "nav.features". */
        const crudas = await page.evaluate(() =>
          [...document.querySelectorAll("[data-i18n]")]
            .filter(e => e.textContent.trim() === e.dataset.i18n)
            .map(e => e.dataset.i18n).slice(0, 5));
        if (crudas.length) {
          problemas.push(`${etiqueta}  texto sin traducir a la vista: ${crudas.join(", ")}`);
        }

        await ctx.close();
      }
    }
  }

  await cerrar();
  srv.close();

  const unicos = [...new Set(problemas)];
  console.log(`\n${capturas} capturas en tools/.preview/` +
    (fieles ? "  (con las tipografias reales)" : "  (con tipografias de respaldo)"));
  if (unicos.length) {
    console.log(`\n${unicos.length} problema(s):`);
    for (const p of unicos) console.log("  " + p);
    process.exit(1);
  }
  console.log("Sin desbordamientos, sin errores de JS y sin texto sin traducir.");
}

main();
