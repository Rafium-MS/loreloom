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
    setTheme(themes[0].name);
    return;
  }

  if (tokens) {
    tokens.href = theme.path;
  }
  localStorage.setItem('theme', theme.name);
  if (btn) {
    btn.textContent = theme.icon;
  }
}

// Inicialização
(function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (themes.some(t => t.name === savedTheme)) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkTheme = themes.find(t => t.name === 'dark');
    const defaultTheme = themes[0];
    setTheme(prefersDark && darkTheme ? darkTheme.name : defaultTheme.name);
  }
})();

// Toggle ao clicar
btn?.addEventListener('click', () => {
  const currentName = localStorage.getItem('theme') || themes[0].name;
  const currentIndex = themes.findIndex(t => t.name === currentName);
  const nextTheme = themes[(currentIndex + 1) % themes.length];
  setTheme(nextTheme.name);
});
