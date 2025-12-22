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
      //.filter(file => !file.endsWith('2x.jpg'))
      resolve(jpgFiles);
    });
  });
}

//----------------------------------------
function generate2x(imagesDir, inputFile) {
  const inputImagePath = path.join(imagesDir, inputFile)
  console.log(inputImagePath)
  const outputImagePath = path.join(imagesDir, inputFile.replace('.jpg', '2x.jpg'))
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
          background: { r: background.r, g: background.g, b: background.b, alpha: 1 } // Fond noir
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

//----------------------------------------
function generate3x(imagesDir, inputFile, background) {
  const inputImagePath = path.join(imagesDir, inputFile)
  const outputImagePathNormalized = 'tmp.jpg'
  console.log('inputImageFile', inputImagePath)
  let colors=`_${background.r}_${background.g}_${background.b}_`
  const outputImagePath = path.join(imagesDir, inputFile.replace('.jpg', colors+'3x.jpg'))
  console.log('outputImagePath', outputImagePath)
  console.log('outputImagePathNormalized', outputImagePathNormalized)

  let imgBuffer = null
  const imgWidth = 256
  const width = 1024
  const height = 512
  const borderHeight = 128;
  const filer = 64; // Nouvelle hauteur avec les bandes noires
  const image = sharp(inputImagePath)
    .resize(imgWidth)
    .toBuffer()
    .then((resizedImageBuffer) => {
      return sharp({
        create: {
          width: width,
          height: height,
          channels: 4,
          background: { r: background.r, g: background.g, b: background.b, alpha: 1 } // Fond noir
        }
      })
      .composite([
          { input: resizedImageBuffer, left: filer / 2, top: borderHeight }, // Première copie de l'image
          { input: resizedImageBuffer, left: imgWidth + 1.5 * filer, top: borderHeight },
          { input: resizedImageBuffer, left: imgWidth * 2 + 3 * filer, top: borderHeight } // Deuxième copie de l'image
      ])
      .toFile(outputImagePath)
      .then(() => {
        console.log(`L'image ${outputImagePath} a été générée avec succès.`);
      })
      .catch((err) => {
        console.error('Erreur lors de la génération de l\'image:', err);
      });
   })
   .catch ((err) => {
     console.error('Erreur lors du redimensionnement de l\'image:', err);
  });
}

//---------------------------------------- Fonction principale
async function convertImagesTo2x(inputImagesDir, inputImageFile, background) {
  try {
    let files = []
    console.log("imagesDir", imagesDir)
    console.log("inputImagePath", inputImageFile)
    if (inputImageFile.length > 0) {
      console.log("file ", inputImageFile)
      files.push(inputImageFile);
    } else {
      files = await readJpgFiles(imagesDir).filter(file => !file.endsWith('2x.jpg'));
    }
    console.log("files", files)
    if (files.length === 0) {
      console.log('Aucun fichier .jpg trouvé dans le répertoire.');
      return;
    }
    console.log("files", files)
    for (const file of files) {
      //const filePath = path.join(imagesDir, file);
      console.log(file)
      generate2x(imagesDir, file, background);
      generate3x(imagesDir, file, background);

    }
  } catch (err) {
    console.log("Exception ", err)

  }
}

//======================================================================

let inputImageFile = ''
let rgb='255,0,0'
// Vérifier les arguments de la ligne de commande
if (process.argv.length > 2) {
  inputImageFile = process.argv[2];
}
if (process.argv.length > 3) {
  rgb = process.argv[3];
}

// Vérifier si le fichier image existe
if (inputImageFile.length > 0 && !fs.existsSync(path.join(imagesDir, `${inputImageFile}`))) {
  console.error(`Le fichier ${inputImageFile} n'existe pas.`);
  process.exit(1);
}

// Lire les informations du fichier d'entrée
//const inputImageDir = path.dirname(inputImagePath);
//const inputImageName = path.basename(inputImagePath, '.jpg');

let colors=rgb.split(',').map(Number)

// Exécuter le script
let background={r:colors[0],g:colors[1],b:colors[2]}
convertImagesTo2x(imagesDir, inputImageFile, background);
//convertImagesTo3x(imagesDir, inputImageFile);
