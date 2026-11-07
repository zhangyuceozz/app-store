// 下载反代（Pages 高级模式）：/dl/apps/... -> 各应用官方 GitHub Release
// 访客从本站域名下载安装包，绕开 GitHub 直链在国内的可达性问题；边缘缓存 24h
// 上架新应用：下载文件放进 apps/<id>/download/，并在 MAP 加一行「文件名 -> 官方 Release 直链」
// 注意：GitHub Release 资产会 302 → release-assets.githubusercontent.com，必须走 mirror 或 redirect: follow
const MIRRORS = [
  "https://ghproxy.net",
  "https://gh-proxy.com",
  "https://gh.monlor.com",
];

const MAP = {
  "BongoCat_1.1.0_x86-setup.exe": "/ayangweb/BongoCat/releases/download/v1.1.0/BongoCat_1.1.0_x86-setup.exe",
  "BongoCat-2.3.0-aarch64.dmg": "/ayangweb/BongoCat/releases/download/v2.3.0/BongoCat-2.3.0-aarch64.dmg",
  "BongoCat-2.3.1-x64.dmg": "/ayangweb/BongoCat/releases/download/v2.3.1/BongoCat-2.3.1-x64.dmg",
  "Winhance.Installer.exe": "/memstechtips/Winhance/releases/download/v26.06.12/Winhance.Installer.exe",
  "Mineradio-2.2.0-Setup.exe": "/XxHuberrr/Mineradio-paused/releases/download/v2.2.0/Mineradio-2.2.0-Setup.exe",
  "pdfcraft-0.10.1-windows-x64.msi": "/storytold/pdfcraft/releases/download/v0.10.1/pdfcraft-0.10.1-windows-x64.msi",
  "pdfcraft-0.10.1-macos-universal.dmg": "/storytold/pdfcraft/releases/download/v0.10.1/pdfcraft-0.10.1-macos-universal.dmg",
  // yt-dlp 2026.08.19
  "yt-dlp.exe": "/yt-dlp/yt-dlp/releases/download/2026.08.19/yt-dlp.exe",
  "yt-dlp_arm64.exe": "/yt-dlp/yt-dlp/releases/download/2026.08.19/yt-dlp_arm64.exe",
  "yt-dlp_linux": "/yt-dlp/yt-dlp/releases/download/2026.08.19/yt-dlp_linux",
  "yt-dlp.tar.gz": "/yt-dlp/yt-dlp/releases/download/2026.08.19/yt-dlp.tar.gz",
  // Lively Wallpaper v2.2.1.0
  "lively_setup_x86_full_v2210.exe": "/lively-community/lively/releases/download/v2.2.1.0/lively_setup_x86_full_v2210.exe",
  // LinkSwift（油猴脚本，网盘直链下载助手）
  "LinkSwift.user.js": "https://raw.githubusercontent.com/hmjz100/LinkSwift/dev/%EF%BC%88%E6%94%B9%EF%BC%89%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js",
  // ReadAny v1.3.6（AI 电子书阅读器）
  "ReadAny_1.3.6_x64-setup.exe": "/codedogQBY/ReadAny/releases/download/v1.3.6/ReadAny_1.3.6_x64-setup.exe",
  "ReadAny_1.3.6_aarch64.dmg": "/codedogQBY/ReadAny/releases/download/v1.3.6/ReadAny_1.3.6_aarch64.dmg",
  "ReadAny_1.3.6_x64.dmg": "/codedogQBY/ReadAny/releases/download/v1.3.6/ReadAny_1.3.6_x64.dmg",
  "ReadAny_1.3.6_amd64.AppImage": "/codedogQBY/ReadAny/releases/download/v1.3.6/ReadAny_1.3.6_amd64.AppImage",
  "ReadAny-1.3.6.apk": "/codedogQBY/ReadAny/releases/download/v1.3.6/ReadAny-1.3.6.apk",
  // iPhone-use v0.6.1（让 AI 代理控制真实 iPhone 的 macOS CLI）
  "iphone-use-0.6.1-macos-arm64.tar.gz": "/hughlee824/iphone-use/releases/download/v0.6.1/iphone-use-0.6.1-macos-arm64.tar.gz",
  // PlainApp v3.3.25（开源 AirDroid 替代，Android 本地网络管理）
  "PlainApp-3.3.25-64bit-Recommended.apk": "/plainhub/plain-app/releases/download/v3.3.25/PlainApp-3.3.25-64bit-Recommended.apk",
  "PlainApp-3.3.25-Old-32bit.apk": "/plainhub/plain-app/releases/download/v3.3.25/PlainApp-3.3.25-Old-32bit.apk",
  // Moli Browser v1.1.20（Rust 写的 AI agent headless browser，Win/Mac 三平台）
  "moli-x86_64-pc-windows-msvc.zip": "/lexmount/moli/releases/download/v1.1.20/moli-x86_64-pc-windows-msvc.zip",
  "moli-aarch64-pc-windows-msvc.zip": "/lexmount/moli/releases/download/v1.1.20/moli-aarch64-pc-windows-msvc.zip",
  "moli-x86_64-apple-darwin.tar.gz": "/lexmount/moli/releases/download/v1.1.20/moli-x86_64-apple-darwin.tar.gz",
  "moli-aarch64-apple-darwin.tar.gz": "/lexmount/moli/releases/download/v1.1.20/moli-aarch64-apple-darwin.tar.gz",
  // ArtCraft AI Studio v0.41.0（storytold，开源 AI 图像视频工作台）
  "ArtCraft_0.41.0_x64-setup.exe": "/storytold/artcraft/releases/download/artcraft-v0.41.0/ArtCraft_0.41.0_x64-setup.exe",
  "ArtCraft_0.41.0_x64_en-US.msi": "/storytold/artcraft/releases/download/artcraft-v0.41.0/ArtCraft_0.41.0_x64_en-US.msi",
  "ArtCraft_0.41.0_universal.dmg": "/storytold/artcraft/releases/download/artcraft-v0.41.0/ArtCraft_0.41.0_universal.dmg",
  // How To Live Better（eternity4719，中文人生指南，EPUB/PDF/HTML/Anki）
  "HowToLiveBetter.epub": "/eternity4719/HowToLiveBetter/releases/download/epub-latest/HowToLiveBetter.epub",
  "HowToLiveBetter.pdf": "/eternity4719/HowToLiveBetter/releases/download/epub-latest/HowToLiveBetter.pdf",
  "HowToLiveBetter.html": "/eternity4719/HowToLiveBetter/releases/download/epub-latest/HowToLiveBetter.html",
  "HowToLiveBetter.apkg": "/eternity4719/HowToLiveBetter/releases/download/epub-latest/HowToLiveBetter.apkg",
  // PowerToys v0.102.3001（Microsoft 官方 Windows 增强包，仅 Windows）
  "PowerToysSetup-0.102.3001.0-x64.exe": "/microsoft/PowerToys/releases/download/v0.102.3001/PowerToysSetup-0.102.3001.0-x64.exe",
  "PowerToysSetup-0.102.3001.0-arm64.exe": "/microsoft/PowerToys/releases/download/v0.102.3001/PowerToysSetup-0.102.3001.0-arm64.exe",
  // Agent Desktop v1.1.0（Vercel Labs，AI Agent 桌面控制，全平台）
  "agent-desktop-v1.1.0-x86_64-pc-windows-msvc.tar.gz": "/vercel-labs/agent-desktop/releases/download/v1.1.0/agent-desktop-v1.1.0-x86_64-pc-windows-msvc.tar.gz",
  "agent-desktop-v1.1.0-aarch64-pc-windows-msvc.tar.gz": "/vercel-labs/agent-desktop/releases/download/v1.1.0/agent-desktop-v1.1.0-aarch64-pc-windows-msvc.tar.gz",
  "agent-desktop-v1.1.0-x86_64-apple-darwin.tar.gz": "/vercel-labs/agent-desktop/releases/download/v1.1.0/agent-desktop-v1.1.0-x86_64-apple-darwin.tar.gz",
  "agent-desktop-v1.1.0-aarch64-apple-darwin.tar.gz": "/vercel-labs/agent-desktop/releases/download/v1.1.0/agent-desktop-v1.1.0-aarch64-apple-darwin.tar.gz",
  "agent-desktop-v1.1.0-x86_64-unknown-linux-gnu.tar.gz": "/vercel-labs/agent-desktop/releases/download/v1.1.0/agent-desktop-v1.1.0-x86_64-unknown-linux-gnu.tar.gz",
  "agent-desktop-v1.1.0-aarch64-unknown-linux-gnu.tar.gz": "/vercel-labs/agent-desktop/releases/download/v1.1.0/agent-desktop-v1.1.0-aarch64-unknown-linux-gnu.tar.gz",
  // VoiceStudio v0.5.7（debpalash，本地语音克隆+视频配音，全平台）
  "VoiceStudio-0.5.7-win-x64.exe": "/debpalash/VoiceStudio/releases/download/v0.5.7/VoiceStudio-0.5.7-win-x64.exe",
  "VoiceStudio-0.5.7-win-arm64.exe": "/debpalash/VoiceStudio/releases/download/v0.5.7/VoiceStudio-0.5.7-win-arm64.exe",
  "VoiceStudio-0.5.7-mac-arm64.dmg": "/debpalash/VoiceStudio/releases/download/v0.5.7/VoiceStudio-0.5.7-mac-arm64.dmg",
  "VoiceStudio-0.5.7-mac-x64.dmg": "/debpalash/VoiceStudio/releases/download/v0.5.7/VoiceStudio-0.5.7-mac-x64.dmg",
  "VoiceStudio-0.5.7-linux-x64.AppImage": "/debpalash/VoiceStudio/releases/download/v0.5.7/VoiceStudio-0.5.7-linux-x64.AppImage",
  // Zed v1.27.0（zed-industries，Rust 高性能多人协同代码编辑器）
  "Zed-x86_64.exe": "/zed-industries/zed/releases/download/v1.27.0/Zed-x86_64.exe",
  "Zed-aarch64.exe": "/zed-industries/zed/releases/download/v1.27.0/Zed-aarch64.exe",
  "Zed-x86_64.dmg": "/zed-industries/zed/releases/download/v1.27.0/Zed-x86_64.dmg",
  "Zed-aarch64.dmg": "/zed-industries/zed/releases/download/v1.27.0/Zed-aarch64.dmg",
};

