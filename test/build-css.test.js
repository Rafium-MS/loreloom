const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const vm = require('node:vm');

function loadFunctions() {
  const code = fs.readFileSync(
    path.join(__dirname, '..', 'build-css.js'),
    'utf8',
  );
  const start = code.indexOf('function resolveImports');
  const end = code.indexOf('const combined');
  const functionsCode = code.slice(start, end);
  const sandbox = { fs, path, module: {} };
  vm.runInNewContext(
    functionsCode + 'module.exports = { resolveImports, minify };',
    sandbox,
  );
  return sandbox.module.exports;
}

const { resolveImports, minify } = loadFunctions();

test('resolveImports concatenates imports and minify strips comments/whitespace', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'css-'));
  fs.writeFileSync(
    path.join(dir, 'b.css'),
    '/* b comment */\n.b { padding: 0; }\n',
  );
  fs.writeFileSync(
    path.join(dir, 'a.css'),
    "@import url('b.css');\n/* a comment */\n.a { margin: 0; }\n",
  );
  const main = path.join(dir, 'main.css');
  fs.writeFileSync(main, "@import url('a.css');\nbody { color: red; }\n");

  const combined = resolveImports(main);
  const expectedCombined =
    '/* b comment */\n.b { padding: 0; }\n\n/* a comment */\n.a { margin: 0; }\n\nbody { color: red; }\n';
  assert.equal(combined, expectedCombined);

  const minified = minify(combined);
  assert.equal(minified, '.b{padding:0}.a{margin:0}body{color:red}');
});
