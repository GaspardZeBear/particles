const fs = require('fs');
const path = require('path');

// Lire les fichiers
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, 'assets\\index-CBwx6CF7.js'), 'utf8');

// Remplacer la balise script dans le HTML
const finalHtml = htmlContent.replace(
  '<script type="module" crossorigin src="/assets/index-CBwx6CF7.js"></script>',
  `<script>${jsContent}</script>`
);

// Écrire le fichier final
fs.writeFileSync(path.join(__dirname, '', 'index.html'), finalHtml, 'utf8');

console.log('Fichier HTML autonome créé dans dist/index.html');