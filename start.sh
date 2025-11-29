#!/bin/bash
set -euo pipefail

# Install Node dependencies for the lightweight static server and start it.
#
# The runtime server now generates a simple placeholder build if the Flutter
# web output is missing so deployments do not fail. To ship the real app,
# run `flutter build web --release` locally and commit the generated
# `build/web` directory.
npm install --prefix web_server
npm start --prefix web_server
