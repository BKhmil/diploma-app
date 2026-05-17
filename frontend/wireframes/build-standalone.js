// Inline CSS into each wireframe HTML → output to ./standalone/
// Run: node build-standalone.js

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'standalone');

if (!existsSync(outDir)) mkdirSync(outDir);

const css = readFileSync(join(__dirname, '_wireframe.css'), 'utf8');
const styleBlock = `<style>\n${css}\n</style>`;

const files = readdirSync(__dirname).filter(f => f.endsWith('.html'));

for (const file of files) {
  const src = readFileSync(join(__dirname, file), 'utf8');
  const out = src.replace(
    /<link\s+rel="stylesheet"\s+href="_wireframe\.css">/g,
    styleBlock
  );
  writeFileSync(join(outDir, file), out, 'utf8');
  console.log('✓', file);
}

console.log(`\nГотово: ${files.length} файлів → ./standalone/`);
