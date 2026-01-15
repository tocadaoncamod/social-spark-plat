// Toca da Onça Agente - Background Service Worker
const LOVABLE_API_URL = 'https://mpozlvvzodkybdhqemuy.supabase.co/functions/v1';

// Estado global
let isConnected = false;
let userData = null;

// Inicialização
chrome.runtime.onInstalled.addListener(() => {
  console.log('🐆 Toca da Onça Agente instalado!');
  
  // Criar menu de contexto
  chrome.contextMenus.create({
    id: 'capture-product',
    title: '🐆 Capturar Produto',
    contexts: ['page', 'selection', 'image']
  });
  
  chrome.contextMenus.create({
    id: 'capture-profile',
    title: '🐆 Capturar Perfil/Loja',
    contexts: ['page']
  });
});

// Handler do menu de contexto
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'capture-product') {
    await captureProduct(tab, info);
  } else if (info.menuItemId === 'capture-profile') {
    await captureProfile(tab);
  }
});

// Capturar dados de produto
async function captureProduct(tab, info) {
  try {
    // Enviar mensagem para content script
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'captureProduct',
      url: tab.url,
      imageUrl: info.srcUrl
    });
    
    if (response.success) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '✅ Produto Capturado',
        message: `${response.productName} foi salvo!`
      });
      
      // Salvar no storage local
      const products = (await chrome.storage.local.get('capturedProducts')).capturedProducts || [];
      products.push({
        ...response.data,
        capturedAt: new Date().toISOString()
      });
      await chrome.storage.local.set({ capturedProducts: products });
    }
  } catch (error) {
    console.error('Erro ao capturar produto:', error);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: '❌ Erro',
      message: 'Não foi possível capturar o produto'
    });
  }
}

// Capturar perfil/loja
async function captureProfile(tab) {
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'captureProfile',
      url: tab.url
    });
    
    if (response.success) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '✅ Perfil Capturado',
        message: `${response.profileName} foi salvo!`
      });
      
      // Salvar no storage local
      const profiles = (await chrome.storage.local.get('capturedProfiles')).capturedProfiles || [];
      profiles.push({
        ...response.data,
        capturedAt: new Date().toISOString()
      });
      await chrome.storage.local.set({ capturedProfiles: profiles });
    }
  } catch (error) {
    console.error('Erro ao capturar perfil:', error);
  }
}

// Comunicação com popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    sendResponse({ isConnected, userData });
  }
  
  if (request.action === 'getCaptured') {
    chrome.storage.local.get(['capturedProducts', 'capturedProfiles'], (data) => {
      sendResponse({
        products: data.capturedProducts || [],
        profiles: data.capturedProfiles || []
      });
    });
    return true; // Async response
  }
  
  if (request.action === 'syncToCloud') {
    syncToLovableCloud(request.data).then(sendResponse);
    return true; // Async response
  }
  
  if (request.action === 'clearCaptured') {
    chrome.storage.local.set({ capturedProducts: [], capturedProfiles: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Sincronizar com Lovable Cloud
async function syncToLovableCloud(data) {
  try {
    const response = await fetch(`${LOVABLE_API_URL}/extension-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getStoredToken()}`
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      return { success: true, message: 'Dados sincronizados!' };
    } else {
      return { success: false, message: 'Erro na sincronização' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Obter token armazenado
async function getStoredToken() {
  const data = await chrome.storage.local.get('authToken');
  return data.authToken || '';
}

console.log('🐆 Background service worker iniciado');
