@echo off
chcp 65001 >nul
title ThreadCanvas Windows 构建脚本

setlocal
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo ========================================================
echo  ThreadCanvas Windows 一键构建
echo ========================================================
echo.

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js / npm 环境。
    echo 请先安装 Node.js (https://nodejs.org/)。
    pause
    exit /b 1
)

echo ===^> 1. 安装/更新依赖...
call npm install
if %errorlevel% neq 0 (
    echo [错误] npm install 失败。
    pause
    exit /b 1
)

echo ===^> 2. 编译前端画布引擎...
call npm run build
if %errorlevel% neq 0 (
    echo [错误] 构建产物失败。
    pause
    exit /b 1
)

echo ===^> 3. 创建桌面快捷方式...
call "%SCRIPT_DIR%install_shortcut.bat"

echo.
echo ========================================================
echo  ✅ Windows 构建完成！
echo  现在您可以直接在桌面双击 ThreadCanvas 图标启动！
echo ========================================================
pause
