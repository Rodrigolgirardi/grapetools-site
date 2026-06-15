@echo off
title Grape Tools - Servidor de Desenvolvimento
cd /d "%~dp0"
echo ====================================================
echo   Grape Tools - iniciando servidor de dev...
echo   Quando aparecer "Ready", abra: http://localhost:3000
echo   Para parar: feche esta janela ou pressione Ctrl+C
echo ====================================================
echo.
call npm run dev
echo.
echo Servidor parado. Pressione qualquer tecla para fechar.
pause >nul
