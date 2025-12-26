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
function getBackgroundAsString(background) {
  if (typeof background === "string") {
    //return ('_' + path.basename(background,'.jpg') + '_')
    //return ('_' + path.name(background,'.jpg') + '_')
    let name = background.split(/[\\/]/).pop().replace(".jpg","");
    //console.log("y",name)
    return ('_' + name + '_')
  };
  return (`_${background.r}_${background.g}_${background.b}_`)
}

//----------------------------------------
function getFilesPaths(imagesDir, inputFile, background, suffix) {
  const inputImagePath = path.join(imagesDir, inputFile)
  console.log(inputImagePath)
  const outputImagePath = path.join(imagesDir, inputFile.replace('.jpg', getBackgroundAsString(background) + suffix + '.jpg'))
  console.log(outputImagePath)
  return ({ inputImagePath: inputImagePath, outputImagePath: outputImagePath })
}

//----------------------------------------
function generate2x(imagesDir, inputFile) {
  const paths = getFilesPaths(imagesDir, inputFile, background, '2x')

  sharp(paths.inputImagePath)
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
          { input: paths.inputImagePath, left: 0, top: borderHeight }, // Première copie de l'image
          { input: paths.inputImagePath, left: width, top: borderHeight } // Deuxième copie de l'image
        ])
        .toFile(paths.outputImagePath)
        .then(() => {
          console.log(`L'image ${paths.outputImagePath} a été générée avec succès.`);
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
  const paths = getFilesPaths(imagesDir, inputFile, background, '3x')
  const imgWidth = 256
  const width = 1024
  const height = 512
  const borderHeight = 128;
  const filler = 64; // Nouvelle hauteur avec les bandes noires
  sharp(paths.inputImagePath)
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
          { input: resizedImageBuffer, left: filler / 2, top: borderHeight }, // Première copie de l'image
          { input: resizedImageBuffer, left: imgWidth + 1.5 * filler, top: borderHeight },
          { input: resizedImageBuffer, left: imgWidth * 2 + 3 * filler, top: borderHeight } // Deuxième copie de l'image
        ])
        .toFile(paths.outputImagePath)
        .then(() => {
          console.log(`Image ${paths.outputImagePath} generated.`);
        })
        .catch((err) => {
          console.error('Error generating ${outputImagePath} ', err);
        });
    })
    .catch((err) => {
      console.error('Error resizing ${inputImagePath}', err);
    });
}

//----------------------------------------
function generate3xBackground(imagesDir, inputFile, background) {
  const paths = getFilesPaths(imagesDir, inputFile, background, '3x')
  const backgroundImagePath = path.join(imagesDir, background)

  const imgWidth = 256
  const width = 1024
  const height = 512
  const borderHeight = 128;
  const filler = 64; 
  sharp(backgroundImagePath)
    .resize(width, height, {
      fit: 'fill' 
    })
    .toBuffer()
    .then((resizedBackgroundBuffer) => {
      // Redimensionner l'image principale à 256 pixels de largeur
      return sharp(paths.inputImagePath)
        .resize(imgWidth)
        .toBuffer()
        .then((resizedImageBuffer) => {
          // Superposer les trois copies de l'image principale sur l'arrière-plan
          return sharp(resizedBackgroundBuffer)
            .composite([
              {input: resizedImageBuffer,left: filler / 2,top: borderHeight},
              {input: resizedImageBuffer,left: imgWidth + 1.5 * filler,top: borderHeight},
              {input: resizedImageBuffer,left: imgWidth * 2 + 3 * filler,top: borderHeight}
            ])
            .toFile(paths.outputImagePath)
            .then(() => {
              console.log(`Image ${paths.outputImagePath} generated.`);
            });
        });
    })
    .catch((err) => {
      console.error('Error: ', err);
    })
}

//---------------------------------------- Fonction principale
async function convertImagesToNx(inputImagesDir, inputImageFile, background) {
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
      console.log('No .jpg file found.');
      return;
    }

    for (const file of files) {
      console.log(file)
      if (background.background.length === 0) {
        generate2x(imagesDir, file, background.colors);
        generate3x(imagesDir, file, background.colors);
      } else {
        generate3xBackground(imagesDir, file, background.background);
      }

    }
  } catch (err) {
    console.log("Exception ", err)
  }
}

//======================================================================
let inputImageFile = ''
let rgb = '255,0,0'
let backgroundImg = ''
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

let colors = rgb.split(',').map(Number)
if (!rgb.includes(',')) {
  backgroundImg = rgb
}

// Exécuter le script
let background = { background: backgroundImg, colors: { r: colors[0], g: colors[1], b: colors[2] } }
convertImagesToNx(imagesDir, inputImageFile, background);
//convertImagesTo3x(imagesDir, inputImageFile);
