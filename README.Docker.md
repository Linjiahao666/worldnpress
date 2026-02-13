# Docker 部署指南

## 快速开始

所有部署操作统一通过 `deploy.sh`（Linux/Mac）或 `deploy.bat`（Windows）完成。

### Linux / Mac

```bash
chmod +x deploy.sh

# 交互式菜单
./deploy.sh

# 或直接指定命令
./deploy.sh deploy       # 常规部署（自动检测 SSL）
./deploy.sh init-ssl     # 首次申请 SSL 证书
./deploy.sh renew-ssl    # 手动续期 SSL 证书
./deploy.sh dev          # 仅启动 Nuxt（开发/测试）
./deploy.sh down         # 停止所有服务
```

### Windows

```cmd
deploy.bat               &:: 交互式菜单
deploy.bat deploy        &:: 常规部署
deploy.bat dev           &:: 仅启动 Nuxt
deploy.bat down          &:: 停止所有服务
```

> SSL 证书初始化和续期需在 Linux 服务器上执行。

## 部署模式详解

### 1. 常规部署 (`deploy`)

脚本会自动检测是否存在 SSL 证书：

- **有证书** → HTTPS 模式：Nuxt + Nginx (HTTPS) + Certbot 自动续期
- **无证书** → HTTP 模式：Nuxt + Nginx (HTTP)

### 2. SSL 证书初始化 (`init-ssl`)

首次部署到生产服务器时使用，自动完成：

1. 创建目录
2. 以 HTTP 模式启动 Nginx（用于域名验证）
3. 通过 Let's Encrypt 申请 SSL 证书
4. 切换到 HTTPS 模式

**前置条件：**

- 域名 A 记录已指向服务器 IP
- 服务器 80/443 端口已开放

### 3. 开发模式 (`dev`)

仅启动 Nuxt 容器，不启动 Nginx，访问 `http://localhost:3000`。

## 常用命令

```bash
# 查看实时日志
docker compose logs -f worldnpress

# 查看所有服务状态
docker compose ps

# 进入容器
docker compose exec worldnpress sh

# 停止并删除数据卷（谨慎！会清除数据库）
docker compose down -v
```

## 数据备份与恢复

```bash
# 备份
docker run --rm -v worldnpress-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/worldnpress-data-$(date +%Y%m%d).tar.gz /data

# 恢复
docker run --rm -v worldnpress-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/worldnpress-data-YYYYMMDD.tar.gz -C /
```

## 性能优化

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  worldnpress:
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 1G
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 故障排查

```bash
# 查看日志
docker compose logs -f worldnpress
docker compose logs nginx

# 容器状态
docker compose ps
docker inspect worldnpress

# 进入容器调试
docker compose exec worldnpress sh

# 数据库权限问题
docker compose exec worldnpress chown -R nodejs:nodejs /data
```

## 更新部署

```bash
git pull
./deploy.sh deploy    # 自动重建并重启
```
