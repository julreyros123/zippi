const fs = require('fs');
const path = require('path');

const filePaths = [
  path.join(__dirname, 'web/frontend/src/pages/Login.jsx'),
  path.join(__dirname, 'web/frontend/src/pages/Register.jsx')
];

for (const filePath of filePaths) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Remove background blurs
  content = content.replace(/<div className="absolute[^"]*blur-[0-9]+(px|xl|2xl)[^"]*"\s*\/>/g, '');

  // 2. Box shadow removals
  content = content.replace(/shadow-[a-z]+-[0-9]+\/[0-9]+/g, '');
  content = content.replace(/shadow-(xl|2xl|lg|md)/g, '');

  // 3. Flatten "Z" logo box
  content = content.replace(/bg-gradient-to-br from-blue-600 to-emerald-500/g, 'bg-indigo-600');
  content = content.replace(/rounded-3xl|rounded-2xl/g, 'rounded-md');

  // 4. Flatten text gradients
  content = content.replace(/text-transparent bg-clip-text bg-gradient-[^"']+/g, 'text-blue-400');

  // 5. Turn translucent/bubbly elements into flat elements
  content = content.replace(/bg-gray-800\/40 backdrop-blur-md/g, 'bg-gray-800');
  
  // 6. Input fields tuning
  content = content.replace(/rounded-xl/g, 'rounded');
  content = content.replace(/focus:ring-[^ \"]+/g, '');
  content = content.replace(/bg-gray-900\/50/g, 'bg-gray-950');

  // 7. Button gradients
  content = content.replace(/bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400/g, 'bg-indigo-600 hover:bg-indigo-500');
  
  // 8. Error boxes 
  content = content.replace(/bg-red-500\/10 border border-red-500\/30/g, 'bg-gray-900 border border-red-900');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Flattened auth page:', filePath);
}
