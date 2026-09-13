/* ============================================================
   CODEKEEB — previsualizacion y revision automatica
   ------------------------------------------------------------
   Levanta el sitio, lo abre en Chromium en movil y escritorio,
   en los tres idiomas, y saca capturas. De paso avisa de:
     - desbordamiento horizontal (la web se va a los lados)
     - errores de JavaScript en consola
     - imagenes o recursos que no cargan

   Uso:
     node tools/preview.mjs              # index, 3 idiomas, 2 tamanos
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
import { execSync } from "node:child_process";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SALIDA = join(RAIZ, "tools", ".preview");
const PUERTO = 8099;

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

const VISTAS = [
  { nombre: "movil", width: 390, height: 844, dsf: 3, movil: true },
  { nombre: "escritorio", width: 1440, height: 900, dsf: 2, movil: false },
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

  const paginas = [{ id: "home", url: "/index.html" }];
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
  const navegador = await chromium.launch();
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
        /* Bajar del todo para disparar las animaciones al entrar en vista. */
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(600);

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

  await navegador.close();
  srv.close();

  const unicos = [...new Set(problemas)];
  console.log(`\n${capturas} capturas en tools/.preview/`);
  if (unicos.length) {
    console.log(`\n${unicos.length} problema(s):`);
    for (const p of unicos) console.log("  " + p);
    process.exit(1);
  }
  console.log("Sin desbordamientos, sin errores de JS y sin texto sin traducir.");
}

main();
