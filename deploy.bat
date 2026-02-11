@echo off
REM WorldnPress Docker 部署脚本 (Windows)

echo === WorldnPress Docker 部署 ===
echo.

REM 检查 Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未安装 Docker，请先安装 Docker Desktop
    pause
    exit /b 1
)

docker compose version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未安装 Docker Compose V2
    pause
    exit /b 1
)

REM 选择部署模式
echo 请选择部署模式：
echo 1^) 完整部署（Nuxt + Nginx）
echo 2^) 仅 Nuxt 服务
set /p MODE="请输入选项 [1]: "
if "%MODE%"=="" set MODE=1

REM 清理旧容器
echo.
echo 停止并清理旧容器...
docker compose down 2>nul

if "%MODE%"=="2" (
    REM 仅 Nuxt 模式
    echo 使用仅 Nuxt 模式...
    docker compose up -d --build worldnpress
    echo.
    echo ✓ 部署完成！
    echo 访问地址: http://localhost:3000
) else (
    REM 完整部署
    echo 使用完整模式（Nuxt + Nginx）...
    docker compose up -d --build
    echo.
    echo ✓ 部署完成！
    echo 访问地址: http://localhost (Nginx)
    echo 直接访问: http://localhost:3000 (Nuxt)
)

REM 等待服务启动
echo.
echo 等待服务启动...
timeout /t 5 /nobreak >nul

REM 显示状态
echo.
echo === 服务状态 ===
docker compose ps

REM 显示日志
echo.
echo === 最新日志 ===
docker compose logs --tail=20 worldnpress

echo.
echo 提示: 使用 'docker compose logs -f' 查看实时日志
echo 提示: 使用 'docker compose down' 停止服务
echo.
echo === 管理后台 ===
echo 地址: http://localhost/admin/login
echo 账号: admin
echo 密码: wp2026@Kx9mP4
echo.
pause
