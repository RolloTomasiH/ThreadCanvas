#!/usr/bin/env bash
# 一键切换 ThreadCanvas 应用图标
# 支持选项:
#   1. apple (默认: Cupertino 纯净无限研思画布)
#   2. mindnode (来自 GitHub: Dav-ej/Custom-Big-Sur-Icons 思维导图流)
#   3. craft (来自 GitHub: elrumo/macOS_Big_Sur_icons_replacements 极简文档块)
#   4. freeform (macOS 官方无边记画板)
#   5. obsidian (Obsidian 官方黑曜石宝石)

ICON_NAME="${1:-apple}"
APP_DIR="$HOME/Applications/ThreadCanvas.app"
ICONS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/resources/icons"

case "$ICON_NAME" in
  apple|canvas)
    SRC="$ICONS_DIR/AppleCanvasPro.icns"
    ;;
  mindnode|mind)
    SRC="$ICONS_DIR/Mindnote.icns"
    ;;
  craft)
    SRC="$ICONS_DIR/CraftDocs.icns"
    ;;
  freeform)
    SRC="$ICONS_DIR/Freeform.icns"
    ;;
  obsidian)
    SRC="$ICONS_DIR/Obsidian.icns"
    ;;
  *)
    if [ -f "$1" ]; then
      SRC="$1"
    else
      echo "用法: ./switch_icon.sh [apple | mindnode | craft | freeform | obsidian | /path/to/custom.icns]"
      exit 1
    fi
    ;;
esac

if [ ! -f "$SRC" ]; then
  echo "❌ 未找到对应图标文件: $SRC"
  exit 1
fi

echo "===> 应用新图标: $SRC"
cp "$SRC" "$APP_DIR/Contents/Resources/AppIcon.icns"
touch "$APP_DIR"
touch "$HOME/Desktop/ThreadCanvas.app"

# 重启 Dock 刷新图标缓存
killall Dock 2>/dev/null || true
echo "✅ 图标更换成功！已生效。"
