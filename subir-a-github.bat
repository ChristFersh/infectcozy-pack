@echo off
chcp 65001 >nul
cd /d "%~dp0"
for /f "usebackq delims=" %%v in (`python -c "import json;print(json.load(open('variantes.json',encoding='utf-8'))['version'])"`) do set VER=%%v
if "%VER%"=="" goto :error
echo Infect Cozy %VER%

echo.
echo [1/3] Compilando la web...
pushd web
call npm install --no-audit --no-fund || goto :error
call npm run publicar || goto :error
popd

echo.
echo [2/3] Subiendo la web y los cambios a GitHub...
git add -A || goto :error
git commit -m "Web nueva: descargas, guia de juego y jefes en 3D"
git push || goto :error

echo.
echo [3/3] Zips completos a la release v%VER% de GitHub...
where gh >nul 2>nul
if errorlevel 1 goto :amano
python publicar.py --solo-release
goto :listo

:amano
echo No tienes GitHub CLI, asi que se suben a mano:
echo   1. Se abre la pagina de nueva release con el tag v%VER% ya puesto.
echo   2. Arrastra los 5 zips de la carpeta exportar-%VER% que se abre y pulsa Publish release.
start "" "https://github.com/ChristFersh/infectcozy-pack/releases/new?tag=v%VER%&title=Infect%%20Cozy%%20%VER%"
start "" "%~dp0..\exportar-%VER%"

:listo
echo.
echo Listo. La web se actualiza en unos minutos: https://christfersh.github.io/infectcozy-pack
pause
goto :eof

:error
echo.
echo Algo fallo. Revisa el mensaje de arriba.
popd 2>nul
pause
