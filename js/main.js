import { projectData } from './state.js';
import * as editor from './editor.js';
import * as characters from './characters.js';
import * as world from './world.js';

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('active');
}

Object.assign(window, editor, characters, world, { closeModal });

async function loadProject() {
  const res = await fetch('/load');
  const data = await res.json();
  Object.assign(projectData, data);
  document.getElementById('mainText')?.value = projectData.content || '';
  document.getElementById('documentTitle')?.value = projectData.title || '';
  editor.updateWordCount();
  characters.renderCharacterList();
  world.renderLocationList();
  world.renderItemList();
  world.renderLanguageList();
  world.renderEventList();
  world.renderNoteList();
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.content-panel').forEach(panel => panel.classList.remove('active'));
    this.classList.add('active');
    const route = this.dataset.route;
    document.getElementById(route)?.classList.add('active');
    const crumb = document.getElementById('crumb');
    if (crumb) crumb.textContent = this.textContent.trim();
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
      this.classList.remove('active');
    }
  });
});

document.getElementById('mainText')?.addEventListener('input', editor.updateWordCount);

document.getElementById('importFile')?.addEventListener('change', editor.importProject);

document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    editor.saveProject();
  }
});

loadProject();
