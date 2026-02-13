@echo off
chcp 65001 >nul 2>&1
REM ============================================================
REM WorldnPress 统一部署脚本 (Windows)
REM 用法:
REM   deploy.bat              交互式选择
REM   deploy.bat deploy       常规部署（自动检测 SSL）
REM   deploy.bat dev          仅启动 Nuxt（开发模式）
REM   deploy.bat down         停止所有服务
REM ============================================================

setlocal enabledelayedexpansion

REM 检查 Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未安装 Docker，请先安装 Docker Desktop
    pause
    exit /b 1
)

docker compose version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未安装 Docker Compose V2
    pause
    exit /b 1
)

REM 解析命令
set CMD=%1
if "%CMD%"=="" goto :menu

goto :run_%CMD%

:menu
echo.
echo === WorldnPress 部署工具 ===
echo.
echo   1) 部署 / 更新（自动检测 SSL）
echo   2) 仅启动 Nuxt（开发模式）
echo   3) 停止所有服务
echo.
set /p CHOICE="请输入选项 [1]: "
if "%CHOICE%"=="" set CHOICE=1

if "%CHOICE%"=="1" goto :run_deploy
if "%CHOICE%"=="2" goto :run_dev
if "%CHOICE%"=="3" goto :run_down

echo [错误] 无效选项
pause
exit /b 1

REM ---- deploy ----
:run_deploy
echo.
echo === WorldnPress 部署 ===

call :clean_down

REM 检测 SSL 证书
if exist "letsencrypt\live\worldnpress.com\fullchain.pem" (
    echo [信息] 检测到 SSL 证书，使用 HTTPS 模式部署
    docker compose --profile ssl up -d --build worldnpress nginx certbot
    echo.
    echo √ 部署完成！
    echo HTTPS 访问: https://worldnpress.com
) else (
    echo [警告] 未检测到 SSL 证书，使用 HTTP 模式部署
    echo [提示] 如需 HTTPS，请在 Linux 服务器运行: ./deploy.sh init-ssl
    docker compose up -d --build worldnpress nginx
    echo.
    echo √ 部署完成（HTTP 模式）
    echo HTTP 访问: http://localhost
)

call :show_status
goto :end

REM ---- dev ----
:run_dev
echo.
echo === WorldnPress 开发模式 ===

call :clean_down

docker compose up -d --build worldnpress
echo.
echo √ 启动完成！
echo 访问地址: http://localhost:3000

call :show_admin
goto :end

REM ---- down ----
:run_down
echo.
echo === 停止 WorldnPress ===
call :clean_down
echo √ 所有容器已停止并清理
goto :end

REM ============================================================
REM 工具函数
REM ============================================================

:clean_down
echo 停止并清理旧容器...
docker compose --profile ssl down --remove-orphans 2>nul
docker rm -f worldnpress-nginx-init 2>nul
docker rm -f worldnpress-certbot 2>nul
exit /b 0

:show_status
echo.
echo === 服务状态 ===
docker compose ps
echo.
echo === 最新日志 ===
docker compose logs --tail=10 worldnpress
call :show_admin
echo.
echo 提示: docker compose logs -f   查看实时日志
echo 提示: deploy.bat down           停止服务
exit /b 0

:show_admin
echo.
echo === 管理后台 ===
echo 地址: http://localhost/admin/login
echo 账号: admin
echo 密码: wp2026@Kx9mP4
exit /b 0

:end
echo.
pause
