@echo off
cd /d "%~dp0"

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Node.js not found. Install it from https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting server at http://localhost:3000
echo Press Ctrl+C to stop.
echo.

start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"
npm run dev

if %ERRORLEVEL% neq 0 pause
