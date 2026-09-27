#!/bin/sh
# Mac/Linux: starts the MMG website at http://localhost:3000
cd "$(dirname "$0")"
(sleep 1; open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000) &
python3 -m http.server 3000
