@echo off
chcp 65001 >nul
rem Pone notas-2.0-pre1.md como descripcion de la pre-release v2.0-pre1 en GitHub.
gh release edit v2.0-pre1 --repo ChristFersh/infectcozy-pack --notes-file "%~dp0notas-2.0-pre1.md"
pause
