// Função para carregar componentes HTML
async function loadComponent(containerId, filePath) {
  try {
    const response = await fetch(filePath);
    const content = await response.text();
    document.getElementById(containerId).innerHTML = content;
  } catch (error) {
    console.error(`Erro ao carregar o componente ${filePath}:`, error);
  }
}

// Carregar todos os componentes quando a página estiver pronta
document.addEventListener('DOMContentLoaded', function() {
  // Carregar sidebar
  loadComponent('sidebar-container', 'components/sidebar.html').then(() => {
    // Após carregar a sidebar, carregar a estrutura de capítulos
    loadComponent('chapter-structure-container', 'components/chapter-structure.html');
  });
  
  // Carregar painéis de conteúdo
  loadComponent('content-panels', 'components/editor-panel.html');
  
  // Carregar modais
  loadComponent('modals-container', 'modals/modals.html');
});