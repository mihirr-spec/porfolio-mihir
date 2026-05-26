/**
 * prerender.mjs
 * Step 3 of the build pipeline (runs after client + SSR builds).
 * Renders the React app to an HTML string and injects it into dist/index.html
 * so the initial page arrives as pre-rendered HTML — no blank screen while JS loads.
 * The dist-ssr/ bundle is deleted after use.
 */
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const toAbs = (p) => resolve(__dirname, p);

// 1. Import the server bundle Vite generated in dist-ssr/
const { render } = await import('./dist-ssr/entry-server.js');

// 2. Render the React app to an HTML string
const appHtml = render();

// 3. Read the client-side HTML template
const template = readFileSync(toAbs('dist/index.html'), 'utf-8');

// 4. Replace the placeholder and save
const html = template.replace('<!--app-html-->', appHtml);
writeFileSync(toAbs('dist/index.html'), html);

// 5. Clean up the temporary SSR bundle
rmSync(toAbs('dist-ssr'), { recursive: true, force: true });

console.log('✓  Pre-rendered: dist/index.html');
