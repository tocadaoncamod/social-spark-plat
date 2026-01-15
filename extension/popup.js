// Toca da Onça Agente - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  // Carregar dados capturados
  await loadCapturedData();
  
  // Event listeners
  document.getElementById('syncBtn').addEventListener('click', syncToCloud);
  document.getElementById('dashboardBtn').addEventListener('click', openDashboard);
  document.getElementById('clearBtn').addEventListener('click', clearCaptured);
});

async function loadCapturedData() {
  chrome.runtime.sendMessage({ action: 'getCaptured' }, (response) => {
    const products = response.products || [];
    const profiles = response.profiles || [];
    
    // Atualizar contadores
    document.getElementById('productCount').textContent = products.length;
    document.getElementById('profileCount').textContent = profiles.length;
    
    // Renderizar lista
    const listEl = document.getElementById('capturedList');
    listEl.innerHTML = '';
    
    const allItems = [
      ...products.map(p => ({ ...p, type: 'product' })),
      ...profiles.map(p => ({ ...p, type: 'profile' }))
    ].slice(-5).reverse(); // Últimos 5 itens
    
    if (allItems.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.5); font-size: 12px;">
          Nenhum item capturado.<br>
          Clique com botão direito em produtos<br>
          para começar a capturar!
        </div>
      `;
      return;
    }
    
    allItems.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'captured-item';
      itemEl.innerHTML = `
        <img src="${item.image || 'icons/icon48.png'}" alt="" onerror="this.src='icons/icon48.png'">
        <div class="captured-item-info">
          <div class="captured-item-name">${item.name || 'Sem nome'}</div>
          <div class="captured-item-platform">${item.platform} • ${item.type === 'product' ? '📦' : '👤'}</div>
        </div>
      `;
      listEl.appendChild(itemEl);
    });
  });
}

async function syncToCloud() {
  const btn = document.getElementById('syncBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '⏳ Sincronizando...';
  btn.disabled = true;
  
  chrome.runtime.sendMessage({ action: 'getCaptured' }, async (data) => {
    chrome.runtime.sendMessage({
      action: 'syncToCloud',
      data: {
        products: data.products,
        profiles: data.profiles
      }
    }, (response) => {
      if (response.success) {
        btn.innerHTML = '✅ Sincronizado!';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 2000);
      } else {
        btn.innerHTML = '❌ Erro';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 2000);
      }
    });
  });
}

function openDashboard() {
  chrome.tabs.create({ url: 'https://connect-sparkle-87.lovable.app' });
}

async function clearCaptured() {
  if (confirm('Limpar todos os itens capturados?')) {
    chrome.runtime.sendMessage({ action: 'clearCaptured' }, () => {
      loadCapturedData();
    });
  }
}
