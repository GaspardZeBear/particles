import fs from 'fs'
import path from 'path'
import { BasicParams } from '../src/params/BasicParams.mjs'
const outputFile = '../src/components/paramSet.mjs';

let profile = ''
let b64 = ''
// Vérifier les arguments de la ligne de commande
if (process.argv.length > 3) {
    profile = process.argv[2];
    b64 = process.argv[3]
}

BasicParams.setProfile(profile)
let P=BasicParams.getProfile().constructor
console.log(P)

let b64Ok = { 'true': 1, 'false': 0 }
if (b64Ok[b64] === undefined) {
    console.log(`Error Usage ${process.argv[0]} profile true|false`)
    process.exit(1);
}

let buffer = `// Automatically generated file, do not modify
const profile='${profile}'
const b64=${b64}
export {profile, b64}`

try {
    fs.writeFile(outputFile, buffer, (err) => {
        if (err) {
            console.error('Error write ${outputFile}:', err);
            return;
        }
        console.log(`file  ${outputFile} created`);
    });
} catch (err) {
    console.error('Error !! :', err);
}
