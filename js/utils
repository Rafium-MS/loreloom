const tokens = document.getElementById('tokens');

function setTheme(mode) {
// 'light' usa tokens.css | 'dark' usa tokens.dark.css
tokens.href = mode === 'dark' ? './tokens.dark.css' : './tokens.css';
localStorage.setItem('theme', mode);
}

// Inicializa respeitando preferência salva ou do sistema
(function initTheme() {
const saved = localStorage.getItem('theme');
if (saved) return setTheme(saved);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(prefersDark ? 'dark' : 'light');
})();