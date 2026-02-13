#!/bin/bash

# ============================================================
# WorldnPress - Let's Encrypt SSL 证书初始化脚本
# 用法: chmod +x init-ssl.sh && ./init-ssl.sh
# ============================================================

set -e

DOMAIN="worldnpress.com"
DOMAIN_WWW="www.worldnpress.com"
EMAIL="admin@worldnpress.com"  # 修改为你的邮箱，用于接收证书过期提醒

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== WorldnPress SSL 证书初始化 ===${NC}\n"

# ---- 第1步：创建必要的目录 ----
echo -e "${GREEN}[1/5] 创建目录...${NC}"
mkdir -p letsencrypt letsencrypt-webroot

# ---- 第2步：用仅 HTTP 的配置启动 Nginx ----
echo -e "${GREEN}[2/5] 使用 HTTP 模式启动 Nginx...${NC}"

# 先停止所有服务
docker compose down 2>/dev/null || true

# 临时使用 nginx-init.conf（仅 HTTP，不需要证书）
docker compose -f docker-compose.yml up -d worldnpress
sleep 5

# 用初始化配置启动 nginx
docker compose -f docker-compose.yml run -d \
  --name worldnpress-nginx-init \
  -v "$(pwd)/nginx-init.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$(pwd)/letsencrypt:/etc/letsencrypt" \
  -v "$(pwd)/letsencrypt-webroot:/var/www/letsencrypt" \
  -p 80:80 \
  nginx

sleep 3

echo -e "${GREEN}[3/5] 验证 Nginx 是否正常运行...${NC}"
if ! docker ps | grep -q worldnpress-nginx-init; then
    echo -e "${RED}错误：Nginx 未能启动，请检查日志${NC}"
    docker logs worldnpress-nginx-init 2>&1 || true
    exit 1
fi

# ---- 第3步：申请证书 ----
echo -e "${GREEN}[4/5] 向 Let's Encrypt 申请 SSL 证书...${NC}"
echo -e "${YELLOW}域名: ${DOMAIN}, ${DOMAIN_WWW}${NC}"
echo -e "${YELLOW}邮箱: ${EMAIL}${NC}\n"

docker compose run --rm certbot \
  "certbot certonly \
    --webroot \
    -w /var/www/letsencrypt \
    -d ${DOMAIN} \
    -d ${DOMAIN_WWW} \
    --email ${EMAIL} \
    --agree-tos \
    --no-eff-email \
    --force-renewal"

# ---- 第4步：检查证书文件 ----
if [ ! -f "letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    echo -e "${RED}错误：证书申请失败！请检查：${NC}"
    echo -e "  1. 域名 ${DOMAIN} 是否已解析到本服务器 IP"
    echo -e "  2. 防火墙是否开放 80 端口"
    echo -e "  3. 查看 certbot 日志获取详情"
    docker stop worldnpress-nginx-init 2>/dev/null || true
    docker rm worldnpress-nginx-init 2>/dev/null || true
    exit 1
fi

echo -e "${GREEN}✓ 证书申请成功！${NC}\n"

# ---- 第5步：切换到正式 HTTPS 配置 ----
echo -e "${GREEN}[5/5] 切换到 HTTPS 模式...${NC}"

# 停止临时 nginx
docker stop worldnpress-nginx-init 2>/dev/null || true
docker rm worldnpress-nginx-init 2>/dev/null || true

# 用正式配置（含 HTTPS）启动所有服务
docker compose down 2>/dev/null || true
docker compose up -d

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}✓ SSL 配置完成！${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e ""
echo -e "HTTPS 访问: ${YELLOW}https://${DOMAIN}${NC}"
echo -e "管理后台:   ${YELLOW}https://${DOMAIN}/admin/login${NC}"
echo -e ""
echo -e "证书有效期 90 天，certbot 容器会自动续期。"
echo -e "手动续期:   ${YELLOW}docker compose run --rm certbot 'certbot renew'${NC}"
echo -e "重载 Nginx: ${YELLOW}docker compose exec nginx nginx -s reload${NC}"
echo -e ""

# 显示服务状态
docker compose ps
