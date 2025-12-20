import { BasicParams } from "../params/BasicParams.mjs";
import ThingMesh from "../classes/ThingMesh.js";

function createBowls({ bowlsCount = 10, w = 400, h = 400, imgs = [], thingMeshRadius = 20, bowlsPerOrbit = 1, snowGlobeRadius = 50 }) {

  let meshes = []
  let radius = snowGlobeRadius
  let angle = 0
  const cameraZ=BasicParams.getProfile().constructor.cameraZ
  for (let i = 1; i < bowlsCount+1; i++) {
    radius += thingMeshRadius
    console.log(radius, )
    //if ( radius > BasicParams.getProfile()/10) {
    if ( radius > cameraZ *0.75 ) {
      console.log("Radius exceed cameraZ, stop bowls generation")
      break
      //radius = snowGlobeRadius
    }
    angle += Math.PI / bowlsCount
    let bowlSpeed = Math.random() * 0.03 + 0.001
    for (let b = 0; b < bowlsPerOrbit; b++) {
      let idx = Math.floor(Math.random() * imgs.length)
      let mesh = new ThingMesh(imgs[idx], thingMeshRadius)
      mesh.initPosition(radius, angle + b * 2 * Math.PI / bowlsPerOrbit, bowlSpeed)
      meshes.push(mesh)
    }
  }
  return (meshes)
}

export { createBowls };