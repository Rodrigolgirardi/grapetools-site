@echo off
REM ============================================================
REM  Grape Tools - Iniciar o site LOCALMENTE (pre-visualizacao)
REM  Duplo-clique neste arquivo para ligar o servidor de testes.
REM  Depois abra no navegador:  http://localhost:3000
REM  Para PARAR: feche esta janela (ou aperte Ctrl+C).
REM ============================================================
cd /d "C:\Projetos\grapetools-site"

echo.
echo  ================================================
echo   Iniciando o site local... aguarde uns segundos.
echo   NAO feche esta janela enquanto estiver usando.
echo.
echo   Quando aparecer "Ready", abra no navegador:
echo       http://localhost:3000
echo  ================================================
echo.

call npm run dev

echo.
echo  O servidor parou. Pode fechar esta janela.
pause
