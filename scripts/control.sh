#!/usr/bin/env bash
# ─── pamgnn Docker control scripts ──────────────────────────
# Usage: ./scripts/control.sh <command>
# Commands: up, down, logs, rebuild, rebuild-frontend,
#           rebuild-backend, restart, status, shell
set -e

COMPOSE="docker compose"
SERVICE="app"

case "${1:-help}" in
  up)
    echo "Starting all services in background..."
    $COMPOSE up -d
    $COMPOSE logs --tail=10 -f $SERVICE
    ;;

  down)
    echo "Stopping all services..."
    $COMPOSE down
    ;;

  logs)
    $COMPOSE logs --tail=50 -f $SERVICE
    ;;

  status)
    $COMPOSE ps
    echo ""
    echo "App health: $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:55800/api/health 2>/dev/null || echo 'unreachable')"
    ;;

  rebuild)
    echo "=== Full rebuild (clean, all layers) ==="
    $COMPOSE build --no-cache $SERVICE
    $COMPOSE up -d $SERVICE
    echo "Waiting for app to be ready..."
    until curl -s -o /dev/null http://127.0.0.1:55800/api/health 2>/dev/null; do
      sleep 2
    done
    echo "App is live at http://127.0.0.1:55800"
    ;;

  rebuild-frontend)
    echo "=== Frontend-only rebuild ==="
    echo "Rebuilding the Docker image (triggers 'next build' for TS/JS/CSS changes)..."
    $COMPOSE build $SERVICE
    $COMPOSE up -d $SERVICE
    echo "Waiting for app to be ready..."
    until curl -s -o /dev/null http://127.0.0.1:55800/api/health 2>/dev/null; do
      sleep 2
    done
    echo "Frontend is live at http://127.0.0.1:55800"
    ;;

  rebuild-backend)
    echo "=== Backend changes (migrations, seed, collections, payload config) ==="
    echo "Performing a no-cache rebuild to ensure fresh backend code..."
    docker compose build --no-cache $SERVICE
    docker compose up -d $SERVICE
    echo "Migrations and seed run automatically on startup..."
    docker compose logs --tail=30 -f $SERVICE
    ;;

  restart)
    echo "Restarting app container (no rebuild)..."
    $COMPOSE restart $SERVICE
    ;;

  shell)
    echo "Opening shell in running app container..."
    $COMPOSE exec $SERVICE sh
    ;;

  help|*)
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  up               Start all services (background)"
    echo "  down             Stop all services"
    echo "  logs             Tail app logs"
    echo "  status           Show service status + health check"
    echo "  rebuild          Full clean rebuild (all layers)"
    echo "  rebuild-frontend Quick rebuild for frontend code (TSX/CSS)"
    echo "  rebuild-backend  Rebuild for backend changes (migrations, collections)"
    echo "  restart          Restart app (no rebuild, pick up volume changes)"
    echo "  shell            Open a shell inside the running app container"
    ;;
esac
