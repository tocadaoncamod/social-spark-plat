const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Informações do app
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // Notificações nativas
  showNotification: (title, body) => 
    ipcRenderer.invoke('show-notification', { title, body }),
  
  // Plataforma
  platform: process.platform,
  
  // Verificar se está no Electron
  isElectron: true
});

// Log de inicialização
console.log('🐆 Toca da Onça Agente - Preload carregado');
