// ============================================================
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
    id: "bongocat",                          // 唯一 ID（英文），和 apps/ 下的文件夹同名
    name: "BongoCat",                        // 应用名
    category: "桌面美化",                    // 大分类（分类条显示这个）
    sub: "互动桌宠",                         // 小分类（可选，进入大分类后按这个分组）
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
    sub: "系统优化",
    date: "2026-10-18",
    tagline: "Windows 系统优化与定制",
    description: "Winhance 是一个 C# 开源应用，用于清理、优化和定制你的 Windows 体验。软件管理、系统优化、界面定制、自定义 ISO 制作——一站式搞定。",
    icon: "apps/winhance/icon.png",
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
    sub: "音乐播放器",
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
    sub: "PDF 工具",
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

  // ↓↓↓ 新应用在这里往下加，复制 BongoCat 整块 { ... } 改内容即可 ↓↓↓
  {
    id: "bing-wallpaper",
    name: "Bing Wallpaper Now",
    category: "桌面美化",
    sub: "每日壁纸",
    date: "2026-10-25",
    tagline: "每天自动换一张微软 Bing 每日一图",
    description: "Bing Wallpaper Now 把微软 Bing 每日精选摄影做成你的桌面壁纸——每天自动换一张，跨平台（Windows / macOS），支持自动更新、多显示器、开机自启。Apple 官方签名 notarized，M4 双击直接开，零账号零配置。MIT 开源。",
    icon: "apps/bing-wallpaper/icon.png",
    preview: "apps/bing-wallpaper/preview.jpg",
    downloads: [
      { platform: "macOS（Apple 芯片 M4/M3/M2/M1）", file: "/dl4/apps/bing-wallpaper/download/Bing.Wallpaper.Now_1.6.1_aarch64.dmg", size: "6.8 MB" },
      { platform: "Windows 10/11 x64",          file: "/dl4/apps/bing-wallpaper/download/Bing.Wallpaper.Now_1.6.1_x64_zh-CN.msi", size: "6.5 MB" },
    ],
    install: [
      "macOS：双击 .dmg 把 Bing Wallpaper Now 拖进「应用程序」。",
      "Windows：双击 .msi 一路下一步。",
      "Apple 官方签名 notarized，首次双击直接打开，不需要右键。",
    ],
    usage: [
      "启动后菜单栏（Mac）/ 系统托盘（Win）出现图标，自动下载当天壁纸并设为桌面。",
      "点图标可以手动换一张、打开设置、退出。",
      "设置里可开多显示器支持、开机自启。",
      "离线时保留上次的壁纸，联网自动补更。",
    ],
  },
  {
    id: "lively",
    name: "Lively Wallpaper",
    category: "桌面美化",
    sub: "动态壁纸",
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
    sub: "视频下载",
    date: "2026-10-23",
    tagline: "全能视频下载命令行工具",
    description: "yt-dlp 是一个功能强大的命令行视频下载工具，支持 YouTube、Bilibili、Twitter、TikTok、Vimeo 等数千个网站的视频和音频下载。基于 Python，开源免费，持续更新。",
    icon: "apps/yt-dlp/icon.png",
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
];