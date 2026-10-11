@echo off
chcp 65001 >nul
python "%~dp0exportar_curseforge.py" %*
pause
