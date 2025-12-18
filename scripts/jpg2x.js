const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Vérifier les arguments de la ligne de commande
if (process.argv.length < 3) {
  console.error('Usage: node generateDoubleWidthImageWithBorders.js <chemin/vers/image.jpg>');
  process.exit(1);
}

const inputImagePath = process.argv[2];

// Vérifier si le fichier image existe
if (!fs.existsSync(inputImagePath)) {
  console.error(`Le fichier ${inputImagePath} n'existe pas.`);
  process.exit(1);
}

// Lire les informations du fichier d'entrée
const inputImageDir = path.dirname(inputImagePath);
const inputImageName = path.basename(inputImagePath, '.jpg');
const outputImagePath = path.join(inputImageDir, `${inputImageName}2x.jpg`);

// Charger l'image d'entrée
sharp(inputImagePath)
  .metadata()
  .then(metadata => {
    const { width, height } = metadata;
    const borderHeight = Math.floor(height / 6); // 1/6 de la hauteur pour les bandes noires
    const newHeight = height + 2 * borderHeight; // Nouvelle hauteur avec les bandes noires

    // Créer une nouvelle image avec deux fois la largeur et les bandes noires
    return sharp({
      create: {
        width: width * 2,
        height: newHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 } // Fond noir
      }
    })
    .composite([
      { input: inputImagePath, left: 0, top: borderHeight }, // Première copie de l'image
      { input: inputImagePath, left: width, top: borderHeight } // Deuxième copie de l'image
    ])
    .toFile(outputImagePath)
    .then(() => {
      console.log(`L'image ${outputImagePath} a été générée avec succès.`);
    })
    .catch(err => {
      console.error('Erreur lors de la génération de l\'image:', err);
    });
  })
  .catch(err => {
    console.error('Erreur lors de la lecture des métadonnées de l\'image:', err);
  });
