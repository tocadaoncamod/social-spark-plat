const { app, BrowserWindow, Menu, Tray, ipcMain, shell, Notification } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let tray;

// URL do app Lovable Cloud
const APP_URL = 'https://1c8fdeb2-dd31-4d4d-84b3-5d479b4e46d3.lovableproject.com?forceHideBadge=true';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    titleBarStyle: 'default',
    title: 'Toca da Onça Agente',
    backgroundColor: '#000000',
    show: false // Mostrar apenas quando carregar
  });

  // Carregar a URL do app
  mainWindow.loadURL(APP_URL);

  // Mostrar janela quando carregar
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Notificação de boas-vindas
    if (Notification.isSupported()) {
      new Notification({
        title: '🐆 Toca da Onça Agente',
        body: 'Agente iniciado! Suas automações estão prontas.',
        icon: path.join(__dirname, 'assets', 'icon.png')
      }).show();
    }
  });

  // Abrir links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Minimizar para bandeja ao fechar
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Menu da aplicação
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Recarregar',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.reload()
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        {
          label: 'Tela Cheia',
          accelerator: 'F11',
          click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen())
        },
        {
          label: 'DevTools',
          accelerator: 'F12',
          click: () => mainWindow.webContents.toggleDevTools()
        }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Sobre',
              message: 'Toca da Onça Agente v1.0.0',
              detail: 'Automação inteligente para seus negócios.\n\nDesenvolvido com ❤️ usando Lovable Cloud.',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return mainWindow;
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'assets', 'icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🐆 Abrir Toca da Onça',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    { type: 'separator' },
    {
      label: '🔄 Recarregar',
      click: () => mainWindow.reload()
    },
    {
      label: '📊 Dashboard',
      click: () => {
        mainWindow.show();
        mainWindow.loadURL(APP_URL);
      }
    },
    { type: 'separator' },
    {
      label: '❌ Sair',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Toca da Onça Agente');
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

// Inicialização do app
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

// Fechar app no Windows/Linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers para comunicação com o renderer
ipcMain.handle('get-app-info', () => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    platform: process.platform
  };
});

ipcMain.handle('show-notification', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
    return true;
  }
  return false;
});

// Auto-updater (para futuras atualizações automáticas)
if (!isDev) {
  const { autoUpdater } = require('electron-updater');
  
  autoUpdater.checkForUpdatesAndNotify();
  
  autoUpdater.on('update-available', () => {
    new Notification({
      title: 'Atualização Disponível',
      body: 'Uma nova versão está sendo baixada...'
    }).show();
  });
  
  autoUpdater.on('update-downloaded', () => {
    new Notification({
      title: 'Atualização Pronta',
      body: 'Reinicie o app para aplicar a atualização.'
    }).show();
  });
}

console.log('🐆 Toca da Onça Agente iniciado!');
