/* Imprime triptico.html a PDF y saca un PNG de cada cara para revisarlo.
   Lo llama generar.py con la direccion del servidor local. */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

async function cargarPlaywright() {
  try { return await import("playwright"); } catch {}
  return await import(join(execSync("npm root -g", { encoding: "utf8" }).trim(), "playwright", "index.mjs"));
}
const [url, salida] = process.argv.slice(2);
const { chromium } = await cargarPlaywright();
const ruta = "/opt/pw-browsers/chromium";
const br = await chromium.launch(existsSync(ruta) ? { executablePath: ruta } : {});
const pg = await br.newPage({ deviceScaleFactor: 3 });
const errores = [];
pg.on("pageerror", e => errores.push(e.message));
pg.on("requestfailed", r => errores.push("no carga: " + r.url()));
await pg.goto(url, { waitUntil: "networkidle" });
await pg.evaluate(() => document.fonts.ready);
/* Si una tipografia no llega, el PDF sale con la de respaldo y el
   interletrado no es el disenado: mejor fallar que imprimirlo asi. */
const faltan = await pg.evaluate(() => ["Doto", "Schibsted Grotesk", "Space Mono"]
  .filter(f => !document.fonts.check(`700 12px "${f}"`) && !document.fonts.check(`400 12px "${f}"`)));
if (faltan.length) errores.push("tipografias sin cargar: " + faltan.join(", "));
await pg.pdf({ path: join(salida, "triptico.pdf"), preferCSSPageSize: true, printBackground: true });
/* 297 mm son 1123 px CSS; a 3x, unos 290 ppp: suficiente para revisar */
await pg.setViewportSize({ width: 1123, height: 794 });
await pg.emulateMedia({ media: "print" });
const caras = await pg.$$(".hoja");
for (const [i, c] of caras.entries())
  await c.screenshot({ path: join(salida, `cara-${i + 1}.png`), scale: "device" });
await br.close();
if (errores.length) { console.error(errores.join("\n")); process.exit(1); }
console.log("triptico.pdf y " + caras.length + " caras en PNG");
