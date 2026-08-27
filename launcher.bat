@echo off
:: launcher.bat
:: ------------
:: Double-click this file to start the Dentic Control Panel on Windows.
:: Checks for Node.js, auto-installs if missing, then opens the web launcher.

setlocal

echo ============================================================
echo   Dentic ^| Dental Clinic Management System
echo   Control Panel Launcher
echo ============================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo  [!] Node.js was not detected on this machine.
  echo ------------------------------------------------------------
  echo  Attempting to install Node.js automatically via Winget...
  echo.

  winget install OpenJS.NodeJS -h --accept-source-agreements --accept-package-agreements
  if %errorlevel% neq 0 (
    echo  [x] Automated installation failed.
    echo      Launching the Node.js download page in your browser...
    echo.
    pause
    start https://nodejs.org
    exit /b 1
  )

  echo  [v] Node.js installed successfully!
  set "PATH=%PATH%;C:\Program Files\nodejs"
)

echo  [v] Node.js detected.
echo  [*] Starting Dentic Control Panel on http://localhost:3030 ...
echo.

node "%~dp0launcher.js"

pause
