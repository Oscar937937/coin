@echo off
echo Deploying website to GitHub Pages...
echo.
echo Step 1: Adding files...
git add .
echo.
echo Step 2: Committing changes...
git commit -m "Update website content"
echo.
echo Step 3: Pushing to GitHub...
git push origin main
echo.
echo Deployment complete!
echo.
echo Please wait a few minutes for GitHub Pages to update.
echo You can check the status at: https://oscar937937.github.io/
pause 