import ThingMesh from "../classes/ThingMesh.js";

function createBowls({ bowlsCount = 10, x = 0, y = 0, z = 0, w = 400, h = 400, imgs = [], thingMeshRadius = 20, bowlsPerOrbit = 1, snowGlobeRadius = 50 }) {

  let meshes = []
  let radius = snowGlobeRadius
  let angle = 0
  let sign = 1
  let x0 = x
  let y0 = y
  for (let i = 0; i < bowlsCount; i++) {
    sign *= -1
    x = i * thingMeshRadius * sign
    y = i * thingMeshRadius * sign
    z = i * thingMeshRadius * sign
    if (Math.abs(x) > 2 * w) x = x0
    if (Math.abs(y) > 2 * h) y = y0
    if (Math.abs(radius) > 400) radius = Math.random() * 200
    radius += thingMeshRadius
    angle += Math.PI / bowlsCount
    let bowlSpeed = Math.random() * 0.03 + 0.001
    for (let b = 0; b < bowlsPerOrbit; b++) {
      let idx = Math.floor(Math.random() * imgs.length)
      let mesh = new ThingMesh(imgs[idx], thingMeshRadius)
      mesh.initPosition(x, y, z, radius, angle + b * 2 * Math.PI / bowlsPerOrbit, bowlSpeed)
      meshes.push(mesh)
    }
  }
  return (meshes)
}

export { createBowls };