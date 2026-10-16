# Phase 4 — Packaging, Public API & Peer Dependencies

## Goal

Make the published package Prime-free by default and expose adapters as subpaths.

## Scope

1. `projects/ngx-skeleton/package.json`:
   - Remove `primeng` from required peers; keep it as an optional peer via
     `peerDependenciesMeta`.
   - Add optional peers for `@angular/material` / `@angular/cdk` when the Material
     adapter lands.
   - Update description/keywords to be renderer-agnostic.
2. Add `exports` mapping for `.`, `./primeng`, `./material`, and `./testing` so
   subpath imports resolve in bundlers.
3. Keep the core `public-api.ts` free of `primeng`; ensure the adapter public APIs
   are separate files.
4. Add `projects/ngx-skeleton/testing/ng-package.json` with a renderer-neutral
   harness (`SkeletonHarness`) so consumers can test any renderer.
5. Remove unused workspace dependencies `primeicons` and `@primeuix/themes` unless
   an adapter requires them.

## Definition of Done

- `npm pack ./dist/ngx-skeleton --dry-run` lists root + `primeng` + `testing`
  entry points (and `material` when present).
- Generated `package.json` declares `primeng` only as an optional peer.
- Core entry point has no PrimeNG import in FESM/d.ts.