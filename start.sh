#!/bin/bash
set -euo pipefail

# Ensure the Flutter web build output exists before starting the server.
if [ ! -d "build/web" ]; then
  echo "Flutter web build not found at build/web. Run 'flutter build web --release' and commit the output." >&2
  exit 1
fi

# Install Node dependencies for the lightweight static server and start it.
npm install --prefix web_server
npm start --prefix web_server
