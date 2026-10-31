@echo off
chcp 65001 >nul
title ThreadCanvas

setlocal enabledelayedexpansion
set "SCRIPT_DIR=%~dp0"
set "PORT=28791"
set "DIST_DIR=%SCRIPT_DIR%dist"

:: 1. Check Python
set "PY_CMD="
where python >nul 2>nul
if %errorlevel% equ 0 (
    set "PY_CMD=python"
) else (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        set "PY_CMD=py"
    )
)

if "%PY_CMD%"=="" (
    echo [错误] 未检测到 Python 运行环境。
    echo 请先安装 Python 3 (https://www.python.org/downloads/) 并勾选 "Add Python to PATH"。
    pause
    exit /b 1
)

:: 2. Check if dist directory exists; build if missing
if not exist "%DIST_DIR%\index.html" (
    echo [提示] 正在初始化构建前端产物...
    where npm >nul 2>nul
    if %errorlevel% equ 0 (
        cd /d "%SCRIPT_DIR%"
        call npm install
        call npm run build
    ) else (
        echo [错误] 未找到 dist 构建包且未安装 Node.js/npm。
        echo 请先执行 npm install 与 npm run build 生成静态文件。
        pause
        exit /b 1
    )
)

:: 3. Start Background Server if not already running on port 28791
netstat -ano | findstr ":%PORT% " >nul 2>nul
if %errorlevel% neq 0 (
    where pythonw >nul 2>nul
    if %errorlevel% equ 0 (
        start "" pythonw "%SCRIPT_DIR%server.py" %PORT% "%DIST_DIR%"
    ) else (
        start /B "" %PY_CMD% "%SCRIPT_DIR%server.py" %PORT% "%DIST_DIR%" >nul 2>nul
    )
    timeout /t 1 /nobreak >nul
)

:: 4. Locate Microsoft Edge or Chrome for Desktop App Mode
set "EDGE_PATH="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set "EDGE_PATH=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set "EDGE_PATH=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
) else if exist "%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe" (
    set "EDGE_PATH=%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"
)

set "USER_DATA_DIR=%LOCALAPPDATA%\ThreadCanvas\AppProfile"

if defined EDGE_PATH (
    start "" "%EDGE_PATH%" --app="http://127.0.0.1:%PORT%" --user-data-dir="%USER_DATA_DIR%" --window-size=1440,900
    exit /b 0
)

:: Fallback to Chrome App Mode
set "CHROME_PATH="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
)

if defined CHROME_PATH (
    start "" "%CHROME_PATH%" --app="http://127.0.0.1:%PORT%" --user-data-dir="%USER_DATA_DIR%" --window-size=1440,900
    exit /b 0
)

:: Fallback to default browser
start http://127.0.0.1:%PORT%
exit /b 0
