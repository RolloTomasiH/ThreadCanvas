@echo off
chcp 65001 >nul
title ThreadCanvas 桌面快捷方式安装

setlocal
set "SCRIPT_DIR=%~dp0"
set "TARGET_VBS=%SCRIPT_DIR%ThreadCanvas.vbs"
set "ICON_PATH=%SCRIPT_DIR%resources\icons\ThreadCanvas.ico"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$desktop = [Environment]::GetFolderPath('Desktop'); " ^
  "$shortcut = $ws.CreateShortcut(\"$desktop\ThreadCanvas.lnk\"); " ^
  "$shortcut.TargetPath = '%TARGET_VBS%'; " ^
  "$shortcut.WorkingDirectory = '%SCRIPT_DIR%'; " ^
  "$shortcut.IconLocation = '%ICON_PATH%, 0'; " ^
  "$shortcut.Description = 'ThreadCanvas · 无限画布分支研思工作台'; " ^
  "$shortcut.Save()"

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  [成功] 已在桌面创建 ThreadCanvas 快捷方式！
    echo  桌面图标: ThreadCanvas.lnk
    echo  双击桌面图标即可像原生桌面软件一样启动 ThreadCanvas。
    echo ========================================================
    echo.
) else (
    echo [错误] 快捷方式创建失败，请尝试以管理员身份运行。
)

timeout /t 3 >nul
exit /b 0
