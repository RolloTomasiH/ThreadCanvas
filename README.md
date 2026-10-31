# ThreadCanvas · 研思分支画布 (v1.0.0)

> **ThreadCanvas** 是专为深度行业投研、商业架构拆解与技术推演打造的 **无限画布分支研思工作台**。
> 结合 LLM 多轮因果推理、划词要点追问、Obsidian Canvas 双向互通与极简工程美学，摆脱线形聊天限制。

---

## 核心特性

### 1. 无限画布与分支推演
- **自由探索**：支持触摸板双指平移、捏合缩放（15% ~ 250%）、小地图（Minimap）鸟瞰与一键全图适应。
- **划词要点追问 (Select-to-Branch)**：在任意解答中划选核心论点，即时唤出 Raycast 风格的极简追问栏，一键生成锚定引述的下游分支卡片。
- **完整因果溯源 (Ancestry Trace)**：下游分支提问自动溯源整条推演链（根问题 → 根解答 → 引用论点 → 分支追问），大模型感知完整前置上下文，避免割裂。
- **单卡问答闭环**：提问与推演结论严格收敛于同一张卡片内部，支持卡片独立滚动隔离与折叠。

### 2. 多模型研思中枢与协议原生支持
- **Anthropic Claude 原生支持**：深度接入官方 `/v1/messages` 协议，支持 Claude 3.7 Sonnet 混合深度推理（Extended Thinking），长链思考过程可按需展开与折叠。
- **主流模型全面预设**：开箱支持 Claude 3.7 / 3.5、智谱 GLM-5.3 (Coding Plan) / GLM-4.7、DeepSeek-V3 / R1、OpenAI GPT-4o、OpenRouter、本地 Ollama (`http://localhost:11434`) 与 LM Studio。
- **多商户密钥独立隔离**：各模型服务商 API 密钥本地隔离存储于浏览器 `localStorage`，零服务端数据中转。

### 3. 买方投研脚手架与反套话去脂 (Anti-AI-Slop)
- **投研视角矩阵**：内置反共识审视、法务审计、商业模式与第一性原理等专业 Harness。
- **严格反套话**：杜绝一切假大空过渡句与修饰词，强制事实直陈与数据因果链。

### 4. 机构级导出与互通
- **Obsidian Canvas (`.canvas`)**：导出为标准 JSON Canvas 文件，可在 Obsidian 中无损打开并保留全部色彩与脉络连线。
- **Markdown 结构化研报 (`.md`)**：自动按分支层级遍历排版，导出高信息密度的专业研究报告。
- **工程全量备份 (`.canvasproj`)**：项目一键导入导出。

---

## 快速上手

### 环境依赖
- Node.js >= 18 (用于前端构建)
- Python >= 3.8 (内置静态服务与 LLM 串流代理)
- **macOS**：macOS 12.0+ (支持原生 Swift App 编译)
- **Windows**：Windows 10 / 11 (内置 Microsoft Edge 或 Google Chrome)

---

### 平台一键运行

#### 🍎 macOS 原生桌面版
```bash
./build_app.sh
```
编译完成后自动生成并安装至 `~/Applications/ThreadCanvas.app`，并在桌面生成启动快捷方式。

#### 🪟 Windows 原生桌面版
1. **一键双击运行**：
   - 双击根目录下的 **`ThreadCanvas.vbs`**（静默后台启动，无黑框命令行），自动唤起 Microsoft Edge 原生独立桌面应用窗口（无地址栏/标签页）。
   - 或双击 **`ThreadCanvas.bat`** 启动。
2. **生成 Windows 桌面快捷方式**：
   - 双击 **`install_shortcut.bat`**，将自动在 Windows 桌面上创建带官方图标的 `ThreadCanvas.lnk` 快捷方式。
3. **源码构建 (Windows)**：
   - 双击 **`build_windows.bat`** 即可自动执行 `npm install`、`npm run build` 并创建桌面快捷方式。

#### 🌐 纯 Web 开发调试版 (跨平台)
```bash
git clone https://github.com/RolloTomasiH/ThreadCanvas.git
cd ThreadCanvas
npm install
npm run dev
```
浏览器打开 `http://localhost:5173` 即可开始使用。首次使用点击顶栏「填入 API Key」输入您自己的 API 密钥即可。

---

## 快捷键速查

| 操作 | 快捷键 / 手势 |
| :--- | :--- |
| **画布平移** | 触摸板双指滑动 / 按住 `空格` 拖动画布 / 切换 `H` 工具 |
| **画布缩放** | 触摸板捏合 / `⌘ +` (放大) / `⌘ -` (缩小) / `⌘ 0` (100% 原始) |
| **快速提问** | 双击画布空白处 / 顶部点击「提问」 |
| **发送推演** | 文本框内按 `⌘ + Enter` |
| **划词追问** | 划选卡片内文字即可弹出追问命令栏，按 `Enter` 立即生成分支 |
| **删除卡片/连线** | 选中卡片或连线后按 `Backspace` 或 `Delete` |
| **取消选择 / 关闭弹窗** | 按 `Esc` 键 |

---

## 隐私与安全

- **纯本地运行**：除推演请求直连对应模型官方接口或您指定的代理端点外，不收集任何用户数据与使用埋点。
- **密钥安全**：所有 API Key 仅保存在本机 `localStorage`，不上传至任何第三方服务器。

---

## 开源协议

[MIT License](LICENSE)
