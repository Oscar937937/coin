@echo off
echo Starting local server...
echo Please open http://localhost:8000 in your browser
echo Press Ctrl+C to stop the server
python -m http.server 8000
pause 