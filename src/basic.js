import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { texture } from "three/tsl";
import { createRenderer } from "./components/renderer";
import ThingMesh from "./classes/ThingMesh";

console.log("Entering basic.js")
const renderer= createRenderer()

const camera = createCamera()
camera.position.set(0, 0, 50);
const scene = createScene('black')
// Point zero
//const zeroGeometry = new THREE.IcosahedronGeometry(3, 1)
//const zeroMaterial = new THREE.MeshPhongMaterial({
//  color: 0xffaa00,
//  transparent: false,
//  opacity: 1,
//  depthTest: false,
//  depthWrite: true,
//});
//const zeroMesh = new THREE.Mesh(zeroGeometry, zeroMaterial);

const zeroMesh = new ThingMesh()

// Ajout fils de fer
//const wireMat = new THREE.MeshBasicMaterial({
//  color: 0xffffff,
//  wireframe: true
//})
//const wireMesh = new THREE.Mesh(zeroMesh.getGeometry(), wireMat)
//zeroMesh.addMesh(wireMesh)
//scene.add(wireMesh)
scene.add(zeroMesh)

// Ajouter une lumière ambiante
const hemiLight = new THREE.HemisphereLight(0xaa5500, 0x0099ff);
scene.add(hemiLight);

let x = 0
let y = 0
let z = 0
let orbit=25
let angle = 0;
zeroMesh.position.x = orbit * Math.cos(angle);
      //sphere.position.y = orbit * Math.sin(angle);
zeroMesh.position.z = orbit * Math.sin(angle);
function animate(t) {
  requestAnimationFrame(animate);
  angle += 0.01
  //zeroMesh.position.x += 0.01
  zeroMesh.position.x = orbit * Math.cos(angle);
  //zeroMesh.position.y += 1
  zeroMesh.position.z = orbit*Math.sin(angle)
  //zeroMesh.position.set(x,y,z)
  zeroMesh.rotateX(Math.PI / 300)
  zeroMesh.rotateY(Math.PI / 300)
  zeroMesh.rotateZ(Math.PI / 100)
  renderer.render(scene, camera)
}

animate()

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});