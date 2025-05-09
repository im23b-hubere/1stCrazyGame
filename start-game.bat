@echo off
echo Starting Simple Runner Game...

:: Check if the src directory exists
if not exist "src" (
    echo Error: src directory not found!
    echo Make sure you're running this from the correct directory.
    pause
    exit /b 1
)

:: Check if index.html exists
if not exist "src\index.html" (
    echo Error: src\index.html not found!
    echo Game files missing.
    pause
    exit /b 1
)

:: Open the game in the default browser
echo Opening game in your browser...
start "" "src\index.html"

echo Game started successfully!
echo You can close this window now.