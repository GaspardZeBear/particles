import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
base: './', // Permet de charger les fichiers localement
resolve: {
    alias: {
      // Alias pour Three.js
      three: resolve('./node_modules/three/src/Three.js'),
      // Alias pour OrbitControls
      'three/addons/controls/OrbitControls': resolve('./node_modules/three/examples/jsm/controls/OrbitControls.js'),
    },
  },
  build: {
    outDir: 'dist', // Dossier de sortie
    emptyOutDir: true, // Vide le dossier de sortie avant le build
    rollupOptions: {
      input: {
        // Point d'entrée : index.html à la racine
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});