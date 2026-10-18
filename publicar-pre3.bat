@echo off
chcp 65001 >nul
rem Pre-release 2.0-pre3 (Media y Detallada) con sus notas (notas-2.0-pre3.md van como descripcion de la release).
python "%~dp0publicar.py" 2.0-pre3 --pre --solo media detallada
pause
