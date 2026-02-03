@echo off
echo ==========================================
echo      Antigravity Auto-Deploy Tool
echo ==========================================
echo.
echo [Step 1] Checking Authentication...
echo Please log in via the browser window that appears.
call firebase login --reauth
if %ERRORLEVEL% NEQ 0 (
    echo Login Failed!
    pause
    exit /b
)

echo.
echo [Step 2] Selecting Project...
call firebase use my-awesome-site-f3f94
if %ERRORLEVEL% NEQ 0 (
    echo Project Selection Failed! Please check if the project exists.
    pause
    exit /b
)

echo.
echo [Step 3] Deploying to Production...
call firebase deploy
if %ERRORLEVEL% NEQ 0 (
    echo Deployment Failed!
    pause
    exit /b
)

echo.
echo ==========================================
echo      DEPLOYMENT SUCCESSFUL!
echo ==========================================
pause
