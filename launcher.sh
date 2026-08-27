#!/usr/bin/env bash
# launcher.sh
# -----------
# Double-click or run this script to start the Dentic Control Panel on macOS/Linux.

set -e

echo "============================================================"
echo "  Dentic | Dental Clinic Management System"
echo "  Control Panel Launcher"
echo "============================================================"
echo ""

if ! command -v node &>/dev/null; then
  echo " [!] Node.js was not detected on this machine."
  echo " --------------------------------------------------------"

  if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v brew &>/dev/null; then
      echo " [*] Installing Node.js via Homebrew..."
      brew install node
    else
      echo " [!] Homebrew not found. Please install Node.js manually:"
      echo "     https://nodejs.org"
      open "https://nodejs.org"
      exit 1
    fi
  elif command -v apt-get &>/dev/null; then
    echo " [*] Installing Node.js via apt-get..."
    sudo apt-get update && sudo apt-get install -y nodejs npm
  else
    echo " [x] Auto-install not supported on this platform."
    echo "     Please install Node.js from: https://nodejs.org"
    exit 1
  fi
fi

echo " [v] Node.js detected: $(node --version)"
echo " [*] Starting Dentic Control Panel on http://localhost:3030 ..."
echo ""

node "$(dirname "$0")/launcher.js"
