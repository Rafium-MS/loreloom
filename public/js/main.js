import { projectData } from './state.js';
import * as editor from './editor.js';
import * as characters from './characters.js';
import * as world from './world.js';
import { setLanguage } from './i18n.js';

const modalTriggers = {};

async function loadModals() {
  const res = await fetch('/partials/modals.html');
  if (res.ok) {
    const html = await res.text();
    document.body.insertAdjacentHTML('beforeend', html);
  }
}

await loadModals();

function openModal(modalId, trigger) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  modalTriggers[modalId] = trigger || document.activeElement;
  const focusEl = modal.querySelector('input, select, textarea, button');
  focusEl?.focus();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal?.classList.remove('active');
  const trigger = modalTriggers[modalId];
  if (trigger && typeof trigger.focus === 'function') {
    trigger.focus();
  }
  delete modalTriggers[modalId];
}

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
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.content-panel').forEach(panel => panel.classList.remove('active'));
    this.classList.add('active');
    const route = this.dataset.route;
    document.getElementById(route)?.classList.add('active');
    const crumb = document.getElementById('crumb');
    if (crumb) {
      crumb.setAttribute('data-i18n', this.getAttribute('data-i18n') || '');
      const label = this.classList.contains('has-submenu')
        ? this.childNodes[0].textContent.trim()
        : this.textContent.trim();
      crumb.textContent = label;
    }
  });
});

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    if (this.closest('#world')) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
      this.classList.add('active');
      const tabId = this.dataset.tab;
      const tab = document.getElementById(tabId);
      if (tab) tab.style.display = 'block';
    }
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal(this.id);
    }
  });
});

document.getElementById('mainText')?.addEventListener('input', editor.updateWordCount);

document.getElementById('importFile')?.addEventListener('change', editor.importProject);

document.getElementById('languageSwitcher')?.addEventListener('change', async function() {
  projectData.uiLanguage = this.value;
  setLanguage(this.value);
  await editor.saveProject();
});

document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    editor.saveProject();
  }
});

document.getElementById('sidebarToggle')?.addEventListener('click', () => {
  document.querySelector('.app')?.classList.toggle('collapsed');
});

document.querySelectorAll('[data-action]').forEach(el => {
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
