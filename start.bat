@echo off
echo Starting Bond-Mortgage Dashboard...
echo.

REM Change to project directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Error: Dependencies not installed.
    echo Please run install.bat first.
    echo.
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo Warning: .env.local file not found.
    echo Please copy .env.local.example to .env.local and add your FRED API key.
    echo Get a free key at: https://fred.stlouisfed.org/docs/api/api_key.html
    echo.
    echo Continuing with mock data...
    echo.
)

REM Start the development server
echo Starting development server...
echo Open http://localhost:3000 in your browser
echo Press Ctrl+C to stop the server
echo.
call npm run dev
