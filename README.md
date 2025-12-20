# particles

Display particles flow

## Files 

### Structure
```
getting-started-with-three
- nodes_modules
index.html
- src
  particles.js
  vite.config.js (utile ????) 
jsconfig.json
package.json
package-lock.json (automatique)
```

### index.html
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Getting Started with Three.js</title>
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <script type="module" src="/src/particles.js"></script>
  </body>
</html>
```

### src/vite.config.json
```
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
```

### jsconfig.json
```
{
  "compilerOptions": {
    "checkJs": true,
    "module": "ESNext",
    "target": "ESNext",
    "paths": {
      "three": ["node_modules/three/src/Three"],
      "three/addons/*": ["node_modules/three/examples/jsm/*"]
    }
  },
  "include": ["src/**/*"]
}
```
### package.json
```
{
  "name": "threestars-project",
  "version": "1.0.0",
  "description": "",
  "type": "module",
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "three": "^0.132.2"
  },
  "devDependencies": {
    "@types/three": "^0.181.0",
    "vite": "^7.2.6"
  }
}
```


### src/particles.js
```
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const w=window.innerWidth;
const h=window.innerHeight;
.....
```



## Project setup

Install node.js sur windows1

```
npm init -y
npm install three@latest
npm install @types/three
npm install vite --save-dev
npm list @types/three
npm start --host
http://localhost:5173/index.html
```
Pb :
```
ls node_modules/three/examples/jsm/controls/OrbitControls.js
rm -rf .\node_modules\
rm -rf package-lock.json
npm install three@latest
```

## Embed images 

Note : images used for textures are data uris in a map called textures. Useful to run from explorer witout server

- drop jpg files in textures
- from scripts/ run : node jpg2b64.js
-- this will generate a js module components/textures_b64.js
- cleanup components/textures_b64.js (remove unwanted images)

## Deployment (new) 

npm run build
```
Create dist dir
- dist
  index.html
  basic.html
  ...
  - assets
    basic.js
```

To run without http server and avoid CORS problem, embed scripts in html
- run python scripts/ToStatic.py (only for basic )


Manually
- comment <script src=xxxx>
- insert <script>Copy the script file xxx.js</script>

```
Note : scripts/build.cjs produces random results, and final htm files often crashs.
Idem for manual.
Temporary fix : create from zero an html file 
 (echo "<html><body><script>" && cat ../dist/assets/js/basic.js && echo "</script></body></html>") > z.htm
 (WIP !!)
 ```


## Deployment (old) 

npm run build
```
Create dist dir
- dist
  index.html
  - assets
    index-CBwx6CF7.js
```

Can only be served by http server (not from file because CORS problem)

To create a big html file, quick and dirty, create build.cjs in dist :

```
const fs = require('fs');
const path = require('path');

// Lire les fichiers
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, 'assets\\index-CBwx6CF7.js'), 'utf8');

// Remplacer la balise script dans le HTML
const finalHtml = htmlContent.replace(
  '<script type="module" crossorigin src="/assets/index-CBwx6CF7.js"></script>',
  `<script>${jsContent}</script>`
);

// Écrire le fichier final
fs.writeFileSync(path.join(__dirname, '', 'index.html'), finalHtml, 'utf8');

console.log('Fichier HTML autonome créé dans dist/index.html');
```

Then run : node build.cjs


