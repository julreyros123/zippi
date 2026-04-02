const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'web/frontend/src/pages/Dashboard.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove dashed borders and replace with solid dark gray blocks
content = content.replace(/border border-dashed border-gray-800/g, 'border-none bg-gray-800/40 p-10 flex flex-col items-center justify-center');

// 2. inputs: focus rings and glow
content = content.replace(/focus:ring-2 focus:ring-[a-z]+-[0-9]+\/[0-9]+/g, '');
content = content.replace(/focus:border-[a-z]+-[0-9]+/g, '');

// 3. Remove blur bubbles
content = content.replace(/<div className="absolute[^"]*blur-[0-9]+(px|xl|2xl)[^"]*"\s*\/>/g, '');

// 4. Flatten neon pill badges / tags to solid rectangles
content = content.replace(/bg-[a-z]+-[0-9]+\/10 text-[a-z]+-[0-9]+ rounded-full border border-[a-z]+-[0-9]+\/20/g, 'bg-gray-700 text-gray-200 rounded px-1.5 py-0.5 border-none');
content = content.replace(/bg-[a-z]+-[0-9]+\/20 text-[a-z]+-[0-9]+/g, 'bg-gray-700 text-white border-none');

// 5. Button and card specific flattening
content = content.replace(/bg-emerald-600\/10 border border-emerald-500\/20/g, 'bg-gray-900 border-none');
content = content.replace(/bg-yellow-500\/5 border border-yellow-500\/20/g, 'bg-gray-800 border border-gray-700');
content = content.replace(/bg-purple-500\/10 border border-purple-500\/20/g, 'bg-gray-800 border border-gray-700 border-l-4 border-l-indigo-500');

// 6. Fix "INPUT" const at the bottom which had rounded-xl
content = content.replace(/const INPUT = '([^']*)';/g, (match, classes) => {
  let newClasses = classes.replace(/rounded-xl/g, 'rounded')
                          .replace(/focus:border-blue-500 focus:ring-1 focus:ring-blue-500/g, '')
                          .trim();
  return `const INPUT = '${newClasses}';`;
});

// 7. Fix modals and some connection buttons
content = content.replace(/bg-yellow-500 text-black hover:bg-yellow-400 transition-colors shadow-sm shadow-yellow-500\/20/g, 'bg-indigo-500 text-white hover:bg-indigo-600 transition-colors');
content = content.replace(/bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500\/10/g, 'bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Deep flattening applied.');
