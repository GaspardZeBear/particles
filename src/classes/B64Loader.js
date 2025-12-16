// Importer le fichier JSON
import { textures } from '../../textures/textures_base64.js';
import { TextureLoader } from 'three';

class B64Loader {
    // Utiliser une texture dans Three.js
    b64load(src) {
        
        //console.log("loading b64 " + src)
        //console.log(textures)
        const b64 = textures[src]
        //console.log(b64)
        const textureLoader = new TextureLoader();

        const texture = textureLoader.load(b64);
        //console.log("loading b64 " + src + " length " + b64.length + " width " + texture.width)
        return (texture)
        //const material = new THREE.MeshBasicMaterial({ map: texture });
    }
}

export { B64Loader }
