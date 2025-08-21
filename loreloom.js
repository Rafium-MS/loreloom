// LoreLoom - núcleo minimalista com roteador e guarda de rota
// Linguagem: ES2020+ sem dependências
// Autor: você 🙂

// ==============================
// Store / Estado global
// ==============================
const Store = {
  state: {
    world: {
      characters: [],
      locations: [],
      items: [],
      languages: [],
      events: [],
      notes: []
    },
    ui: {
      dirty: {
        editor: false
      },
      currentRoute: '#/editor'
    }
  },
  load() {
    try {
      const raw = localStorage.getItem('loreloom@state');
      if (raw) {
        const parsed = JSON.parse(raw);
        // fundo do poço seguro
        this.state = Object.assign({}, this.state, parsed);
      }
    } catch (e) {
      console.warn('Falha ao carregar estado:', e);
    }
  },
  save() {
    try {
      localStorage.setItem('loreloom@state', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Falha ao salvar estado:', e);
    }
  },
  setDirty(key, val = true) {
    this.state.ui.dirty[key] = !!val;
    this.save();
    updateDirtyBadges();
  }
};

// ==============================
// Utilidades de UI
// ==============================
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function setActiveSidebar(routePath) {
  qsa('.nav-item').forEach(el => el.classList.remove('active'));
  const map = {
    '#/editor': 'editor',
    '#/characters': 'characters',
    '#/world': 'world',
    '#/economy': 'economy',
    '#/languages': 'languages',
    '#/timeline': 'timeline',
    '#/notes': 'notes'
  };
  const panelId = map[routePath] || 'editor';
  const idx = ['editor','characters','world','economy','languages','timeline','notes'].indexOf(panelId);
  const sidebarItem = qsa('.sidebar .nav-item')[idx];
  if (sidebarItem) sidebarItem.classList.add('active');
}

function updateDirtyBadges() {
  // simples: título do documento com * quando sujo no editor
  document.title = Store.state.ui.dirty.editor ? '• LoreLoom (não salvo)' : 'LoreLoom - Editor de Mundos Fantásticos';
}

// ==============================
// Editor básico
// ==============================
function updateStats() {
  const ta = qs('#mainText');
  if (!ta) return;
  const text = ta.value;
  const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
  const chars = text.length;
  const references = (text.match(/\\[([^\\]]+)\\]/g) || []).length;

  qs('#wordCount').textContent = String(words);
  qs('#charCount').textContent = String(chars);
  qs('#refCount').textContent = String(references);
}

function formatText(command) {
  const ta = qs('#mainText');
  if (!ta) return;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = ta.value.substring(start, end);
  if (!selected) return;

  let out = selected;
  if (command === 'bold') out = `**${selected}**`;
  if (command === 'italic') out = `*${selected}*`;

  ta.value = ta.value.substring(0, start) + out + ta.value.substring(end);
  ta.focus();
  ta.selectionStart = start;
  ta.selectionEnd = start + out.length;
  updateStats();
  Store.setDirty('editor', true);
}

function insertReference() {
  const ta = qs('#mainText');
  if (!ta) return;
  const ref = '[Nome/Local/Item]';
  const pos = ta.selectionStart ?? ta.value.length;
  ta.value = ta.value.slice(0, pos) + ref + ta.value.slice(pos);
  ta.focus();
  ta.setSelectionRange(pos + 1, pos + ref.length - 1);
  updateStats();
  Store.setDirty('editor', true);
}

function checkConsistency() {
  const ta = qs('#mainText');
  if (!ta) return;
  const refs = ta.value.match(/\\[([^\\]]+)\\]/g) || [];
  if (refs.length) {
    alert(`Encontradas ${refs.length} referências:\\n${refs.join('\\n')}\\n\\nVerifique se todas estão cadastradas no gerenciador de mundo!`);
  } else {
    alert('Nenhuma referência encontrada. Use [colchetes] para marcar personagens, locais e itens.');
  }
}

// Eventos do editor
function bindEditor() {
  const ta = qs('#mainText');
  if (!ta) return;

  // restaura rascunho salvo
  const draft = localStorage.getItem('loreloom@draft');
  if (draft && !ta.value) {
    ta.value = draft;
  }
  updateStats();

  ta.addEventListener('input', () => {
    updateStats();
    Store.setDirty('editor', true);
    // auto-save leve
    localStorage.setItem('loreloom@draft', ta.value);
  });

  // atalhos
  ta.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveDocument();
    }
  });
}

function saveDocument() {
  // simula salvamento
  const text = qs('#mainText')?.value ?? '';
  // guarde no storage como "arquivo atual"
  localStorage.setItem('loreloom@lastSavedDoc', JSON.stringify({
    content: text,
    savedAt: new Date().toISOString()
  }));
  Store.setDirty('editor', false);
  toast('Documento salvo.');
}

// Ações simuladas de criação
function addCharacter(){ simpleCreate('Personagem'); }
function addLocation(){ simpleCreate('Local'); }
function addMerchant(){ simpleCreate('Comerciante'); }
function addItem(){ simpleCreate('Item'); }
function addLanguage(){ simpleCreate('Língua'); }
function addEvent(){ simpleCreate('Evento'); }
function addNote(){ simpleCreate('Anotação'); }

function simpleCreate(label){
  const name = prompt(`Nome de ${label.toLowerCase()}:`);
  if (name) alert(`${label} "${name}" criado! Em uma versão completa, abriria um formulário detalhado.`);
}

