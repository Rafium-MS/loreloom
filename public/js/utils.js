const tokens = document.getElementById('tokens');
const btn = document.getElementById('themeToggle');

const themes = [
  { name: 'light', path: '/css/tokens.css', icon: '🌙' },
  { name: 'dark', path: '/css/tokens.dark.css', icon: '☀️' },
  { name: 'medieval', path: '/css/theme-medieval.css', icon: '🏰' },
  { name: 'cyberpunk', path: '/css/theme-cyberpunk.css', icon: '🤖' }
];

function setTheme(themeName) {
  const theme = themes.find(t => t.name === themeName);
  if (!theme) {
    console.warn(`Theme "${themeName}" not found. Defaulting to light.`);
    setTheme('light');
    return;
  }

  if (tokens) {
    tokens.href = mode === 'dark' ? '/css/tokens.dark.css' : '/css/tokens.css';
  }
  localStorage.setItem('theme', themeName);
  if (btn) {
    btn.textContent = mode === 'dark' ? '☀️' : '🌙';
  }
}

// Inicialização
(function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const themeExists = themes.some(t => t.name === savedTheme);

  if (themeExists) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
})();

// Toggle ao clicar
btn?.addEventListener('click', () => {
  const current = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
});
