/*
import {
    PlaneGeometry,
    Mesh,
    MeshBasicMaterial,
    TextureLoader,
    TextureUtils,
} from 'three';
 */
import { B64Loader } from '../classes/B64Loader.mjs';

function createPlaneBackground(img,w,h, z) {
    console.log("createPlaneBackground() generating sceneBackground")
    //const textureLoader = new TextureLoader();
    //const texture = textureLoader.load('textures/' + img)
    const texture = new B64Loader().b64loadJpg(img)
    //const backgroundGeometry = new PlaneGeometry(2*w, 2*h);
    //const backgroundMaterial = new MeshBasicMaterial({ map: texture, transparent:false,opacity:0});
    //const backgroundMesh = new Mesh(backgroundGeometry, backgroundMaterial);
    //backgroundMesh.position.z = z; // Placez-le derrière les autres objets
    //return (backgroundMesh);
    return (texture)
}

export { createPlaneBackground };
