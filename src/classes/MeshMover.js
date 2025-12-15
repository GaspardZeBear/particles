class MeshMover {

  constructor(mesh) {
    this.mesh=mesh
  }

  
  initPosition(x, y, z, orbit, angle, angularSpeed) {
    this.mesh.orbit0 = orbit
    this.mesh.orbit=orbit
    this.mesh.angle = angle;
    this.mesh.angularSpeed=angularSpeed
    this.mesh.x0=x
    this.mesh.y0=y
    this.mesh.z0=z
    this.mesh.move()
    //this.mesh.mesh.position.x = orbit * Math.cos(angle);
    //this.mesh.mesh.position.y = y
    //this.mesh.mesh.position.z = orbit * Math.sin(angle);
  }

  move() {
    this.mesh.angle += this.mesh.angularSpeed/4
    if (this.mesh.orbit > 4 ) {
      this.mesh.orbit=this.mesh.orbit0
    }
    this.mesh.position.x = this.mesh.orbit * Math.cos(this.mesh.angle);
    this.mesh.position.y = this.mesh.y0
    //this.mesh.position.y = this.mesh.orbit * Math.cos(this.mesh.angle) *Math.sin(this.mesh.angle);
    this.mesh.position.z = this.mesh.orbit * Math.sin(this.mesh.angle)
    //zeroMesh.position.set(x,y,z)
    //this.mesh.mesh.rotateX(Math.PI / 300)
    this.mesh.rotateY(Math.PI / 300)
    this.mesh.rotateZ(Math.PI / 600)
    }
}
export default MeshMover