// Visor de revision y de la pagina: escena, luces de la spec, suelo con sombra y controles.
import * as THREE from "three";
import {
  createSofleSplitKeyboardModel, createSofleSplitKeyboardLookDevLights, createSofleSplitKeyboardEnvironment,
  frameSofleSplitKeyboardCamera, configureSofleSplitKeyboardRenderer, createSofleSplitKeyboardInspectControls,
} from "./createSofleModel";

declare global { interface Window { __listo?: boolean; __giro?: (az: number, el: number) => void } }

export function montarVisor(lienzo: HTMLCanvasElement, opciones: { az?: number; el?: number; margen?: number; fov?: number; quieto?: boolean } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  configureSofleSplitKeyboardRenderer(renderer);
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f5f7);
  scene.environment = createSofleSplitKeyboardEnvironment(renderer);

  const modelo = createSofleSplitKeyboardModel({ castShadow: true, receiveShadow: true } as never);
  scene.add(modelo);

  const luces = createSofleSplitKeyboardLookDevLights("neutral");
  // el modelo mide ~15 unidades: la sombra del generador cubre +-2.6
  luces.traverse(o => {
    const l = o as THREE.DirectionalLight;
    if (l.isDirectionalLight && l.castShadow) {
      l.position.multiplyScalar(2.2);
      Object.assign(l.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, far: 60 });
      l.shadow.camera.updateProjectionMatrix();
    }
  });
  scene.add(luces);

  // suelo blanco que recibe la sombra de contacto
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: 0xf4f5f7, roughness: 0.95 }));
  suelo.rotation.x = -Math.PI / 2;
  suelo.position.y = -0.001;
  suelo.receiveShadow = true;
  scene.add(suelo);

  const camara = new THREE.PerspectiveCamera(opciones.fov ?? 30, 1, 0.1, 200);
  const controles = createSofleSplitKeyboardInspectControls(camara, lienzo);
  controles.maxDistance = 40; controles.minDistance = 4; controles.maxPolarAngle = Math.PI * 0.47;

  const encuadra = (az = opciones.az ?? 0, el = opciones.el ?? 38) => {
    frameSofleSplitKeyboardCamera(camara, modelo, { margin: opciones.margen ?? 0.74, azimuthDeg: az, elevationDeg: el });
    controles.target.copy(new THREE.Box3().setFromObject(modelo).getCenter(new THREE.Vector3()));
    controles.update();
  };
  const ajusta = () => {
    const w = lienzo.clientWidth, h = lienzo.clientHeight;
    renderer.setSize(w, h, false); camara.aspect = w / h; camara.updateProjectionMatrix();
  };
  ajusta(); encuadra();
  addEventListener("resize", ajusta);
  window.__giro = (az, el) => { encuadra(az, el); renderer.render(scene, camara); };

  const pinta = () => { controles.update(); renderer.render(scene, camara); };
  if (opciones.quieto) { pinta(); } else renderer.setAnimationLoop(pinta);
  pinta();
  window.__listo = true;
  return { renderer, scene, camara, controles, modelo, pinta };
}
