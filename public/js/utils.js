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
    tokens.href = theme.path;
  }
  localStorage.setItem('theme', themeName);
  if (btn) {
    btn.textContent = theme.icon;
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

// Event listeners para os botões de tema
const themeSwitcher = document.getElementById('themeSwitcher');
if (themeSwitcher) {
  const themeButtons = themeSwitcher.querySelectorAll('.theme-switcher-options button');
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const themeName = button.getAttribute('data-theme');
      setTheme(themeName);
    });
  });
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
