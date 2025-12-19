const fs = require('fs');
const path = require('path');

// Lire les fichiers
const htmlContent = fs.readFileSync(path.join(__dirname, '..\\dist\\basic.html'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, '..\\dist\\assets\\js\\basic.js'), 'utf8');

// Remplacer la balise script dans le HTML
const finalHtml = htmlContent.replace(
  `<script type="module" crossorigin src="./assets/js/basic.js"></script>`,
  `<script>${jsContent}</script>`
);

// Écrire le fichier final
fs.writeFileSync(path.join(__dirname, '', '..\\dist\\target.html'), finalHtml, 'utf8');

console.log('Fichier HTML autonome créé dans dist/target.html');