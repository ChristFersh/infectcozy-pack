@echo off
chcp 65001 >nul
rem Pre-release: va a pre-release/, crea la release de GitHub marcada como pre-release y no toca la version publicada.
rem Ejemplo: publicar-pre.bat 2.0-pre1 --solo media detallada
python "%~dp0publicar.py" --pre %*
pause
