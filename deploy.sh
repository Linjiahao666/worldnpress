#!/bin/bash

# ============================================================
# WorldnPress 统一部署脚本
# 用法:
#   chmod +x deploy.sh
#   ./deploy.sh              # 交互式选择
#   ./deploy.sh deploy       # 常规部署（自动检测 SSL）
#   ./deploy.sh init-ssl     # 首次申请 SSL 证书
#   ./deploy.sh renew-ssl    # 手动续期 SSL 证书
#   ./deploy.sh dev          # 仅启动 Nuxt（开发/测试）
#   ./deploy.sh down         # 停止并清理所有容器
# ============================================================

set -e

# ---- 颜色 ----
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# ---- 配置 ----
DOMAIN="worldnpress.com"
DOMAIN_WWW="www.worldnpress.com"
EMAIL="2195781154@qq.com"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# ============================================================
# 工具函数
# ============================================================

info()  { echo -e "${GREEN}$*${NC}"; }
warn()  { echo -e "${YELLOW}$*${NC}"; }
error() { echo -e "${RED}$*${NC}"; }
step()  { echo -e "\n${CYAN}[$1] $2${NC}"; }

has_ssl() {
  [ -f "letsencrypt/live/${DOMAIN}/fullchain.pem" ]
}

# 彻底停止并清理（包括孤儿容器）
clean_down() {
  info "停止并清理旧容器..."
  docker compose --profile ssl down --remove-orphans 2>/dev/null || true
  # 清理可能残留的一次性容器
  docker rm -f worldnpress-nginx-init 2>/dev/null || true
  docker rm -f worldnpress-certbot 2>/dev/null || true
}

wait_for_service() {
  local retries=15
  info "等待服务启动..."
  for i in $(seq 1 $retries); do
    if docker ps --format '{{.Names}}' | grep -q worldnpress-nginx; then
      info "✓ Nginx 运行正常"
      return 0
    fi
    sleep 2
  done
  error "错误：Nginx 未能启动"
  docker compose logs nginx
  return 1
}

show_status() {
  echo ""
  info "=== 服务状态 ==="
  docker compose ps
  echo ""
  info "=== 最新日志 ==="
  docker compose logs --tail=10 worldnpress
}

show_admin_info() {
  echo ""
  info "=== 管理后台 ==="
  if has_ssl; then
    echo -e "地址: ${YELLOW}https://${DOMAIN}/admin/login${NC}"
  else
    echo -e "地址: ${YELLOW}http://localhost/admin/login${NC}"
  fi
  echo -e "账号: ${YELLOW}admin${NC}"
  echo -e "密码: ${YELLOW}wp2026@Kx9mP4${NC}"
}

# ============================================================
# 命令: deploy — 常规部署
# ============================================================
cmd_deploy() {
  info "=== WorldnPress 部署 ==="

  # 检查 Docker
  if ! command -v docker &>/dev/null || ! docker compose version &>/dev/null; then
    error "请先安装 Docker 和 Docker Compose V2"
    exit 1
  fi

  clean_down

  if has_ssl; then
    info "检测到 SSL 证书，使用 HTTPS 模式部署"
    docker compose --profile ssl up -d --build worldnpress nginx certbot
    echo ""
    info "✓ 部署完成！"
    echo -e "HTTPS 访问: ${YELLOW}https://${DOMAIN}${NC}"
  else
    warn "未检测到 SSL 证书，使用 HTTP 模式部署"
    warn "如需 HTTPS，请运行: ./deploy.sh init-ssl"

    # 用 HTTP-only 配置启动 Nginx
    use_http_config
    docker compose up -d --build worldnpress nginx
    echo ""
    info "✓ 部署完成（HTTP 模式）"
    echo -e "HTTP 访问: ${YELLOW}http://localhost${NC}"
  fi

  show_status
  show_admin_info

  echo ""
  warn "提示: docker compose logs -f   查看实时日志"
  warn "提示: ./deploy.sh down          停止服务"
}

# ============================================================
# 命令: dev — 仅启动 Nuxt（无 Nginx）
# ============================================================
cmd_dev() {
  info "=== WorldnPress 开发模式 ==="
  clean_down
  docker compose up -d --build worldnpress
  info "✓ 启动完成！"
  echo -e "访问地址: ${YELLOW}http://localhost:3000${NC}"
  show_admin_info
}

