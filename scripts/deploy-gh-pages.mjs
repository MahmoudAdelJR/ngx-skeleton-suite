#!/usr/bin/env node
/*
 * Build the Starlight docs + Angular demo and publish the combined static site to
 * the `gh-pages` branch. Deploying from a branch avoids consuming GitHub Actions
 * minutes and works independently of workflow billing limits.
 *
 * Usage:
 *   node scripts/deploy-gh-pages.mjs
 *   npm run deploy:docs
 *
 * Requirements: clean working tree not required, but git credentials must allow
 * pushing `gh-pages` to `origin`.
 */
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repo = process.cwd();
const starlightOut = join(repo, 'dist', 'starlight-docs');
const demoOut = join(repo, 'dist', 'demo-app');
const siteDir = join(repo, 'dist', 'gh-pages-site');

function run(command, cwd = repo) {
  console.log(`\n$ ${command}`);
  execSync(command, { cwd, stdio: 'inherit' });
}

function runQuiet(command, cwd = repo) {
  return execSync(command, { cwd, stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
}

/** Copy the *contents* of src into dest (creating dest if needed). */
function copyContents(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    cpSync(join(src, entry), join(dest, entry), { recursive: true });
  }
}

console.log('==> Building demo app (production)');
run(
  'npx ng build demo-app --configuration production ' +
    '--base-href /ngx-skeleton-suite/demo/ --output-path dist/demo-app'
);

console.log('==> Building Starlight documentation');
run('npx astro build --root docs --outDir ../dist/starlight-docs');

console.log('==> Assembling combined site');
rmSync(siteDir, { recursive: true, force: true });
mkdirSync(siteDir, { recursive: true });
copyContents(starlightOut, siteDir);

const demoBrowser = join(demoOut, 'browser');
const demoSource = existsSync(demoBrowser) ? demoBrowser : demoOut;
copyContents(demoSource, join(siteDir, 'demo'));

// Required so GitHub Pages serves Astro's asset folders verbatim.
writeFileSync(join(siteDir, '.nojekyll'), '');

console.log('==> Publishing to gh-pages branch');
const worktree = join(tmpdir(), `ngx-gh-pages-${Date.now()}`);

let base = 'origin/gh-pages';
try {
  runQuiet('git fetch origin gh-pages', repo);
} catch {
  base = undefined; // branch does not exist yet
}

if (base) {
  run(`git worktree add -B gh-pages "${worktree}" ${base}`, repo);
} else {
  run(`git worktree add -B gh-pages "${worktree}"`, repo);
}

// Replace the worktree contents (everything except the .git pointer) with the site.
for (const entry of readdirSync(worktree)) {
  if (entry === '.git') continue;
  rmSync(join(worktree, entry), { recursive: true, force: true });
}
copyContents(siteDir, worktree);

run('git add -A', worktree);
const status = runQuiet('git status --porcelain', worktree);
if (!status) {
  console.log('No changes to deploy.');
} else {
  run('git commit -m "deploy: docs and demo site"', worktree);
  run('git push origin gh-pages', worktree);
}

run(`git worktree remove "${worktree}" --force`, repo);
runQuiet('git worktree prune', repo);

console.log('\nDeployed. GitHub Pages will rebuild from gh-pages shortly.');
console.log('Docs: https://MahmoudAdelJR.github.io/ngx-skeleton-suite/');
console.log('Demo: https://MahmoudAdelJR.github.io/ngx-skeleton-suite/demo/');