const fs = require('fs');
const path = require('path');

// Répertoire contenant les images
const imagesDir = './textures/'; // Remplacez par le chemin de votre répertoire
// Fichier de sortie JSON
const outputFile = './textures/textures_base64.json'; // Fichier JSON où les images en base64 seront enregistrées

// Fonction pour lire les fichiers .jpg dans un répertoire
function readJpgFiles(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const jpgFiles = files.filter(file => path.extname(file).toLowerCase() === '.jpg');
      resolve(jpgFiles);
    });
  });
}

// Fonction pour convertir un fichier en base64
function fileToBase64(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const base64 = Buffer.from(data).toString('base64');
      resolve(base64);
    });
  });
}

// Fonction principale
async function convertImagesToBase64JSON() {
  try {
    const files = await readJpgFiles(imagesDir);
    if (files.length === 0) {
      console.log('Aucun fichier .jpg trouvé dans le répertoire.');
      return;
    }

    const result = {};
    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const base64 = await fileToBase64(filePath);
      result[file] = `data:image/jpeg;base64,${base64}`;
    }

    fs.writeFile(outputFile, JSON.stringify(result, null, 2), (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier de sortie:', err);
        return;
      }
      console.log(`Les images ont été converties en base64 et enregistrées dans ${outputFile}`);
    });
  } catch (err) {
    console.error('Une erreur est survenue:', err);
  }
}

// Exécuter le script
convertImagesToBase64JSON();
