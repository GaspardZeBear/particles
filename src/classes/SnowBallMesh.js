import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Controls,
  DoubleSide,
  IcosahedronGeometry,
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  Points,
  PointsMaterial,
  TextureLoader,
  TextureUtils,
  SphereGeometry,
} from 'three';

class SnowBallMesh extends Mesh {

  constructor(zTexture,snowGlobeRadius,flakeCount) {
    super()
    this.snowGlobeRadius = snowGlobeRadius;
    this.flakeCount = flakeCount;
    
    // Création de la boule à neige (sphère transparente)
    const snowGlobeGeometry = new SphereGeometry(this.snowGlobeRadius, 32, 32);
    const snowGlobeMaterial = new MeshPhongMaterial({
      color: 0x77b5fe,
      transparent: true,
      opacity: 0.2,
      side: DoubleSide,
    });

    // Création sphère intérieure
    const textureLoader = new TextureLoader()
    const snowGlobeGeometryIn = new SphereGeometry(this.snowGlobeRadius * 0.99, 32, 32);
    const texture = new TextureLoader().load('textures/' + zTexture)
    TextureUtils.contain(texture, 1)
    const snowGlobeMaterialIn = new MeshPhongMaterial({
      map: texture,
      transparent: false,
      opacity: 1,
      side: DoubleSide,
    });

    const snowGlobe = new Mesh(snowGlobeGeometry, snowGlobeMaterial);
    this.snowGlobeIn = new Mesh(snowGlobeGeometryIn, snowGlobeMaterialIn);

    // Création des flocons de neige
    this.initFlakes()
    snowGlobe.add(this.flakes);
    snowGlobe.add(this.snowGlobeIn)
    this.add(snowGlobe)
  }

  //-------------------------------------------------------------------------
  initFlakes() {
    // Tableaux pour les positions et vitesses des flocons
    this.flakePositions = new Float32Array(this.flakeCount * 3);
    this.flakeSpeeds = new Float32Array(this.flakeCount);
    this.flakeSwaySpeedsX = new Float32Array(this.flakeCount);
    this.flakeSwaySpeedsZ = new Float32Array(this.flakeCount);

    // Initialisation des flocons
    for (let i = 0; i < this.flakeCount; i++) {
      // Position aléatoire à l'intérieur de la boule
      const radius = this.snowGlobeRadius * 0.97;
      const angles = this.getInitialFlakeCoordinates()
      const pos = this.getFlakeXYZ(radius, angles.theta, angles.phi)
      this.flakePositions[i * 3] = pos.x
      this.flakePositions[i * 3 + 1] = pos.y
      this.flakePositions[i * 3 + 2] = pos.z

      // Vitesse de chute aléatoire
      this.flakeSpeeds[i] = 0.01 + Math.random() * 0.03;
      this.flakeSwaySpeedsX[i] = (Math.random() - 0.5) * 0.01;
      this.flakeSwaySpeedsZ[i] = (Math.random() - 0.5) * 0.01;
    }
    const flakeGeometry = new BufferGeometry();
    const flakeMaterial = new PointsMaterial({
      color: 0xffffff,
      size: 0.2,
      transparent: false,
      opacity: 0.8,
      depthTest: false,
      depthWrite: true,
    });

    flakeGeometry.setAttribute('position', new BufferAttribute(this.flakePositions, 3));
    this.flakes = new Points(flakeGeometry, flakeMaterial);
  }

  //----------------------------------------------------------
  getInitialFlakeCoordinates() {
    let pi = Math.PI
    return ({
      'xtheta': Math.random() * Math.PI * 2,
      'theta': pi / 2,
      'phi': Math.random() * pi * 2,
      'xxphi': Math.PI / 8,
      'xphi': Math.acos(2 * Math.random() - 1)
    });
  }

  //----------------------------------------------------------------------------------------------
  getFlakeXYZ(radius, theta, phi) {
    let x = radius * Math.sin(theta) * Math.cos(phi);
    let y = radius * Math.sin(theta) * Math.sin(phi);
    let z = radius * Math.cos(theta);
    //console.log(radius,'theta',theta.toFixed(2),'phi',phi.toFixed(2),'x',x.toFixed(2),'y',y.toFixed(2),'z',z.toFixed(2))
    return ({ 'x': x, 'y': y, 'z': z })
  }
  //----------------------------------------------------------------------------------------------
  // Fonction pour vérifier si un point est à l'intérieur de la boule
  isInsideSphere(x, y, z, radius) {
    return (x * x + y * y + z * z) <= (radius * radius);
  }

  //---------------------------------------------------------------------------------
  initPosition(x, y, z, orbit, angle) {
    this.orbit0 = orbit
    this.orbit = orbit
    this.angle = angle;
    this.x0 = x
    this.y0 = y
    this.z0 = z
    this.move()
    //this.mesh.position.x = orbit * Math.cos(angle);
    //this.mesh.position.y = y
    //this.mesh.position.z = orbit * Math.sin(angle);
  }

  //--------------------------------------------------------------------------------
  move() {
    this.angle += 0.01
    //zeroMesh.position.x += 0.01
    //this.orbit -= 0.01
    if (this.orbit > 4) {
      this.orbit = this.orbit0
    }
    this.position.x = this.orbit * Math.cos(this.angle);
    this.position.y = this.y0
    //this.position.y = this.orbit * Math.cos(this.angle) *Math.sin(this.angle);
    this.position.z = this.orbit * Math.sin(this.angle)
    //zeroMesh.position.set(x,y,z)
    //this.mesh.rotateX(Math.PI / 300)
    this.rotateY(Math.PI / 300)
    this.rotateZ(Math.PI / 600)

    // Faire tourner la boule à neige lentement
    this.snowGlobeIn.rotation.y += 0.002;

    // Animer les flocons de neige
    const positions = this.flakes.geometry.attributes.position.array;
    for (let i = 0; i < this.flakeCount; i++) {
      // Index dans le tableau des positions

      const index = i * 3;
      //console.log(i,positions[index + 1])
      // Faire tomber le flocon
      positions[index + 1] -= this.flakeSpeeds[i];

      // Balancement latéral
      positions[index] += this.flakeSwaySpeedsX[i];
      positions[index + 2] += this.flakeSwaySpeedsZ[i];

      // Vérifier si le flocon est sorti de la boule
      if (!this.isInsideSphere(positions[index], positions[index + 1], positions[index + 2], this.snowGlobeRadius * 1)) {
        // Replacer le flocon à une position aléatoire à l'intérieur de la boule
        console.log("Flake out")
        const radius = this.snowGlobeRadius * 1;
        const angles = this.getInitialFlakeCoordinates()
        const pos = this.getFlakeXYZ(radius, angles.theta, angles.phi)
        this.flakePositions[i * 3] = pos.x
        this.flakePositions[i * 3 + 1] = pos.y
        this.flakePositions[i * 3 + 2] = pos.z
      }
    }
    // Indiquer que les positions des flocons ont été mises à jour
    this.flakes.geometry.attributes.position.needsUpdate = true;
  }
}
export default SnowBallMesh