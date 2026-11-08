﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿// ============================================================
//  应用商店 · 数据文件（上架新应用，只改这个文件）
//
//  上架流程（安装包走 GitHub Releases 托管）：
//    1. 安装包提交到 zhangyuceozz/app-store 仓库的 apps/<id>/download/ 目录
//    2. 复制下面 BongoCat 那一整块 { ... }，粘到 APPS 里
//    3. 改 id、name、category、date、tagline、description、icon、downloads
//    4. downloads 的 file 填 /dl/apps/<id>/download/<文件名>（本站反代直链）
//    5. 保存，刷新网页就能看到
//
//  分类说明（支持两级）：
//    category = 大分类（左侧分类树显示这个，比如「系统工具」）
//    sub      = 小分类（可选，进入大分类后按这个分组，比如「系统优化」「卸载工具」）
//  没放 icon.png 的应用会自动用「名字首字母」当图标。
// ============================================================

// 商店信息
const SITE = {
  name: "应用商店",              // 商店名字（改这里）
  tagline: "免费的小工具",       // 商店一句话简介（改这里）
  subtitle: "精选实用软件 · 一键下载安装",  // 副标题（新加的）
  accent: "#f5491f",             // 主题色 / 强调色（改这里换整个商店的颜色，比如蓝色 #2563eb）
};

// ============================================================
//  分类列表（顶栏分类条固定显示这些，即使下面没应用也显示）
//  想加/删/改分类，直接改这个数组的顺序和名字即可
// ============================================================
const CATEGORIES = [
  "系统工具",
  "实用工具",
  "开发工具",
  "设计创意",
  "效率办公",
  "网络通信",
  "多媒体",
  "桌面美化",
  "游戏",
  "安全防护",
];

