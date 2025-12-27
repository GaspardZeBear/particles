import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { BasicParams } from '../src/params/BasicParams.mjs'
const imagesDir = '../textures/';
const outputFile = '../src/components/textures_base64.js';

// Fonction pour lire les fichiers .jpg dans un répertoire
function readJpgFiles(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log("err readJpgFiles")
        reject(err);
        return;
      }
      const jpgFiles = files
        .filter(file => file.length > 0)
        .filter(file => !file.endsWith("\\"))
        .filter(file => path.extname(file).toLowerCase() === '.jpg');
      resolve(jpgFiles);
    });
  });
}

// Fonction pour convertir un fichier en base64
function fileToBase64(filePath) {
  console.log("Converting " + filePath)
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log("Error fileToBase64 ",err)
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
export async function convertImagesToBase64JSON(profile) {
  try {
    let files = null
    console.log("imagesDir", imagesDir)
    console.log("profile", profile)
    if (profile.length > 0) {
      BasicParams.setProfile(profile)
      files = BasicParams.getProfile().imgs;
      files.push(BasicParams.getProfile().snowBallImg);
      files.push(BasicParams.getProfile().backgroundImg);
    } else {
      files = await readJpgFiles(imagesDir);
    }
    console.log("files", files)
    if (files.length === 0) {
      console.log('Aucun fichier .jpg trouvé dans le répertoire.');
      return;
    }

    const result = {};
    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const base64 = await fileToBase64(filePath);
      if (base64.length > 0) {
        result[file] = `data:image/jpeg;base64,${base64}`;
      }
    }
    let buffer = "// Automatically generated file, do not modify\n"
    buffer += 'const textures=' + JSON.stringify(result, null, 2) + ';export {textures}'
    fs.writeFile(outputFile, buffer, (err) => {
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
  convertImagesToBase64JSON(profile);
} 


//export {convertImagesToBase64JSON}