// ==============================
// Toast minimalista
// ==============================
function toast(msg, ms = 1800){
  let box = document.getElementById('toast-container');
  if(!box){
    box = document.createElement('div');
    box.id = 'toast-container';
    document.body.appendChild(box);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  box.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, ms);
}

// ==============================
// Roteador simples (hash-based)
// ==============================
class Router {
  constructor() {
    /** @type {Record<string, (ctx: RouteContext)=>Promise<void>|void>} */
    this.routes = {};
    /** @type {(to: string, from: string)=>Promise<boolean>|boolean} */
    this.beforeEach = null;
    /** @type {(to: string, from: string)=>void} */
    this.afterEach = null;
    this._navigating = false;
  }

  on(path, handler) { this.routes[path] = handler; return this; }
  setBeforeEach(fn){ this.beforeEach = fn; return this; }
  setAfterEach(fn){ this.afterEach = fn; return this; }

  current() { return location.hash || '#/editor'; }

  async navigate(to) {
    const from = this.current();
    if (this._navigating || to === from) return;
    this._navigating = true;
    try {
      let ok = true;
      if (this.beforeEach) {
        ok = await this.beforeEach(to, from);
      }
      if (!ok) return; // cancelado pelo guarda

      location.hash = to; // isto disparará _onChange também
      // Quando hash mudar, o handler cuidará do render
      if (this.afterEach) this.afterEach(to, from);
    } finally {
      this._navigating = false;
    }
  }

  async _onChange() {
    const to = this.current();
    const from = Store.state.ui.currentRoute;
    // guarda de navegação também se aplica a hash manual
    if (this.beforeEach && to !== from) {
      const ok = await this.beforeEach(to, from);
      if (!ok) {
        // reverter hash
        if (from) location.hash = from;
        return;
      }
    }
    Store.state.ui.currentRoute = to;
    Store.save();

    const handler = this.routes[to];
    if (handler) {
      await handler({ path: to });
    } else {
      // rota desconhecida → editor
      location.hash = '#/editor';
    }
    if (this.afterEach) this.afterEach(to, from);
  }

  mount() {
    window.addEventListener('hashchange', () => this._onChange());
    // inicial
    if (!location.hash) location.hash = '#/editor';
    this._onChange();
  }
}

/** @typedef {{path: string}} RouteContext */

// ==============================
// Inicialização do app
// ==============================
const router = new Router();

router
  .on('#/editor', () => {
    setActiveSidebar('#/editor');
    showPanel('editor');
    bindEditor();
  })
  .on('#/characters', () => {
    setActiveSidebar('#/characters');
    showPanel('characters');
  })
  .on('#/world', () => {
    setActiveSidebar('#/world');
    showPanel('world');
  })
  .on('#/economy', () => {
    setActiveSidebar('#/economy');
    showPanel('economy');
  })
  .on('#/languages', () => {
    setActiveSidebar('#/languages');
    showPanel('languages');
  })
  .on('#/timeline', () => {
    setActiveSidebar('#/timeline');
    showPanel('timeline');
  })
  .on('#/notes', () => {
    setActiveSidebar('#/notes');
    showPanel('notes');
  });

// Guarda de rota assíncrona para confirmar salvamento ao sair do editor
router.setBeforeEach(async (to, from) => {
  // Se estiver saindo do editor com conteúdo não salvo
  const leavingEditor = from === '#/editor' && to !== from;
  if (leavingEditor && Store.state.ui.dirty.editor) {
    // Exemplo de fluxo assíncrono (poderia ser um modal customizado)
    const wantsSave = await confirmAsync('Você tem alterações não salvas. Deseja salvar antes de sair?');
    if (wantsSave) {
      saveDocument();
      return true;
    }
    // Confirmar descarte
    const discard = await confirmAsync('Tem certeza que deseja sair sem salvar?');
    if (!discard) return false;
    // se descartou, limpe flag dirty
    Store.setDirty('editor', false);
    return true;
  }
  return true;
});

// Pós-navegação
router.setAfterEach((to, from) => {
  // foco no painel principal (acessibilidade)
  const main = document.querySelector('.content-area') || document.body;
  if (main) main.setAttribute('tabindex', '-1'), main.focus();
});

// Confirm "assíncrono" usando Promise (placeholder para modal real)
function confirmAsync(message){
  return new Promise(resolve => {
    // timeout para permitir pintura de UI do browser antes do confirm (UX)
    setTimeout(() => resolve(window.confirm(message)), 0);
  });
}

// Clique nos itens da sidebar → usar roteador
function wireSidebar(){
  const ids = ['editor','characters','world','economy','languages','timeline','notes'];
  qsa('.sidebar .nav-item').forEach((el, idx) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = '#/' + ids[idx];
      router.navigate(target);
    });
  });
}

// Boot
window.addEventListener('DOMContentLoaded', () => {
  Store.load();
  updateDirtyBadges();
  wireSidebar();
  router.mount();
});

// Expor no escopo global para os botões inline do HTML
window.formatText = formatText;
window.insertReference = insertReference;
window.checkConsistency = checkConsistency;
window.addCharacter = addCharacter;
window.addLocation = addLocation;
window.addMerchant = addMerchant;
window.addItem = addItem;
window.addLanguage = addLanguage;
window.addEvent = addEvent;
window.addNote = addNote;
window.showPanel = (id) => router.navigate('#/' + id); // manter compat com HTML inline
window.saveDocument = saveDocument;
