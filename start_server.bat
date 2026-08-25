@echo off
cd /d "%~dp0"
echo ====================================================
echo Starting The Poddar's Courtyard Server & Tunnels...
echo ====================================================
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start_persistent.ps1"
pause
