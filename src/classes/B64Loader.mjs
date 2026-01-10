// Importer le fichier JSON
import { MirroredRepeatWrapping } from 'three';
import { textures } from '../components/textures_base64.mjs';
import { sounds } from '../components/sounds_base64.mjs';
import { TextureLoader, AudioLoader } from 'three';

class B64Loader {
    static b64 = true

    b64loadJpg(src) {
        console.log("b64 ", B64Loader.b64, "loading texture ", src)
        const textureLoader = new TextureLoader();
        let texture = null
        if (B64Loader.b64) {
            texture = textureLoader.load(textures[src]);
            return (texture)
        } else {
            texture = textureLoader.load('textures/' + src)
        }
        //texture.wrapS=MirroredRepeatWrapping
        //texture.wrapT=MirroredRepeatWrapping
        let rc = "Loaded"
        if (texture.source.data == null) {
            rc = "Not loaded"
        }
        console.log("b64 ", B64Loader.b64, "texture ", src, " has data ", texture.source)
        return (texture)
    }

    b64loadSound(src,sound) {
        console.log("b64 ", B64Loader.b64, "loading sound ", src)
        console.log("sounds ", sounds)
        const loader = new AudioLoader();
        let mp3 = null
        if (B64Loader.b64) {
            loader.load(sounds[src], (buffer) => {
                console.log("buffer ", buffer)
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setVolume(1);
                sound.play(0);
                //sound.loopStart = this.musicPosition;
                //mp3 = buffer
                //return (mp3)
            });
            //console.log("loaded mp3 ", mp3)
            //return (mp3)
        } else {
            mp3 = loader.load('sounds/' + src, (buffer) => mp3 = buffer)
            return (mp3)
        }
    }
    //const material = new THREE.MeshBasicMaterial({ map: texture });
}

export { B64Loader }
