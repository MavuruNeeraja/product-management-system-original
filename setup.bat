@echo off
echo Setting up Product Management System...
echo.

echo Installing Backend Dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing Frontend Dependencies...
cd ../frontend
npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo.
echo Setup complete!
echo.
echo To start the application:
echo 1. Make sure MongoDB is running
echo 2. Run start-dev.bat or manually start both servers
echo.
pause
