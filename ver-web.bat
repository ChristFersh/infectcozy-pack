@echo off
chcp 65001 >nul
cd /d "%~dp0web"
echo Preparando la web...
call npm install --no-audit --no-fund || goto :error
echo Abriendo la web en http://localhost:5173 (cierra esta ventana para pararla)
call npm run dev -- --open
goto :eof
:error
echo No se pudo instalar. Necesitas Node.js 20.19 o mas nuevo: https://nodejs.org
pause
