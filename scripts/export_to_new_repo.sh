#!/usr/bin/env bash
set -euo pipefail

SOURCE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
DEFAULT_TARGET="${SOURCE_ROOT}/../ai-tutor-new"
TARGET_DIR="${1:-$DEFAULT_TARGET}"

if [ -d "${TARGET_DIR}" ] && [ -n "$(find "${TARGET_DIR}" -mindepth 1 -maxdepth 1 -print -quit)" ]; then
  echo "Target directory '${TARGET_DIR}' already exists and is not empty. Aborting to avoid overwriting." >&2
  exit 1
fi

mkdir -p "${TARGET_DIR}"

rsync -a --delete \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='frontend/node_modules/' \
  --exclude='backend/node_modules/' \
  --exclude='*.log' \
  --exclude='tmp/' \
  "${SOURCE_ROOT}/" "${TARGET_DIR}/"

cd "${TARGET_DIR}"

if [ ! -d .git ]; then
  git init >/dev/null
fi

git add .

git commit -m "Initial commit from ai-tutor export" >/dev/null

cat <<MSG
Repository exported to ${TARGET_DIR}.
You can now add a remote and push:
  cd "${TARGET_DIR}"
  git remote add origin <your-new-repo-url>
  git push -u origin main
MSG
