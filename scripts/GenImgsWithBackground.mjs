import { glob } from 'glob';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

//--------------------------------------------------------------------------------------------------
async function processImages(imagesPath, backgroundsPath) {
  console.log(imagesPath, backgroundsPath)
  try {
    const imgs=await glob(imagesPath)
    const bgrounds = await glob(backgroundsPath)
    for (const l of imgs.filter(file => !file.endsWith('x.jpg'))) {
      for (const b of bgrounds.filter(file => !file.endsWith('x.jpg'))) {
        const command = `node ./jpg2x.mjs ${imagesDir}/${path.basename(l)} ${backgroundsDir}/${path.basename(b)}`;
        console.log(command);
        // Si vous voulez exécuter la commande, décommentez la ligne suivante
        // await execAsync(command);
      }
    }
  } catch (err) {
    console.error('Erreur:', err);
  }
}

//--------------------------------------------------------------------------------------------------
// Convertir `exec` en une fonction promesse
const execAsync = promisify(exec);

// Récupérer les arguments de la ligne de commande
const [imagesDir, backgroundsDir] = process.argv.slice(2);
if (!imagesDir || !backgroundsDir) {
  console.error('Usage: node script.js <imagesDir> <backgroundsDir>');
  process.exit(1);
}

const imagesPath = `../textures/${imagesDir}/*.jpg`
const backgroundsPath = `../textures/${backgroundsDir}/*.jpg`
processImages(imagesPath, backgroundsPath);

