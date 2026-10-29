#!/usr/bin/env bash
# restore-to-repo.sh — restore the flat package files into a ViewTube checkout,
# per MANIFEST.md. Flat name = repo path with every "/" replaced by "__".
# Package-only files (README.md, MANIFEST.md, this script, ROADMAP-REFERENCE.md,
# SCAFFOLD-README.md→README.md special case) are handled explicitly.
set -euo pipefail

PKG_DIR="${1:-$(cd "$(dirname "$0")" && pwd)}"
TARGET_DIR="${2:-.}"

if [ ! -d "$PKG_DIR" ]; then echo "error: package folder not found: $PKG_DIR" >&2; exit 1; fi
if [ ! -d "$TARGET_DIR/.git" ] && [ ! -f "$TARGET_DIR/package.json" ]; then
  echo "error: $TARGET_DIR does not look like the viewtube checkout (pass it as arg 2)" >&2
  exit 1
fi

count=0
cd "$PKG_DIR"
for flat in *.md *.sh *.ts *.tsx; do
  [ -e "$flat" ] || continue
  case "$flat" in
    README.md|MANIFEST.md|restore-to-repo.sh|ROADMAP-REFERENCE.md) continue ;;  # package-only
    SCAFFOLD-README.md) rel="README.md" ;;                                      # special case
    src__*) rel="${flat//__//}" ;;                                              # decode
    *) echo "skip (unknown flat name): $flat" >&2; continue ;;
  esac
  mkdir -p "$TARGET_DIR/$(dirname "$rel")"
  cp "$flat" "$TARGET_DIR/$rel"
  count=$((count + 1))
done

echo "restored $count files into $TARGET_DIR"
# sanity: expected 118 (the manifest's repo-file count)
if [ "$count" -ne 118 ]; then
  echo "warning: expected 118 restored files, got $count — check MANIFEST.md" >&2
  exit 2
fi
