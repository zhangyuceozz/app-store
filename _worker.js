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
  // 绝对 URL（非 GitHub 来源，比如官方 CDN）→ 直接 fetch
  if (upstreamPath.startsWith("http://") || upstreamPath.startsWith("https://")) {
    return fetch(upstreamPath, {
      cf: { cacheEverything: true, cacheTtl: 86400 },
      headers: { "User-Agent": "ChovyStore/1.0" },
    });
  }
    // GitHub 相对路径 → 先走 ghproxy 镜像再 fallback 直链
  const mirror = MIRROR + GH + upstreamPath;
  const direct = GH + upstreamPath;
  try {
    const resp = await fetch(mirror, {
      cf: { cacheEverything: false },  // mirror 永不缓存，每次拿新鲜
      headers: { "User-Agent": "ChovyStore/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) throw new Error("mirror HTTP " + resp.status);
    // 内容完整性校验：前 4KB + 后 4KB 里如果有 HTML 错误标记，说明 mirror 返回了污染数据
    // （GitHub 偶尔会返回 200 但尾部拼接错误页/HTML）
    const buf = await resp.arrayBuffer();
    const head = new Uint8Array(buf.slice(0, Math.min(4096, buf.byteLength)));
    const tail = new Uint8Array(buf.slice(Math.max(0, buf.byteLength - 4096)));
    const isHTML = (u8) => {
      const s = String.fromCharCode.apply(null, u8);
      return s.includes("<!DOC") || s.includes("<html") || s.includes("<HTML")
          || s.includes("Not Found") || s.includes("<?xml");
    };
    if (isHTML(head) || isHTML(tail)) {
      throw new Error("mirror returned HTML garbage (" + buf.byteLength + " bytes)");
    }
    return new Response(buf, { status: resp.status, headers: resp.headers });
  } catch (e) {
    console.warn("mirror failed:", e.message, "fallback to direct GitHub");
    const resp = await fetch(direct, {
      cf: { cacheEverything: true, cacheTtl: 86400 },  // 直链缓存 24h
      headers: { "User-Agent": "ChovyStore/1.0" },
    });
    if (!resp.ok) return resp;
    // GitHub 直链也做同样的完整性校验
    const buf = await resp.arrayBuffer();
    const tail = new Uint8Array(buf.slice(Math.max(0, buf.byteLength - 4096)));
    const tailStr = String.fromCharCode.apply(null, tail);
    if (tailStr.includes("<!DOC") || tailStr.includes("<html") || tailStr.includes("Not Found")) {
      return new Response("Upstream returned corrupted data", { status: 502 });
    }
    return new Response(buf, { status: resp.status, headers: resp.headers });
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
      headers.set("Cache-Control", "s-maxage=0");  // 禁止 Pages 缓存 Worker 输出
      return new Response(resp.body, { status: resp.status, headers });
    }

    // 其余请求走静态资产
    return env.ASSETS.fetch(request);
  }
};