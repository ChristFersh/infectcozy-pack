@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Sube solo novedades.json (las notas de la version) a GitHub. La web las lee sin recompilar.
for /f "usebackq delims=" %%v in (`python -c "import json;print(json.load(open('novedades.json',encoding='utf-8'))[0]['version'])"`) do set VERSION=%%v
git add novedades.json
git commit -m "Notas de la version %VERSION%"
git push
echo.
echo Listo: GitHub Pages muestra las notas de la %VERSION% en unos 10 minutos.
pause
