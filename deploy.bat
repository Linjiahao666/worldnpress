@echo off
chcp 65001 >nul 2>&1
REM ============================================================
REM WorldnPress 本地开发脚本 (Windows)
REM 用法: deploy.bat
REM ============================================================

setlocal enabledelayedexpansion

echo.
echo === WorldnPress 本地开发 ===
echo.
echo 安装依赖...
call npm install

echo.
echo 启动开发服务器...
echo 访问地址: http://localhost:3000
echo 按 Ctrl+C 停止
echo.
call npm run dev
