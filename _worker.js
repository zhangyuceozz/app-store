// 下载反代（Pages 高级模式）：/dl/apps/... -> 各应用官方 GitHub Release
// 访客从本站域名下载安装包，绕开 GitHub 直链在国内的可达性问题；边缘缓存 24h
// 上架新应用：下载文件放进 apps/<id>/download/，并在 MAP 加一行「文件名 -> 官方 Release 直链」
const GH = "https://github.com";
const MIRROR = "https://mirror.ghproxy.com";

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
  // Bing Wallpaper Now v1.6.1 (跨平台每日壁纸, Homebrew cask)
  "Bing.Wallpaper.Now_1.6.1_aarch64.dmg": "/qiyuey/bing-wallpaper-now/releases/download/1.6.1/Bing.Wallpaper.Now_1.6.1_aarch64.dmg",
  "Bing.Wallpaper.Now_1.6.1_x64_zh-CN.msi": "/qiyuey/bing-wallpaper-now/releases/download/1.6.1/Bing.Wallpaper.Now_1.6.1_x64_zh-CN.msi",
};

async function fetchUpstream(upstreamPath) {
  // 绝对 URL（非 GitHub 来源）或 GitHub 相对路径 → 都直接 fetch 上游
  const url = upstreamPath.startsWith("http")
    ? upstreamPath
    : "https://github.com" + upstreamPath;
  const resp = await fetch(url, {
    cf: { cacheEverything: true, cacheTtl: 86400 },
    headers: { "User-Agent": "ChovyStore/1.0" },
    redirect: "follow",  // GitHub Release 资产 302 → release-assets.githubusercontent.com，必须跟随
  });
  if (!resp.ok) return resp;
  // 完整性校验：前 4KB + 后 4KB 里有 HTML 错误标记说明返回了垃圾
  const buf = await resp.arrayBuffer();
  const head = new Uint8Array(buf.slice(0, Math.min(4096, buf.byteLength)));
  const tail = new Uint8Array(buf.slice(Math.max(0, buf.byteLength - 4096)));
  const bad = (u8) => {
    const s = String.fromCharCode.apply(null, u8);
    return s.includes("<!DOC") || s.includes("<html") || s.includes("<HTML")
        || s.includes("Not Found") || s.includes("<?xml");
  };
  if (bad(head) || bad(tail)) {
    return new Response("Upstream returned corrupted data", { status: 502 });
  }
  return new Response(buf, { status: resp.status, headers: resp.headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // /dl/, /dl2/, /dl3/ → 下载反代
    const dlMatch = url.pathname.match(/^\/(dl|dl2|dl3)(\/.*)$/);
    if (dlMatch) {
      const path = dlMatch[2]; // => /apps/...
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
        return new Response("Not Found", { status: 404 });
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