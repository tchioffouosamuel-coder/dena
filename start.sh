#!/usr/bin/env bash
set -euo pipefail

export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:4000/api}"

npm run build --workspace backend
npm run build --workspace frontend
npm run start
