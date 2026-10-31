#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "===> 1. 构建前端画布引擎..."
npm run build

echo "===> 2. 编译原生 Swift 启动器..."
swiftc -O -target arm64-apple-macos12.0 main.swift -o ThreadCanvas

echo "===> 3. 打包 ThreadCanvas.app..."
APP_DIR="$HOME/Applications/ThreadCanvas.app"
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

cp ThreadCanvas "$APP_DIR/Contents/MacOS/ThreadCanvas"
chmod +x "$APP_DIR/Contents/MacOS/ThreadCanvas"
rm -rf "$APP_DIR/Contents/Resources/dist"
cp -r dist "$APP_DIR/Contents/Resources/dist"
cp server.py "$APP_DIR/Contents/Resources/server.py"
chmod +x "$APP_DIR/Contents/Resources/server.py"

# Write Info.plist
cat << 'EOF' > "$APP_DIR/Contents/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>ThreadCanvas</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundleIdentifier</key>
    <string>com.workbuddy.threadcanvas</string>
    <key>CFBundleName</key>
    <string>ThreadCanvas</string>
    <key>CFBundleDisplayName</key>
    <string>ThreadCanvas</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>12.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
        <key>NSAllowsLocalNetworking</key>
        <true/>
    </dict>
</dict>
</plist>
EOF

echo -n "APPL????" > "$APP_DIR/Contents/PkgInfo"

# Apply premium Apple HIG canvas icon
ICON_SRC="resources/icons/AppleCanvasPro.icns"
if [ -f "$ICON_SRC" ]; then
    cp "$ICON_SRC" "$APP_DIR/Contents/Resources/AppIcon.icns"
elif [ -f "/tmp/candidate_icons/AppleCanvasPro.icns" ]; then
    cp "/tmp/candidate_icons/AppleCanvasPro.icns" "$APP_DIR/Contents/Resources/AppIcon.icns"
fi

touch "$APP_DIR"

# Update Desktop Symlink
ln -sf "$APP_DIR" "$HOME/Desktop/ThreadCanvas.app"

# Migrate WebKit WebsiteData if needed so user's local projects exist out of the box
LEGACY_WEBKIT="$HOME/Library/WebKit/com.workbuddy.canvasresearcher"
TARGET_WEBKIT="$HOME/Library/WebKit/com.workbuddy.threadcanvas"
if [ -d "$LEGACY_WEBKIT" ] && [ ! -d "$TARGET_WEBKIT" ]; then
    echo "===> 迁移 WebKit 本地工程数据至 ThreadCanvas..."
    mkdir -p "$TARGET_WEBKIT"
    cp -r "$LEGACY_WEBKIT/"* "$TARGET_WEBKIT/" 2>/dev/null || true
fi

echo "✅ 打包完成！已安装至："
echo "   $APP_DIR"
echo "   $HOME/Desktop/ThreadCanvas.app"
