#!/usr/bin/env bash
#
# Compatibility fixture: scaffolds a clean Angular consumer pinned to a specific
# Angular major, installs the packed ngx-skeleton-suite tarball plus the requested
# renderer adapter peer, wires the directive + provider, and builds.
#
# Usage:
#   bash scripts/compat-fixture.sh <angular-major> <native|primeng|material> [primeng-major]
#
# Example:
#   bash scripts/compat-fixture.sh 20 primeng 20
#
set -euo pipefail

ANGULAR_MAJOR="${1:?angular major is required}"
ADAPTER="${2:-native}"
PRIMENG_MAJOR="${3:-}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARBALL="$(ls "${ROOT_DIR}"/ngx-skeleton-suite-*.tgz 2>/dev/null | head -n1 || true)"

if [ -z "${TARBALL}" ]; then
  echo "No packed tarball found. Run 'npx ng build ngx-skeleton && npm pack ./dist/ngx-skeleton' first." >&2
  exit 1
fi

echo "=== Compatibility fixture ==="
echo "Angular major : ${ANGULAR_MAJOR}"
echo "Adapter       : ${ADAPTER}"
echo "PrimeNG major : ${PRIMENG_MAJOR:-n/a}"
echo "Tarball       : ${TARBALL}"

WORK_DIR="$(mktemp -d)"
FIXTURE="${WORK_DIR}/consumer"

echo "=== Scaffolding Angular ${ANGULAR_MAJOR} consumer ==="
npx -y "@angular/cli@${ANGULAR_MAJOR}" new consumer \
  --directory "${FIXTURE}" \
  --defaults \
  --skip-git \
  --skip-install \
  --skip-tests \
  --style=scss \
  --ssr=false

cd "${FIXTURE}"

echo "=== Installing consumer dependencies ==="
npm install --no-audit --no-fund

echo "=== Installing packed ngx-skeleton-suite ==="
npm install --no-audit --no-fund "${TARBALL}"

PROVIDER_IMPORT=""
PROVIDER_CALL=""

case "${ADAPTER}" in
  native)
    ;;
  primeng)
    if [ -z "${PRIMENG_MAJOR}" ]; then
      echo "primeng adapter requires a primeng major argument" >&2
      exit 1
    fi
    npm install --no-audit --no-fund "primeng@${PRIMENG_MAJOR}"
    PROVIDER_IMPORT="import { providePrimeNgSkeleton } from 'ngx-skeleton-suite/primeng';"
    PROVIDER_CALL=", providePrimeNgSkeleton()"
    ;;
  material)
    npm install --no-audit --no-fund "ngx-skeleton-loader"
    PROVIDER_IMPORT="import { provideMaterialSkeleton } from 'ngx-skeleton-suite/material';"
    PROVIDER_CALL=", provideMaterialSkeleton()"
    ;;
  *)
    echo "Unknown adapter '${ADAPTER}' (expected native|primeng|material)" >&2
    exit 1
    ;;
esac

echo "=== Writing fixture app ==="
cat > src/app/app.config.ts <<EOF
import { ApplicationConfig } from '@angular/core';
import { provideNgxSkeleton } from 'ngx-skeleton-suite';
${PROVIDER_IMPORT}

export const appConfig: ApplicationConfig = {
  providers: [provideNgxSkeleton({ animation: 'adapter-default' })${PROVIDER_CALL}],
};
EOF

cat > src/app/app.ts <<'EOF'
import { Component, signal } from '@angular/core';
import { SkeletonDirective } from 'ngx-skeleton-suite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SkeletonDirective],
  template: `
    <div *skeleton="isLoading(); preset: 'profile-card'; animation: 'wave'">
      <p>Loaded content</p>
    </div>
  `,
})
export class AppComponent {
  readonly isLoading = signal(true);
}
EOF

echo "=== Building consumer (${ADAPTER}) ==="
npm run build

echo "=== Compatibility fixture passed: Angular ${ANGULAR_MAJOR} + ${ADAPTER} ==="
rm -rf "${WORK_DIR}"