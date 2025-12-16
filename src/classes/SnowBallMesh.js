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
  Texture,
  TextureLoader,
  TextureUtils,
  SphereGeometry,
} from 'three';
import { B64Loader } from './B64Loader.js';

class SnowBallMesh extends Mesh {

  constructor(zTexture, snowGlobeRadius, flakeCount) {
    super()
    this.snowGlobeRadius = snowGlobeRadius;
    this.flakeCount = flakeCount;

    // Création de la boule à neige (sphère transparente)
    const snowGlobeGeometry = new SphereGeometry(this.snowGlobeRadius, 32, 32)
    //,0,Math.PI*2,Math.PI*2/4,Math.PI*2/4);
    this.snowGlobeMaterial = new MeshPhongMaterial({
      color: 0x77b5fe,
      transparent: true,
      opacity: 0.2,
      side: DoubleSide,
      wireframe: false
    });

    // Création sphère intérieure
    //const textureLoader = new TextureLoader()
    const snowGlobeGeometryIn = new SphereGeometry(this.snowGlobeRadius * 0.99, 32, 32);
    //const texture = new TextureLoader().load('textures/' + zTexture)
    const texture=new B64Loader().b64load(zTexture)
    //texture.image=zTexture
    TextureUtils.contain(texture, 1)
    const snowGlobeMaterialIn = new MeshPhongMaterial({
      map: texture,
      transparent: false,
      opacity: 1,
      side: DoubleSide,
    });

    const snowGlobe = new Mesh(snowGlobeGeometry, this.snowGlobeMaterial);
    this.snowGlobeIn = new Mesh(snowGlobeGeometryIn, snowGlobeMaterialIn);

    // Création des flocons de neige
    this.initFlakes()
    snowGlobe.add(this.flakes);
    snowGlobe.add(this.snowGlobeIn)
    this.add(snowGlobe)
  }

  //-------------------------------------------------------------------------
  setWireframe(bool) {
    this.snowGlobeMaterial.wireframe=bool
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
      this.initFlakePosition(i)

      // Vitesse de chute aléatoire
      this.flakeSpeeds[i] = 0.1 + Math.random() * 0.03;
      this.flakeSwaySpeedsX[i] = (Math.random() - 0.5) * 0.3;
      this.flakeSwaySpeedsZ[i] = (Math.random() - 0.5) * 0.1;
    }
    const flakeGeometry = new BufferGeometry();
    const flakeMaterial = new PointsMaterial({
      color: 0xffffff,
      size: 2,
      transparent: false,
      opacity: 0.8,
      depthTest: false,
      depthWrite: true,
    });

    flakeGeometry.setAttribute('position', new BufferAttribute(this.flakePositions, 3));
    this.flakes = new Points(flakeGeometry, flakeMaterial);
  }
  //----------------------------------------------------------
  initFlakePosition(idx) {
    const radius = this.snowGlobeRadius * 0.97;
    const angles = this.getInitialFlakeAnglesCoordinates()
    const pos = this.getFlakeXYZ(radius, angles.theta, angles.phi)
    this.flakePositions[idx * 3] = pos.x
    this.flakePositions[idx * 3 + 1] = pos.y
    this.flakePositions[idx * 3 + 2] = pos.z
    //console.log('x',pos.x,'y',pos.y,'z',pos.z)
  }

  //----------------------------------------------------------
  getInitialFlakeAnglesCoordinates() {
    let pi = Math.PI
    return ({
      'theta': Math.random() *pi/2,
      'phi': Math.random() * pi * 2,
      'xphi': 0.5* pi,
    });
  }

  //----------------------------------------------------------------------------------------------
  getFlakeXYZ(radius, theta, phi) {
    let x = radius * Math.sin(theta) * Math.cos(phi);
    let y = radius * Math.sin(theta) * Math.sin(phi);
    let z = radius * Math.cos(theta);
    //console.log('radius',radius,'theta',theta.toFixed(2),'phi',phi.toFixed(2),'x',x.toFixed(2),'y',y.toFixed(2),'z',z.toFixed(2))
    return ({ 'x': x, 'y': y, 'z': z })
  }
  //----------------------------------------------------------------------------------------------
  // Fonction pour vérifier si un point est à l'intérieur de la boule
  isInsideSphere(x, y, z, radius) {
    return (x * x + y * y + z * z) <= (radius * radius);
  }

  //---------------------------------------------------------------------------------
  initPosition({ x = 0, y = 0, z = 0, orbit = 0, angle = 0 }) {
    this.orbit0 = orbit
    this.orbit = orbit
    this.angle = angle;
    this.x0 = x
    this.y0 = y
    this.z0 = z
    //this.move()
  }

  //--------------------------------------------------------------------------------
  move() {
    this.angle += 0.01
    if (this.orbit > 4) {
      this.orbit = this.orbit0
    }
    this.position.x = this.orbit * Math.cos(this.angle);
    this.position.z = this.orbit * Math.sin(this.angle)
    this.position.x = this.x0
    this.position.y = this.y0
    this.position.z = this.z0

    //this.rotateY(Math.PI / 3000)
    //this.rotateZ(Math.PI / 6000)

    // Faire tourner la boule à neige lentement
    this.snowGlobeIn.rotation.y += 0.001;

    // Animer les flocons de neige
    const positions = this.flakes.geometry.attributes.position.array;
    for (let i = 0; i < this.flakeCount; i++) {
      const index = i * 3;
      //console.log(i,positions[index + 1])
      // Balancement latéral
      positions[index] += this.flakeSwaySpeedsX[i];
      // Faire tomber le flocon
      positions[index + 1] -= this.flakeSpeeds[i];
      positions[index + 2] += this.flakeSwaySpeedsZ[i];

      // Vérifier si le flocon est sorti de la boule
      if ( !this.isInsideSphere(positions[index], positions[index + 1], positions[index + 2], this.snowGlobeRadius * 0.97)) {
        // Replacer le flocon à une position aléatoire à l'intérieur de la boule
        //console.log("Flake ",i," out")
        this.initFlakePosition(i)
      } else {
        // Find how to calculate new x for flake. Must follow snowGlobe.x
        // this.flakePositions[i * 3 + 1] += 0.0002 
      }
    }
    // Indiquer que les positions des flocons ont été mises à jour
    this.flakes.geometry.attributes.position.needsUpdate = true;
  }
}
export default SnowBallMesh