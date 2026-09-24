// Entrada de sofle-3d.html. El modelo es orientativo y lo dice; si no hay WebGL, se dice y se
// manda a las fotos reales en vez de dejar un hueco.
import { montarVisor } from "./visor";

declare const CK: { t(k: string): string; icono(n: string, t?: number): string; montarSelectorIdioma(): void; pintarIdioma(f: () => void): void };

const lienzo = document.getElementById("lienzo3d") as HTMLCanvasElement;
const estado = document.getElementById("estado3d")!;

function hayWebgl() {
  try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; }
}

function pintar() {
  document.title = `${CK.t("t3.titulo")} — Codekeeb`;
  lienzo.setAttribute("aria-label", CK.t("t3.lienzo"));
  document.querySelectorAll(".ic-flecha").forEach(e => (e.innerHTML = CK.icono("flecha", 16)));
}
CK.montarSelectorIdioma();
CK.pintarIdioma(pintar);
pintar();

if (!hayWebgl()) {
  estado.textContent = CK.t("t3.sinWebgl");
  lienzo.hidden = true;
} else {
  // El modelo es estatico: solo se mueve si lo gira quien mira (nada que pausar, WCAG 2.2.2).
  montarVisor(lienzo, { az: 0, el: 34, margen: 0.9, fov: 30 });
  estado.hidden = true;
}
