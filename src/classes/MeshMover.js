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
    //this.theta=0
    this.phi=angles.phi
    this.move()
  }

  move() {
    //console.log("speedFactor theta", this.mesh.bowlsSpeedFactorTheta)
    //console.log("speedFactor phi", this.mesh.bowlsSpeedFactorPhi)
    const pos = this.getXYZ(this.orbit, this.theta, this.phi)
    //this.theta += this.angularSpeed / (5+2*Math.cos(this.phi))
    //this.phi += this.angularSpeed / (6+2*Math.cos(this.phi))
    this.theta += this.angularSpeed / this.mesh.bowlsSpeedFactorTheta
    this.phi += this.angularSpeed / this.mesh.bowlsSpeedFactorPhi
    this.mesh.position.x = pos.x
    this.mesh.position.y = pos.y
    this.mesh.position.z = pos.z
    this.mesh.rotateX(Math.random() * Math.PI / 600)
    this.mesh.rotateY(Math.random() * Math.PI / 600)
    this.mesh.rotateZ(Math.random() * Math.PI / 600)
  }



}
export default MeshMover