// 应用列表
const APPS = [
  {
    id: "powertoys",
    name: "PowerToys",
    category: "系统工具",
    date: "2026-11-01",
    tagline: "30+ 免费开源小工具，让 Windows 更好用",
    description: "PowerToys 是 Microsoft 官方开源的 Windows 增强工具包——30+ 个小工具，从命令选择器（Command Palette，Win+Alt+Space 搜一切）到 FancyZones（窗口布局管理）、Advanced Paste（AI 辅助粘贴，转 Markdown / JSON / 翻译）、Peek（空格预览文件）、Environment Variables（环境变量分组开关）、Hosts File Editor（直接编辑 hosts）、Text Extractor（Win+Shift+T 从屏幕任何地方 OCR 抓文字）、Keyboard Manager（改键位）、Mouse Utilities（鼠标锁定 / 隐藏指针）……MIT 协议，C# 写，x64 和 ARM64 都支持。",
    icon: "apps/powertoys/icon.png",
    preview: "apps/powertoys/preview.jpg",
    downloads: [
      { platform: "Windows (x64)",    file: "/dl/apps/powertoys/download/PowerToysSetup-0.102.3001.0-x64.exe", size: "—" },
      { platform: "Windows (ARM64)",  file: "/dl/apps/powertoys/download/PowerToysSetup-0.102.3001.0-arm64.exe", size: "—" },
    ],
    install: [
      "下载 PowerToysSetup-xxx-x64.exe 双击安装（需要 Windows 10 2004+ 或 Windows 11）。",
      "或 winget install --id Microsoft.PowerToys --source winget（自动保持最新）。",
      "首次打开会提示启用想要的工具，不用的可以关掉。",
    ],
    usage: [
      "Win + Alt + Space：命令选择器，搜应用、文件、命令。",
      "Win + Shift + `：FancyZones 布局编辑器，拖拽窗口自动吸附。",
      "Win + Shift + V：Advanced Paste，转纯文字/Markdown/JSON/AI 翻译。",
      "Win + Shift + T：Text Extractor，屏幕任何地方 OCR 抓文字。",
      "文件管理器里按 Space：Peek 快速预览，不用打开任何应用。",
    ],
  },
  {
    id: "paperless-ngx",
    name: "Paperless-ngx",
    category: "效率办公",
    date: "2026-11-01",
    tagline: "OCR + AI 自动分类你的所有纸质扫描件",
    description: "Paperless-ngx 是社区驱动的文档管理系统——把发票、合同、收据、身份证扫描件统统丢进去，它用 OCR + AI 自动提取文字、识别日期/金额/联系人、按规则自动归档到分类文件夹。支持 PDF / 图片 / Office 文档 / 邮件附件，全文搜索、标签、自定义文档类型、邮件消费（发邮件到专用地址自动入库）、WebDAV 同步。GPL-3.0，Docker 一键部署，数据完全自己掌控，29k+⭐。",
    icon: "apps/paperless-ngx/icon.png",
    preview: "apps/paperless-ngx/preview.jpg",
    downloads: [
      { platform: "Docker Compose（推荐）", file: "", size: "—" },
    ],
    install: [
      "前置：装好 Docker + Docker Compose。",
      "最简单：`bash -c \"$(curl -sL https://raw.githubusercontent.com/paperless-ngx/paperless-ngx/main/install-paperless-ngx.sh)\"`，交互式脚本问几个问题就搞定。",
      "或手动：下载 docker/compose/docker-compose.sqlite.yml → 改名为 docker-compose.yml → `docker compose pull && docker compose up -d`。",
      "打开 http://127.0.0.1:8000 首次创建超级用户。",
    ],
    usage: [
      "扫描件丢进 consume/ 文件夹或 Web UI 上传 → 自动 OCR + 分类。",
      "全文搜索支持模糊匹配，搜「2024 年房租」就能找到所有相关文档。",
      "定义规则：发票 → 自动打标签「财务」+ 按月份归档。",
      "邮件消费：给 paperless@你的域名发邮件带附件，自动入库。",
      "备份：用管理界面的文档导出，或直接备份 Docker volumes。",
    ],
  },
  {
    id: "excalidraw",
    name: "Excalidraw",
    category: "设计创意",
    date: "2026-11-01",
    tagline: "打开浏览器就能画的免费开源白板",
    description: "Excalidraw 是一个纯 Web 的手绘风白板——打开 excalidraw.com 就能画，不用注册，浏览器 localStorage 自动存。用 Rough.js 让所有线条看起来像手画的，支持矩形、圆形、菱形、箭头、钢笔、文字、便签、Mermaid 图表嵌入、代码高亮。多人实时协作用 Socket.IO + Web Cryptography API 端到端加密（只有参与者能看到内容）。导出 PNG / SVG / .excalidraw 源文件。MIT 协议，135k+⭐，TypeScript + React + Vite 写的，PWA 支持离线使用。",
    icon: "apps/excalidraw/icon.svg",
    preview: "apps/excalidraw/preview.jpg",
    downloads: [
      { platform: "浏览器直接用（跨平台）", file: "", size: "—" },
    ],
    install: [
      "不用安装！打开 https://excalidraw.com 就能画。",
      "想离线用：浏览器菜单「添加到桌面」→ PWA 就能离线跑。",
      "想自托管：`docker run -p 80:80 excalidraw/excalidraw` 或 docker-compose。",
    ],
    usage: [
      "画完了 File → Export image（PNG / SVG / .excalidraw 源文件）。",
      "想协作：File → Collaborate（生成房间链接，发出去就能一起画）。",
      "File → Export → Link：生成只读分享链接。",
      "常用快捷键：Ctrl+D 复制、Ctrl+G 分组、Ctrl+Shift+D 复制保持相对位置。",
    ],
  },
  {
    id: "text-to-cad",
    name: "Text to CAD",
    category: "开发工具",
    date: "2026-11-01",
    tagline: "给 AI Agent 装上 CAD 超能力",
    description: "Text to CAD（earthtojake/text-to-cad）是一个给 AI Agent 的 CAD 插件/skill——用自然语言告诉 Claude Code / Codex / Cursor「生成一个直径 20mm 的带键槽圆柱齿轮」，Agent 就会生成 STEP / GLB / STL / 3MF 文件。底层用 CadQuery + build123d（Python CAD 内核），支持 STEP 零件库（找标准螺丝、轴承、电机）、工程图纸生成（PDF 带尺寸标注、隐藏线、标题栏）、制造可行性检查、3D 打印/钣金/CNC 服务对接。MIT 协议，Python 3.11+，22k+⭐。",
    icon: "apps/text-to-cad/icon.png",
    preview: "apps/text-to-cad/preview.jpg",
    downloads: [
      { platform: "Agent Plugin + Skill（跨平台）", file: "", size: "—" },
    ],
    install: [
      "推荐（让你的代理装）：`Install text-to-cad from https://github.com/earthtojake/text-to-cad`",
      "Claude Code：`claude plugin marketplace add earthtojake/text-to-cad#latest` + `claude plugin install text-to-cad@earthtojake`",
      "Codex：`codex plugin marketplace add earthtojake/text-to-cad --ref latest`",
      "Cursor：`git clone --depth 1 --branch latest https://github.com/earthtojake/text-to-cad ~/.cursor/plugins/local/text-to-cad`",
      "无 plugin 支持的代理：`npx skills add earthtojake/text-to-cad#latest`",
    ],
    usage: [
      "「生成一个直径 20mm 的带键槽圆柱齿轮，齿数 18，模数 2」→ 得到 STEP 文件。",
      "「找 M8 内六角螺丝，长度 25mm」→ step.parts skill 自动从零件库搜。",
      "「给这个零件生成工程图」→ engineering-drawing skill 出 PDF（带尺寸、隐藏线、标题栏）。",
      "「检查这个零件能不能 3D 打印」→ DFM 可行性检查。",
      "生成的 STEP 文件可以直接在 Fusion 360 / SolidWorks / FreeCAD 里打开继续编辑。",
    ],
  },
  {
    id: "rea",
    name: "REA",
    category: "开发工具",
    date: "2026-11-01",
    tagline: "给 AI 编程代理装一套逆向工具链",
    description: "REA（Reverse Engineer Anything）是一个 MIT 开源的 MCP Server，让 Claude Code、Codex、Cursor、TRAE 等 AI 编程代理能够逆向分析任何东西：原生二进制、Electron/JS 应用、.NET 程序、Android APK、GGUF 模型文件、SQLite 数据库、EVM 字节码……你用自然语言告诉代理「帮我看看这个 exe 的 % 按钮怎么实现的」，代理通过 REA 调本地反编译器（Hopper/Ghidra/IDA，三选一），返回伪代码、汇编、符号提取、调用关系，再帮你解释和重构。不是魔法还原源码，是带证据的结构化分析报告。npm 安装：`npx rea-agents setup`。",
    icon: "apps/rea/icon.png",
    preview: "apps/rea/preview.jpg",
    downloads: [
      { platform: "跨平台（npm 安装）", file: "", size: "—" },
    ],
    install: [
      "前置：Node.js 22.x / 24.x（23 和 25 不支持）。深度原生二进制分析需要 Hopper / Ghidra / IDA 三选一（静态 JS/.NET 分析不需要）。",
      "一键安装（让你的 AI 编程代理帮你做）：`使用 npx rea-agents setup 安装 REA，并连接到这个编程助手。先展示安装计划，等我确认后再执行。`",
      "手动安装：`npx rea-agents setup`，按提示选要连接的代理（Claude Code / Cursor / Codex / Gemini CLI / Cline / Windsurf / Amp）。",
      "检查安装：`npx rea-agents check`，确认所有二进制路径和反编译引擎就绪。",
      "更新：`npx rea-agents update`。",
    ],
    usage: [
      "告诉编程代理：「逆向 C:\\path\\to\\target.exe 的 XXX 功能，用 REA 调查」。",
      "REA 会自主决定用哪些工具：AST 分析、ASAR 解包、符号提取、Ghidra/Hopper/IDA 调用。",
      "每一步都返回确定性证据：产物摘要、提供者、置信度、代码位置。",
      "分析中没弄清的部分会被显式保留为 residual unknowns，不会悄悄丢掉。",
      "所有分析在本地跑。结果会进入你用的模型的上下文——模型供应商有自己的数据政策。",
    ],
  },
  {
    id: "moli",
    name: "Moli Browser",
    category: "开发工具",
    date: "2026-11-01",
    tagline: "为 AI Agent 设计的轻量无头浏览器",
    description: "Moli 是 Lexmount 用 Rust 写的独立无头浏览器内核——不是 Chromium 包装器，是纯 Rust 实现：html5ever 解析 HTML、rusty_v8 跑 JS、Servo/Stylo 处理 CSS、Taffy+Parley 做布局。专为 AI 代理设计：按需布局（需要时才做重排）、低资源占用、支持 CDP / WebDriver Classic / WebDriver BiDi 三套协议。v1.1.20 已经很稳，AI 代理可以用它来抓取网页内容、自动填表、搜索信息、操作 DOM。Apache-2.0 / MIT 双协议，Win/Mac/Linux 三平台。",
    icon: "apps/moli/icon.svg",
    preview: "apps/moli/preview.jpg",
    downloads: [
      { platform: "Windows (x64)",    file: "/dl/apps/moli/download/moli-x86_64-pc-windows-msvc.zip", size: "—" },
      { platform: "Windows (ARM64)",  file: "/dl/apps/moli/download/moli-aarch64-pc-windows-msvc.zip", size: "—" },
      { platform: "macOS (Intel)",    file: "/dl/apps/moli/download/moli-x86_64-apple-darwin.tar.gz", size: "—" },
      { platform: "macOS (Apple Silicon)", file: "/dl/apps/moli/download/moli-aarch64-apple-darwin.tar.gz", size: "—" },
    ],
    install: [
      "下载 zip / tar.gz 解压后把 moli 可执行文件放进 PATH。",
      "或用安装脚本：Windows `powershell -c \"irm https://lexmount.com/moli-installer.ps1 | iex\"`，Mac/Linux `curl -fsSL https://lexmount.com/moli-installer.sh | bash`。",
      "验证：`moli --version` 应该输出版本号。",
    ],
    usage: [
      "CLI 模式：`moli fetch https://example.com` 抓取页面 HTML。",
      "CDP 模式：`moli --cdp-port 9222` 启动 CDP 服务，Playwright / Puppeteer 可以连。",
      "WebDriver 模式：`moli webdriver --port 4444`。",
      "AI 代理常用法：让代理调 moli 的 CDP 接口来自动化浏览器操作。",
      "默认不做完整布局和渲染，需要时加 `--render` 开启。",
    ],
  },
  {
    id: "artcraft",
    name: "ArtCraft AI Studio",
    category: "设计创意",
    date: "2026-11-01",
    tagline: "可控的 AI 创作：2D/3D 合成、视频生成",
    description: "ArtCraft 是 storytold（Brandon Thomas）的开源 AI 创作桌面应用——给艺术家「控制感」而不只是文字提示。桌面端 macOS/Windows，也有浏览器版 app.getartcraft.com。内置 Seedance 2.5、GPT Image 2、Sora 2 Pro、Kling 3.0 Pro、Flux Pro 等主流模型。特色功能：Image to Location（把虚拟演员放进真实环境）、3D Compositing（场景建图层）、Image to 3D Mesh、Character Posing（3D 摆姿势）、Background Removal。MIT 或 Apache-2.0 双协议，免费无订阅。注意：AI 模型调用需要在 ArtCraft 内登录模型提供商（或用自己的 API key）。",
    icon: "apps/artcraft/icon.png",
    preview: "apps/artcraft/preview.jpg",
    downloads: [
      { platform: "Windows (x64, 安装包)", file: "/dl/apps/artcraft/download/ArtCraft_0.41.0_x64-setup.exe", size: "—" },
      { platform: "Windows (x64, MSI)",  file: "/dl/apps/artcraft/download/ArtCraft_0.41.0_x64_en-US.msi", size: "—" },
      { platform: "macOS (Universal)",    file: "/dl/apps/artcraft/download/ArtCraft_0.41.0_universal.dmg", size: "—" },
    ],
    install: [
      "Windows：下载 exe 或 msi 双击安装。macOS：下载 dmg 拖进 Applications。",
      "第一次打开会提示登录（可用 GitHub 账号），然后选择要用的 AI 模型（Seedance 2.5 / GPT Image 2 / Sora 2 Pro / 其他）。",
      "或用浏览器版 app.getartcraft.com 无需安装。",
    ],
    usage: [
      "Studio 模式：2D 合成 / 3D 合成 / 人物摆姿势 / 背景抠图。",
      "Image to 3D Mesh：上传图生成 3D 模型，用于场景布置。",
      "Seedance 2.5：视频生成，可控制镜头运动。",
      "所有工作文件本地保存，不经过 ArtCraft 服务器。",
      "付费项是 AI 模型 credits（$8/月起），也可以用自己的 API key。",
    ],
  },
  {
    id: "howtolivebetter",
    name: "How To Live Better",
    category: "实用工具",
    date: "2026-11-01",
    tagline: "长寿防病、省钱理财、法律红线、恋爱婚育、出国",
    description: "HowToLiveBetter 是 eternity4719 开源的中文人生指南项目——68k+⭐，用 Python + AI 生成，内容覆盖：长寿与防病、急救知识、省钱理财与法律红线、失业与工伤、医保社保、恋爱与婚育、怀孕与育儿、创业与合规、出国指南……不是鸡汤，是干货清单，按主题分章节，有具体数字和操作步骤。输出格式多：EPUB（手机/平板读）、PDF、离线 HTML（浏览器双击打开就行）、Anki 卡片（知识条目做成记忆卡片）。MIT 协议，完全免费。",
    icon: "apps/howtolivebetter/icon.svg",
    preview: "apps/howtolivebetter/preview.jpg",
    downloads: [
      { platform: "EPUB（推荐，手机/平板）", file: "/dl/apps/howtolivebetter/download/HowToLiveBetter.epub", size: "—" },
      { platform: "PDF（打印/分享）",      file: "/dl/apps/howtolivebetter/download/HowToLiveBetter.pdf", size: "—" },
      { platform: "离线 HTML（浏览器双击）", file: "/dl/apps/howtolivebetter/download/HowToLiveBetter.html", size: "—" },
      { platform: "Anki 卡片（记忆）",     file: "/dl/apps/howtolivebetter/download/HowToLiveBetter.apkg", size: "—" },
    ],
    install: [
      "EPUB：手机装 Apple Books / Google Play Books，电脑装 Calibre，拖进去就能读。",
      "PDF：任何 PDF 阅读器。",
      "HTML：下载后双击 HowToLiveBetter.html 浏览器打开（完全离线）。",
      "Anki：装 Anki，双击 apkg 文件导入卡组。",
    ],
    usage: [
      "目录结构：按主题分章，搜索关键词找具体条目。",
      "定期 GitHub release 自动更新，关注版本号刷新内容。",
      "项目用 AI 辅助生成，社区校对，欢迎 PR 补充。",
    ],
  },
  {
    id: "diagram-design",
    name: "Diagram Design",
    category: "开发工具",
    date: "2026-11-01",
    tagline: "45 种图表类型，一个 HTML + SVG 文件",
    description: "Diagram Design 是 Cathryn Lavery 的 Agent Skill（62k+⭐）——让 Claude Code、Codex、Cursor、TRAE 等编程代理生成**杂志级质量**的图表。45 种类型：架构图、流程图、时序图、象限分析、Wardley 地图、鱼骨图、金字塔、服务蓝图、瀑布桥、极地图、爆炸视图……输出是**一个自包含的 .html 文件**（双击就能打开），纯 HTML + SVG，无阴影、无 Mermaid 那种 AI 味的圆角框、4px 网格对齐、1px hairline 边框、Instrument Serif + Geist + Geist Mono 三字体。MIT 协议，安装用 `npx skills add cathrynlavery/diagram-design`。",
    icon: "apps/diagram-design/icon.png",
    preview: "apps/diagram-design/preview.jpg",
    downloads: [
      { platform: "跨平台（npm skill）", file: "", size: "—" },
    ],
    install: [
      "前置：Node.js（npm 可用）+ 支持 Agent Skills 的编程代理（Claude Code / Codex / Cursor / GitHub Copilot / Gemini CLI / Cline / Windsurf / Amp）。",
      "安装：`npx skills add cathrynlavery/diagram-design`（让你的代理执行）。",
      "或手动克隆仓库到代理的 skills 目录。",
    ],
    usage: [
      "安装后，直接告诉代理：「画一个我的 app 架构图：frontend、backend、database、Redis cache」。",
      "或：「给我画一个象限图，Q2 项目按 impact vs effort 排序」。",
      "或：「画一个 bearer token 刷新的时序图」。",
      "代理会选图表类型、写 .html 文件，你双击就能在浏览器里看到成品。",
      "想让图表匹配你的品牌？用 `/onboard diagram-design https://yoursite.com`，代理会自动提取你的调色板和字体。",
    ],
  },
  {
    id: "plainapp",
    name: "PlainApp",
    category: "网络通信",
    date: "2026-11-01",
    tagline: "开源 AirDroid 替代：浏览器管理 Android，全程本地网络",
    description: "PlainApp 是一个开源的 AirDroid 替代方案——装上 Android App，在同一 Wi-Fi 的浏览器里直接管理手机：文件浏览/上传/下载、短信收发、联系人查看、WebRTC 屏幕镜像、通知镜像、RSS 阅读器、Markdown 笔记。全程本地网络，数据不经过任何第三方服务器，不用注册账号，无文件大小限制。端到端加密（XChaCha20-Poly1305 + Ed25519 签名 + ECDH 密钥交换），AGPL-3.0 开源，Android 9.0+。",
    icon: "apps/plainapp/icon.png",
    preview: "apps/plainapp/preview.jpg",
    downloads: [
      { platform: "Android (64-bit, 推荐)", file: "/dl/apps/plainapp/download/PlainApp-3.3.25-64bit-Recommended.apk", size: "—" },
      { platform: "Android (旧 32-bit)",      file: "/dl/apps/plainapp/download/PlainApp-3.3.25-Old-32bit.apk", size: "—" },
    ],
    install: [
      "下载 APK 装到 Android 9.0+ 手机。",
      "手机和电脑连同一个 Wi-Fi（或电脑连手机热点）。",
      "打开 PlainApp，点「Start」，记下显示的地址（比如 http://192.168.1.234:8080）。",
      "电脑浏览器打开这个地址就能管理手机了。",
    ],
    usage: [
      "Files：浏览/上传/下载/删除手机文件，无大小限制。",
      "SMS：收发短信、查看通话记录（需要授予 SMS 权限）。",
      "Screen Mirror：WebRTC 实时投屏到浏览器。",
      "Notifications：手机通知镜像到浏览器。",
      "RSS / Notes：内置 RSS 阅读器和 Markdown 笔记。",
      "全部流量在本地网络，离开 Wi-Fi 自动停。",
    ],
  },
  {
    id: "iphone-use",
    name: "iPhone-use",
    category: "开发工具",
    date: "2026-11-01",
    tagline: "让 Claude Code / Codex 等 AI 代理操作你的真实 iPhone",
    description: "iPhone-use 是一个开源 macOS CLI，让 Claude Code、Codex、Cursor、TRAE 等 AI 代码代理**看得到、摸得到**你的真实 iPhone。CLI 运行在 Mac 上，iPhone 插 USB + 信任 + 开发者模式 + 解锁。AI 代理发命令：截屏、点按钮、滑动、输入文字，iPhone-use 用 Apple 原生 HID/XCTest 执行动作，返回新截图让代理检查结果。支持标准模式（HID，无需 Xcode 签名）和 Runner 模式（XCTest，可操作 accessibility 元素）。MIT 协议，Swift 6 原生，不依赖 Node/Python/WebDriverAgent。",
    icon: "apps/iphone-use/icon.png",
    preview: "apps/iphone-use/preview.jpg",
    downloads: [
      { platform: "macOS (Apple Silicon)", file: "/dl/apps/iphone-use/download/iphone-use-0.6.1-macos-arm64.tar.gz", size: "—" },
    ],
    install: [
      "前置：Apple Silicon Mac、macOS 27 / Xcode 27、iPhone（iOS 27，USB 连接，已信任，开发者模式已开，保持解锁）。",
      "Homebrew 安装：brew install hughlee824/tap/iphone-use",
      "或手动下载 tar.gz 解压后把 iphone-use 放进 PATH。",
      "第一次用：iphone-use devices → 复制 UDID → iphone-use connect --device $UDID --mode standard",
      "然后在 Claude Code / Codex 里 invoke /iphone-use:iphone-use skill，给它第一个任务。",
    ],
    usage: [
      "先 iphone-use connect 连接设备，会话期间 AI 代理可以反复 observe + act。",
      "两个模式：standard（HID，无需签名，先装这个）和 runner（XCTest，有 accessibility 元素引用）。",
      "常用命令：observe（截屏）、tap（点）、swipe（滑）、text（输文字）、press（按键）。",
      "跑完 iphone-use disconnect 释放会话；空闲超时也会自动释放。",
    ],
  },
  {
    id: "readany",
    name: "ReadAny",
    category: "效率办公",
    date: "2026-11-01",
    tagline: "带 AI 聊天和语义搜索的本地优先电子书阅读器",
    description: "ReadAny 是一款本地优先的跨平台 AI 电子书阅读器。支持 EPUB、PDF、MOBI、AZW、FB2、CBZ、TXT 等几乎所有电子书格式。内置 AI RAG 聊天（问任何一本里的问题）、语义搜索（按意思而非关键词找内容）、高亮笔记自动整理、TTS 朗读、WebDAV 跨设备同步。桌面端（Win/macOS/Linux）+ 移动端（iOS/Android）全平台可用，数据本地存储不上传，隐私完全自主。",
    icon: "apps/readany/icon.png",
    preview: "apps/readany/preview.jpg",
    downloads: [
      { platform: "Windows (x64)",              file: "/dl/apps/readany/download/ReadAny_1.3.6_x64-setup.exe", size: "—" },
      { platform: "macOS (Apple Silicon)",      file: "/dl/apps/readany/download/ReadAny_1.3.6_aarch64.dmg", size: "—" },
      { platform: "macOS (Intel)",               file: "/dl/apps/readany/download/ReadAny_1.3.6_x64.dmg", size: "—" },
      { platform: "Linux (AppImage)",           file: "/dl/apps/readany/download/ReadAny_1.3.6_amd64.AppImage", size: "—" },
      { platform: "Android (APK)",               file: "/dl/apps/readany/download/ReadAny-1.3.6.apk", size: "—" },
    ],
    install: [
      "Windows：双击 setup.exe 安装。",
      "macOS：双击 .dmg 把 ReadAny 拖进「应用程序」。",
      "Linux：chmod +x AppImage 后直接运行。",
      "Android：下载 APK 安装即可。",
      "iOS：TestFlight 链接在 README 里（需要 iOS 设备扫码加入）。",
    ],
    usage: [
      "首次打开后选「本地」模式，点「导入书籍」把 EPUB/PDF 拖进去。",
      "等索引完成后，顶部搜索框可以按意思搜（比如「作者讨论自由意志的段落」），AI 会返回语义匹配结果。",
      "右侧「AI 聊天」面板可以直接问关于这本书的任何问题（需要填自己的 LLM API Key，本地不调用任何云端）。",
      "高亮、笔记自动聚合，支持 WebDAV 同步到多设备。",
    ],
  },
  {
    id: "bongocat",
    name: "BongoCat",                        // 应用名
    category: "桌面美化",                    // 大分类（分类条显示这个）
    date: "2026-10-15",                      // 上架日期（YYYY-MM-DD），用于「最近上架」排序
    tagline: "会打鼓的小猫",                 // 一句话简介（卡片上显示）
    description: "BongoCat 是一只住在你桌面的小猫，会跟着键盘和鼠标一起敲鼓。",  // 详细介绍（点开后显示）
    icon: "apps/bongocat/icon.png",
    preview: "apps/bongocat/preview.jpg",
    downloads: [                             // 下载项：几个平台就写几行，格式照抄
      { platform: "Windows",               file: "/dl/apps/bongocat/download/BongoCat_1.1.0_x86-setup.exe", size: "4.9 MB" },
      { platform: "macOS（Apple 芯片）",    file: "/dl/apps/bongocat/download/BongoCat-2.3.0-aarch64.dmg", size: "10.3 MB" },
      { platform: "macOS（Intel）",         file: "/dl/apps/bongocat/download/BongoCat-2.3.1-x64.dmg", size: "11.6 MB" },
    ],
    install: [                               // 安装说明（可选，不要就整段删掉）
      "Windows：双击安装包，若提示「已保护你的电脑」点「更多信息」→「仍要运行」。",
      "macOS：双击 .dmg 把 BongoCat 拖进「应用程序」；首次打开若提示「无法验证开发者」右键点图标选「打开」。",
    ],
    usage: [                                 // 使用说明（怎么用，可选，不要就整段删掉）
      "启动后，小猫会出现在屏幕底部，开始打鼓。",
      "敲键盘、点鼠标，小猫会跟着你的输入一起敲鼓——你敲多快，它就打多快。",
      "想调整位置、大小或退出，试试右键小猫，或点系统托盘 / 菜单栏里的 BongoCat 图标。",
    ],
  },

  {
    id: "winhance",
    name: "Winhance",
    category: "系统工具",
    date: "2026-10-18",
    tagline: "Windows 系统优化与定制",
    description: "Winhance 是一个 C# 开源应用，用于清理、优化和定制你的 Windows 体验。软件管理、系统优化、界面定制、自定义 ISO 制作——一站式搞定。",
    icon: "apps/winhance/icon.ico",
    preview: "apps/winhance/preview.jpg",
    downloads: [
      { platform: "Windows", file: "/dl/apps/winhance/download/Winhance.Installer.exe", size: "61.5 MB" },
    ],
    install: [
      "双击 Winhance.Installer.exe，按提示选择安装版或便携版。",
      "若 SmartScreen 提示未识别的应用，点「更多信息」→「仍要运行」即可。",
      "安装完成后会自动启动 Winhance。",
    ],
    usage: [
      "启动后可以看到四个主要板块：软件与应用、优化、定制、高级工具。",
      "软件与应用：卸载不需要的 Windows 自带应用，或通过 WinGet 安装常用软件。",
      "优化：一键开启隐私保护、游戏性能、电源计划等系统设置。",
      "定制：主题色、任务栏、开始菜单、资源管理器的外观和行为都可以改。",
      "高级工具：从零制作自定义 Windows ISO，或生成无人值守安装文件。",
    ],
  },

  {
    id: "mineradio",
    name: "Mineradio",
    category: "多媒体",
    date: "2026-10-20",
    tagline: "沉浸式音乐播放器",
    description: "Mineradio 是一款以电影镜头、粒子视觉和歌词舞台为核心的沉浸式音乐播放器。支持多格式音频、内嵌与外置歌词、本地封面、迷你播放器和桌面歌词，把听歌变成一场视觉演出。",
    icon: "apps/mineradio/icon.png",
    preview: "apps/mineradio/preview.jpg",
    downloads: [
      { platform: "Windows", file: "/dl/apps/mineradio/download/Mineradio-2.2.0-Setup.exe", size: "111.4 MB" },
    ],
    install: [
      "双击 Mineradio-2.2.0-Setup.exe，按提示完成安装。",
      "若 SmartScreen 提示「已保护你的电脑」，点「更多信息」→「仍要运行」。",
    ],
    usage: [
      "启动后添加本地音乐或登录音乐账号即可开始播放。",
      "播放界面内置多种粒子视觉预设与歌词舞台效果，可在设置中切换。",
      "支持外置歌词、桌面歌词与迷你播放器；手势操作可在设置里按习惯调整。",
    ],
  },

  {
    id: "pdfcraft",
    name: "PdfCraft",
    category: "实用工具",
    date: "2026-10-21",
    tagline: "纯 Rust 打造的开源 PDF 阅读编辑器",
    description: "PdfCraft 是一个用纯 Rust 从零编写的开源 PDF 阅读器与编辑器。轻快、干净、不臃肿——打开就能读，标注、编辑、导出一步到位。",
    icon: "apps/pdfcraft/icon.png",
    preview: "apps/pdfcraft/preview.jpg",
    downloads: [
      { platform: "Windows", file: "/dl/apps/pdfcraft/download/pdfcraft-0.10.1-windows-x64.msi", size: "68.8 MB" },
      { platform: "macOS（Intel / Apple 芯片）", file: "/dl/apps/pdfcraft/download/pdfcraft-0.10.1-macos-universal.dmg", size: "90.9 MB" },
    ],
    install: [
      "Windows：双击 .msi 安装包，按提示完成安装。",
      "macOS：双击 .dmg 把 PdfCraft 拖进「应用程序」；通用包同时支持 Intel 和 Apple 芯片，无需挑版本。",
    ],
    usage: [
      "打开任意 PDF 即可流畅阅读，支持缩放、翻页与导航。",
      "阅读之余可直接标注、编辑与导出，一个应用搞定 PDF 日常操作。",
      "纯 Rust 原生内核，没有网页套壳，内存占用低、大文件也顺手。",
    ],
  },

  {
    id: "linkswift",
    name: "LinkSwift",
    category: "实用工具",
    date: "2026-10-31",
    tagline: "一键解析 8 大网盘直链，油猴脚本",
    description: "LinkSwift 是一个油猴（Tampermonkey）脚本，在网盘网页上一键提取直链下载地址。支持百度网盘、阿里云盘、中国移动云盘、天翼云盘、迅雷云盘、夸克网盘、UC网盘、123云盘共 8 大平台。解析完成后可一键推送给 Aria2、Motrix、IDM 等下载器，自动精简网盘界面、支持自定义主题色。GitHub 35k+⭐，AGPL-3.0 开源。",
    icon: "apps/linkswift/icon.svg",
    preview: "apps/linkswift/preview.jpg",
    downloads: [
      { platform: "油猴脚本（全浏览器通用）", file: "/dl/apps/linkswift/download/LinkSwift.user.js", size: "783 KB" },
    ],
    install: [
      "第一步：浏览器里先装 Tampermonkey 扩展（Chrome/Edge/Firefox 扩展商店搜 Tampermonkey）。",
      "第二步：下载 LinkSwift.user.js，在 Tampermonkey 图标菜单里点「添加新脚本」，把文件内容粘贴进去保存；或直接在油猴扩展页拖入 .user.js 文件。",
      "第三步：打开任意支持的网盘（百度网盘/阿里云盘等），脚本自动在页面上显示「直链」按钮，点击即可提取下载地址。",
    ],
    usage: [
      "脚本安装后访问网盘页面自动生效，不需要手动启动。",
      "选中网盘里的文件，点页面上出现的「直链」按钮，复制直链或一键推送给 Aria2/Motrix。",
      "脚本设置里可选主题色、默认下载器、自动复制等。",
      "如果网盘页面没出按钮，检查 Tampermonkey 扩展是否启用、脚本是否在匹配列表里。",
    ],
  },

  {
    id: "lively",
    name: "Lively Wallpaper",
    category: "桌面美化",
    date: "2026-10-24",
    tagline: "免费开源的 Windows 动态壁纸",
    description: "Lively Wallpaper 是一款免费开源的 Windows 动态壁纸引擎。支持视频、GIF、HTML 网页、GLSL 着色器、YouTube 链接等多种壁纸格式，多显示器支持，游戏自动暂停，资源占用低。2023 微软商店应用大奖得主。",
    icon: "apps/lively/icon.png",
    preview: "apps/lively/preview.jpg",
    downloads: [
      { platform: "Windows (x64)", file: "/dl/apps/lively/download/lively_setup_x86_full_v2210.exe", size: "208.0 MB" },
    ],
    install: [
      "双击 lively_setup_x86_full_v2210.exe，按提示完成安装。",
      "若 SmartScreen 提示「已保护你的电脑」，点「更多信息」→「仍要运行」。",
      "首次启动若提示缺少 WebView2 Runtime（用于 HTML/网页壁纸），按提示安装即可。",
    ],
    usage: [
      "启动后内置壁纸库会自动展示——流体模拟、粒子效果、交互式可视化，点一下就上桌面。",
      "也可以把本地视频、GIF、HTML 文件或 YouTube 链接拖进窗口，一秒变成动态壁纸。",
      "支持多显示器：每张屏幕独立壁纸、横跨所有屏幕、或网格布局。",
      "玩游戏或全屏应用时自动暂停壁纸播放，CPU/GPU 占用降为零。",
      "系统托盘图标可随时暂停/恢复，设置里能调播放质量、性能配置和暂停规则。",
    ],
  },
  {
    id: "yt-dlp",
    name: "yt-dlp",
    category: "实用工具",
    date: "2026-10-23",
    tagline: "全能视频下载命令行工具",
    description: "yt-dlp 是一个功能强大的命令行视频下载工具，支持 YouTube、Bilibili、Twitter、TikTok、Vimeo 等数千个网站的视频和音频下载。基于 Python，开源免费，持续更新。",
    icon: "apps/yt-dlp/icon.ico",
    preview: "apps/yt-dlp/preview.jpg",
    downloads: [
      { platform: "Windows (x64)",  file: "/dl/apps/yt-dlp/download/yt-dlp.exe",          size: "17.0 MB" },
      { platform: "Windows (ARM64)", file: "/dl/apps/yt-dlp/download/yt-dlp_arm64.exe",   size: "20.2 MB" },
      { platform: "Linux (x64)",    file: "/dl/apps/yt-dlp/download/yt-dlp_linux",          size: "38.6 MB" },
      { platform: "源码包",          file: "/dl/apps/yt-dlp/download/yt-dlp.tar.gz",       size: "5.7 MB" },
    ],
    install: [
      "Windows：下载 .exe 后直接双击或放入 PATH 目录即可命令行使用。",
      "macOS：brew install yt-dlp（推荐），或 pip install yt-dlp。",
      "Linux：包管理器安装（apt/dnf/pacman 搜 yt-dlp），或 pip install yt-dlp。",
    ],
    usage: [
      "最简用法：yt-dlp <视频 URL>",
      "下载指定格式：yt-dlp -f bestvideo+bestaudio <URL>",
      "下载整个播放列表：yt-dlp <播放列表 URL>",
      "仅提取音频：yt-dlp -x --audio-format mp3 <URL>",
      "yt-dlp 是命令行工具，在终端/PowerShell 里运行。",
    ],
  },
  {
    id: "agent-desktop",
    name: "Agent Desktop",
    category: "开发工具",
    date: "2026-11-04",
    tagline: "让 AI Agent 直接操作你的桌面（Rust 原生）",
    description: "Agent Desktop 是 Vercel Labs 开源的 Rust 项目——给 Claude Code / Codex / Cursor / TRAE 等 Agent 一套真正的桌面控制力。不是基于像素识别（容易出错），而是通过操作系统原生的 Accessibility Tree（Windows UI Automation / macOS AXUIElement / Linux AT-SPI）拿到任何应用的真实 UI 结构，精准点击按钮、读取菜单、输入文字、截屏。底层是 Rust 写的桌面代理，Agent 通过 MCP 协议调用，动作可重试、有 ref 稳定引用。+4.2k⭐ 本周爆火，MIT 协议。",
    icon: "apps/agent-desktop/icon.ico",
    preview: "apps/agent-desktop/preview.jpg",
    downloads: [
      { platform: "Windows (x64)",      file: "/dl/apps/agent-desktop/download/agent-desktop-v1.1.0-x86_64-pc-windows-msvc.tar.gz", size: "—" },
      { platform: "Windows (ARM64)",    file: "/dl/apps/agent-desktop/download/agent-desktop-v1.1.0-aarch64-pc-windows-msvc.tar.gz", size: "—" },
      { platform: "macOS (Apple Silicon)", file: "/dl/apps/agent-desktop/download/agent-desktop-v1.1.0-aarch64-apple-darwin.tar.gz", size: "—" },
      { platform: "macOS (Intel)",      file: "/dl/apps/agent-desktop/download/agent-desktop-v1.1.0-x86_64-apple-darwin.tar.gz", size: "—" },
      { platform: "Linux (x64)",        file: "/dl/apps/agent-desktop/download/agent-desktop-v1.1.0-x86_64-unknown-linux-gnu.tar.gz", size: "—" },
      { platform: "Linux (ARM64)",      file: "/dl/apps/agent-desktop/download/agent-desktop-v1.1.0-aarch64-unknown-linux-gnu.tar.gz", size: "—" },
    ],
    install: [
      "解压 tar.gz，里面有 agent-desktop 可执行文件。",
      "Windows：PowerShell 里 tar -xzf xxx.tar.gz → 双击 agent-desktop.exe 或放入 PATH。",
      "macOS/Linux：tar -xzf → chmod +x agent-desktop → ./agent-desktop。",
      "需要 Rust ≥ 1.77 编译（源码方式），或直接用 release 预编译。",
    ],
    usage: [
      "Agent Desktop 跑在本机，Agent 通过 MCP 协议连接。",
      "让你的代理装上 MCP server 后说：「打开 VS Code，在 settings.json 里加一行配置」→ Agent Desktop 自动完成。",
      "所有动作基于 OS Accessibility API，精准度比纯像素截图高得多。",
    ],
  },
  {
    id: "voicestudio",
    name: "VoiceStudio",
    category: "音频视频",
    date: "2026-11-04",
    tagline: "开源 ElevenLabs 替代——本地语音克隆 + 视频配音",
    description: "VoiceStudio 是开源的全本地语音 AI 工作台——语音克隆（30 秒录音就能克隆任何人的声音）、AI 语音设计（选性别/年龄/语速/情绪从零生成新声音）、视频配音（自动识别画面里谁在说话、替换音轨）、听写转录（646 种语言）、TTS 朗读。完全本地跑，数据不外传，646 种语言支持，+10k⭐ 本周 GitHub 爆火。Electron + Python，跨平台：Windows / macOS / Linux / Android / iOS。AGPL-3.0。",
    icon: "apps/voicestudio/icon.png",
    preview: "apps/voicestudio/preview.jpg",
    downloads: [
      { platform: "Windows (x64)",        file: "/dl/apps/voicestudio/download/VoiceStudio-0.5.7-win-x64.exe", size: "—" },
      { platform: "Windows (ARM64)",      file: "/dl/apps/voicestudio/download/VoiceStudio-0.5.7-win-arm64.exe", size: "—" },
      { platform: "macOS (Apple Silicon)", file: "/dl/apps/voicestudio/download/VoiceStudio-0.5.7-mac-arm64.dmg", size: "—" },
      { platform: "macOS (Intel)",        file: "/dl/apps/voicestudio/download/VoiceStudio-0.5.7-mac-x64.dmg", size: "—" },
      { platform: "Linux (AppImage)",     file: "/dl/apps/voicestudio/download/VoiceStudio-0.5.7-linux-x64.AppImage", size: "—" },
    ],
    install: [
      "Windows：下载 .exe 双击安装器，一步步点「下一步」。",
      "macOS：下载 .dmg → 拖进 Applications。首次打开如被 Gatekeeper 拦截，右键 → 打开。",
      "Linux：chmod +x VoiceStudio-xxx.AppImage → 双击运行（AppImage 免安装）。",
      "首次启动需要下载 AI 模型（几百 MB），建议在「设置」里选「最小模型」先跑起来。",
    ],
    usage: [
      "语音克隆：录 30 秒你自己的声音 → AI 学完就能用「你的声音」说任何文本。",
      "视频配音：导入 mp4 → 自动识别画面里说话的人 → 替换成克隆声音的新音轨。",
      "TTS 朗读：输入中文/英文文本 → 选声音 → 导出 mp3。",
      "全部本地处理，录音不上传服务器，隐私 100% 自己掌控。",
    ],
  },
  {
    id: "zed",
    name: "Zed",
    category: "开发工具",
    date: "2026-11-04",
    tagline: "Rust 写的高性能多人协同代码编辑器",
    description: "Zed 是用 Rust 从零重写的下一代代码编辑器，由 Atom 和 Tree-sitter 创始人主导。专为速度打造：多线程利用多核 CPU，直接调用 GPU 渲染，打开超大项目也瞬间流畅。内置 Agent 面板（AI 并行编辑文件、导航代码、跑命令）、实时多人协作（屏幕共享、光标同步）、Vim 模式、LSP 补全、Markdown 预览。跨 macOS / Windows / Linux 三端，完全免费开源（GPL-3.0）。",
    icon: "apps/zed/icon.png",
    preview: "apps/zed/preview.jpg",
    downloads: [
      { platform: "Windows (x64)",         file: "/dl/apps/zed/download/Zed-x86_64.exe",          size: "62 MB" },
      { platform: "Windows (ARM64)",       file: "/dl/apps/zed/download/Zed-aarch64.exe",         size: "55 MB" },
      { platform: "macOS (Intel)",         file: "/dl/apps/zed/download/Zed-x86_64.dmg",          size: "92 MB" },
      { platform: "macOS (Apple Silicon)", file: "/dl/apps/zed/download/Zed-aarch64.dmg",         size: "84 MB" },
    ],
    install: [
      "Windows：双击 .exe 安装（需要 Windows 10 2004+ 或 Windows 11），或 winget install ZedIndustries.Zed。",
      "macOS：双击 .dmg 把 Zed 拖进「应用程序」，首次打开右键 → 打开（Gatekeeper 提示）。",
      "Linux：curl -f https://zed.dev/install.sh | sh（或 apt install zed / pacman -S zed）。",
    ],
    usage: [
      "首次启动会自动导入 VS Code / JetBrains 的键位习惯（可跳过）。",
      "内置 AI Agent 面板（Cmd+Shift+O / Ctrl+Shift+O），可以并行发多个 agent 任务。",
      "多人协作：右上角 Share Project → 生成分享链接 → 邀请他人实时编辑。",
      "设置里开启 Vim 模式、Relative Line Numbers、Lazy Git 等常见偏好。",
    ],
  },
  {
    id: "craft-anything",
    name: "Craft Anything",
    category: "开发工具",
    date: "2026-11-08",
    tagline: "逆向+创作，看懂任何软件然后自己做",
    description: "Craft Anything 由 storytold（PdfCraft/ArtCraft 作者）开源，Rust 写的桌面工作台。核心想法：给它任意软件（二进制、源码、网页），它先帮你看透内部原理，再引导你做出自己的版本。底层用 LLVM、Ghidra、Tree-sitter 等工具链做静态分析，结合 AI 模型生成可读的解释文档和代码脚手架。适合想学习软件内部原理、或者想复刻某个工具的开发者。v0.5.0 刚发布，20.4k⭐。",
    icon: "apps/craft-anything/icon.png",
    preview: "apps/craft-anything/preview.jpg",
    downloads: [
      { platform: "Windows (x64)",         file: "/dl/apps/craft-anything/download/craft-anything-0.5.0-windows-x64.msi",          size: "57 MB" },
      { platform: "Windows (ARM64)",       file: "/dl/apps/craft-anything/download/craft-anything-0.5.0-windows-arm64.msi",         size: "54 MB" },
      { platform: "macOS (Intel / Apple Silicon)", file: "/dl/apps/craft-anything/download/craft-anything-0.5.0-macos-universal.dmg",  size: "133 MB" },
    ],
    install: [
      "Windows：双击 .msi 安装，安装后开始菜单找 Craft Anything。",
      "macOS：双击 .dmg 把 Craft Anything 拖进「应用程序」。",
    ],
    usage: [
      "首页点「Load Target」导入想研究的二进制或源码目录。",
      "左侧会显示反编译结构，右侧 AI 面板可以问问题、让它生成复刻脚手架。",
      "底层依赖 Ghidra（反汇编）和 Tree-sitter（代码解析），首次启动会自动拉取。",
    ],
  },
];