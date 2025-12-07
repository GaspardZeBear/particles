import { WebGLRenderer } from 'three';

function createRenderer() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);

  return renderer;
}

export { createRenderer };