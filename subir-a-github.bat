@echo off
chcp 65001 >nul
cd /d "%~dp0"
for /f "usebackq delims=" %%v in (`python -c "import json;print(json.load(open('variantes.json',encoding='utf-8'))['version'])"`) do set VER=%%v
if "%VER%"=="" goto :error
echo Infect Cozy %VER%

echo.
echo [1/2] Compilando la web...
pushd web
call npm install --no-audit --no-fund || goto :error
call npm run publicar || goto :error
popd

echo.
echo [2/2] Subiendo la web y los cambios a GitHub...
git add -A || goto :error
git commit -m "Web nueva: descargas, guia de juego y jefes en 3D"
git push || goto :error

echo.
echo Listo. La web se actualiza en unos minutos: https://christfersh.github.io/infectcozy-pack
pause
goto :eof

:error
echo.
echo Algo fallo. Revisa el mensaje de arriba.
popd 2>nul
pause
