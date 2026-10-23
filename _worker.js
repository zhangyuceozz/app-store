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
};

async function fetchUpstream(path) {
  // 先试 ghproxy 镜像（国内快 3-5 倍），超时/失败 fallback GitHub 直链
  const mirror = MIRROR + GH + path;
  const direct = GH + path;
  try {
    const resp = await fetch(mirror, {
      cf: { cacheEverything: true, cacheTtl: 86400 },
      headers: { "User-Agent": "ChovyStore/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (resp.ok) return resp;
    throw new Error("mirror HTTP " + resp.status);
  } catch (e) {
    console.log("mirror miss:", e.message, "fallback GitHub");
    return fetch(direct, {
      cf: { cacheEverything: true, cacheTtl: 86400 },
      headers: { "User-Agent": "ChovyStore/1.0" },
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/dl/")) {
      const path = url.pathname.slice("/dl".length); // => /apps/...
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