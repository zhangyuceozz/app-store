# Chovy Store Deploy Script
# Usage:
#   set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID env vars first
#   powershell -ExecutionPolicy Bypass -File deploy.ps1 -Msg "your message"
param([string]$Msg = 'auto deploy')
$ErrorActionPreference = 'Stop'
$root = 'C:\Users\zhang\Desktop\app-store'
$gitExe = 'C:\Administrator\AppData\Local\GitHubDesktop\app-3.5.7\resources\app\git\cmd\git.exe'
$wrangler = 'C:\Users\zhang\nodejs\node-v22.20.0-win-x64\wrangler.cmd'
Set-Location $root
$env:GIT_SSH_COMMAND = 'ssh -i C:/Users/zhang/.ssh/id_ed25519 -o StrictHostKeyChecking=accept-new'
if (-not $env:CLOUDFLARE_API_TOKEN -or -not $env:CLOUDFLARE_ACCOUNT_ID) {
  Write-Host 'FAIL: set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID first' -ForegroundColor Red; exit 1
}
$index = Join-Path $root 'index.html'
$lines = [System.IO.File]::ReadAllLines($index)
Write-Host '=== Chovy Store Deploy ===' -ForegroundColor Cyan
# Find SPLASH_LOG
$s = -1; $e = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match '^\s*var SPLASH_LOG = \[$') { $s = $i; break }
}
if ($s -lt 0) { Write-Host 'FAIL: SPLASH_LOG start not found' -ForegroundColor Red; exit 1 }
for ($i = $s + 1; $i -lt $s + 15; $i++) {
  if ($lines[$i] -match '^\s*\];\s*$') { $e = $i; break }
}
if ($e -lt 0) { Write-Host 'FAIL: SPLASH_LOG closing not found' -ForegroundColor Red; exit 1 }
# Parse entries
$entries = @()
for ($i = $s + 1; $i -lt $e; $i++) {
  $line = $lines[$i]
  if ($line -match 'text:\s*"([^"]+)"') {
    $t = $Matches[1]
    $d = if ($line -match 'date:\s*"([^"]+)"') { $Matches[1] } else { '???' }
    $ty = if ($line -match 'type:\s*"([^"]+)"') { $Matches[1] } else { '???' }
    $entries += [pscustomobject]@{ Text = $t; Date = $d; Type = $ty }
  }
}
Write-Host "
Local SPLASH_LOG ($($entries.Count) items):" -ForegroundColor Yellow
$entries | ForEach-Object { Write-Host "  [$($_.Date)] [$($_.Type)] $($_.Text)" }
# Validate
$today = (Get-Date).ToString('yyyy-MM-dd')
$fail = $false
if ($entries.Count -ne 5) {
  Write-Host "FAIL: need exactly 5 entries, got $($entries.Count)" -ForegroundColor Red; $fail = $true
}
$hasNew = $entries | Where-Object { $_.Type -eq 'new' }
if ($hasNew) {
  Write-Host "FAIL: type:'new' forbidden (user rule)" -ForegroundColor Red
  $hasNew | ForEach-Object { Write-Host "  - $($_.Text)" }
  $fail = $true
}
if ($fail) { Write-Host 'Fix SPLASH_LOG manually then rerun.' -ForegroundColor Red; exit 1 }
$latest = $entries[0]
if ($latest.Date -ne $today) { Write-Host "WARN: latest date $($latest.Date) != today $today" -ForegroundColor DarkYellow }
# Bump cache-buster
$content = [System.IO.File]::ReadAllText($index)
$m = [regex]::Match($content, 'apps\.js\?v=(\d+)')
$oldVer = [int]$m.Groups[1].Value
$newVer = $oldVer + 1
$content = $content.Replace("apps.js?v=$oldVer", "apps.js?v=$newVer")
[System.IO.File]::WriteAllText($index, $content)
Write-Host "
cache-buster: v$oldVer -> v$newVer" -ForegroundColor Green
# Git
Write-Host "
--- git add + commit + push ---" -ForegroundColor Yellow
& $gitExe add -A | Out-Null
& $gitExe commit -m "[$today] $Msg (v$newVer)" | Out-Null
& $gitExe push origin main
if ($LASTEXITCODE -ne 0) { Write-Host 'FAIL: git push' -ForegroundColor Red; exit 1 }
# Dual deploy
Write-Host "
--- Cloudflare Pages deploy ---" -ForegroundColor Yellow
& $wrangler pages deploy . --project-name=chovy --branch=main
if ($LASTEXITCODE -ne 0) { Write-Host 'FAIL: chovy' -ForegroundColor Red; exit 1 }
& $wrangler pages deploy . --project-name=ah0 --branch=main
if ($LASTEXITCODE -ne 0) { Write-Host 'FAIL: ah0' -ForegroundColor Red; exit 1 }
# Verify live
Write-Host "
--- Live verify ---" -ForegroundColor Yellow
Start-Sleep -Seconds 3
try {
  $ProgressPreference = 'SilentlyContinue'
  $r = Invoke-WebRequest -Uri 'https://chovy.cc.cd/' -UseBasicParsing -Headers @{ 'Cache-Control' = 'no-cache' }
  $c = $r.Content
  $m2 = [regex]::Match($c, 'apps\.js\?v=(\d+)')
  $liveVer = $m2.Groups[1].Value
  Write-Host "  Live cache-buster: v$liveVer (expect v$newVer)" -ForegroundColor 
  $textOk = $c -match [regex]::Escape($latest.Text)
  Write-Host "  Live has latest entry: " -ForegroundColor 
} catch { Write-Host '  Live verify skipped' -ForegroundColor DarkYellow }
Write-Host "
=== Done! Close old tab -> new tab -> Ctrl+Shift+R ===" -ForegroundColor Green