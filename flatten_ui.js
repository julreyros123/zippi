const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'web/frontend/src/pages/Dashboard.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Global flattening replacements
content = content.replace(/rounded-3xl/g, 'rounded-md');
content = content.replace(/rounded-2xl/g, 'rounded-md');
content = content.replace(/rounded-xl/g, 'rounded');
content = content.replace(/bg-gray-900\/60/g, 'bg-gray-800 border-none shadow-none');
content = content.replace(/bg-gray-900\/40/g, 'bg-gray-800 border-none shadow-none');
content = content.replace(/border border-gray-800/g, 'border-none');
content = content.replace(/border border-gray-700/g, 'border-none');
content = content.replace(/hover:border-[^ ]+/g, ''); // Remove colorful hover borders
content = content.replace(/shadow-xl/g, 'shadow-md');
content = content.replace(/shadow-lg/g, 'shadow-sm');
content = content.replace(/bg-gradient-to-br from-[a-z]+-[0-9]+\/?[0-9]* to-[a-z]+-[0-9]+\/?[0-9]*/g, 'bg-gray-800'); // Remove gradients

fs.writeFileSync(filePath, content, 'utf-8');
console.log('UI successfully flattened across Dashboard.');
