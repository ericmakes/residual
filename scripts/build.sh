#!/usr/bin/env bash
# Wraps the artifact-source pages (no doctype; claude.ai adds the skeleton) into standalone HTML.
set -euo pipefail
cd "$(dirname "$0")/.."
for pair in "app:prototype" "landing:landing"; do
  src=${pair%%:*}; out=${pair##*:}
  mkdir -p "$out"
  { printf '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'; cat "src/$src.html"; printf '</body></html>\n'; } > "$out/index.html"
done
echo "built prototype/index.html and landing/index.html"
