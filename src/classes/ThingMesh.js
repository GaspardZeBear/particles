import { 
    IcosahedronGeometry, 
    MeshPhongMaterial,
    MeshBasicMaterial,
    Mesh,
    } from 'three';

class ThingMesh extends Mesh {

  constructor() {
    super()
    this.geometry = new IcosahedronGeometry(3, 1)
    this.material = new MeshPhongMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.5,
      depthTest: false,
      depthWrite: true,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    // Ajout fils de fer
    const wireMat = new MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    })
    const wireMesh = new Mesh(this.geometry, wireMat)
  }

  getMesh() {
    return(this.mesh)
  }

  getGeometry() {
    return(this.geometry)
  }

  getMaterial() {
    return(this.material)
  }

  addMesh(mesh) {
    this.mesh.add(mesh)
  }
    
}
export default ThingMesh