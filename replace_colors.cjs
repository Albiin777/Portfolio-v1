const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['./src', './tailwind.config.js', './index.html'];

const REPLACEMENTS = [
  { search: /#ff4b1f/gi, replace: '#ff6a00' },
  { search: /255,\s*75,\s*31/g, replace: '255, 106, 0' },
  // Standardize darkest backgrounds to #050505
  { search: /#090909/gi, replace: '#050505' },
  { search: /#050507/gi, replace: '#050505' },
  { search: /#08080a/gi, replace: '#050505' },
  { search: /#0e0e10/gi, replace: '#050505' },
  { search: /#09090b/gi, replace: '#050505' },
  // Standardize medium backgrounds to #0a0a0a
  { search: /#111113/gi, replace: '#0a0a0a' },
  { search: /#0a0a0c/gi, replace: '#0a0a0a' },
  { search: /#060608/gi, replace: '#0a0a0a' },
  { search: /#0f0f0f/gi, replace: '#0a0a0a' },
  // Standardize top backgrounds to #121212
  { search: /#171717/gi, replace: '#121212' },
];

function processDirectory(dirPath) {
  if (fs.statSync(dirPath).isFile()) {
    processFile(dirPath);
    return;
  }
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (const rule of REPLACEMENTS) {
    if (rule.search.test(content)) {
      content = content.replace(rule.search, rule.replace);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated colors in ${filePath}`);
  }
}

DIRECTORIES.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
});

console.log('Color replacement complete.');
