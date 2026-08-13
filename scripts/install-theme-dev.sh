#!/bin/sh
# Dev-only: copy this package tree into an app's node_modules so Next.js
# Turbopack resolves CSS/exports from real files (not a broken file: link).
#
# Host must have built dist first: `bun run build:lib` in this repo.
# Safe to skip when THEME_DIR is missing (production images).
#
# Usage (from an app directory, Docker or local):
#   THEME_DIR=/the-old-ui TARGET=/app/node_modules/@xenide-io/the-old-ui-theme \
#     sh /the-old-ui/scripts/install-theme-dev.sh
# Or via each app's thin wrapper under scripts/install-theme-dev.sh.

set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
THEME_DIR=${THEME_DIR:-$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)}

if [ -z "${TARGET:-}" ]; then
  if [ -d /app/node_modules ]; then
    TARGET=/app/node_modules/@xenide-io/the-old-ui-theme
  elif [ -d ./node_modules ]; then
    TARGET=$(pwd)/node_modules/@xenide-io/the-old-ui-theme
  else
    echo "install-theme-dev: set TARGET=.../node_modules/@xenide-io/the-old-ui-theme" >&2
    exit 1
  fi
fi

if [ ! -d "$THEME_DIR" ]; then
  echo "install-theme-dev: $THEME_DIR not found, skipping"
  exit 0
fi

if [ ! -d "$THEME_DIR/dist" ]; then
  echo "install-theme-dev: $THEME_DIR/dist is missing."
  echo "Run: cd \"$THEME_DIR\" && bun run build:lib"
  exit 1
fi

echo "install-theme-dev: copying $THEME_DIR -> $TARGET"

rm -rf "$TARGET"
mkdir -p "$TARGET"

# tar preserves structure and is faster than cp for many small files.
tar -C "$THEME_DIR" -cf - \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='node_modules' \
  --exclude='test-results' \
  --exclude='playwright-report' \
  --exclude='coverage' \
  --exclude='out' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  --exclude='.turbo' \
  --exclude='*.tsbuildinfo' \
  . | tar -C "$TARGET" -xf -

echo "install-theme-dev: done"
