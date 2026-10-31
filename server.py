#!/usr/bin/env python3
"""
ThreadCanvas Embedded Streaming Proxy & Static File Server
Bypasses browser CORS restrictions by streaming LLM completions locally.
Full support for Anthropic Claude native protocol (/v1/messages) & OpenAI-compatible endpoints.
Enforces Coding Plan endpoint routing & eliminates 1113 quota errors.
"""
import sys
import os
import json
import time
import tempfile
import urllib.request
import urllib.error
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 28791
DIRECTORY = os.path.normpath(sys.argv[2]) if len(sys.argv) > 2 else os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist"))
LOG_PATH = os.path.join(tempfile.gettempdir(), "canvas_proxy.log")

def log_proxy(msg):
    try:
        ts = time.strftime("%Y-%m-%d %H:%M:%S")
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(f"[{ts}] {msg}\n")
    except Exception:
        pass

class ThreadCanvasHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Force browser/WebKit to never cache static app shell assets
        if self.path.endswith((".html", ".js", ".css", "/")) or "?" in self.path:
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_POST(self):
        if self.path.startswith("/api/proxy"):
            self.handle_proxy_request()
        else:
            self.send_error(404, "Endpoint Not Found")

    def handle_proxy_request(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length > 0 else b""

        target_url = self.headers.get("X-Target-Url") or "https://open.bigmodel.cn/api/coding/paas/v4/chat/completions"
        auth_header = self.headers.get("Authorization")
        x_api_key = self.headers.get("x-api-key") or self.headers.get("X-Api-Key")
        anthropic_version = self.headers.get("anthropic-version") or self.headers.get("Anthropic-Version") or "2023-06-01"

        # 1. Zhipu Coding Plan Guard:
        # Only rewrite if targeting Zhipu
        if "open.bigmodel.cn" in target_url or "bigmodel.cn" in target_url:
            target_url = "https://open.bigmodel.cn/api/coding/paas/v4/chat/completions"

            # Parse and enforce supported model (glm-5.3 or glm-4.7)
            try:
                body_json = json.loads(body.decode("utf-8"))
                cur_model = body_json.get("model", "")
                if cur_model not in ["glm-5.3", "glm-4.7", "glm-4-flash"]:
                    log_proxy(f"Rewriting unsupported model '{cur_model}' -> 'glm-5.3'")
                    body_json["model"] = "glm-5.3"
                    body = json.dumps(body_json).encode("utf-8")
                req_model = body_json.get("model", "glm-5.3")
            except Exception:
                req_model = "unknown"

        # 2. Anthropic Claude Guard:
        elif "anthropic" in target_url or (x_api_key and "sk-ant-" in str(x_api_key)):
            if not target_url.endswith("/messages"):
                target_url = target_url.rstrip("/") + ("/messages" if "/v1" in target_url else "/v1/messages")
            try:
                body_json = json.loads(body.decode("utf-8"))
                req_model = body_json.get("model", "claude")
            except Exception:
                req_model = "claude"

        # 3. Standard OpenAI / DeepSeek / Custom Guard:
        else:
            try:
                body_json = json.loads(body.decode("utf-8"))
                req_model = body_json.get("model", "external")
            except Exception:
                req_model = "external"

        auth_preview = "sk-ant-..." if (x_api_key or (auth_header and "sk-ant-" in auth_header)) else (auth_header[:15] if auth_header else "None")
        log_proxy(f"PROXY REQ -> Target: {target_url} | Model: {req_model} | Auth: {auth_preview}...")

        headers = {
            "Content-Type": "application/json",
            "User-Agent": "ThreadCanvas/1.0"
        }

        # Handle Auth headers for both OpenAI & Anthropic
        if auth_header:
            headers["Authorization"] = auth_header
        if x_api_key:
            headers["x-api-key"] = x_api_key
        elif auth_header and "sk-ant-" in auth_header:
            # If user provided Anthropic key in Authorization header, map to x-api-key
            headers["x-api-key"] = auth_header.replace("Bearer", "").strip()

        # If Anthropic endpoint or x-api-key present, add required Anthropic headers
        if "anthropic" in target_url or "x-api-key" in headers:
            headers["anthropic-version"] = anthropic_version
            headers["anthropic-dangerous-direct-browser-access"] = "true"

        req = urllib.request.Request(target_url, data=body, headers=headers)

        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                log_proxy(f"UPSTREAM SUCCESS: status={resp.status}")
                self.send_response(200)
                self.send_header("Content-Type", "text/event-stream; charset=utf-8")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Cache-Control", "no-cache, no-transform")
                self.send_header("Connection", "close")
                self.end_headers()

                try:
                    while True:
                        line = resp.readline()
                        if not line:
                            break
                        self.wfile.write(line)
                        self.wfile.flush()
                except (BrokenPipeError, ConnectionResetError):
                    log_proxy("Client disconnected gracefully")
                    pass
        except urllib.error.HTTPError as e:
            err_body = e.read()
            log_proxy(f"UPSTREAM HTTP ERROR {e.code}: {err_body.decode('utf-8', errors='ignore')}")
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(err_body)))
            self.end_headers()
            try:
                self.wfile.write(err_body)
            except Exception:
                pass
        except Exception as e:
            log_proxy(f"UPSTREAM EXCEPTION: {str(e)}")
            err_msg = json.dumps({"error": {"message": str(e), "code": "PROXY_ERROR"}}).encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(err_msg)))
            self.end_headers()
            try:
                self.wfile.write(err_msg)
            except Exception:
                pass

def run():
    log_proxy(f"ThreadCanvas Server starting on port {PORT}, dir={DIRECTORY}")
    server = ThreadingHTTPServer(("127.0.0.1", PORT), ThreadCanvasHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == "__main__":
    run()
