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
const qString = window.location.search;
const params = new URLSearchParams(qString);
let snowBallImg="alia00.jpg"
if ( params.get("snowBallImg") ) {
  snowBallImg=params.get("snowBallImg")
}
const renderer= createRenderer()
const NEAR=10
const SNOWGLOBERADIUS=75
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
  bowlsPerOrbit:4,
  snowGlobeRadius:SNOWGLOBERADIUS
})

for (let i=0; i<meshes.length; i++) {
  scene.add(meshes[i])
}

const sMesh0=new SnowBallMesh(snowBallImg,SNOWGLOBERADIUS,500)
sMesh0.initPosition({})
scene.add(sMesh0)

//const particles=new ParticlesMesh(1,0.1,100)
//scene.add(particles)
// Ajouter une lumière ambiante
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);
const spotLight = new THREE.SpotLight( 0xffffff, 10.0, 200,Math.PI/3,100,0 );
scene.add( spotLight );
const spotLight1 = new THREE.SpotLight( 0xff00ff, 20.0, 200,Math.PI,0,0.1 );
spotLight1.position.set(-100,-100,100)
scene.add( spotLight1 );
const spotLight2 = new THREE.SpotLight( 0x00ff00, 20.0, 200,Math.PI,0,0.1 );
spotLight2.position.set(100,100,100)
scene.add( spotLight2 );
const spotLight3 = new THREE.SpotLight( 0x0000ff, 20.0, 200,Math.PI,0,0.1 );
spotLight3.position.set(0,100,100)
scene.add( spotLight3 );

var axisHelper = new THREE.AxesHelper(5000);
//scene.add(axisHelper);


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