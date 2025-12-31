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
  console.log("getFilesPaths() background"  , background, " suffix ",suffix)
  const inputImagePath = path.join(imagesDir, inputFile)
  console.log("getFilesPaths() inputImagePath" , inputImagePath)
  const outputImagePath = path.join(imagesDir, inputFile.replace('.jpg', getBackgroundAsString(background) + suffix + '.jpg'))
  console.log("getFilesPaths() ouputImagePath",outputImagePath)
  return ({ inputImagePath: inputImagePath, outputImagePath: outputImagePath })
}

//----------------------------------------
// Process RGB pattern
//--------------------------------------------
async function generateBackgroundRgb(imagesDir, background) {
  const paths = getFilesPaths(imagesDir, '$background.jpg', background, 'x')
  console.log("generateBackgroundRgb() generate fake background path ",paths)
  const width = 1024
  const height = 512
  let created= await sharp({
    create: {
      width: width,
      height: height,
      channels: 4,
      background: { r: background.r, g: background.g, b: background.b, alpha: 1 } // Fond noir
    }
  })
    .toFile(paths.outputImagePath)
    .then(() => {
      console.log(`generateBackgroundRgb() Image ${paths.outputImagePath} generated.`);
      console.log("generateBackgroundRgb() return in then ",paths.outputImagePath);
      //return(paths.outputImagePath)
    })
    .catch((err) => {
      console.error(`generateBackgroundRgb()  Error generating ${paths.outputImagePath} `, err);
    });
  console.log("generateBackgroundRgb() return",paths.outputImagePath);
  return(paths.outputImagePath)
}

//----------------------------------------
// Merge with background image
//----------------------------------------
async function generateNxBackground(imagesDir, inputFile, backgroundImg, lines, cols) {
  console.log("generateNxBackground() enter  backgroundImg ", backgroundImg)
  const paths = getFilesPaths(imagesDir, inputFile, backgroundImg, lines + '_' + cols + 'x')
  const backgroundImagePath = path.join(imagesDir, backgroundImg)

  const width = 1024
  const imgWidth = Math.round(width / (cols + 1))
  const height = 512
  //const borderHeight = Math.round(height/(count+1))

  const vfiller = Math.round(imgWidth / cols);
  let meta = {}
  await sharp(paths.inputImagePath)
    .metadata()
    .then((metadata) => { meta = metadata })

  //console.log(meta)
  const ratio = meta.width / meta.height
  if (ratio > 1.5 || ratio < 0.5)
    console.log(`generateNxBackground() bad image with/height ratio ${ratio}, unpredictable results `)

  const imgHeight = Math.round(ratio * imgWidth)

  //const borderHeight = Math.round((height-imgHeight)/2)
  //const borderHeight = 256
  const hfiller = Math.round((height - (lines * imgHeight)) / lines)
  //console.log(" lines ", lines, " cols ", cols)
  //console.log("imgWidth ", imgWidth, "imgHeight ", imgHeight)
  //console.log(" vfiller ", vfiller, " hfiller ", hfiller)

  let composites = []
  sharp(backgroundImagePath)
    //Resize background image
    .resize(width, height, {
      fit: 'fill'
    })
    .toBuffer()
    .then((resizedBackgroundBuffer) => {
      // Resize image
      return sharp(paths.inputImagePath)
        .resize(imgWidth, imgHeight)
        //.sharpen()
        .toBuffer()
        .then((resizedImageBuffer) => {
          let topPos = Math.round(hfiller / 2)
          for (let l = 0; l < lines; l++) {
            let leftPos = Math.round(vfiller / 2)
            for (let c = 0; c < cols; c++) {
              composites.push({ input: resizedImageBuffer, left: leftPos, top: topPos },)
              leftPos += imgWidth + vfiller
            }
            topPos += imgHeight + hfiller
          }
          //console.log(composites)
          return sharp(resizedBackgroundBuffer)
            .composite(composites)
            .toFile(paths.outputImagePath)
            .then(() => {
              console.log(`generateNxBackground() Image ${paths.outputImagePath} generated.`);
            });
        });
    })
    .catch((err) => {
      console.error('generateNxBackground() Error: ', err);
    })
}

//---------------------------------------- Fonction principale
async function convertImagesToNx(inputImagesDir, inputImageFile, background) {
  try {
    let files = []
    console.log("convertImagesToNx() imagesDir", imagesDir, 
      "inputImagePath", inputImageFile,
       "background", background)
    if (inputImageFile.length > 0) {
      console.log("convertImagesToNx() file ", inputImageFile)
      files.push(inputImageFile);
    } else {
      files = await readJpgFiles(imagesDir).filter(file => !file.endsWith('2x.jpg'));
    }
    console.log("convertImagesToNx() files", files)
    if (files.length === 0) {
      console.log('convertImagesToNx() No .jpg file found.');
      return;
    }

    for (const file of files) {
      console.log(file)
      let backgroundImg= background.backgroundImg
      if (background.backgroundImg.length === 0) {
        console.log("convertImagesToNx() background colors ",background.colors);
        backgroundImg=await generateBackgroundRgb(imagesDir, background.colors)
      } 
      console.log("convertImagesToNx() backgroundImg", backgroundImg)
      generateNxBackground(imagesDir, file, backgroundImg, background.format.l, background.format.c);
      }
  } catch (err) {
    console.log("convertImagesToNx() Exception ", err)
  }
}

//======================================================================
// Param1 : image file
// Param2 : merge : 
//   If param 2 contains commas, it is Red Green Blue pattern
//   -> generate 2x and 3x file
//   Else, it's a background image file
//   -> generate 3x file
// Param3 : format lines,cols 
//--------------------------------------------------------------------

let inputImageFile = ''
let rgb = '255,0,0'
let linesCols = '1,3'
let backgroundImg = ''
// Vérifier les arguments de la ligne de commande
if (process.argv.length > 2) {
  inputImageFile = process.argv[2];
}
if (process.argv.length > 3) {
  rgb = process.argv[3];
}
if (process.argv.length > 4) {
  linesCols = process.argv[4];
}

// check if image file exists
if (inputImageFile.length > 0 && !fs.existsSync(path.join(imagesDir, `${inputImageFile}`))) {
  console.error(`Le fichier ${inputImageFile} n'existe pas.`);
  process.exit(1);
}

let colors = rgb.split(',').map(Number)
let fmts = linesCols.split(',').map(Number)
let format = { l: fmts[0], c: fmts[1] }

// check if backgroud image exists
if (!rgb.includes(',')) {
  backgroundImg = rgb
  let pieces = rgb.split(/[\\/]/)
  console.log("pieces", pieces)
  let file = path.join(...pieces)
  console.log("file", file)
  //if (rgb.length > 0 && !fs.existsSync(`${file}`)) {
  if (rgb.length > 0 && !fs.existsSync(path.join(imagesDir, file))) {
    console.error(`Le fichier ${file} n'existe pas.`);
    process.exit(1);
  }
}

let background = { format: format, backgroundImg: backgroundImg, colors: { r: colors[0], g: colors[1], b: colors[2] } }
convertImagesToNx(imagesDir, inputImageFile, background);
