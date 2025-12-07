import { PerspectiveCamera } from 'three';

function createCamera() {
  const camera = new PerspectiveCamera(
    75, // fov = Field Of View
    1.5, // aspect ratio (dummy value)
    10, // near clipping plane
    1000, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(0, 0, 10);

  return camera;
}

export { createCamera };