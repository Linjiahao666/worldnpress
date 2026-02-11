# Docker 部署指南

## 快速开始

### 1. 构建并启动服务

```bash
# 构建镜像并启动容器
docker compose up -d --build

# 查看日志
docker compose logs -f worldnpress

# 访问应用
# http://localhost        (通过 Nginx)
# http://localhost:3000   (直接访问 Nuxt)
```

### 2. 常用命令

```bash
# 停止服务
docker compose down

# 停止并删除数据卷（谨慎使用！）
docker compose down -v

# 重启服务
docker compose restart

# 查看运行状态
docker compose ps

# 进入容器
docker compose exec worldnpress sh

# 查看实时日志
docker compose logs -f worldnpress
```

## 生产环境部署

### 1. 使用环境变量

创建 `.env` 文件：

```env
# 应用端口
PORT=3000

# 数据库密钥（建议修改）
SESSION_PASSWORD=your-secure-session-password-here

# API 基础 URL（如果需要）
NUXT_PUBLIC_API_BASE=https://yourdomain.com
```

### 2. HTTPS 配置

1. 修改 `nginx.conf` 添加 SSL 配置：

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # ... 其他配置
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

2. 在 `docker-compose.yml` 中挂载证书：

```yaml
nginx:
  volumes:
    - ./ssl:/etc/nginx/ssl:ro
  ports:
    - "443:443"
```

### 3. 数据备份

```bash
# 备份数据卷
docker run --rm -v worldnpress-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/worldnpress-data-$(date +%Y%m%d).tar.gz /data

# 恢复数据
docker run --rm -v worldnpress-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/worldnpress-data-YYYYMMDD.tar.gz -C /
```

## 仅使用 Nuxt 服务（无 Nginx）

如果不需要 Nginx，可修改 `docker-compose.yml`：

```yaml
version: "3.8"

services:
  worldnpress:
    build: .
    container_name: worldnpress
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - worldnpress-data:/data
    environment:
      - NODE_ENV=production
      - PORT=3000

volumes:
  worldnpress-data:
```

然后运行：

```bash
docker compose up -d --build
```

访问 `http://localhost:3000`

## 性能优化

### 1. 限制资源使用

在 `docker-compose.yml` 中添加：

```yaml
services:
  worldnpress:
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 1G
        reservations:
          cpus: "0.5"
          memory: 512M
```

### 2. 健康检查

已在 `docker-compose.yml` 中配置，确保服务异常时自动重启。

### 3. 日志管理

```yaml
services:
  worldnpress:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 故障排查

### 查看容器日志

```bash
docker compose logs -f worldnpress
```

### 检查容器状态

```bash
docker compose ps
docker inspect worldnpress
```

### 进入容器调试

```bash
docker compose exec worldnpress sh
# 在容器内检查
ls -la /app
ls -la /data
ps aux
```

### 数据库文件权限问题

如果遇到数据库无法写入：

```bash
docker compose exec worldnpress sh
chown -R nodejs:nodejs /data
```

## 更新部署

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建
docker-compose build --no-cache

# 3. 重启服务（数据会保留）
docker-compose up -d

# 4. 查看日志确认
docker-compose logs -f worldnpress
```
