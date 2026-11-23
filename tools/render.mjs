// Renders design/page.html to entry.png (1024x1024) with a local headless Chrome.
// Run at build time only; the entry itself (main.ts) just copies the committed PNG.
//   node tools/render.mjs [path-to-chrome]
import { execFileSync } from 'node:child_process';
import { existsSync, statSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const page = pathToFileURL(join(root, 'design', 'page.html')).href;
const out = join(root, 'entry.png');

const candidates = [
  process.argv[2],
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) throw new Error('no Chrome found; pass its path');

execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1024,1024', `--screenshot=${out}`, page,
], { stdio: 'inherit' });

const png = readFileSync(out);
const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
console.log(`entry.png ${w}x${h}, ${statSync(out).size} bytes`);
if (w > 1024 || h > 1024 || statSync(out).size > 1048576) throw new Error('over the gate limits');
