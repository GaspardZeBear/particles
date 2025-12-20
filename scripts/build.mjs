import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let source='basic'
// Vérifier les arguments de la ligne de commande
if (process.argv.length >2) {
  source = process.argv[2];
}

// Lire les fichiers
//const htmlContent = fs.readFileSync(path.join(__dirname, '..\\dist\\' + source +'.html'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, '..\\dist\\assets\\js\\' + source +'.js'), 'utf8');

// Remplacer la balise script dans le HTML
//const finalHtml = htmlContent.replace(
//  `<script type="module" crossorigin src="./assets/js/basic.js"></script>`,
//  `<script>${jsContent}</script>`
//);
let finalHtml="<html><body><script>"
finalHtml += jsContent
finalHtml += "</script></body></html>"
// Écrire le fichier final
fs.writeFileSync(path.join(__dirname, '', '..\\dist\\target.html'), finalHtml, 'utf8');

console.log('Fichier HTML autonome créé dans dist/target.html');