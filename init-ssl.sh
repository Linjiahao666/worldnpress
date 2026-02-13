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

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${GREEN}=== WorldnPress SSL 证书初始化 ===${NC}\n"

# ---- 第1步：创建必要的目录 ----
echo -e "${GREEN}[1/5] 创建目录...${NC}"
mkdir -p letsencrypt letsencrypt-webroot

# ---- 第2步：临时使用 HTTP-only 配置启动 Nginx ----
echo -e "${GREEN}[2/5] 使用 HTTP 模式启动 Nginx...${NC}"

# 停止所有服务
docker compose down 2>/dev/null || true

# 备份正式 HTTPS 配置，换上仅 HTTP 的初始化配置
cp nginx.conf nginx.conf.ssl-bak
cp nginx-init.conf nginx.conf

# 正常启动 worldnpress + nginx（此时 nginx.conf 是纯 HTTP，不依赖证书）
docker compose up -d worldnpress nginx

echo -e "${GREEN}等待服务启动...${NC}"
sleep 8

# ---- 第3步：验证 Nginx 是否正常运行 ----
echo -e "${GREEN}[3/5] 验证 Nginx 是否正常运行...${NC}"
if ! docker ps --format '{{.Names}}' | grep -q worldnpress-nginx; then
    echo -e "${RED}错误：Nginx 未能启动，请检查日志：${NC}"
    docker compose logs nginx
    # 恢复配置
    cp nginx.conf.ssl-bak nginx.conf
    exit 1
fi
echo -e "${GREEN}✓ Nginx 运行正常${NC}"

# 测试 ACME 路径可访问（在 webroot 放一个测试文件）
mkdir -p letsencrypt-webroot/.well-known/acme-challenge
echo "test" > letsencrypt-webroot/.well-known/acme-challenge/test.txt
if docker compose exec nginx wget -q -O - http://localhost/.well-known/acme-challenge/test.txt | grep -q test; then
    echo -e "${GREEN}✓ ACME challenge 路径验证成功${NC}"
else
    echo -e "${YELLOW}⚠ 内部 ACME 路径测试未通过，继续尝试申请...${NC}"
fi
rm -f letsencrypt-webroot/.well-known/acme-challenge/test.txt

# ---- 第4步：申请证书 ----
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

# ---- 检查证书结果 ----
if [ ! -f "letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    echo -e "${RED}错误：证书申请失败！请检查：${NC}"
    echo -e "  1. 域名 ${DOMAIN} 和 ${DOMAIN_WWW} 是否已 A 记录解析到本服务器 IP"
    echo -e "  2. 防火墙/安全组是否已开放 80 端口"
    echo -e "  3. 运行 docker compose logs certbot 查看详细日志"
    # 恢复配置
    cp nginx.conf.ssl-bak nginx.conf
    exit 1
fi

echo -e "\n${GREEN}✓ 证书申请成功！${NC}\n"

# ---- 第5步：切换到 HTTPS 配置 ----
echo -e "${GREEN}[5/5] 切换到 HTTPS 模式...${NC}"

# 恢复正式 HTTPS 配置
cp nginx.conf.ssl-bak nginx.conf
rm -f nginx.conf.ssl-bak

# 重启所有服务（nginx 现在加载 HTTPS 配置）
docker compose down
docker compose up -d

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}✓ SSL 配置完成！${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e ""
echo -e "HTTPS 访问: ${YELLOW}https://${DOMAIN}${NC}"
echo -e "管理后台:   ${YELLOW}https://${DOMAIN}/admin/login${NC}"
echo -e ""
echo -e "证书有效期 90 天，certbot 容器会每 12 小时自动续期。"
echo -e "手动续期:   ${YELLOW}docker compose run --rm certbot 'certbot renew --webroot -w /var/www/letsencrypt'${NC}"
echo -e "重载 Nginx: ${YELLOW}docker compose exec nginx nginx -s reload${NC}"
echo -e ""

# 显示服务状态
docker compose ps
