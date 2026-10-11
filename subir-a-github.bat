@echo off
chcp 65001 >nul
cd /d "%~dp0"
for /f "usebackq delims=" %%v in (`python -c "import json;print(json.load(open('variantes.json',encoding='utf-8'))['version'])"`) do set VER=%%v
if "%VER%"=="" goto :error
echo Infect Cozy %VER%

echo.
echo [1/3] Zips para CurseForge a la release v%VER% de GitHub...
if not exist "..\exportar-%VER%\InfectCozy-*-CurseForge-%VER%.zip" goto :sincf
python exportar_curseforge.py --solo-subir || goto :error
python publicar.py --solo-datos || goto :error
goto :web

:sincf
echo No hay zips de CurseForge de la %VER% en exportar-%VER%: la web solo ofrece el zip para Prism.
echo Para ofrecerlos tambien: doble clic en exportar-curseforge.bat y luego vuelve a abrir este.

:web
echo.
echo [2/3] Compilando la web...
pushd web
call npm install --no-audit --no-fund || goto :error
call npm run publicar || goto :error
popd

echo.
echo [3/3] Subiendo la web y los cambios a GitHub...
git add -A || goto :error
git commit -m "Web y descargas %VER%"
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
