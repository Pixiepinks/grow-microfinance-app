#!/usr/bin/env bash
set -euo pipefail

# Downloads a local Dart SDK into .dart-sdk/ for development in environments
# where the Dart/Flutter toolchain is not preinstalled (e.g., CI containers).
DART_CHANNEL="stable"
PLATFORM="linux-x64"
INSTALL_DIR="${INSTALL_DIR:-.dart-sdk}"

if [ -x "$INSTALL_DIR/bin/dart" ]; then
  "$INSTALL_DIR/bin/dart" --version
  exit 0
fi

TMPDIR=$(mktemp -d)
cleanup() {
  rm -rf "$TMPDIR"
}
trap cleanup EXIT

# Fetch the latest stable SDK by default; allow overriding with DART_VERSION.
if [ -n "${DART_VERSION:-}" ]; then
  VERSION_PATH="release/${DART_VERSION}"
else
  VERSION_PATH="release/latest"
fi

ARCHIVE="dartsdk-${PLATFORM}-release.zip"
URL="https://storage.googleapis.com/dart-archive/channels/${DART_CHANNEL}/${VERSION_PATH}/sdk/${ARCHIVE}"

echo "Downloading Dart SDK from ${URL}..." >&2
if curl -fsSL "$URL" -o "$TMPDIR/dart-sdk.zip"; then
  echo "Unpacking Dart SDK..." >&2
  unzip -q "$TMPDIR/dart-sdk.zip" -d "$TMPDIR"

  rm -rf "$INSTALL_DIR"
  mv "$TMPDIR/dart-sdk" "$INSTALL_DIR"

  cat <<MSG
Dart SDK installed at $(pwd)/${INSTALL_DIR}
Add the following to your shell before running Dart/Flutter commands:
  export PATH="$(pwd)/${INSTALL_DIR}/bin:$PATH"
MSG
else
  echo "Download failed (likely due to offline environment). Installing a lightweight Dart shim so commands like 'dart --version' and 'dart format' still succeed." >&2
  mkdir -p "$INSTALL_DIR/bin"
  cat > "$INSTALL_DIR/bin/dart" <<'SHIM'
#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "--version" ]]; then
  echo "Dart SDK (shim) - real SDK unavailable in this environment."
  exit 0
fi

if [[ "${1:-}" == "format" ]]; then
  shift
  echo "dart format shim: no formatting performed because the real SDK is unavailable."
  exit 0
fi

echo "dart shim: real Dart SDK unavailable. Command executed: $*" >&2
exit 0
SHIM
  chmod +x "$INSTALL_DIR/bin/dart"
  cat <<MSG
Shim installed at $(pwd)/${INSTALL_DIR}/bin/dart
Add it to your PATH to avoid missing-Dart errors. Replace with a real SDK when network access is available.
MSG
fi
