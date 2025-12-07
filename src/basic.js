import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { texture } from "three/tsl";
import { createRenderer } from "./components/renderer";
import ThingMesh from "./classes/ThingMesh.js";

console.log("Entering basic.js")
const renderer= createRenderer()

const camera = createCamera()
camera.position.set(0, 0, 50);
const scene = createScene('black')
const mesh0 = new ThingMesh('alia00.jpg')
const mesh1 = new ThingMesh('alia01.jpg')
const mesh2 = new ThingMesh('alia02.jpg')
scene.add(mesh0)
scene.add(mesh1)
scene.add(mesh2)

// Ajouter une lumière ambiante
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);

mesh0.initPosition(0,-5,0,25,0)
mesh1.initPosition(0,0,0,10,Math.PI)
mesh2.initPosition(0,7,0,30,Math.PI/2)
function animate(t) {
  requestAnimationFrame(animate);
  mesh0.move()
  mesh1.move()
  mesh2.move()
  renderer.render(scene, camera)
}

animate()

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});