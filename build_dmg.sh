#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

VERSION="1.0.2"
VOL_NAME="ThreadCanvas"
DMG_NAME="ThreadCanvas-v${VERSION}-macOS.dmg"
OUTPUT_DIR="$DIR/release"
DMG_PATH="$OUTPUT_DIR/$DMG_NAME"
APP_SRC="$HOME/Applications/ThreadCanvas.app"

echo "===> 1. 确保最新应用包已编译..."
./build_app.sh

if [ ! -d "$APP_SRC" ]; then
    echo "[错误] 未找到应用包: $APP_SRC"
    exit 1
fi

echo "===> 2. 准备 DMG 打包镜像临时目录..."
STAGING_DIR="$(mktemp -d /tmp/ThreadCanvas-DMG-XXXXXX)"
mkdir -p "$OUTPUT_DIR"

# 复制 App 并创建 Applications 快捷方式
cp -R "$APP_SRC" "$STAGING_DIR/ThreadCanvas.app"
ln -s /Applications "$STAGING_DIR/Applications"

# 确保属性干净且签名有效
xattr -cr "$STAGING_DIR/ThreadCanvas.app" 2>/dev/null || true
codesign --force --deep -s - "$STAGING_DIR/ThreadCanvas.app" 2>/dev/null || true

echo "===> 3. 正在生成高压缩比 DMG 镜像..."
rm -f "$DMG_PATH"
rm -f "$HOME/Desktop/$DMG_NAME"
rm -f "$HOME/Desktop/ThreadCanvas.dmg"

hdiutil create \
    -volname "$VOL_NAME" \
    -srcfolder "$STAGING_DIR" \
    -ov \
    -format UDZO \
    -imagekey zlib-level=9 \
    "$DMG_PATH"

# 复制一份到桌面，方便直接发给他人
cp "$DMG_PATH" "$HOME/Desktop/$DMG_NAME"
cp "$DMG_PATH" "$HOME/Desktop/ThreadCanvas.dmg"

# 清理临时目录
rm -rf "$STAGING_DIR"

DMG_SIZE=$(du -h "$DMG_PATH" | cut -f1)

echo ""
echo "========================================================"
echo "🎉 [成功] ThreadCanvas v${VERSION} DMG 安装包已生成！"
echo "   文件大小: $DMG_SIZE"
echo "   工程目录: $DMG_PATH"
echo "   桌面路径: $HOME/Desktop/$DMG_NAME"
echo "   通用快捷: $HOME/Desktop/ThreadCanvas.dmg"
echo "   (打开即可像标准 Mac 软件一样拖拽至 Applications 安装)"
echo "========================================================"
