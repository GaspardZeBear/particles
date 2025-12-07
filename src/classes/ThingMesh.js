import {
  IcosahedronGeometry,
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
} from 'three';

class ThingMesh extends Mesh {

  constructor(zTexture) {
    super()
    this.geometry = new IcosahedronGeometry(7, 10)
    const texture = new TextureLoader().load('textures/' + zTexture)
    this.material = new MeshPhongMaterial({
      map: texture,
      color: 0xffffff,
      transparent: true,
      opacity: 0.99,
      //depthTest: false,
      //depthWrite: true,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    // Ajout fils de fer
    const wireMat = new MeshBasicMaterial({
      color: 0xff00ff,
      wireframe: true
    })
    const wireMesh = new Mesh(this.geometry, wireMat)
    //this.add(wireMesh)
  }

  getGeometry() {
    return (this.geometry)
  }

  getMaterial() {
    return (this.material)
  }

  initPosition(x, y, z, orbit, angle) {
    this.orbit = orbit
    this.angle = angle;
    this.x0=x
    this.y0=y
    this.z0=z
    this.move()
    //this.mesh.position.x = orbit * Math.cos(angle);
    //this.mesh.position.y = y
    //this.mesh.position.z = orbit * Math.sin(angle);
  }

  move() {
    this.angle += 0.001
    //zeroMesh.position.x += 0.01
    this.position.x = this.orbit * Math.cos(this.angle);
    this.position.y = this.y0
    this.position.z = this.orbit * Math.sin(this.angle)
    //zeroMesh.position.set(x,y,z)
    //this.mesh.rotateX(Math.PI / 300)
    this.rotateY(Math.PI / 300)
    this.rotateZ(Math.PI / 600)
    }
}
export default ThingMesh