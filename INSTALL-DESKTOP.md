# 🐆 Toca da Onça Agente - Instalação Desktop

## Guia Completo para Gerar o Executável (.exe)

### Pré-requisitos

Antes de começar, instale no seu computador:

1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Escolha a versão LTS

2. **Git** (para clonar o projeto)
   - Download: https://git-scm.com/

---

## 🚀 Passo a Passo

### 1. Exporte o Projeto para seu GitHub

No Lovable, clique em **"Share" → "Export to GitHub"**

### 2. Clone no seu Computador

```bash
# Abra o Prompt de Comando (CMD) e execute:
cd C:\Users\lenovo\Desktop
git clone https://github.com/SEU-USUARIO/connect-sparkle-87.git
cd connect-sparkle-87
```

### 3. Instale as Dependências do Projeto Web

```bash
npm install
```

### 4. Construa o Projeto Web

```bash
npm run build
```

### 5. Configure o Electron

```bash
# Entre na pasta electron
cd electron

# Instale as dependências do Electron
npm install
```

### 6. Gere o Executável (.exe)

```bash
# Para gerar o instalador Windows:
npm run build:win

# OU para gerar apenas o executável portátil:
npm run dist
```

### 7. Encontre seu Executável

O arquivo `.exe` estará em:
```
electron/release/Toca da Onça Agente-1.0.0-Setup.exe
```

---

## 📦 Tipos de Build Disponíveis

| Comando | Resultado |
|---------|-----------|
| `npm run build:win` | Instalador Windows (.exe) |
| `npm run build:mac` | DMG para macOS |
| `npm run build:linux` | AppImage para Linux |
| `npm run dist` | Apenas Windows x64 |
| `npm run pack` | Versão descompactada (para debug) |

---

## 🔧 Executar em Modo Desenvolvimento

Para testar sem gerar o .exe:

```bash
cd electron
npm start
```

---

## 🎨 Personalizar Ícone

Adicione seus ícones na pasta `electron/assets/`:

- `icon.png` - 256x256px ou maior (Linux/Tray)
- `icon.ico` - Windows
- `icon.icns` - macOS

Você pode converter PNG para ICO em: https://convertio.co/png-ico/

---

## ❓ Problemas Comuns

### "npm não encontrado"
- Instale o Node.js e reinicie o terminal

### "electron-builder não funciona"
```bash
npm install -g electron-builder
```

### "Erro de permissão no Windows"
- Execute o CMD como Administrador

---

## 🔄 Atualizações Automáticas

O app verifica automaticamente por atualizações quando você publica novas versões no GitHub Releases.

---

## 📱 Funcionalidades do App Desktop

- ✅ Roda offline (com cache)
- ✅ Notificações nativas do Windows
- ✅ Ícone na bandeja do sistema
- ✅ Minimiza para bandeja ao fechar
- ✅ Atalhos de teclado (Ctrl+R recarrega, F11 tela cheia)
- ✅ Auto-atualização via GitHub

---

## 🐆 Pronto!

Após a instalação, o **Toca da Onça Agente** estará disponível:
- No menu Iniciar do Windows
- Com atalho na Área de Trabalho
- Na bandeja do sistema (ao lado do relógio)

O app conecta automaticamente aos seus agentes na nuvem e permite:
- Controlar automações em tempo real
- Receber notificações de vendas
- Gerenciar todas as 8 plataformas
- Executar o Super Agente localmente
