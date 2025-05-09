@echo off
echo Building game for CrazyGames...

:: Check if dist directory exists, create if not
if not exist "dist" (
    echo Creating dist directory...
    mkdir dist
)

:: Create game directory inside dist
if not exist "dist\game" (
    mkdir dist\game
) else (
    echo Cleaning previous build...
    del /q dist\game\*
)

:: Copy game files
echo Copying game files...
xcopy /s /y "src\*.*" "dist\game\"

:: Remove debug files
echo Removing debug files...
if exist "dist\game\debug.html" del "dist\game\debug.html"
if exist "dist\game\test.html" del "dist\game\test.html"
if exist "dist\game\simple.html" del "dist\game\simple.html"

:: Create zip file for CrazyGames
echo Creating zip file...
powershell -Command "Compress-Archive -Path 'dist\game\*' -DestinationPath 'dist\crazygame.zip' -Force"

echo Build completed!
echo Your game is ready in dist\crazygame.zip
echo Upload this file to CrazyGames developer portal.
pause