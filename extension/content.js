// Toca da Onça Agente - Content Script
// Injeta funcionalidades nas páginas de e-commerce e redes sociais

console.log('🐆 Toca da Onça Agente ativo nesta página');

// Detectar plataforma atual
function detectPlatform() {
  const url = window.location.hostname;
  
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('mercadolivre.com')) return 'mercadolivre';
  if (url.includes('shopee.com')) return 'shopee';
  if (url.includes('amazon.com')) return 'amazon';
  
  return 'unknown';
}

// Extrair dados de produto baseado na plataforma
function extractProductData(platform) {
  const data = {
    platform,
    url: window.location.href,
    capturedAt: new Date().toISOString()
  };
  
  switch (platform) {
    case 'tiktok':
      return extractTikTokProduct(data);
    case 'instagram':
      return extractInstagramProduct(data);
    case 'mercadolivre':
      return extractMercadoLivreProduct(data);
    case 'shopee':
      return extractShopeeProduct(data);
    default:
      return extractGenericProduct(data);
  }
}

// Extratores específicos por plataforma
function extractTikTokProduct(data) {
  try {
    // TikTok Shop product
    data.name = document.querySelector('[data-e2e="product-title"]')?.textContent ||
                document.querySelector('.product-title')?.textContent ||
                document.title;
    data.price = document.querySelector('[data-e2e="product-price"]')?.textContent ||
                 document.querySelector('.product-price')?.textContent;
    data.image = document.querySelector('[data-e2e="product-image"] img')?.src ||
                 document.querySelector('.product-image img')?.src;
    data.seller = document.querySelector('[data-e2e="seller-name"]')?.textContent;
  } catch (e) {
    console.error('Erro ao extrair dados TikTok:', e);
  }
  return data;
}

function extractInstagramProduct(data) {
  try {
    // Instagram Shop
    data.name = document.querySelector('h1')?.textContent || document.title;
    data.image = document.querySelector('article img')?.src;
    data.description = document.querySelector('article span')?.textContent;
  } catch (e) {
    console.error('Erro ao extrair dados Instagram:', e);
  }
  return data;
}

function extractMercadoLivreProduct(data) {
  try {
    data.name = document.querySelector('.ui-pdp-title')?.textContent;
    data.price = document.querySelector('.andes-money-amount__fraction')?.textContent;
    data.image = document.querySelector('.ui-pdp-image')?.src;
    data.seller = document.querySelector('.ui-pdp-seller__link-trigger')?.textContent;
  } catch (e) {
    console.error('Erro ao extrair dados ML:', e);
  }
  return data;
}

function extractShopeeProduct(data) {
  try {
    data.name = document.querySelector('.product-briefing div span')?.textContent;
    data.price = document.querySelector('.pqTWkA')?.textContent;
    data.image = document.querySelector('.product-briefing img')?.src;
  } catch (e) {
    console.error('Erro ao extrair dados Shopee:', e);
  }
  return data;
}

function extractGenericProduct(data) {
  try {
    data.name = document.querySelector('h1')?.textContent || document.title;
    data.price = document.querySelector('[itemprop="price"]')?.content ||
                 document.querySelector('.price')?.textContent;
    data.image = document.querySelector('[itemprop="image"]')?.src ||
                 document.querySelector('main img')?.src;
  } catch (e) {
    console.error('Erro ao extrair dados genéricos:', e);
  }
  return data;
}

// Extrair dados de perfil/loja
function extractProfileData(platform) {
  const data = {
    platform,
    url: window.location.href,
    capturedAt: new Date().toISOString()
  };
  
  try {
    switch (platform) {
      case 'tiktok':
        data.name = document.querySelector('[data-e2e="user-title"]')?.textContent;
        data.bio = document.querySelector('[data-e2e="user-bio"]')?.textContent;
        data.followers = document.querySelector('[data-e2e="followers-count"]')?.textContent;
        data.avatar = document.querySelector('[data-e2e="user-avatar"] img')?.src;
        break;
      case 'instagram':
        data.name = document.querySelector('header h2')?.textContent;
        data.bio = document.querySelector('header section > div')?.textContent;
        data.avatar = document.querySelector('header img')?.src;
        break;
      default:
        data.name = document.querySelector('h1')?.textContent;
    }
  } catch (e) {
    console.error('Erro ao extrair perfil:', e);
  }
  
  return data;
}

// Listener para mensagens do background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const platform = detectPlatform();
  
  if (request.action === 'captureProduct') {
    const productData = extractProductData(platform);
    if (request.imageUrl) {
      productData.image = request.imageUrl;
    }
    
    sendResponse({
      success: true,
      productName: productData.name || 'Produto',
      data: productData
    });
  }
  
  if (request.action === 'captureProfile') {
    const profileData = extractProfileData(platform);
    
    sendResponse({
      success: true,
      profileName: profileData.name || 'Perfil',
      data: profileData
    });
  }
  
  if (request.action === 'getPlatform') {
    sendResponse({ platform });
  }
});

// Adicionar botão flutuante na página (opcional)
function injectFloatingButton() {
  const button = document.createElement('div');
  button.id = 'toca-onca-capture-btn';
  button.innerHTML = '🐆';
  button.title = 'Capturar com Toca da Onça';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    z-index: 999999;
    box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  `;
  
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.6)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.4)';
  });
  
  button.addEventListener('click', () => {
    const platform = detectPlatform();
    const productData = extractProductData(platform);
    
    chrome.runtime.sendMessage({
      action: 'quickCapture',
      data: productData
    });
    
    // Feedback visual
    button.innerHTML = '✅';
    setTimeout(() => {
      button.innerHTML = '🐆';
    }, 1500);
  });
  
  document.body.appendChild(button);
}

// Injetar botão após carregar a página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFloatingButton);
} else {
  injectFloatingButton();
}
