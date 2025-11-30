#!/bin/bash
set -euo pipefail

# This script serves the Flutter web build with the lightweight Express server
# defined in `server.js`. It also ensures the `build/web` assets exist so the
# web UI mirrors the mobile experience (multi-step loan applications, etc.).

ensure_web_build() {
  if [[ -f build/web/index.html ]]; then
    echo "Using existing Flutter web build in build/web"
    return
  fi

  if command -v flutter >/dev/null 2>&1; then
    echo "build/web missing; running flutter build web --release"
    flutter build web --release
  else
    echo "Error: build/web is missing and Flutter is not installed in this environment." >&2
    echo "Please run 'flutter build web --release' locally to generate the web assets before deploying." >&2
    exit 1
  fi
}

ensure_web_build

npm install
npm start
