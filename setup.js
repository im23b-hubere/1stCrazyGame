// This script creates a simple HTML file that can be run directly in a browser
// without needing npm or any other dependencies

const fs = require('fs');
const path = require('path');

// Create a dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy the HTML file but modify it to include inline scripts
const html = fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf8');

// Create a modified HTML file that works without bundling
const modifiedHtml = html
  .replace('<script src="./index.js"></script>', '<script src="./bundle.js"></script>');

fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), modifiedHtml);

// Create a simple script to copy all needed files
const setupScript = `
@echo off
echo Setting up Simple Phaser Game...

:: Create directories if they don't exist
if not exist dist mkdir dist
if not exist dist\\assets mkdir dist\\assets

:: Copy the CDN version of Phaser
echo Downloading Phaser from CDN...
curl -o dist\\phaser.min.js https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js

:: Copy our game files
echo Copying game files...
copy src\\index.html dist\\index.html
copy dist\\bundle.js dist\\bundle.js

echo Setup complete!
echo To play the game, open dist/index.html in your browser.
`;

// Save the setup script
fs.writeFileSync('setup.bat', setupScript);
console.log('Setup script created. Run setup.bat to prepare the game for direct browser play.');

// Create a simple bundle.js that includes all our game code
// This is a very basic bundling - in a real project you would use a proper bundler
console.log('Creating a simple bundle of all game files...');

// A function to read all JS files from the src directory
function readJSFiles(directory, fileList = []) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      readJSFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push({
        path: filePath,
        content: fs.readFileSync(filePath, 'utf8')
      });
    }
  }
  
  return fileList;
}

// Get all JS files
const jsFiles = readJSFiles(path.join(__dirname, 'src'));

// Create a single bundle
let bundleContent = `
// Simple bundle of all game files
// This would normally be done by a proper bundler like Webpack or Parcel

// Include Phaser from CDN
document.write('<script src="phaser.min.js"></script>');

// Game code
(function() {
  // Placeholder for imports
  const modules = {};
  
  function require(moduleName) {
    return modules[moduleName];
  }
  
  // Define modules
`;

// Add each file as a module
jsFiles.forEach(file => {
  const relativePath = path.relative(path.join(__dirname, 'src'), file.path).replace(/\\/g, '/');
  const moduleName = './' + relativePath;
  
  // Replace import statements with our custom require
  let content = file.content;
  content = content.replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, 'const $1 = require("$2")');
  
  // Define the module
  bundleContent += `
  // Module: ${moduleName}
  modules['${moduleName}'] = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    
    // Module code
    ${content}
    
    return module.exports;
  })();
  `;
});

// Add the initialization code
bundleContent += `
  // Initialize the game
  document.addEventListener('DOMContentLoaded', function() {
    // Start the game
    const main = modules['./index.js'];
  });
})();
`;

// Write the bundle
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle.js'), bundleContent);
console.log('Bundle created at dist/bundle.js');

// Create a simple readme
const readmeContent = `
# Simple Phaser Game for CrazyGames - No-Install Version

This version of the game can be run directly in a browser without needing npm or any other dependencies.

## How to Run

Simply open the \`index.html\` file in your web browser.

## Controls

- Arrow keys to move
- Space to jump
- Collect coins and avoid obstacles!

Enjoy!
`;

fs.writeFileSync(path.join(__dirname, 'dist', 'README.md'), readmeContent);
console.log('README created.');

console.log('All done! You can now run the game without npm by opening dist/index.html in your browser.');