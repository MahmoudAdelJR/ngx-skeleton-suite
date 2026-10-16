/*
 * Decoupling guard: verifies the published package keeps the core renderer-neutral
 * and exposes UI-library integrations only as optional secondary entry points.
 *
 * Run after `ng build ngx-skeleton`.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist', 'ngx-skeleton');
const failures = [];

function read(relativePath) {
  return readFileSync(join(dist, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

// 1. Core entry point must not import PrimeNG or ngx-skeleton-loader.
const coreBundle = read('fesm2022/ngx-skeleton-suite.mjs');
for (const vendor of ['primeng', 'ngx-skeleton-loader', '@primeuix']) {
  assert(
    !new RegExp(`from ['"]${vendor.replace('/', '\\/')}`).test(coreBundle),
    `Core FESM unexpectedly imports "${vendor}".`
  );
}

// 2. Core public API source must not reference PrimeNG.
const corePublicApi = readFileSync(
  join(process.cwd(), 'projects', 'ngx-skeleton', 'src', 'public-api.ts'),
  'utf8'
);
assert(!/primeng/i.test(corePublicApi), 'Core public-api.ts references PrimeNG.');

// 3. Optional UI libraries must be published as optional peer dependencies.
const manifest = JSON.parse(read('package.json'));
for (const optionalPeer of ['primeng', 'ngx-skeleton-loader']) {
  assert(
    manifest.peerDependenciesMeta?.[optionalPeer]?.optional === true,
    `"${optionalPeer}" must be an optional peer dependency.`
  );
}

// 4. Adapter entry points must exist and be exported.
for (const entry of ['primeng', 'material', 'testing']) {
  assert(
    manifest.exports?.[`./${entry}`] !== undefined,
    `Missing "./${entry}" export in published manifest.`
  );
  assert(
    existsSync(join(dist, entry, 'index.d.ts')),
    `Missing types for secondary entry point "${entry}".`
  );
}

// 5. PrimeNG must only be imported by the primeng adapter bundle.
const primengBundle = read('fesm2022/ngx-skeleton-suite-primeng.mjs');
assert(
  /from ['"]primeng\/skeleton['"]/.test(primengBundle),
  'PrimeNG adapter does not import primeng/skeleton.'
);

if (failures.length > 0) {
  console.error('Decoupling verification FAILED:');
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exit(1);
}

console.log('Decoupling verification passed: core is renderer-neutral and adapters are optional.');