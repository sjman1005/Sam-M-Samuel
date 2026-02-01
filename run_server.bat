@echo off
echo ===================================================
echo Starting Local Portfolio Server...
echo ===================================================
echo.
echo 1. Keep this window open.
echo 2. Open your web browser.
echo 3. Go to: http://localhost:8000
echo.
echo This allows the Contact Form "Direct Send" to work
echo by bypassing local file security restrictions.
echo.
python -m http.server 8000
pause
