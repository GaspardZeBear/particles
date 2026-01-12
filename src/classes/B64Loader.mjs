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


    async b64loadSound(src, audioBuffer) {
        console.log("b64 ", B64Loader.b64, "loading sound ", src)
        //console.log("sound before load", sound)
        const loader = new AudioLoader();
        if (B64Loader.b64) {
            audioBuffer = await loader.loadAsync(sounds[src])
        } else {
            audioBuffer = await loader.loadAsync('sounds/' + src)
        }
        return(audioBuffer)
    }

    async xb64loadSound(src, audioBuffer) {
    console.log("b64 ", B64Loader.b64, "loading sound ", src)
    //console.log("sound before load", sound)
    const loader = new AudioLoader();
    if (B64Loader.b64) {
        loader.load(sounds[src], (buffer) => {
            console.log("loaded b64")
            audioBuffer = buffer;
        });
        return (audioBuffer)
        //console.log("loaded mp3 ", mp3)
        //return (mp3)
    } else {
        loader.load('sounds/' + src, (buffer) => {
            console.log("loaded mp3")
            audioBuffer = buffer;
        })

    }
}
}


export { B64Loader }
