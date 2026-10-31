import Cocoa
import WebKit

class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate, WKNavigationDelegate {
    var window: NSWindow!
    var webView: WKWebView!
    var serverProcess: Process?
    let port = 28791
    var loadRetryCount = 0

    func killPortProcess(port: Int) {
        let p = Process()
        p.launchPath = "/bin/sh"
        p.arguments = ["-c", "lsof -ti :\(port) | xargs kill -9 2>/dev/null || true"]
        try? p.run()
        p.waitUntilExit()
    }

    func loadAppURL() {
        if let url = URL(string: "http://127.0.0.1:\(self.port)") {
            let request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 10)
            self.webView.load(request)
        }
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        if loadRetryCount < 20 {
            loadRetryCount += 1
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                self.loadAppURL()
            }
        }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        if loadRetryCount < 20 {
            loadRetryCount += 1
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                self.loadAppURL()
            }
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        loadRetryCount = 0
    }

    func getZhipuApiKey() -> String {
        if let envKey = ProcessInfo.processInfo.environment["ZHIPU_API_KEY"], !envKey.isEmpty {
            return envKey
        }
        let home = FileManager.default.homeDirectoryForCurrentUser.path
        let zshrcPath = "\(home)/.zshrc"
        if let content = try? String(contentsOfFile: zshrcPath, encoding: .utf8) {
            let lines = content.components(separatedBy: .newlines)
            for line in lines {
                let trimmed = line.trimmingCharacters(in: .whitespaces)
                if trimmed.hasPrefix("export ZHIPU_API_KEY=") {
                    var val = trimmed.replacingOccurrences(of: "export ZHIPU_API_KEY=", with: "")
                    val = val.trimmingCharacters(in: CharacterSet(charactersIn: "\"' "))
                    if !val.isEmpty {
                        return val
                    }
                }
            }
        }
        return ""
    }

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Find Resources/dist path
        let bundle = Bundle.main
        var distPath = bundle.resourcePath.map { "\($0)/dist" } ?? ""
        
        let fileManager = FileManager.default
        if !fileManager.fileExists(atPath: distPath) {
            let currentDir = fileManager.currentDirectoryPath
            if fileManager.fileExists(atPath: "\(currentDir)/dist") {
                distPath = "\(currentDir)/dist"
            }
        }

        // Start local static server
        startServer(distPath: distPath)

        // Setup Window
        let screenSize = NSScreen.main?.visibleFrame.size ?? CGSize(width: 1440, height: 900)
        let windowWidth = min(1400.0, screenSize.width * 0.94)
        let windowHeight = min(920.0, screenSize.height * 0.94)
        let windowRect = NSRect(
            x: (screenSize.width - windowWidth) / 2,
            y: (screenSize.height - windowHeight) / 2,
            width: windowWidth,
            height: windowHeight
        )

        window = NSWindow(
            contentRect: windowRect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        window.delegate = self
        window.title = "ThreadCanvas · 研思分支画布"
        window.titlebarAppearsTransparent = true
        window.titleVisibility = .hidden
        window.minSize = NSSize(width: 1000, height: 650)
        window.isReleasedWhenClosed = false

        // Setup WKWebView Configuration with environment bridge
        let config = WKWebViewConfiguration()
        config.preferences.setValue(true, forKey: "developerExtrasEnabled")
        config.defaultWebpagePreferences.allowsContentJavaScript = true

        let zhipuKey = getZhipuApiKey()
        let jsSource = "window.__NATIVE_ENV__ = { ZHIPU_API_KEY: '\(zhipuKey)' };"
        let userScript = WKUserScript(source: jsSource, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        config.userContentController.addUserScript(userScript)

        webView = WKWebView(frame: windowRect, configuration: config)
        webView.navigationDelegate = self
        webView.autoresizingMask = [.width, .height]
        window.contentView = webView

        // Setup Native Menus
        setupMenus()

        // Clear WebKit cache on launch so fresh updates load immediately
        WKWebsiteDataStore.default().removeData(ofTypes: [WKWebsiteDataTypeDiskCache, WKWebsiteDataTypeMemoryCache], modifiedSince: Date.distantPast) { }

        // Start loading URL; if server takes 100-300ms to bind, navigationDelegate retries seamlessly
        self.loadAppURL()

        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    func startServer(distPath: String) {
        killPortProcess(port: self.port)

        let task = Process()
        task.launchPath = "/usr/bin/python3"

        let bundle = Bundle.main
        let resourcePath = bundle.resourcePath ?? ""
        let serverPyInBundle = "\(resourcePath)/server.py"
        let currentDir = FileManager.default.currentDirectoryPath
        let serverPyInCurrent = "\(currentDir)/server.py"

        var serverScript = ""
        if FileManager.default.fileExists(atPath: serverPyInBundle) {
            serverScript = serverPyInBundle
        } else if FileManager.default.fileExists(atPath: serverPyInCurrent) {
            serverScript = serverPyInCurrent
        }

        if !serverScript.isEmpty {
            task.arguments = [serverScript, "\(port)", distPath]
        } else {
            task.arguments = [
                "-m", "http.server",
                "\(port)",
                "--bind", "127.0.0.1",
                "--directory", distPath
            ]
        }
        task.standardOutput = FileHandle.nullDevice
        task.standardError = FileHandle.nullDevice

        do {
            try task.run()
            self.serverProcess = task
        } catch {
            print("Failed to start embedded python server: \(error)")
        }
    }

    func setupMenus() {
        let mainMenu = NSMenu()

        // App Menu
        let appMenuItem = NSMenuItem()
        mainMenu.addItem(appMenuItem)
        let appMenu = NSMenu()
        appMenuItem.submenu = appMenu
        appMenu.addItem(withTitle: "关于 ThreadCanvas", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "隐藏 ThreadCanvas", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        let hideOthersItem = NSMenuItem(title: "隐藏其他", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h")
        hideOthersItem.keyEquivalentModifierMask = [.command, .option]
        appMenu.addItem(hideOthersItem)
        appMenu.addItem(withTitle: "全部显示", action: #selector(NSApplication.unhideAllApplications(_:)), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "退出 ThreadCanvas", action: #selector(AppDelegate.quitApp), keyEquivalent: "q")

        // Edit Menu (Standard macOS Copy/Paste/Select All)
        let editMenuItem = NSMenuItem()
        mainMenu.addItem(editMenuItem)
        let editMenu = NSMenu(title: "编辑")
        editMenuItem.submenu = editMenu
        editMenu.addItem(withTitle: "剪切", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        editMenu.addItem(withTitle: "复制", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        editMenu.addItem(withTitle: "粘贴", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        editMenu.addItem(withTitle: "全选", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")

        // View Menu
        let viewMenuItem = NSMenuItem()
        mainMenu.addItem(viewMenuItem)
        let viewMenu = NSMenu(title: "视图")
        viewMenuItem.submenu = viewMenu
        viewMenu.addItem(withTitle: "重新加载画布", action: #selector(reloadCanvas), keyEquivalent: "r")
        viewMenu.addItem(NSMenuItem.separator())
        viewMenu.addItem(withTitle: "放大", action: #selector(zoomIn), keyEquivalent: "=")
        viewMenu.addItem(withTitle: "缩小", action: #selector(zoomOut), keyEquivalent: "-")
        viewMenu.addItem(withTitle: "实际大小", action: #selector(resetZoom), keyEquivalent: "0")

        // Window Menu
        let windowMenuItem = NSMenuItem()
        mainMenu.addItem(windowMenuItem)
        let windowMenu = NSMenu(title: "窗口")
        windowMenuItem.submenu = windowMenu
        windowMenu.addItem(withTitle: "最小化", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
        windowMenu.addItem(withTitle: "缩放", action: #selector(NSWindow.performZoom(_:)), keyEquivalent: "")

        NSApp.mainMenu = mainMenu
    }

    @objc func reloadCanvas() {
        webView?.reloadFromOrigin()
    }

    @objc func zoomIn() {
        webView?.pageZoom += 0.1
    }

    @objc func zoomOut() {
        if webView != nil && webView.pageZoom > 0.3 {
            webView.pageZoom -= 0.1
        }
    }

    @objc func resetZoom() {
        webView?.pageZoom = 1.0
    }

    @objc func quitApp() {
        cleanup()
        NSApp.terminate(nil)
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

    func applicationWillTerminate(_ notification: Notification) {
        cleanup()
    }

    func windowWillClose(_ notification: Notification) {
        cleanup()
    }

    func cleanup() {
        if let proc = serverProcess, proc.isRunning {
            proc.terminate()
            serverProcess = nil
        }
        killPortProcess(port: self.port)
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.run()
