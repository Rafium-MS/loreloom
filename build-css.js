const fs = require('fs');
const path = require('path');

const entry = path.join(__dirname, 'public', 'css', 'index.css');
const output = path.join(__dirname, 'public', 'css', 'bundle.css');

function resolveImports(filePath, visited = new Set()) {
  if (visited.has(filePath)) return '';
  visited.add(filePath);
  let css = fs.readFileSync(filePath, 'utf8');
  const importRegex = /@import\s+url\(["'](.+?)["']\);?/g;
  return css.replace(importRegex, (_match, importPath) => {
    const resolved = path.resolve(path.dirname(filePath), importPath);
    return resolveImports(resolved, visited);
  });
}

function minify(css) {
  return css
    .replace(/\/\*[^]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

const combined = resolveImports(entry);
const minified = minify(combined);
fs.writeFileSync(output, minified);
console.log(`CSS bundle written to ${output}`);
