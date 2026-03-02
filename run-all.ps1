param(
  [string]$BackendPort = "8080",
  [string]$FrontendPort = "5173"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot "backend"
$frontendDir = Join-Path $projectRoot "frontend"

function Get-FreePort([int]$startPort) {
  $port = $startPort
  while ($true) {
    $inUse = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
    if (-not $inUse) { return $port }
    $port++
  }
}

$resolvedBackendPort = Get-FreePort([int]$BackendPort)
$resolvedFrontendPort = Get-FreePort([int]$FrontendPort)

Write-Host "Starting Smart AI Habit Tracker..."
Write-Host "Backend:  http://localhost:$resolvedBackendPort/api/health"
Write-Host "Frontend: http://localhost:$resolvedFrontendPort"

$backendCommand = "& { `$env:SERVER_PORT='$resolvedBackendPort'; .\mvnw.cmd spring-boot:run }"
$frontendCommand = "& { `$env:VITE_API_PROXY_TARGET='http://localhost:$resolvedBackendPort'; npx vite --host 0.0.0.0 --port $resolvedFrontendPort --strictPort }"

$backendProcess = Start-Process powershell -WorkingDirectory $backendDir -ArgumentList "-NoExit", "-Command", $backendCommand -PassThru

$backendReady = $false
for ($i = 0; $i -lt 45; $i++) {
  Start-Sleep -Seconds 1
  if ($backendProcess.HasExited) { break }
  try {
    $resp = Invoke-WebRequest -Uri "http://localhost:$resolvedBackendPort/api/health" -UseBasicParsing -TimeoutSec 1
    if ($resp.StatusCode -eq 200) {
      $backendReady = $true
      break
    }
  } catch {
  }
}

if (-not $backendReady) {
  Write-Host ""
  Write-Host "Backend failed to become healthy on port $resolvedBackendPort."
  Write-Host "Check the backend terminal window for the exact error."
  return
}

$frontendProcess = Start-Process powershell -WorkingDirectory $frontendDir -ArgumentList "-NoExit", "-Command", $frontendCommand -PassThru

Write-Host ""
Write-Host "Backend PID : $($backendProcess.Id)"
Write-Host "Frontend PID: $($frontendProcess.Id)"
Write-Host "Two terminals opened. Close them to stop services."
