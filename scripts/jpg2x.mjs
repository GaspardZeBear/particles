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
  console.log("getFilesPaths() background", background, " suffix ", suffix)
  const inputImagePath = path.join(imagesDir, inputFile)
  console.log("getFilesPaths() inputImagePath", inputImagePath)
  const outputImagePath = path.join(imagesDir, inputFile.replace('.jpg', getBackgroundAsString(background) + suffix + '.jpg'))
  console.log("getFilesPaths() ouputImagePath", outputImagePath)
  return ({ inputImagePath: inputImagePath, outputImagePath: outputImagePath })
}

//----------------------------------------
// Process RGB pattern
//--------------------------------------------
async function generateBackgroundRgb(imagesDir, background) {
  const paths = getFilesPaths(imagesDir, '$.jpg', background, 'x')
  console.log("generateBackgroundRgb() generate fake background path ", paths)
  const width = 1024
  const height = 512
  let created = await sharp({
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
      console.log("generateBackgroundRgb() return in then ", paths.outputImagePath);
      //return(paths.outputImagePath)
    })
    .catch((err) => {
      console.error(`generateBackgroundRgb()  Error generating ${paths.outputImagePath} `, err);
    });
  console.log("generateBackgroundRgb() return", paths.outputImagePath);
  return (paths.outputImagePath)
}

//----------------------------------------
async function getCoefs(p, imgWidth, imgHeight) {
  let c = {
    vOffset: 0,
    hOffset: -1,
    vFiller: -1,
    hFiller: -1,
    imgWidth: -1,
    imgHeight: -1,
    vSum: -1,
    hSum: -1
  }
  c.hOffset=p.height/(6*p.lines)
  if (p.hoffset && p.hoffset > 0 )
    c.hOffset=p.hoffset
  //c.hOffset=height/(18*lines)
  //c.hOffset = 96
  c.imgHeight = (p.height - ((p.lines + 1) * c.hOffset)) / p.lines
  let ratio = imgWidth/imgHeight
  c.imgWidth = c.imgHeight * ratio
  //c.hFiller = Math.round( (height -2*c.hOffset - lines*imgHeight)) 
  c.hFiller = 0
  if (p.lines > 1) {
    c.hFiller = Math.round((2 * c.hOffset / (p.lines)))
  }
  c.vFiller = (p.width - c.imgWidth * p.cols) / p.cols
  console.log("width ", p.width, "height ", p.height, "lines ", p.lines, "cols ", p.cols, "imgWidth ", p.imgWidth, "imgHeight ", p.imgHeight)
  c.hSum = 2 * c.hOffset + p.lines * c.imgHeight + (p.lines - 1) * c.hFiller
  c.vSum = p.cols * (c.imgWidth + c.vFiller)

  for (let a in c) {
    //console.log(" attrib ",a, " ", c[a] )
    c[a] = Math.round(c[a])
  }
  console.log(c)
  return (c)
  //console.log(c)
}

//----------------------------------------
// Merge with background image
//----------------------------------------
async function generateNxBackground(P) {
  console.log("generateNxBackground() enter  backgroundImg ", P.background)
  const paths = getFilesPaths(P.dir, P.img, P.background, P.lines + '_' + P.cols + 'x')
  const backgroundImagePath = path.join(P.dir, P.background)

  let meta = {}
  await sharp(paths.inputImagePath)
    .metadata()
    .then((metadata) => { meta = metadata })

  //console.log(meta)
  //const ratio = meta.width / meta.height
  const coefs = await getCoefs(P, meta.width, meta.height)
  console.log("coefs ", coefs)

  let composites = []
  sharp(backgroundImagePath)
    //Resize background image
    .resize(P.width, P.height, {
      fit: 'fill'
    })
    .toBuffer()
    .then((resizedBackgroundBuffer) => {
      // Resize image
      return sharp(paths.inputImagePath)
        .resize(coefs.imgWidth, coefs.imgHeight, {
          fit: 'fill'
        })
        .sharpen()
        .sharpen()
        .sharpen()
        .toBuffer()
        .then((resizedImageBuffer) => {
          //let topPos = Math.round(hfiller / 2)
          let topPos = coefs.hOffset
          for (let l = 0; l < P.lines; l++) {
            //let leftPos = Math.round(coefs.vFiller / 2)
            let leftPos = 0
            for (let c = 0; c < P.cols; c++) {
              composites.push({ input: resizedImageBuffer, left: leftPos, top: topPos },)
              leftPos += coefs.imgWidth + coefs.vFiller
            }
            topPos += coefs.imgHeight + coefs.hFiller
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
async function convertImagesToNx(P) {
  try {
    for (const file of P.files) {
      console.log(file)
      if (P.background.length === 0) {
        console.log("convertImagesToNx() background colors ", P.color);
        P.background = await generateBackgroundRgb(P.dir, P.color)
      }
      console.log("convertImagesToNx() backgroundImg", P.background)
      generateNxBackground(P);
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

//--------------------------------- Entry point command line -----------------------
if (import.meta.main) {
  console.log("Use jpg2xCli.mjs CLI")
 }

//--------------------------------------------------------------------------------------------
async function args2P(args) {
  console.log(args)
  let p = args
  p.width=Number(p.width)
  p.height=Number(p.height)
  // check if image file exists
  if (args.img && args.img.length > 0 && !fs.existsSync(path.join(args.dir, `${args.img}`))) {
    throw new Error(`Le fichier ${args.img} n'existe pas.`);
  }

  // proc
  p.files = [args.img]
  /*
  if (args.img.length > 0) {
    console.log("convertImagesToNx() file ", args.img)
    p.files.push(args.img);
  } else {
    p.files = await readJpgFiles(args.dir).filter(file => !file.endsWith('x.jpg'));
  }
  console.log("convertImagesToNx() files", p.files)
  if (p.files.length === 0) {
    throw new Error('convertImagesToNx() No .jpg file found.');
  }
    */

  p.color = null
  if (args.rgb) {
    let colors = args.rgb.split(',').map(Number)
    p.color = { r: 0, g: 0, b: 0 }
    if (colors.length ===3 ) {
      p.color.r = colors[0]
      p.color.g = colors[1]
      p.color.b = colors[2]
    } else {
      throw new Error('rgb must be r,g,b');
    }

  }
  let lc = args.lc.split(',').map(Number)
  p.lines = lc[0]
  p.cols = lc[1]
  console.log(p)
  return (p)
}

//--------------------------------------------------------------------------------------------
async function process(args) {
  await args2P(args)
    .then((p) => convertImagesToNx(p))
    .catch(error => console.log("Error " + error))
}

export { process }
