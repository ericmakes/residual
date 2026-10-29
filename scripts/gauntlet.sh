#!/usr/bin/env bash
# Certify before ship: build, then run every saved harness battery against the build. Exit 0 = CERTIFIED.
set -euo pipefail
cd "$(dirname "$0")/.."
bash scripts/build.sh
node audits/2026-10-29/harness-residual.js "$PWD/prototype/index.html" "$PWD/landing/index.html"
