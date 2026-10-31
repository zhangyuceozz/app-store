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