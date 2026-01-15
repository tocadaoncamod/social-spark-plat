#!/bin/bash

echo ""
echo "============================================"
echo "   TOCA DA ONÇA AGENTE - INSTALADOR"
echo "============================================"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js não encontrado!"
    echo ""
    echo "Por favor, instale o Node.js:"
    echo "https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js encontrado: $(node --version)"
echo ""

# Instalar dependências do projeto principal
echo "[1/5] Instalando dependências do projeto..."
npm install || { echo "[ERRO] Falha ao instalar dependências"; exit 1; }
echo ""

# Build do projeto web
echo "[2/5] Construindo o projeto web..."
npm run build || { echo "[ERRO] Falha ao construir o projeto"; exit 1; }
echo ""

# Entrar na pasta electron
echo "[3/5] Configurando Electron..."
cd electron

# Instalar dependências do Electron
echo "[4/5] Instalando dependências do Electron..."
npm install || { echo "[ERRO] Falha ao instalar Electron"; exit 1; }
echo ""

# Detectar plataforma e gerar executável
echo "[5/5] Gerando executável..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Detectado: macOS"
    npm run build:mac
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Detectado: Linux"
    npm run build:linux
else
    echo "Detectado: Windows/WSL"
    npm run build:win
fi

if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao gerar executável"
    exit 1
fi

echo ""
echo "============================================"
echo "   SUCESSO! Executável gerado!"
echo "============================================"
echo ""
echo "Encontre seu instalador em: electron/release/"
echo ""

# Voltar à pasta raiz
cd ..

# Abrir pasta no macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open electron/release
fi
