const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find dicebear notionists and replace with UI Avatars (initials) for a professional, native app feel
  // ui-avatars.com generates clean letter-avatars which look like standard, non-AI platform defaults.
  const regex = /https:\/\/api\.dicebear\.com\/[^\/]+\/notionists\/svg\?seed=/g;
  content = content.replace(regex, 'https://ui-avatars.com/api/?background=random&color=fff&name=');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Replaced avatars in:', filePath);
}

const frontendDir = path.join(__dirname, 'web/frontend/src');
replaceInFile(path.join(frontendDir, 'pages/Dashboard.jsx'));
replaceInFile(path.join(frontendDir, 'pages/ChatInterface.jsx'));
replaceInFile(path.join(frontendDir, 'components/ChannelInfoPanel.jsx'));
