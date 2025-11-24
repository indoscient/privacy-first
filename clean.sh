#!/usr/bin/env bash
#
# clean.sh – delete caches, temporary artefacts and build output
# -------------------------------------------------------------
# Keeps local node_modules intact.
# -------------------------------------------------------------
set -euo pipefail

# ------------------------------------------------------------------
# Helper: pretty section headings
# ------------------------------------------------------------------
section() {
    echo -e "\n=== $1 ==="
}

# ------------------------------------------------------------------
# 1️⃣ Root‑level artefacts (outside client/server)
# ------------------------------------------------------------------
section "Root‑level caches & logs"
rm -f .eslintcache         # ESLint cache
rm -f .tsbuildinfo        # TypeScript incremental build info
rm -f npm-debug.log yarn-error.log

# ----------------------------------------------------------
# 2️⃣ Test & coverage artefacts
# ---------------------------------------------------------------
section "Test & coverage directories"
rm -rf coverage .nyc_output .vitest .jest

# -------------------------------------------------------
# 3️⃣ OS / editor junk (recursive)
# ------------------------------------------------------------------
section "OS / editor junk"
# Files
find . -type f \( \
    -name '.DS_Store' \
    -o -name 'Thumbs.db' \
    -o -name '*~' \
    -o -name '*.log' \
\) -print -delete

# Directories (but **do not delete node_modules**)
find . -type d \( \
    -name '__pycache__' \
    -o -name '.cache' \
    -o -name '.idea' \
    -o -name '.vscode' \
\) -prune -print -exec rm -rf {} +

# -------------------------------------------------------------
# 4️⃣ Per‑project clean‑up (client & server)
# --------------------------------------------------------
for dir in client server; do
   if [[ -d "$dir" ]]; then
      section "Cleaning $dir"

        # ------------------------------------------------------------------
        # Keep node_modules – comment out the line below if you ever want to delete them.
        # ------------------------------------------------------------------
      # rm -rf "$dir/node_modules"   # <-- DO NOT RUN (kept)

        # Build artefacts – uncomment if you never want them in VCS
        rm -rf "$dir/dist" "$dir/build"

      # Vite / React caches (safe to drop)
      rm -rf "$dir/.vite" "$dir/.vitepress" "$dir/.next" 2>/dev/null || true

        # TypeScript & ESLint caches that may live inside the project
        find "$dir" -type f -name '*.tsbuildinfo' -delete
     find "$dir" -type f -name '.eslintcache' -delete

        # Any stray log files inside the project
        find "$dir" -type f -name '*.log' -delete
    fi
done

# ------------------------------------------------------------------
# 5️⃣ Final tidy‑up – remove empty directories left behind
# ------------------------------------------------------------------
section "Final tidy‑up"
find . -type d -empty -delete

echo -e "\n✅ Clean‑up completed (node_modules retained)."
