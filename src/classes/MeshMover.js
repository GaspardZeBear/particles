class MeshMover {

  constructor(mesh) {
    this.mesh = mesh
  }

    //----------------------------------------------------------
  getInitialAnglesCoordinates() {
    let pi = Math.PI
    return ({
      'theta': Math.random() * pi / 2,
      'phi': Math.random() * pi * 2,
    });
  }

  //----------------------------------------------------------------------------------------------
  getXYZ(radius, theta, phi) {
    let x = radius * Math.sin(theta) * Math.cos(phi);
    let y = radius * Math.sin(theta) * Math.sin(phi);
    let z = radius * Math.cos(theta);
    //console.log('radius',radius,'theta',theta.toFixed(2),'phi',phi.toFixed(2),'x',x.toFixed(2),'y',y.toFixed(2),'z',z.toFixed(2))
    return ({ 'x': x, 'y': y, 'z': z })
  }

  initPosition(orbit, angle, angularSpeed) {
    this.orbit = orbit
    this.angle = angle;
    this.angularSpeed = angularSpeed
    const angles =this.getInitialAnglesCoordinates()
    this.theta=angle
    this.phi=angles.phi
    this.move()
  }

  move() {
    const pos = this.getXYZ(this.orbit, this.theta, this.phi)
    this.theta += this.angularSpeed / 8
    this.phi += this.angularSpeed / 8
    this.mesh.position.x = pos.x
    this.mesh.position.y = pos.y
    this.mesh.position.z = pos.z
    this.mesh.rotateY(Math.PI / 300)
    this.mesh.rotateZ(Math.PI / 600)
  }


XinitPosition(x, y, z, orbit, angle, angularSpeed) {
    this.mesh.orbit0 = orbit
    this.mesh.orbit = orbit
    //if (this.mesh.orbit > 4 ) {
    //  this.mesh.orbit=this.mesh.orbit0
    //}
    this.mesh.angle = angle;
    this.mesh.angularSpeed = angularSpeed
    this.mesh.x0 = x
    this.mesh.y0 = y
    this.mesh.z0 = z
    this.mesh.move()

    //this.mesh.mesh.position.x = orbit * Math.cos(angle);
    //this.mesh.mesh.position.y = y
    //this.mesh.mesh.position.z = orbit * Math.sin(angle);
  }


  Xmove() {
    this.mesh.angle += this.mesh.angularSpeed / 8
    if (this.mesh.orbit > 4) {
      this.mesh.orbit = this.mesh.orbit0
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