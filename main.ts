// Sunday 22 November 2026 in one image. The picture (entry.png) is rendered at build time from design/page.html
// by tools/render.mjs; this program only copies it to the output directory, so every run writes the same bytes.
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');
mkdirSync(outDir, { recursive: true });
copyFileSync(new URL('./entry.png', import.meta.url), target);

// The gate's limit is 1 MiB; fail loudly rather than hand the judge a file the gate would refuse.
if (statSync(target).size > 1048576) throw new Error('entry.png is over 1 MiB');
