import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { BasicParams } from '../src/params/BasicParams.mjs'

const imgsOutputFile = '../src/components/textures_base64.mjs';
const soundsOutputFile = '../src/components/sounds_base64.mjs';

// Fonction pour lire les fichiers .jpg dans un répertoire
function readFiles(dir, suffix) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log("err readFiles")
        reject(err);
        return;
      }
      const filteredFiles = files
        .filter(file => file.length > 0)
        .filter(file => !file.endsWith("\\"))
        .filter(file => path.extname(file).toLowerCase() === suffix);
      resolve(filterFiles);
    });
  });
}

// Fonction pour convertir un fichier en base64
function fileToBase64(filePath) {
  console.log("Converting " + filePath)
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log("Error fileToBase64 ", err)
        //reject(err);
        //return;
        resolve('')
      } else {
        const base64 = Buffer.from(data).toString('base64');
        resolve(base64);
      }
    });
  });
}

// Fonction principale
export async function convertFilesToBase64JSON(files, item, prefix) {
  try {
    const result = {};
    const dir= {
      "textures" : '../textures',
      "sounds" : '../sounds'
    }
    for (const file of files) {
      if (!file || file.length=== 0) {
        continue
      }
      const filePath = path.join(dir[item], file);
      const base64 = await fileToBase64(filePath);
      if (base64.length > 0) {
        result[file] = `${prefix},${base64}`;
      }
    }
    let buffer = "// Automatically generated file, do not modify\n"
    buffer += `const ${item}=` + JSON.stringify(result, null, 2) + ';export {' + item + '}'
    const outputFile = '../src/components/' + item + '_base64.mjs';
    fs.writeFile(outputFile, buffer, (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier de sortie:', err);
        return;
      }
      console.log(`files convertd to b64 in ${outputFile}`);
    });
  } catch (err) {
    console.error('Une erreur est survenue:', err);
  }
}

//--------------------------------- Entry point command line -----------------------
if (import.meta.main) {
  console.log("From CLI")
  let profile = ''
  // Vérifier les arguments de la ligne de commande
  if (process.argv.length > 2) {
    profile = process.argv[2];
  } else {
    console.log("profile required")
    process.exit(1)
  }
  BasicParams.setProfile(profile)
  let files = BasicParams.getProfile().imgs;
  files.push(BasicParams.getProfile().snowBallImg);
  files.push(BasicParams.getProfile().backgroundImg);
  console.log(files)
  convertFilesToBase64JSON(files, 'textures', 'data:image/jpeg;base64');
  files = []
  files.push(BasicParams.getProfile().music.mp3);
  console.log(files)
  convertFilesToBase64JSON(files, 'sounds', 'data:audio/mp3;base64');
}


//export {convertImagesToBase64JSON}

