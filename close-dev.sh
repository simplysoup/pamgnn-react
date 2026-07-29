#!/usr/bin/env bash
set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# ── Colors ──────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; NC='\033[0m'
info() { echo -e "${CYAN}[info]${NC}  $*"; }
ok()   { echo -e "${GREEN}[ok]${NC}    $*"; }
warn() { echo -e "${YELLOW}[warn]${NC}  $*"; }
err()  { echo -e "${RED}[error]${NC} $*"; }

SESSION_NAME="pamgnn-dev"
PORT="${DEV_PORT:-55800}"

ANY_KILLED=false

# ── Kill tmux session ───────────────────────────────────
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  tmux kill-session -t "$SESSION_NAME" 2>/dev/null || true
  ok "Killed tmux session '$SESSION_NAME'."
  ANY_KILLED=true
else
  info "No tmux session '$SESSION_NAME' found."
fi

# ── Kill any leftover dev server on our port ────────────
if fuser "$PORT/tcp" >/dev/null 2>&1; then
  PIDS=$(fuser "$PORT/tcp" 2>/dev/null | tr '\n' ' ')
  warn "Port $PORT still in use by PID(s): $PIDS – killing."
  fuser -k "$PORT/tcp" 2>/dev/null || true
  sleep 1
  # Force kill if still alive
  if fuser "$PORT/tcp" >/dev/null 2>&1; then
    fuser -k -9 "$PORT/tcp" 2>/dev/null || true
    warn "Force killed."
  fi
  ANY_KILLED=true
fi

if [ "$ANY_KILLED" = true ]; then
  ok "Dev server stopped."
else
  info "No dev server was running."
fi
