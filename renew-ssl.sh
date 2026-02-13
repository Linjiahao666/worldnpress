#!/bin/bash

# ============================================================
# WorldnPress - SSL 证书续期脚本
# 可手动运行或加入 crontab:
#   0 3 * * 1 /path/to/renew-ssl.sh >> /var/log/ssl-renew.log 2>&1
# ============================================================

set -e

COMPOSE_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$COMPOSE_DIR"

echo "[$(date)] 开始 SSL 证书续期检查..."

# 续期证书
docker compose run --rm certbot "certbot renew --webroot -w /var/www/letsencrypt"

# 重载 Nginx 使新证书生效
docker compose exec nginx nginx -s reload

echo "[$(date)] SSL 续期检查完成。"
