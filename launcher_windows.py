#!/usr/bin/env python3
"""
ThreadCanvas Windows Native Desktop Launcher
Supports pywebview (Microsoft Edge WebView2) for a true native Windows GUI window,
or launches Microsoft Edge in standalone App Mode with isolated local profile.
"""
import sys
import os
import time
import socket
import subprocess
import threading

PORT = 28791
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(SCRIPT_DIR, "dist")
URL = f"http://127.0.0.1:{PORT}"

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("127.0.0.1", port)) == 0

def start_server_in_thread():
    if not is_port_in_use(PORT):
        import server
        server.PORT = PORT
        server.DIRECTORY = DIST_DIR
        t = threading.Thread(target=server.run, daemon=True)
        t.start()
        time.sleep(0.5)

def main():
    start_server_in_thread()

    # Try pywebview (Edge Chromium WebView2)
    try:
        import webview
        window = webview.create_window(
            title="ThreadCanvas",
            url=URL,
            width=1440,
            height=900,
            min_size=(960, 600),
            text_select=True,
            zoomable=True
        )
        webview.start(gui="edgechromium", debug=False)
        return
    except ImportError:
        pass

    # Fallback to Microsoft Edge App Mode
    edge_paths = [
        os.path.expandvars(r"%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"),
        os.path.expandvars(r"%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"),
        os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"),
    ]
    user_data = os.path.expandvars(r"%LOCALAPPDATA%\ThreadCanvas\AppProfile")

    for p in edge_paths:
        if os.path.isfile(p):
            subprocess.Popen([p, f"--app={URL}", f"--user-data-dir={user_data}", "--window-size=1440,900"])
            return

    # Fallback to Chrome App Mode
    chrome_paths = [
        os.path.expandvars(r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    ]
    for p in chrome_paths:
        if os.path.isfile(p):
            subprocess.Popen([p, f"--app={URL}", f"--user-data-dir={user_data}", "--window-size=1440,900"])
            return

    # Fallback to default browser
    import webbrowser
    webbrowser.open(URL)

if __name__ == "__main__":
    main()
