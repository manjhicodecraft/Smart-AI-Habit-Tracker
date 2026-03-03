@echo off
REM Smart AI Habit Tracker - Quick Start Batch File
REM Simply double-click this file to start the application

echo ================================================
echo   Smart AI Habit Tracker - Auto Start
echo ================================================
echo.

REM Get script directory
set SCRIPT_DIR=%~dp0
set BACKEND_DIR=%SCRIPT_DIR%backend
set FRONTEND_DIR=%SCRIPT_DIR%frontend

echo Project Directory: %SCRIPT_DIR%
echo Backend Directory: %BACKEND_DIR%
echo Frontend Directory: %FRONTEND_DIR%
echo.

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

echo Java found! Starting services...
echo.

REM Start backend in a new window
echo Starting Backend Server...
start "Smart AI Habit Tracker - Backend" cmd /k "cd /d %BACKEND_DIR% && .\mvnw.cmd spring-boot:run"

REM Wait for backend to initialize
echo Waiting 30 seconds for backend to start...
timeout /t 30 /nobreak >nul

REM Set environment variable and start frontend in a new window
echo Starting Frontend Server...
start "Smart AI Habit Tracker - Frontend" cmd /k "cd /d %FRONTEND_DIR% && set VITE_API_PROXY_TARGET=http://localhost:8080&& npm run dev:client"

echo.
echo ================================================
echo   Services Started Successfully!
echo ================================================
echo.
echo Backend:  http://localhost:8080/api/health
echo Frontend: http://localhost:5173
echo.
echo Two terminal windows have been opened.
echo Close them when you want to stop the services.
echo.
echo This window will close automatically in 5 seconds...
timeout /t 5 /nobreak >nul
exit
