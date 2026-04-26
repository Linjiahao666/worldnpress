#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/www/wwwroot/worldnpress"
ENTRY_FILE="$APP_DIR/.output/server/index.mjs"
ENV_FILE="$APP_DIR/.env"
APP_NAME="worldnpress"
ACTION="${1:-start}"

usage() {
  echo "Usage: $0 [start|stop|restart|status]"
}

if ! command -v pm2 >/dev/null 2>&1; then
  echo "[ERROR] pm2 is not installed. Please run: npm i -g pm2"
  exit 1
fi

ensure_start_requirements() {
  if [ ! -f "$ENTRY_FILE" ]; then
    echo "[ERROR] Build output not found: $ENTRY_FILE"
    echo "Run build first in $APP_DIR (e.g. npm run build)."
    exit 1
  fi

  if [ ! -f "$ENV_FILE" ]; then
    echo "[ERROR] Env file not found: $ENV_FILE"
    exit 1
  fi
}

load_env() {
  # Read KEY=VALUE pairs from .env without executing shell code.
  while IFS= read -r raw_line || [ -n "$raw_line" ]; do
    line="${raw_line%$'\r'}"

    case "$line" in
      ''|\#*)
        continue
        ;;
    esac

    if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
      export "$line"
    fi
  done < "$ENV_FILE"

  # Fallback runtime values for Nuxt server mode.
  export NODE_ENV="${NODE_ENV:-production}"
  export HOST="${HOST:-0.0.0.0}"
  export PORT="${PORT:-3000}"
  export NUXT_HOST="${NUXT_HOST:-$HOST}"
  export NUXT_PORT="${NUXT_PORT:-$PORT}"

  # Normalize runtimeConfig env vars to NUXT_* for Nuxt server runtime.
  export NUXT_ADMIN_USERNAME="${NUXT_ADMIN_USERNAME:-${ADMIN_USERNAME:-}}"
  export NUXT_ADMIN_PASSWORD="${NUXT_ADMIN_PASSWORD:-${ADMIN_PASSWORD:-}}"
  export NUXT_SESSION_PASSWORD="${NUXT_SESSION_PASSWORD:-${SESSION_PASSWORD:-}}"
  export NUXT_API_KEY="${NUXT_API_KEY:-${API_KEY:-}}"

  # Keep non-prefixed vars aligned for backward compatibility.
  export ADMIN_USERNAME="${ADMIN_USERNAME:-${NUXT_ADMIN_USERNAME:-}}"
  export ADMIN_PASSWORD="${ADMIN_PASSWORD:-${NUXT_ADMIN_PASSWORD:-}}"
  export SESSION_PASSWORD="${SESSION_PASSWORD:-${NUXT_SESSION_PASSWORD:-}}"
  export API_KEY="${API_KEY:-${NUXT_API_KEY:-}}"
}

start_app() {
  ensure_start_requirements
  cd "$APP_DIR"
  load_env

  if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    pm2 reload "$APP_NAME" --update-env
  else
    pm2 start "$ENTRY_FILE" \
      --name "$APP_NAME" \
      --cwd "$APP_DIR" \
      --interpreter node \
      --time \
      --update-env
  fi

  pm2 save
  pm2 status "$APP_NAME"
  echo "[OK] $APP_NAME started from $ENTRY_FILE"
}

stop_app() {
  if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    pm2 stop "$APP_NAME"
    pm2 save
    echo "[OK] $APP_NAME stopped"
  else
    echo "[INFO] $APP_NAME is not managed by pm2"
  fi
}

restart_app() {
  ensure_start_requirements
  cd "$APP_DIR"
  load_env

  if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    pm2 restart "$APP_NAME" --update-env
  else
    pm2 start "$ENTRY_FILE" \
      --name "$APP_NAME" \
      --cwd "$APP_DIR" \
      --interpreter node \
      --time \
      --update-env
  fi

  pm2 save
  pm2 status "$APP_NAME"
  echo "[OK] $APP_NAME restarted"
}

case "$ACTION" in
  start)
    start_app
    ;;
  stop)
    stop_app
    ;;
  restart)
    restart_app
    ;;
  status)
    pm2 status "$APP_NAME"
    ;;
  *)
    usage
    exit 1
    ;;
esac