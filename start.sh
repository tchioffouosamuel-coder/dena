#!/usr/bin/env bash
set -euo pipefail

cd backend
npm install
npm run build
npm run start:prod
