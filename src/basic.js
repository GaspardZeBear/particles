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

const camera = createCamera({
  fov:60,
  ratio:window.innerWidth/window.innerHeight,
  //near:20,
  //z:500,
  y:0,
  z:100
})
 
const scene = createScene('black')
const gridHelper = new THREE.GridHelper(100,100,0xffffff,0xffffff);
//scene.add(gridHelper);
const imgs=[
  'alia00.jpg',
  'alia01.jpg',
  'alia02.jpg',
  'alia03.jpg',
  'maison.jpg'
]

const meshes= []
let bowlsCount=1
let x=Math.random()*200,y=Math.random()*200,z=Math.random()*200,radius=0,angle=0,pos=1
for (let i=0; i<bowlsCount; i++) {
  let idx=Math.floor(   Math.random()*imgs.length)
  let mesh=new ThingMesh(imgs[idx])
  
  pos*=-1
  y = i*20*pos
  if ( Math.abs(y) > 200 ) y=Math.random()*200
  if ( Math.abs(radius) > 400 ) radius=Math.random()*200
  radius +=20
  angle += Math.PI/10
  mesh.initPosition(x,y,z,radius,angle,Math.random()*0.005 + 0.001)
  meshes.push(mesh)
  scene.add(mesh)
}

const sMesh0=new SnowBallMesh('maison.jpg',5,100)

// Ajouter une lumière ambiante
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);
const spotLight = new THREE.SpotLight( 0xffffff, 10.0, 200,Math.PI/3,100,0 );
scene.add( spotLight );

sMesh0.initPosition(1,1,1,5,3)
scene.add(sMesh0)

function animate(t) {
  requestAnimationFrame(animate);
  sMesh0.move()
  for (let i=0; i<bowlsCount; i++) {
    meshes[i].move()
  }
  renderer.render(scene, camera)
}

animate()

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});