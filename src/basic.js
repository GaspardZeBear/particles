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
//import { GUI} from 'lil-gui'


console.log("Entering basic.js")
const renderer= createRenderer()

const camera = createCamera({
  fov:60,
  ratio:window.innerWidth/window.innerHeight,
  near:10,
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
  'maison.jpg'
]

const meshes= []
let bowlsCount=50
let x=Math.random()*200
let y=Math.random()*200
let z=Math.random()*200
let radius=0
let angle=0
let sign=1
for (let i=0; i<bowlsCount; i++) {
  let idx=Math.floor(   Math.random()*imgs.length)
  let mesh=new ThingMesh(imgs[idx])
  sign*=-1
  x = i*20*sign
  y = i*20*sign
  if ( Math.abs(x) > 400 ) x=Math.random()*200
  if ( Math.abs(y) > 300 ) y=Math.random()*200
  if ( Math.abs(radius) > 400 ) radius=Math.random()*200
  radius +=20
  angle += Math.PI/10
  mesh.initPosition(x,y,z,radius,angle,Math.random()*0.005 + 0.001)
  meshes.push(mesh)
  scene.add(mesh)
}

const sMesh0=new SnowBallMesh('maison.jpg',50,500)
sMesh0.initPosition({})
scene.add(sMesh0)

const particles=new ParticlesMesh(2,500)
scene.add(particles)
// Ajouter une lumière ambiante
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);
const spotLight = new THREE.SpotLight( 0xffffff, 10.0, 200,Math.PI/3,100,0 );
scene.add( spotLight );

var axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);


function animate(t) {
  requestAnimationFrame(animate);
  sMesh0.move()
  //particles.move()
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