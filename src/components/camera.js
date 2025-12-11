import { PerspectiveCamera } from 'three';

function createCamera({fov=75,ratio=1.5,near=10,far=1000,x=0,y=0,z=20}) {
//function createCamera() {
  const camera = new PerspectiveCamera(
    fov, // fov = Field Of View
    ratio, // aspect ratio (dummy value)
    near, // near clipping plane
    far, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(x,y,z);

  return camera;
}

export { createCamera };