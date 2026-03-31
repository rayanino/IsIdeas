#!/usr/bin/env bash
set -euo pipefail

WINDOWS_REPO_PATH="${1:-/mnt/c/Users/Rayane/Desktop/IsIdeas}"
TARGET_DIR="${HOME}/isideas-codex"

echo "Bootstrapping IsIdeas WSL runtime..."
echo "Windows checkout: ${WINDOWS_REPO_PATH}"
echo "Target clone: ${TARGET_DIR}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required inside WSL."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required inside WSL."
  exit 1
fi

if [ ! -d "${TARGET_DIR}/.git" ]; then
  git clone "${WINDOWS_REPO_PATH}" "${TARGET_DIR}"
else
  git -C "${TARGET_DIR}" fetch --all --prune
  git -C "${TARGET_DIR}" pull --ff-only || true
fi

mkdir -p "${TARGET_DIR}"
tar \
  --exclude=.git \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=runtime/local \
  --exclude=.env.local \
  -C "${WINDOWS_REPO_PATH}" \
  -cf - . | tar -C "${TARGET_DIR}" -xf -

cd "${TARGET_DIR}"

if [ ! -f .env.local ] && [ -f .env.example ]; then
  cp .env.example .env.local
fi

if [ -f "${WINDOWS_REPO_PATH}/.env.local" ]; then
  cp "${WINDOWS_REPO_PATH}/.env.local" .env.local
fi

npm install

cat <<'EOF'

Bootstrap complete.

Recommended next steps:
1. Review .env.local and confirm the runtime endpoints you want.
2. Start the dashboard:
   npm run dev
3. Run the runtime doctor:
   npm run runtime:doctor
EOF
