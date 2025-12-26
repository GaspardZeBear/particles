import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { rgbShift } from 'three/examples/jsm/tsl/display/RGBShiftNode.js';

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
    console.log("Backroung file ", background)
    //return ('_' + path.basename(background,'.jpg') + '_')
    //return ('_' + path.name(background,'.jpg') + '_')
    let name = background.split(/[\\/]/).pop().replace(".jpg", "");
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
function generate2xRgb(imagesDir, inputFile) {
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
// Process RGB pattern
//--------------------------------------------
function generate3xRgb(imagesDir, inputFile, background) {
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
// Merge with background image
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
              { input: resizedImageBuffer, left: filler / 2, top: borderHeight },
              { input: resizedImageBuffer, left: imgWidth + 1.5 * filler, top: borderHeight },
              { input: resizedImageBuffer, left: imgWidth * 2 + 3 * filler, top: borderHeight }
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
    console.log("background", background)
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
        generate2xRgb(imagesDir, file, background.colors);
        generate3xRgb(imagesDir, file, background.colors);
      } else {
        generate3xBackground(imagesDir, file, background.background);
      }
    }
  } catch (err) {
    console.log("Exception ", err)
  }
}

//======================================================================
// Param1 : image file
// Param2 : merge : 
//   If param 2 contains commas, it is Red Green Blue pattern
//   -> generate 2x and 3x file
//   Else, it's a background image file
//   -> generate 3x file
//--------------------------------------------------------------------

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

// check if image file exists
if (inputImageFile.length > 0 && !fs.existsSync(path.join(imagesDir, `${inputImageFile}`))) {
  console.error(`Le fichier ${inputImageFile} n'existe pas.`);
  process.exit(1);
}

let colors = rgb.split(',').map(Number)

// check if backgroud image exists
if (!rgb.includes(',')) {
  backgroundImg = rgb
  let pieces=rgb.split(/[\\/]/)
  console.log("pieces",pieces)
  let file=path.join(...pieces)
  console.log("file",file)
  //if (rgb.length > 0 && !fs.existsSync(`${file}`)) {
  if (rgb.length > 0 && !fs.existsSync(path.join(imagesDir, file))) {
    console.error(`Le fichier ${file} n'existe pas.`);
    process.exit(1);
  }
}

let background = { background: backgroundImg, colors: { r: colors[0], g: colors[1], b: colors[2] } }
convertImagesToNx(imagesDir, inputImageFile, background);
