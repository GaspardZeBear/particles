import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { texture } from "three/tsl";
import { createRenderer } from "./components/renderer";
import ThingMesh from "./classes/ThingMesh.js";
import SnowBallMesh from "./classes/SnowBallMesh.js";

console.log("Entering basic.js")
const renderer= createRenderer()

const camera = createCamera()
camera.position.set(0, 0, 75);
const scene = createScene('black')
const gridHelper = new THREE.GridHelper(100,100,0xffffff,0xffffff);
//scene.add(gridHelper);
const mesh0 = new ThingMesh('alia00.jpg')
const mesh1 = new ThingMesh('alia01.jpg')
const mesh2 = new ThingMesh('alia02.jpg')
const mesh3 = new ThingMesh('alia03.jpg')
const sMesh0=new SnowBallMesh('alia00.jpg',5,100)
scene.add(mesh0)
scene.add(sMesh0)
scene.add(mesh1)
//scene.add(mesh2)
//scene.add(mesh3)

// Ajouter une lumière ambiante
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);
const spotLight = new THREE.SpotLight( 0xffffff, 10.0, 200,Math.PI/3,100,0 );
scene.add( spotLight );

mesh0.initPosition(0,-5,0,0,0)
mesh1.initPosition(0,0,0,20,Math.PI)
mesh2.initPosition(0,10,8,40,Math.PI/2)
mesh3.initPosition(3,5,0,15,Math.PI/3)
sMesh0.initPosition(1,1,1,5,3)
function animate(t) {
  requestAnimationFrame(animate);
  mesh0.move()
  sMesh0.move()
  mesh1.move()
  mesh2.move()
  mesh3.move()
  renderer.render(scene, camera)
}

animate()

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});