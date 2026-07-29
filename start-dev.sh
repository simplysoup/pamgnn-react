#!/usr/bin/env bash
set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# ── Colors ──────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; NC='\033[0m' # No Color
info()  { echo -e "${CYAN}[info]${NC}  $*"; }
ok()    { echo -e "${GREEN}[ok]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC}  $*"; }
err()   { echo -e "${RED}[error]${NC} $*"; }

SESSION_NAME="pamgnn-dev"
PORT="${DEV_PORT:-55800}"

# ── Prerequisites ───────────────────────────────────────
command -v pnpm >/dev/null 2>&1 || { err "pnpm not found."; exit 1; }
command -v tmux  >/dev/null 2>&1 || { err "tmux not found. Install it: apt install tmux"; exit 1; }

# ── Check Docker Postgres ───────────────────────────────
PG_RUNNING=false
if command -v docker >/dev/null 2>&1; then
  if docker ps --format '{{.Names}} {{.Status}}' 2>/dev/null | grep -q 'postgres.*healthy'; then
    PG_RUNNING=true
  fi
fi

if [ "$PG_RUNNING" = false ]; then
  warn "Postgres container is not running. Starting Docker services…"
  if [ -f docker-compose.yml ]; then
    docker compose up -d postgres mailhog 2>/dev/null || {
      err "Failed to start Docker services. Start Postgres manually and re-run."
      exit 1
    }
    info "Waiting for Postgres to become healthy…"
    for i in $(seq 1 20); do
      if docker ps --format '{{.Names}} {{.Status}}' 2>/dev/null | grep -q 'postgres.*healthy'; then
        ok "Postgres is healthy."
        break
      fi
      sleep 3
    done
  else
    err "No docker-compose.yml found. Ensure Postgres is running on localhost:5432."
    exit 1
  fi
fi

# ── Kill existing session if any ────────────────────────
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  warn "Existing dev session '$SESSION_NAME' found – killing it."
  tmux kill-session -t "$SESSION_NAME" 2>/dev/null || true
  sleep 1
fi

# Kill any leftover process on our port
if fuser "$PORT/tcp" >/dev/null 2>&1; then
  PIDS=$(fuser "$PORT/tcp" 2>/dev/null | tr '\n' ' ')
  warn "Port $PORT is in use by PID(s): $PIDS – killing."
  fuser -k "$PORT/tcp" 2>/dev/null || true
  sleep 2
fi

# ── Launch ──────────────────────────────────────────────
info "Starting dev server on port $PORT …"
tmux new-session -d -s "$SESSION_NAME" -x "$(tput cols 2>/dev/null || echo 120)" -y "$(tput lines 2>/dev/null || echo 40)" \
  "pnpm dev --port $PORT 2>&1 | tee /tmp/pamgnn-dev.log"

sleep 3

# Quick health check
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  ok "Dev server is running in tmux session: ${CYAN}${SESSION_NAME}${NC}"
  info "Port:         ${CYAN}${PORT}${NC}"
  info "URL:          ${CYAN}http://76.13.4.115:${PORT}/${NC}"
  info "Via Caddy:    ${CYAN}http://76.13.4.115:80/${NC}"
  info "Attach:       ${CYAN}tmux attach -t ${SESSION_NAME}${NC}"
  info "Detach:       ${CYAN}Ctrl+B, D${NC}"
  info "Stop:         ${CYAN}./close-dev.sh${NC}"
  echo ""
  # Show last few lines from the log
  if [ -f /tmp/pamgnn-dev.log ]; then
    echo -e "${YELLOW}─── last output ───${NC}"
    tail -5 /tmp/pamgnn-dev.log
    echo -e "${YELLOW}──────────────────${NC}"
  fi
else
  err "Failed to start dev server. Check /tmp/pamgnn-dev.log for details."
  exit 1
fi
