@echo off
echo ========================================
echo  Playturfy Website - Broadcasting Update
echo  Version 1.3.0
echo ========================================
echo.

echo [1/4] Checking Git status...
git status
echo.

echo [2/4] Adding changes...
git add index.html
git add WEBSITE_UPDATE_v1.3.0_BROADCASTING.md
echo Changes staged!
echo.

echo [3/4] Committing changes...
git commit -m "Add broadcasting features to website v1.3.0 - Live streaming to OBS with professional overlay"
echo.

echo [4/4] Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
echo Your website will be live in a few minutes at:
echo https://playturfy.com
echo.
echo Next steps:
echo 1. Visit https://playturfy.com to verify
echo 2. Test on mobile devices
echo 3. Check SEO meta tags
echo 4. Clear browser cache if needed (Ctrl+Shift+R)
echo.
echo ========================================
pause
