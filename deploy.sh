#!/bin/bash

# WorldnPress Docker 部署脚本

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== WorldnPress Docker 部署 ===${NC}\n"

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}错误: 未安装 Docker，请先安装 Docker${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}错误: 未安装 Docker Compose，请先安装${NC}"
    exit 1
fi

# 选择部署模式
echo "请选择部署模式："
echo "1) 完整部署（Nuxt + Nginx）"
echo "2) 仅 Nuxt 服务"
read -p "请输入选项 [1]: " MODE
MODE=${MODE:-1}

# 清理旧容器
echo -e "\n${GREEN}停止并清理旧容器...${NC}"
docker-compose down 2>/dev/null || true

if [ "$MODE" = "2" ]; then
    # 临时禁用 Nginx 服务
    echo -e "${GREEN}使用仅 Nuxt 模式...${NC}"
    docker-compose up -d --build worldnpress
    echo -e "\n${GREEN}✓ 部署完成！${NC}"
    echo -e "访问地址: ${YELLOW}http://localhost:3000${NC}"
else
    # 完整部署
    echo -e "${GREEN}使用完整模式（Nuxt + Nginx）...${NC}"
    docker-compose up -d --build
    echo -e "\n${GREEN}✓ 部署完成！${NC}"
    echo -e "访问地址: ${YELLOW}http://localhost${NC} (Nginx)"
    echo -e "直接访问: ${YELLOW}http://localhost:3000${NC} (Nuxt)"
fi

# 等待服务启动
echo -e "\n${GREEN}等待服务启动...${NC}"
sleep 5

# 显示状态
echo -e "\n${GREEN}=== 服务状态 ===${NC}"
docker-compose ps

# 显示日志
echo -e "\n${GREEN}=== 最新日志 ===${NC}"
docker-compose logs --tail=20 worldnpress

echo -e "\n${YELLOW}提示: 使用 'docker-compose logs -f' 查看实时日志${NC}"
echo -e "${YELLOW}提示: 使用 'docker-compose down' 停止服务${NC}"

# 管理员账号信息
echo -e "\n${GREEN}=== 管理后台 ===${NC}"
echo -e "地址: ${YELLOW}http://localhost/admin/login${NC}"
echo -e "账号: ${YELLOW}admin${NC}"
echo -e "密码: ${YELLOW}wp2026@Kx9mP4${NC}"
