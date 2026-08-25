$ErrorActionPreference = 'SilentlyContinue'
$dir = 'c:\Users\Aarav Poddar\OneDrive\Pictures\Documents\Desktop\Food_Order'
Set-Location $dir

# Stop any running node and tunnel instances
Get-Process node,cloudflared,lt -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 600

# Start Node backend server with explicit working directory and quoted path
Start-Process -FilePath 'node' -ArgumentList "`"$dir\server.js`"" -WorkingDirectory $dir -WindowStyle Hidden
Start-Sleep -Milliseconds 1500

# Remove old logs
if (Test-Path "$dir\live_cf.log") { Remove-Item "$dir\live_cf.log" -Force }

# Start Cloudflare Tunnel
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', "npx --yes cloudflared tunnel --url http://localhost:3002 --logfile `"$dir\live_cf.log`"" -WorkingDirectory $dir -WindowStyle Hidden

# Start Localtunnel (backup)
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npx --yes localtunnel --port 3002 --subdomain thepoddarscourtyard' -WorkingDirectory $dir -WindowStyle Hidden

Write-Output "Server and tunnels started successfully."
