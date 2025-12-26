// Importer le fichier JSON
import { MirroredRepeatWrapping } from 'three';
import { textures } from '../components/textures_base64.js';
import { TextureLoader } from 'three';

class B64Loader {
    static b64 = true
    b64load(src) {
        console.log("b64 ", B64Loader.b64 , "loading texture ", src )
        const textureLoader = new TextureLoader();
        let texture=null
        if (B64Loader.b64) {
            texture = textureLoader.load(textures[src]);
            return (texture)
        } else {
            texture = textureLoader.load('textures/' + src)
        }
        //texture.wrapS=MirroredRepeatWrapping
        //texture.wrapT=MirroredRepeatWrapping
        let rc="Loaded"
        if (texture.source.data == null) {
            rc="Not loaded"
        }
        console.log("b64 ", B64Loader.b64 , "texture ", src , " has data ", texture.source )
        return (texture)
        //const material = new THREE.MeshBasicMaterial({ map: texture });
    }
}

export { B64Loader }
