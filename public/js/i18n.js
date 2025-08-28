const translations = {
  pt: {
    navigation: 'Navegação',
    save_project: 'Salvar Projeto',
    export: 'Exportar',
    import: 'Importar',
    ready: 'Pronto',
    editor: '📝 Editor',
    documents: '📄 Textos',
    characters: '👤 Personagens',
    world: '🌍 Mundo',
    economy: '💱 Economia',
    nav_languages: '🔤 Línguas',
    timeline: '⏳ Linha do Tempo',
    notes: '🗒️ Notas',
    home: 'Início',
  },
  en: {
    navigation: 'Navigation',
    save_project: 'Save Project',
    export: 'Export',
    import: 'Import',
    ready: 'Ready',
    editor: '📝 Editor',
    documents: '📄 Documents',
    characters: '👤 Characters',
    world: '🌍 World',
    economy: '💱 Economy',
    nav_languages: '🔤 Languages',
    timeline: '⏳ Timeline',
    notes: '🗒️ Notes',
    home: 'Home',
  },
};

let currentLang = 'pt';

export function setLanguage(lang) {
  currentLang = translations[lang] ? lang : 'pt';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = translations[currentLang][key];
    if (text) el.textContent = text;
  });
}
