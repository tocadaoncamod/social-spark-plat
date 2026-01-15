@echo off
echo.
echo ============================================
echo    TOCA DA ONCA AGENTE - INSTALADOR
echo ============================================
echo.

:: Verificar se Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado: 
node --version
echo.

:: Instalar dependências do projeto principal
echo [1/5] Instalando dependencias do projeto...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)
echo.

:: Build do projeto web
echo [2/5] Construindo o projeto web...
call npm run build
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao construir o projeto
    pause
    exit /b 1
)
echo.

:: Entrar na pasta electron
echo [3/5] Configurando Electron...
cd electron

:: Instalar dependências do Electron
echo [4/5] Instalando dependencias do Electron...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar Electron
    pause
    exit /b 1
)
echo.

:: Gerar o executável
echo [5/5] Gerando executavel Windows...
call npm run build:win
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao gerar executavel
    pause
    exit /b 1
)

echo.
echo ============================================
echo    SUCESSO! Executavel gerado!
echo ============================================
echo.
echo Encontre seu instalador em:
echo electron\release\Toca da Onca Agente-1.0.0-Setup.exe
echo.
echo Pressione qualquer tecla para abrir a pasta...
pause >nul

:: Abrir pasta com o executável
start "" "release"

cd ..
