import { montarVisor } from "./visor";
const q = new URLSearchParams(location.search);
const n = (k: string, d: number) => (q.has(k) ? +q.get(k)! : d);
montarVisor(document.querySelector("canvas")!, { az: n("az", 0), el: n("el", 34), margen: n("m", 0.74), fov: n("fov", 30), quieto: true });
