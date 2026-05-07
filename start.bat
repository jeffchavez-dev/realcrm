@echo off
echo.
echo  ============================================
echo   RealCRM - Real Estate CRM Demo
echo   Files: C:\Users\Jeff Chavez\Desktop\realcrm
echo  ============================================
echo.

echo  Stopping any existing RealCRM processes...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3005" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5200" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

echo  [1/2] Starting Backend API on port 3005...
start "RealCRM - Backend API" cmd /k "cd /d "C:\Users\Jeff Chavez\Desktop\realcrm\backend" && node src/index.js"

timeout /t 3 /nobreak >nul

echo  [2/2] Starting Frontend on port 5200...
start "RealCRM - Frontend" cmd /k "cd /d "C:\Users\Jeff Chavez\Desktop\realcrm\frontend" && npm run dev"

timeout /t 5 /nobreak >nul

echo  Opening RealCRM in browser...
start "" "http://localhost:5200"

echo.
echo  ============================================
echo   RealCRM is running!
echo   Frontend : http://localhost:5200
echo   API      : http://localhost:3005/api/health
echo   Login    : admin@realcrm.com / admin123
echo              billy@demo.com    / billy2026
echo  ============================================
echo.
pause
