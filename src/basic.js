// @ts-nocheck
//import * as THREE from "three";
import * as THREE from '../node_modules/three/build/three.module.js';
//import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//import { OrbitControls } from "three/addons/controls/OrbitControls";
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
//import { or, texture } from "three/tsl";
import { createRenderer } from "./components/renderer.js";
import ThingMesh from "./classes/ThingMesh.js";
import SnowBallMesh from "./classes/SnowBallMesh.js";
import ParticlesMesh from "./classes/ParticlesMesh.js";
import { createBowls } from "./components/bowls.js";
import { createPlaneBackground } from "./components/background.js";
import { B64Loader } from './classes/B64Loader.js';

//-----------Parm section ------------------------------------------
// Here declare only one import as P !!!
// quick an dirty way to get different profiles with name P 
import { BasicParams } from './params/BasicParams.mjs';
//import { Alia as P} from './params/BasicParams.js';
//import { IsaFamily as P} from './params/BasicParams.js';
//--------------------------------------------------------------

console.log("Entering basic.js")

const qString = window.location.search;
const params = new URLSearchParams(qString);
BasicParams.setProfile('Full')
if ( params.get("profile") ) {
  BasicParams.setProfile(params.get("profile"))
}
let P=BasicParams.getProfile().constructor
B64Loader.b64=P.b64
B64Loader.b64=true
if ( params.get("b64") ) {
  B64Loader.b64=params.get("b64")
} 

const renderer= createRenderer()
const camera = createCamera({
  fov:P.cameraFov,
  ratio:window.innerWidth/window.innerHeight,
  near:P.cameraNear,
  far:P.cameraFar10000,
  x:P.cameraX,
  y:P.cameraY,
  z:P.cameraZ
})
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update()
const scene = createScene('black')

const meshes= createBowls({
  bowlsCount:P.bowlsCount,
  w:window.innerWidth,
  h:window.innerHeight,
  imgs:P.imgs,
  thingMeshRadius:P.thingMeshRadius,
  bowlsPerOrbit:P.bowlsPerOrbit,
  snowGlobeRadius:P.snowGlobeRadius
})

for (let i=0; i<meshes.length; i++) {
  scene.add(meshes[i])
}

const sMesh0=new SnowBallMesh(P.snowBallImg,P.snowGlobeRadius,P.flakesCount)
sMesh0.initPosition({})
scene.add(sMesh0)

// Ajouter une lumière ambiante
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);


const spotLight = new THREE.SpotLight( 0xffffff, 0.5, 0,Math.PI/3,0,0 );
spotLight.position.set(0,0,300)
scene.add( spotLight );
const spotLight1 = new THREE.SpotLight( 0xff00ff, 5.0, 200,Math.PI/3,0,0.1 );
spotLight1.position.set(-100,-100,100)
scene.add( spotLight1 );
const spotLight2 = new THREE.SpotLight( 0x00ff00, 5.0, 200,Math.PI/3,0,0.1 );
spotLight2.position.set(100,100,100)
scene.add( spotLight2 );
const spotLight3 = new THREE.SpotLight( 0x0000ff, 5.0, 200,Math.PI/6,0,0.1 );
spotLight3.position.set(0,100,100)
scene.add( spotLight3 );

var axisHelper = new THREE.AxesHelper(5000);
//scene.add(axisHelper);


function animate(t) {
  requestAnimationFrame(animate);
  sMesh0.move()
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