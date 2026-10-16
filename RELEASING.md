# Releasing

## 1. Preconditions

- All CI checks are green, including the `compatibility` matrix job.
- The workspace resolves with strict peer resolution (`npm ci`, no `--legacy-peer-deps`).
- `CHANGELOG.md` is updated for the intended version.

## 2. Version

Update the version in `projects/ngx-skeleton/package.json` (this is the published package).
The workspace root `package.json` is private and stays at `0.0.0`.

## 3. Verify locally

```bash
npm ci
npx ng build ngx-skeleton
npm run verify:decoupling
npx ng test ngx-skeleton --watch=false --no-progress
npx ng build demo-app --configuration development
npm --prefix docs run build
```

## 4. Inspect the artifact

```bash
npx ng build ngx-skeleton
npm pack ./dist/ngx-skeleton --dry-run
```

Confirm the tarball contains `index.d.ts`, `fesm2022/*.mjs`, and the
`primeng/`, `material/`, and `testing/` entry points, and that `package.json` marks
`primeng` and `ngx-skeleton-loader` as **optional** peers.

## 5. Publish the built output (not the repo root)

```bash
npm login
npm publish ./dist/ngx-skeleton
```

The package is unscoped, so `--access public` is not required. Use `--dry-run` first if
unsure.

## 6. Tag

```bash
git tag v<version>
git push origin v<version>
```

## Supported version policy

PrimeNG majors track Angular majors (PrimeNG 20 → Angular 20). The `/primeng` adapter
must be used with the PrimeNG major that matches the consumer's Angular major. The
`compatibility` CI matrix (`scripts/compat-fixture.sh`) is the source of truth for what
is actually validated; update the matrix and this policy together.