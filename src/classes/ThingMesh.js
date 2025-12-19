import {
  BoxGeometry,
  IcosahedronGeometry,
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  TextureUtils,
  SphereGeometry,
} from 'three';
import MeshMover from "./MeshMover.js";
import { B64Loader } from './B64Loader.js';

class ThingMesh extends Mesh {

  constructor(zTexture, radius = 12) {
    super()
    this.radius = radius
    this.setGeometry()
    //const texture = new TextureLoader().load('textures/' + zTexture)
    const texture0 = new B64Loader().b64load(zTexture)
     
    const material0 = new MeshPhongMaterial({
      map: texture0,
      color: 0xffffff,
      transparent: true,
      opacity: 0.99,
      //depthTest: false,
      //depthWrite: true,
      wireframe: false
    });
    
    this.meshMover = new MeshMover(this)
    this.add(new Mesh(this.geometry, material0))
  }

  setGeometry() {
    this.geometry = new SphereGeometry(this.radius, 32, 32);
    //this.geometry = new BoxGeometry( 5,5, 5 );
  }
  

  initPosition(x, y, z, orbit, angle, angularSpeed) {
    this.meshMover.initPosition(x, y, z, orbit, angle, angularSpeed)
  }

  move() {
    this.meshMover.move()
  }

}
export default ThingMesh