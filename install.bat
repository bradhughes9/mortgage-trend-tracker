@echo off
echo Installing Bond-Mortgage Dashboard dependencies...
echo.

REM Change to project directory
cd /d "%~dp0"

REM Install dependencies
echo Installing npm packages...
call npm install

REM Check if installation was successful
if %errorlevel% equ 0 (
    echo.
    echo ✓ Installation completed successfully!
    echo.
    echo Next steps:
    echo 1. Copy .env.local.example to .env.local
    echo 2. Add your FRED API key to .env.local
    echo 3. Run: npm run dev
    echo.
    echo To get a free FRED API key, visit:
    echo https://fred.stlouisfed.org/docs/api/api_key.html
    echo.
    pause
) else (
    echo.
    echo ✗ Installation failed. Please check your internet connection
    echo   and make sure Node.js is installed correctly.
    echo.
    pause
)
