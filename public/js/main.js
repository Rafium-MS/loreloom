import { projectData } from './state.js';
import * as editor from './editor.js';
import * as characters from './characters.js';
import * as world from './world.js';
import { setLanguage } from './i18n.js';
import { debounce } from './utils-module.js';
import { loadModals, openModal, closeModal } from './modals.js';
import { initNavigation } from './navigation.js';
await loadModals();
initNavigation();

function triggerImport() {
  document.getElementById('importFile')?.click();
}

function closeGrammarPanel() {
  const panel = document.getElementById('grammarPanel');
  if (panel) panel.style.display = 'none';
}

const localActions = { triggerImport, closeGrammarPanel };

Object.assign(window, editor, characters, world, { openModal, closeModal });

async function loadProject() {
  let data;
  try {
    const res = await fetch('/load');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.error('Failed to load project', err);
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.textContent = 'Erro ao carregar projeto';
    try {
      const fallback = await fetch('/data.json');
      if (fallback.ok) {
        data = await fallback.json();
        const statusEl = document.getElementById('status');
        if (statusEl) statusEl.textContent = 'Dados locais carregados';
      }
    } catch (fallbackErr) {
      console.error('Fallback load failed', fallbackErr);
    }
  }
  if (data) {
    Object.assign(projectData, data);
  }
  const mainTextEl = document.getElementById('mainText');
  if (mainTextEl) mainTextEl.innerHTML = projectData.content || '';
  const titleEl = document.getElementById('documentTitle');
  if (titleEl) titleEl.value = projectData.title || '';
  const langSelect = document.getElementById('languageSwitcher');
  if (langSelect) langSelect.value = projectData.uiLanguage || 'pt';
  setLanguage(projectData.uiLanguage || 'pt');
  editor.updateWordCount();
  characters.renderCharacterList();
  world.renderLocationList();
  world.renderItemList();
  world.renderLanguageList();
  world.renderEventList();
  world.renderNoteList();
  world.renderFactionList();
  editor.resetHistory();
}

document
  .getElementById('mainText')
  ?.addEventListener('input', editor.updateWordCount);
document
  .getElementById('mainText')
  ?.addEventListener('input', debounce(editor.checkConsistency, 300));

document
  .getElementById('importFile')
  ?.addEventListener('change', editor.importProject);

document
  .getElementById('languageSwitcher')
  ?.addEventListener('change', async function () {
    projectData.uiLanguage = this.value;
    setLanguage(this.value);
    await editor.saveProject();
  });

document.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    editor.saveProject();
  }
});

document.querySelectorAll('[data-action]').forEach((el) => {
  el.addEventListener('click', () => {
    const action = el.getAttribute('data-action');
    const arg = el.getAttribute('data-arg');
    const fn = localActions[action] || window[action];
    if (typeof fn === 'function') {
      if (arg !== null) {
        fn(arg, el);
      } else {
        fn(el);
      }
    }
  });
});

loadProject();
editor.bindEditorHistory();
