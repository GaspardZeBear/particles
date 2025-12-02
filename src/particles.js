import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

//------------------------------------------------------------------
    function hslToRgb(h, s, l) {
      let r, g, b;

      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }

      return { r, g, b };
    }

//------------------------------------------------------------------

    // Générer une couleur aléatoire en HSL et la convertir en RGB
    function getRandomColor() {
      const h = Math.random(); // Teinte aléatoire entre 0 et 1
      const s = 0.7 + Math.random() * 0.3; // Saturation élevée pour des couleurs vives
      const l = 0.5 + Math.random() * 0.2; // Luminosité moyenne
      const { r, g, b } = hslToRgb(h, s, l);
      return { r, g, b };
    }


const w=window.innerWidth;
const h=window.innerHeight;
const renderer=new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w,h);
document.body.appendChild(renderer.domElement);

const fov=50;
const aspect = w/h;
const near=0.1;
const far=10000;
const camera=new THREE.PerspectiveCamera(fov, aspect, near, far );
camera.position.x=10;
camera.position.y=0;
camera.position.z=20;
const scene=new THREE.Scene();
scene.background = new THREE.Color('black');

// Création des particules
const particleCount = 1000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const speeds = new Float32Array(particleCount);
const directions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

// Initialisation des particules au centre
for (let i = 0; i < particleCount; i++) {
      // Rayon du cercle
      const radius = 10;

      // Angle aléatoire pour positionner la particule sur le cercle
      const angle = Math.random() * Math.PI * 2;

      // Position initiale sur le cercle
      positions[i * 3] = radius * Math.cos(angle);  // x
      positions[i * 3 + 1] = radius * Math.sin(angle);  // y
      positions[i * 3 + 2] = 0;  // z (plan 2D)

  // Vitesse aléatoire
  speeds[i] = 0.1 + Math.random() * 0.05;

  // Direction aléatoire vers l'extérieur
  const theta = Math.random() * Math.PI * 2;  // Angle aléatoire
  const phi = Math.random() * Math.PI;        // Angle aléatoire
  directions[i * 3] = Math.sin(phi) * Math.cos(theta);  // x
  directions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);  // y
  directions[i * 3 + 2] = Math.cos(phi);  // z

  const { r, g, b } = getRandomColor();
  colors[i * 3] = r;
  colors[i * 3 + 1] = g;
  colors[i * 3 + 2] = b;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particles.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
particles.setAttribute('direction', new THREE.BufferAttribute(directions, 3));
particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Matériau des particules
const particleMaterial = new THREE.PointsMaterial({
  //color: 0xff00ff,
  size: 0.1,
  vertexColors: true, // Active les couleurs par sommet
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
});

// Création du système de particules
const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Ajout d'OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Active l'amortissement pour un mouvement fluide
controls.dampingFactor = 0.05;


// Animation loop
let loops=0;
let currentColor = { r: 1, g: 0, b: 1 }; // Couleur initiale

function zanimate(t) {
    requestAnimationFrame(zanimate);
    loops += 1
    controls.update();
    const colors=particleSystem.geometry.attributes.color.array;
    const positions = particleSystem.geometry.attributes.position.array;
    const speeds = particleSystem.geometry.attributes.speed.array;
    const directions = particleSystem.geometry.attributes.direction.array;
    
    for (let i = 0; i < particleCount; i++) {
    // Déplacer la particule vers l'extérieur
      positions[i * 3] += directions[i * 3] * speeds[i];
      positions[i * 3 + 1] += directions[i * 3 + 1] * speeds[i];
      positions[i * 3 + 2] += directions[i * 3 + 2] * speeds[i];

    // Réinitialiser la particule si elle est trop éloignée
      const distanceToCenter = Math.sqrt(
        positions[i * 3] ** 2 +
        positions[i * 3 + 1] ** 2 +
        positions[i * 3 + 2] ** 2
      );
      //console.log("distance  " + i + " " + distanceToCenter)
            
      if ( loops > 100 ) {
        // Générer une couleur aléatoire uniforme
        const { r, g, b } = getRandomColor();
        currentColor = {
         r: r,
         g: g,
         b: b
        } ;
        loops = 0;
        //console.log("Changing global color to: ", currentColor);
      }
      //console.log("color ", currentColor)
      if (distanceToCenter > 20) {  // Seuil de distance pour réinitialiser
        colors[i * 3] =  currentColor.r    // R
        colors[i * 3 + 1] = currentColor.g ; // G
        colors[i * 3 + 2] = currentColor.b; // B
          // Réinitialiser la position sur le cercle
          const radius = 0.3;
          const angle = Math.random() * Math.PI * 2;
          positions[i * 3] = radius * Math.cos(angle);  // x
          positions[i * 3 + 1] = radius * Math.sin(angle);  // y
          positions[i * 3 + 2] = 5;  // z (plan 2D)]]

      // Nouvelle direction aléatoire
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        directions[i * 3] = Math.sin(phi) * Math.cos(theta);
        directions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
        directions[i * 3 + 2] = Math.cos(phi);
      }
  }
  
  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.color.needsUpdate = true;
  renderer.render(scene,camera)
}

zanimate()

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});