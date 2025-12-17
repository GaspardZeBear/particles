// Importer le fichier JSON
import { textures } from '../components/textures_base64.js';
import { TextureLoader } from 'three';

class B64Loader {
    static b64 = true
    b64load(src) {
        const textureLoader = new TextureLoader();
        if (B64Loader.b64) {
            const texture = textureLoader.load(textures[src]);
            return (texture)
        } else {
            const texture = new TextureLoader().load('textures/' + src)
            return (texture)
        }
        //const material = new THREE.MeshBasicMaterial({ map: texture });
    }
}

export { B64Loader }
