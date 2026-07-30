#!/usr/bin/env bash
# ─── pamgnn bare-metal control script ──────────────────────
# Usage: ./scripts/control.sh <command>
# Commands: build, restart, stop, logs, status
set -e

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PM2="pm2"
APP_NAME="pamgnn"

case "${1:-help}" in
  build)
    echo "=== Build Next.js app ==="
    cd "$APP_DIR"
    pnpm run build
    # Link static assets into standalone output so server.js can serve them
    # Copy assets into standalone output so server.js can serve them
    cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
    cp -r public .next/standalone/public 2>/dev/null || true
    $PM2 restart "$APP_NAME" || $PM2 start .next/standalone/server.js --name "$APP_NAME"
    echo "✓ Build complete & app restarted"
    ;;

  restart)
    echo "=== Restart app ==="
    $PM2 restart "$APP_NAME"
    echo "✓ App restarted"
    ;;

  stop)
    echo "=== Stop app ==="
    $PM2 stop "$APP_NAME"
    echo "✓ App stopped"
    ;;

  logs)
    $PM2 logs "$APP_NAME" --lines 50
    ;;

  status)
    $PM2 status "$APP_NAME"
    echo ""
    echo "App health: $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:55800/api/health 2>/dev/null || echo 'unreachable')"
    ;;

  help|*)
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  build    Build Next.js + restart PM2"
    echo "  restart  Restart PM2 process"
    echo "  stop     Stop PM2 process"
    echo "  logs     Tail app logs"
    echo "  status   Show PM2 status + health check"
    echo ""
    echo "Built files are served from .next/standalone/server.js on port 55800."
    echo "Caddy proxies :80 → localhost:55800."
    ;;
esac
