import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//import { Controls } from "three";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { or, texture } from "three/tsl";
import { createRenderer } from "./components/renderer";
import ThingMesh from "./classes/ThingMesh.js";
import SnowBallMesh from "./classes/SnowBallMesh.js";
import ParticlesMesh from "./classes/ParticlesMesh.js";
import { createBowls } from "./components/bowls";
//import { GUI} from 'lil-gui'


console.log("Entering basic.js")
const renderer= createRenderer()
const NEAR=10
const SNOWGLOBERADIUS=50
const camera = createCamera({
  fov:60,
  ratio:window.innerWidth/window.innerHeight,
  near:NEAR,
  far:10000,
  //z:500,
  x:0,
  y:0,
  z:400
})
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update()

const scene = createScene('black')
scene.fog=  new THREE.FogExp2( 0xff00ff, 0.0005 );
const gridHelper = new THREE.GridHelper(100,100,0xffffff,0xffffff);
//scene.add(gridHelper);
const imgs=[
  'alia00.jpg',
  'alia01.jpg',
  'alia02.jpg',
  'alia03.jpg',
  'maison.jpg',
  'pepette.jpg',
  'PereNoel.jpg'
]


let bowlsCount=20
let x=Math.random()*200
let y=Math.random()*200
let z=Math.random()*200
let radius=SNOWGLOBERADIUS
let angle=0
let sign=1
const THINGMESHRADIUS=20
const BOWLSPERORBIT=6
const meshes= createBowls({
  bowlsCount:20,
  x:x,
  y:y,
  z:z,
  imgs:imgs,
  thingMeshRadius:20,
  bowlsPerOrbit:6,
  snowGlobeRadius:SNOWGLOBERADIUS
})

//for (let i=0; i<bowlsCount; i++) {
//  sign*=-1
 // x = i*THINGMESHRADIUS*sign
//  y = i*THINGMESHRADIUS*sign
//  z = i*THINGMESHRADIUS*sign
//  if ( Math.abs(x) > 400 ) x=Math.random()*200
//  if ( Math.abs(y) > 300 ) y=Math.random()*200
//  if ( Math.abs(radius) > 400 ) radius=Math.random()*200
//  radius +=THINGMESHRADIUS
//  angle += Math.PI/10
  //let mesh=new ThingMesh(imgs[idx],THINGMESHRADIUS)
  //mesh.initPosition(x,y,z,radius,angle,Math.random()*0.005 + 0.001)
  //meshes.push(mesh)
  //scene.add(mesh)
  //let bowlSpeed=Math.random()*0.01 + 0.001
  //for (let b=0;b<BOWLSPERORBIT;b++) {
  //  let idx=Math.floor(   Math.random()*imgs.length)
  //  let mesh=new ThingMesh(imgs[idx],THINGMESHRADIUS)
  //  mesh.initPosition(x,y,z,radius,angle+b*2*Math.PI/BOWLSPERORBIT,bowlSpeed)
  //  meshes.push(mesh)
  //  scene.add(mesh)
  //}
//}
for (let i=0; i<meshes.length; i++) {
  scene.add(meshes[i])
}

const sMesh0=new SnowBallMesh('alia00.jpg',SNOWGLOBERADIUS,500)
sMesh0.initPosition({})
scene.add(sMesh0)

//const particles=new ParticlesMesh(1,0.1,100)
//scene.add(particles)
// Ajouter une lumière ambiante
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);
const spotLight = new THREE.SpotLight( 0xffffff, 10.0, 200,Math.PI/3,100,0 );
scene.add( spotLight );

var axisHelper = new THREE.AxesHelper(5000);
scene.add(axisHelper);


function animate(t) {
  requestAnimationFrame(animate);
  sMesh0.move()
  //particles.move()
  //particles.geometry.getAttribute('position').needsUpdate = true;
  for (let i=0; i<meshes.length; i++) {
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