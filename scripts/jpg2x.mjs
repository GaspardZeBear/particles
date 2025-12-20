import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const imagesDir = '../textures/';


//----------------------------------------
function readJpgFiles(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      //const jpgFiles = files.filter(file => path.extname(file).toLowerCase() === '.jpg').filter(file => );
      const jpgFiles = files
         .filter(file => path.extname(file).toLowerCase() === '.jpg')
         .filter(file => !file.endsWith('2x.jpg'))
      resolve(jpgFiles);
    });
  });
}

//----------------------------------------
function generate2x(imagesDir,inputFile) {
  const inputImagePath=path.join(imagesDir, inputFile)
  console.log(inputImagePath)
  const outputImagePath = path.join(imagesDir, inputFile.replace('.jpg','2x.jpg'))
  console.log(outputImagePath)
   
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
     
}

//---------------------------------------- Fonction principale
async function convertImagesTo2x(inputImagesDir,inputImageFile) {
  try {
    let files = null
    console.log("imagesDir", imagesDir)
    console.log("inputImagePath", inputImageFile)
    if (inputImageFile.length > 0) {
      files.push(inputImagePath);
    } else {
      files = await readJpgFiles(imagesDir);
    }
    console.log("files", files)
    if (files.length === 0) {
      console.log('Aucun fichier .jpg trouvé dans le répertoire.');
      return;
    }
   
    for (const file of files) {
      //const filePath = path.join(imagesDir, file);
      console.log(file)
      generate2x(imagesDir,file);

    }
  } catch {

  }
}

//======================================================================

let inputImageFile = ''
// Vérifier les arguments de la ligne de commande
if (process.argv.length > 2) {
  inputImageFile = process.argv[2];
}

// Vérifier si le fichier image existe
if (inputImageFile.length > 0 && !fs.existsSync(path.join(imagesDir, `${inputImageFile}`))) {
  console.error(`Le fichier ${inputImageFile} n'existe pas.`);
  process.exit(1);
}

// Lire les informations du fichier d'entrée
//const inputImageDir = path.dirname(inputImagePath);
//const inputImageName = path.basename(inputImagePath, '.jpg');


// Exécuter le script
convertImagesTo2x(imagesDir,inputImageFile);
