$ErrorActionPreference = 'SilentlyContinue'
Set-Location 'c:\Users\Aarav Poddar\OneDrive\Pictures\Documents\Desktop\Food_Order'

# Stop any running node and tunnel instances
Get-Process node,cloudflared,lt -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 600

# Start Node backend server
Start-Process -FilePath 'node' -ArgumentList 'server.js' -WindowStyle Hidden
Start-Sleep -Milliseconds 1000

# Remove old logs
if (Test-Path 'live_cf.log') { Remove-Item 'live_cf.log' -Force }

# Start Cloudflare Tunnel
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npx --yes cloudflared tunnel --url http://localhost:3002 --logfile live_cf.log' -WindowStyle Hidden

# Start Localtunnel (backup)
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npx --yes localtunnel --port 3002 --subdomain thepoddarscourtyard' -WindowStyle Hidden

Write-Output "Server and tunnels started successfully."
