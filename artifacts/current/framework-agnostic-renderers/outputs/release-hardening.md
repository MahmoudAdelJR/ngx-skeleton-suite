# Release Hardening (post-Phase 6)

Addresses the publishing caveats raised after Phase 6.

## 1. Invalid dependency combo (root cause)

The workspace paired Angular 20.3.x with PrimeNG 22 (which declares Angular 22 peers),
and `@angular/animations@20.1.8` pinned `@angular/common@20.1.8` while other Angular
packages were 20.3.x. This forced `npm ci --legacy-peer-deps` and masked real breakage.

**Fixed:** all `@angular/*` packages aligned to `^20.3.0` (resolved 20.3.34), PrimeNG
downgraded to its matching major `primeng@20.4.0`, and `@angular/cdk@20.2.14` added as a
dev dependency. `npm install` now resolves with **strict peer resolution** (no legacy flag)
and `npm ls --depth=0` is clean.

## 2. CI no longer hides the mismatch

- `.github/workflows/deploy-docs.yml`: `npm ci --legacy-peer-deps` → `npm ci`, plus a
  `verify:decoupling` step.
- `.github/workflows/ci.yml` (new):
  - `verify` job — strict `npm ci`, build all entry points, decoupling guard, unit tests,
    demo build.
  - `compatibility` matrix — scaffolds clean Angular consumers for supported
    Angular/PrimeNG pairs and builds against the packed library via
    `scripts/compat-fixture.sh`.

## 3. Compatibility matrix encoded and documented

- `scripts/compat-fixture.sh` is the executable source of truth for supported pairs.
- Docs updated: PrimeNG majors track Angular majors (PrimeNG 20 → Angular 20). Package
  README, `DOCUMENTATION.md`, and the demo dependency matrix now say so.

## 4. Release process

- `CHANGELOG.md` added for the 2.0.0 breaking changes.
- `RELEASING.md` added: versioning, local verification, artifact inspection, publishing the
  built `dist/ngx-skeleton`, and tagging.

## 5. Still manual by nature

- `npm login` / `npm publish ./dist/ngx-skeleton` (2.0.0) and the git tag remain manual.
- The `compatibility` matrix was authored but not executed here (CI-only, needs network and
  `ng new`); the native/PrimeNG/Material renderers are covered by the local 32-test suite
  against Angular 20.3.34 + PrimeNG 20.4.0.

## Verification after hardening

- `npm ci` (strict, no `--legacy-peer-deps`) — exit 0.
- `npx ng build ngx-skeleton` — 4 entry points, pass.
- `npx ng test ngx-skeleton --watch=false` — 32/32 pass on PrimeNG 20.
- `npm run verify:decoupling` — pass.
- `npx ng build demo-app --configuration development` — pass.

Resolved final dev tree: Angular `20.3.34` (all `@angular/*` aligned), `@angular/cdk@20.2.14`,
`primeng@20.4.0`, `ngx-skeleton-loader@13.0.0`.

Note: an interrupted `npm install` (flaky network) had left `node_modules` partially extracted and
an invalid `package-lock.json` (missing `resolved`/`integrity` for `p-map`). Both were regenerated
from scratch; `npm ci` now installs cleanly and deterministically.