async function fetchUpstream(upstreamPath) {
  const upstream = upstreamPath.startsWith("http")
    ? upstreamPath
    : "https://github.com" + upstreamPath;
  // 逐个试 mirror，最后 fallback 到 GitHub 直链
  const sources = [
    ...MIRRORS.map(m => m + "/" + upstream),
    upstream, // GitHub 直链 fallback
  ];
  let lastErr = null;
  for (const url of sources) {
    try {
      const resp = await fetch(url, {
        cf: { cacheEverything: true, cacheTtl: 86400 },
        headers: { "User-Agent": "ChovyStore/1.0" },
        redirect: "follow",
      });
      if (resp.ok) return resp;
      lastErr = "HTTP " + resp.status;
    } catch (e) {
      lastErr = e.message;
    }
  }
  return new Response("All mirrors failed: " + lastErr, { status: 502 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // /dl/ → 下载反代
    const dlMatch = url.pathname.match(/^\/dl(\/.*)$/);
    if (dlMatch) {
      const path = dlMatch[1]; // => /apps/...
      if (!path.startsWith("/apps/") || path.includes("..")) {
        return new Response("Not Found", { status: 404 });
      }
      const fname = path.split("/").pop();
      const upstreamPath = MAP[fname];
      if (!upstreamPath) {
        return new Response("Not Found", { status: 404 });
      }
      const resp = await fetchUpstream(upstreamPath);
      if (!resp.ok) {
        return resp;  // 透传 fetchUpstream 的错误（404/502/upstream status）
      }
      const headers = new Headers(resp.headers);
      headers.set("Content-Type", "application/octet-stream");
      headers.set("Content-Disposition", "attachment; filename=\"" + fname + "\"");
      return new Response(resp.body, { status: resp.status, headers });
    }

    // 其余请求走静态资产
    return env.ASSETS.fetch(request);
  }
};