# ============================================================
# 命令: init-ssl — 首次申请 SSL 证书
# ============================================================
use_http_config() {
  # 备份 HTTPS 配置，临时换成 HTTP-only
  if [ ! -f nginx.conf.https-bak ]; then
    cp nginx.conf nginx.conf.https-bak
  fi

  cat > nginx.conf <<'NGINXCONF'
upstream worldnpress {
    server worldnpress:3000;
}

server {
    listen 80;
    server_name worldnpress.com www.worldnpress.com;

    client_max_body_size 10m;

    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    location / {
        proxy_pass http://worldnpress;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXCONF
}

restore_https_config() {
  if [ -f nginx.conf.https-bak ]; then
    cp nginx.conf.https-bak nginx.conf
    rm -f nginx.conf.https-bak
  fi
}

cmd_init_ssl() {
  info "=== WorldnPress SSL 证书初始化 ==="

  if has_ssl; then
    warn "已存在 SSL 证书: letsencrypt/live/${DOMAIN}/"
    read -p "是否强制重新申请？[y/N] " CONFIRM
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
      info "已取消"
      exit 0
    fi
  fi

  step "1/5" "创建必要目录"
  mkdir -p letsencrypt letsencrypt-webroot

  step "2/5" "使用 HTTP 模式启动 Nginx"
  clean_down
  use_http_config
  docker compose up -d worldnpress nginx
  sleep 8

  step "3/5" "验证 Nginx 运行状态"
  if ! wait_for_service; then
    restore_https_config
    exit 1
  fi

  # 测试 ACME 路径
  mkdir -p letsencrypt-webroot/.well-known/acme-challenge
  echo "test" > letsencrypt-webroot/.well-known/acme-challenge/test.txt
  if docker compose exec nginx wget -q -O - http://localhost/.well-known/acme-challenge/test.txt 2>/dev/null | grep -q test; then
    info "✓ ACME challenge 路径验证成功"
  else
    warn "⚠ ACME 路径测试未通过，继续尝试申请..."
  fi
  rm -f letsencrypt-webroot/.well-known/acme-challenge/test.txt

  step "4/5" "向 Let's Encrypt 申请 SSL 证书"
  echo -e "域名: ${YELLOW}${DOMAIN}, ${DOMAIN_WWW}${NC}"
  echo -e "邮箱: ${YELLOW}${EMAIL}${NC}"

  docker compose --profile ssl run --rm certbot \
    certbot certonly \
      --webroot \
      -w /var/www/letsencrypt \
      -d "${DOMAIN}" \
      -d "${DOMAIN_WWW}" \
      --email "${EMAIL}" \
      --agree-tos \
      --no-eff-email \
      --force-renewal

  # 检查结果
  if ! has_ssl; then
    error "证书申请失败！请检查："
    echo "  1. 域名 ${DOMAIN} 和 ${DOMAIN_WWW} 的 A 记录是否指向本服务器"
    echo "  2. 防火墙/安全组是否已开放 80 端口"
    echo "  3. docker compose logs certbot 查看详细日志"
    restore_https_config
    exit 1
  fi

  info "✓ 证书申请成功！"

  step "5/5" "切换到 HTTPS 模式"
  restore_https_config

  # 重启所有服务
  docker compose --profile ssl down --remove-orphans
  docker compose --profile ssl up -d worldnpress nginx certbot

  echo ""
  info "========================================="
  info "✓ SSL 配置完成！"
  info "========================================="
  echo ""
  echo -e "HTTPS 访问: ${YELLOW}https://${DOMAIN}${NC}"
  echo -e "管理后台:   ${YELLOW}https://${DOMAIN}/admin/login${NC}"
  echo ""
  echo -e "证书有效期 90 天，certbot 容器会每 12 小时自动续期。"
  echo -e "手动续期:   ${YELLOW}./deploy.sh renew-ssl${NC}"
  echo ""
  docker compose ps
}

# ============================================================
# 命令: renew-ssl — 手动续期证书
# ============================================================
cmd_renew_ssl() {
  info "=== WorldnPress SSL 证书续期 ==="
  echo "[$(date)] 开始 SSL 证书续期检查..."

  docker compose --profile ssl run --rm certbot \
    certbot renew --webroot -w /var/www/letsencrypt

  # 重载 Nginx
  docker compose exec nginx nginx -s reload

  info "[$(date)] ✓ SSL 续期检查完成"
}

# ============================================================
# 命令: down — 停止服务
# ============================================================
cmd_down() {
  info "=== 停止 WorldnPress ==="
  clean_down
  info "✓ 所有容器已停止并清理"
}

# ============================================================
# 主入口
# ============================================================
CMD="${1:-}"

if [ -z "$CMD" ]; then
  echo -e "${GREEN}=== WorldnPress 部署工具 ===${NC}"
  echo ""
  echo "请选择操作："
  echo "  1) 部署 / 更新（自动检测 SSL）"
  echo "  2) 首次申请 SSL 证书"
  echo "  3) 手动续期 SSL 证书"
  echo "  4) 仅启动 Nuxt（开发模式）"
  echo "  5) 停止所有服务"
  echo ""
  read -p "请输入选项 [1]: " CHOICE
  CHOICE=${CHOICE:-1}

  case "$CHOICE" in
    1) CMD="deploy" ;;
    2) CMD="init-ssl" ;;
    3) CMD="renew-ssl" ;;
    4) CMD="dev" ;;
    5) CMD="down" ;;
    *)
      error "无效选项"
      exit 1
      ;;
  esac
fi

case "$CMD" in
  deploy)    cmd_deploy ;;
  init-ssl)  cmd_init_ssl ;;
  renew-ssl) cmd_renew_ssl ;;
  dev)       cmd_dev ;;
  down)      cmd_down ;;
  *)
    error "未知命令: $CMD"
    echo ""
    echo "可用命令: deploy | init-ssl | renew-ssl | dev | down"
    exit 1
    ;;
esac
