import {
    AdditiveBlending,
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

class ParticlesMesh extends Mesh {

    constructor(originRadius, particleCount) {
        super()
        this.originRadius = originRadius;
        this.particleCount = particleCount;
        this.init()
    }
    //------------------------------------------------------------------
    hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return { r, g, b };
    }

    //--------- 
    getRandomColor() {
        const h = Math.random(); // Teinte aléatoire entre 0 et 1
        const s = 0.7 + Math.random() * 0.3; // Saturation élevée pour des couleurs vives
        const l = 0.5 + Math.random() * 0.2; // Luminosité moyenne
        const { r, g, b } = this.hslToRgb(h, s, l);
        return { r, g, b };
    }

    //--------- 
    initParticleColor(colors, i) {
        const { r, g, b } = this.getRandomColor();
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
    }

    //--------- 
    initParticlePosition(positions, i) {
        const angle = Math.random() * Math.PI * 2;
        positions[i * 3] = this.originRadius * Math.cos(angle);  // x
        positions[i * 3 + 1] = this.originRadius * Math.sin(angle);  // y
        positions[i * 3 + 2] = 0;  // z (plan 2D)
    }
    //--------- 
    initParticleDirection(directions, i) {
        // Nouvelle direction aléatoire
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        directions[i * 3] = Math.sin(phi) * Math.cos(theta);
        directions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
        directions[i * 3 + 2] = Math.cos(phi);
    }

    //--------- 
    initParticleSpeed(speeds, i) {
        speeds[i] = 0.1 + Math.random() * 0.05;
    }


    init() {
        console.log("particles.init()")
        const particles = new BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const speeds = new Float32Array(this.particleCount);
        const directions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        // Initialisation des particules au centre
        for (let i = 0; i < this.particleCount; i++) {
            this.initParticlePosition(positions, i)
            this.initParticleSpeed(speeds, i)
            this.initParticleDirection(directions, i)
            this.initParticleColor(colors, i)
        }

        particles.setAttribute('position', new BufferAttribute(positions, 3));
        particles.setAttribute('speed', new BufferAttribute(speeds, 1));
        particles.setAttribute('direction', new BufferAttribute(directions, 3));
        particles.setAttribute('color', new BufferAttribute(colors, 3));

        // Matériau des particules
        const particleMaterial = new PointsMaterial({
            //color: 0xff00ff,
            size: 0.1,
            vertexColors: true, // Active les couleurs par sommet
            transparent: true,
            opacity: 0.8,
            blending: AdditiveBlending,
        });

        // Création du système de particules
        const particleSystem = new Points(particles, particleMaterial);
        this.loops = 0
        this.add(particleSystem)
    }


    move() {
        // Animation loop
        //console.log("particles.move()")
        let currentColor = { r: 1, g: 0, b: 1 }; // Couleur initiale

        this.loops += 1

        const colors = this.geometry.attributes.color.array;
        const positions = this.geometry.attributes.position.array;
        const speeds = this.geometry.attributes.speed.array;
        const directions = this.geometry.attributes.direction.array;

        for (let i = 0; i < this.particleCount; i++) {
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

            if (this.loops > 100) {
                // Générer une couleur aléatoire uniforme
                const { r, g, b } = this.getRandomColor();
                currentColor = {
                    r: r,
                    g: g,
                    b: b
                };
                this.loops = 0;
            }
            if (distanceToCenter > 20) {  // Seuil de distance pour réinitialiser
                colors[i * 3] = currentColor.r    // R
                colors[i * 3 + 1] = currentColor.g; // G
                colors[i * 3 + 2] = currentColor.b; // B
                this.initParticlePosition(positions, i)
                this.initParticleSpeed(speeds, i)
                this.initParticleDirection(directions, i)
            }
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;

    }

}

export default ParticlesMesh