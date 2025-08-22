const tokens = document.getElementById('tokens');
  const btn = document.getElementById('themeToggle');

  function setTheme(mode) {
    tokens.href = mode === 'dark' ? './tokens.dark.css' : './tokens.css';
    localStorage.setItem('theme', mode);
    btn.textContent = mode === 'dark' ? '☀️' : '🌙';
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
  btn.addEventListener('click', () => {
    const current = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });