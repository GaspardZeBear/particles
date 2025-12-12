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

class ThingMesh extends Mesh {

  constructor(zTexture) {
    super()
    this.setGeometry()
    const texture = new TextureLoader().load('textures/' + zTexture)
    TextureUtils.contain(texture,1)
    this.material = new MeshPhongMaterial({
      map: texture,
      color: 0xffffff,
      transparent: true,
      opacity: 0.99,
      //depthTest: false,
      //depthWrite: true,
      wireframe : false
    });
    this.mesh = new Mesh(this.geometry, this.material);
    // Ajout fils de fer
    const wireMat = new MeshBasicMaterial({
      color: 0xff00ff,
      wireframe: true
    })
    const wireMesh = new Mesh(this.geometry, wireMat)
    this.meshMover=new MeshMover(this)
    //this.add(wireMesh)
  }

  setGeometry() {
    this.geometry = new IcosahedronGeometry(8, 10)
    this.geometry = new SphereGeometry( 12,16, 16 );
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