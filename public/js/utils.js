const tokens = document.getElementById('tokens');
const btn = document.getElementById('themeToggle');

function setTheme(mode) {
  if (tokens) {
    tokens.href = mode === 'dark' ? '/css/tokens.dark.css' : '/css/tokens.css';
  }
  localStorage.setItem('theme', mode);
  if (btn) {
    btn.textContent = mode === 'dark' ? '☀️' : '🌙';
  }
}

// Inicialização
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    setTheme(saved);
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
