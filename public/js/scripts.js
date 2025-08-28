// ===============================
// ESTADO & PERSISTÊNCIA POR PROJETO
// ===============================
const STORAGE_KEY = 'loreloom:projects';

let projectData = {
  title: 'Projeto LoreLoom',
  content: '',
  characters: [],
  locations: [],
  items: [],
  languages: [],
  timeline: [],
  notes: [],
  economy: { currencies: [], resources: [], markets: [] },
  documents: [], // <- NOVO: coleção de textos (cada um com title/content/status)
};

let currentProjectName = 'Projeto LoreLoom';
let currentDocumentId = null; // id do documento aberto no editor

function slugify(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function loadProjectsMap() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProjectsMap(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function ensureProject(name) {
  const map = loadProjectsMap();
  const key = slugify(name);
  if (!map[key]) map[key] = JSON.parse(JSON.stringify(projectData)); // deep clone da estrutura default
  saveProjectsMap(map);
  return { map, key };
}

function setSaveStatus(message) {
  const el = document.getElementById('saveStatus');
  if (el) {
    el.textContent = message;
  }
}

function persistProject() {
  const map = loadProjectsMap();
  map[slugify(currentProjectName)] = projectData;
  saveProjectsMap(map);
  setSaveStatus('Salvo');
}
function nowISO() {
  return new Date().toISOString();
}

function createDocument(title) {
  return {
    id: Date.now(),
    title: title || `Sem título ${new Date().toLocaleString()}`,
    content: '',
    status: 'draft', // 'draft' | 'final'
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
}

function selectDocument(id) {
  const doc = projectData.documents.find((d) => d.id === id);
  if (!doc) return;
  currentDocumentId = id;
  document.getElementById('documentTitle').value = doc.title;
  document.getElementById('mainText').innerHTML = doc.content;
  updateWordCount();
  updateStatusBadge();
  renderProjectTree();
  setSaveStatus('Documento carregado');
}

function newDocument() {
  const title = prompt(
    'Título do novo texto:',
    `Novo Texto ${projectData.documents.length + 1}`,
  );
  if (title === null) return;
  const doc = createDocument(title.trim() || 'Sem título');
  projectData.documents.unshift(doc);
  selectDocument(doc.id);
  renderProjectTree();
  renderDocumentsPanel();
  persistProject();
}

function renameCurrentDocument(newTitle) {
  const doc = getCurrentDoc();
  if (!doc) return;
  doc.title = newTitle || doc.title;
  doc.updatedAt = nowISO();
  renderProjectTree();
  renderDocumentsPanel();
  persistProject();
}

function saveCurrentDocumentContent(text) {
  const doc = getCurrentDoc();
  if (!doc) return;
  doc.content = text;
  doc.updatedAt = nowISO();
}

function deleteDocument(id) {
  if (!confirm('Excluir este texto?')) return;
  projectData.documents = projectData.documents.filter((d) => d.id !== id);
  if (currentDocumentId === id) {
    currentDocumentId = projectData.documents[0]?.id || null;
    if (currentDocumentId) selectDocument(currentDocumentId);
    else {
      // se não restou nada, cria um vazio
      const d = createDocument('Documento 1');
      projectData.documents.push(d);
      selectDocument(d.id);
    }
  }
  renderProjectTree();
  renderDocumentsPanel();
  persistProject();
}

function getCurrentDoc() {
  return projectData.documents.find((d) => d.id === currentDocumentId) || null;
}

function renderProjectTree() {
  const ul = document.getElementById('documentsTree');
  if (!ul) return;
  ul.innerHTML = '';
  projectData.documents.forEach((doc) => {
    const li = document.createElement('li');
    li.className = 'doc-node' + (doc.id === currentDocumentId ? ' active' : '');
    li.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        📄 <span class="doc-title">${doc.title}</span>
        <span class="badge ${doc.status === 'draft' ? 'badge-draft' : 'badge-final'}">${doc.status === 'draft' ? 'Rascunho' : 'Final'}</span>
      </div>
      <div>
        <button class="btn btn-sm" title="Abrir">Abrir</button>
        <button class="btn btn-sm" title="Excluir">Del</button>
      </div>
    `;
    li.querySelector('button[title="Abrir"]').onclick = () =>
      selectDocument(doc.id);
    li.querySelector('button[title="Excluir"]').onclick = () =>
      deleteDocument(doc.id);
    ul.appendChild(li);
  });

  // atualiza o nome do livro (pasta)
  document.getElementById('projectNameDisplay').textContent =
    currentProjectName || 'Projeto';
}

function renderDocumentsPanel() {
  const cont = document.getElementById('documentsList');
  if (!cont) return;
  const q = (document.getElementById('docSearch')?.value || '').toLowerCase();

  const list = projectData.documents
    .filter((d) => !q || d.title.toLowerCase().includes(q))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  cont.innerHTML = list
    .map(
      (d) => `
    <div class="list-item">
      <div>
        <div class="document-title">${d.title}</div>
        <div class="document-sub">
          ${d.status === 'draft' ? '<span class="badge badge-draft">Rascunho</span>' : '<span class="badge badge-final">Final</span>'}
          • Atualizado em ${new Date(d.updatedAt).toLocaleString()}
        </div>
      </div>
      <div>
        <button class="btn btn-sm" onclick="selectDocument(${d.id}); document.querySelector('[data-route=\\'editor\\']').click();">Abrir</button>
        <button class="btn btn-sm" onclick="deleteDocument(${d.id})">Excluir</button>
      </div>
    </div>
  `,
    )
    .join('');
}

// ====== Binds de UI novos ======
// Some pages may not include this button; guard to avoid errors
const newDocBtn = document.getElementById('newDocumentBtn');
if (newDocBtn) newDocBtn.addEventListener('click', newDocument);

const projectInput = document.getElementById('projectNameInput');
if (projectInput) {
  projectInput.addEventListener('input', (e) => {
    currentProjectName = e.target.value || 'Projeto';
    renderProjectTree(); // reflete nome de livro ao digitar
  });
  projectInput.addEventListener('change', () => {
    // move/garante projeto no storage quando o nome muda
    // (função de carregar projeto removida)
  });
}

// atualizar título do doc em tempo real
document.getElementById('documentTitle').addEventListener('input', (e) => {
  renameCurrentDocument(e.target.value);
});

// autosave simples do conteúdo com debounce
let saveTimer = null;
document.getElementById('mainText').addEventListener('input', () => {
  updateWordCount();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveProject();
  }, 400);
});

// busca de textos no painel
const docSearch = document.getElementById('docSearch');
if (docSearch) docSearch.addEventListener('input', renderDocumentsPanel);
function updateStatusBadge() {
  const badge = document.getElementById('docStatusBadge');
  const doc = getCurrentDoc();
  if (!badge || !doc) return;
  if (doc.status === 'draft') {
    badge.className = 'badge badge-draft';
    badge.textContent = 'Rascunho';
    document.getElementById('draftToggleBtn').textContent = '🏷️ Rascunho';
  } else {
    badge.className = 'badge badge-final';
    badge.textContent = 'Final';
    document.getElementById('draftToggleBtn').textContent = '🏷️ Final';
  }
}

function toggleDraft() {
  const doc = getCurrentDoc();
  if (!doc) return;
  doc.status = doc.status === 'draft' ? 'final' : 'draft';
  doc.updatedAt = nowISO();
  updateStatusBadge();
  renderProjectTree();
  renderDocumentsPanel();
  persistProject();
}
function grammarReview() {
  const panel = document.getElementById('grammarPanel');
  const out = document.getElementById('grammarResults');
  const text = document.getElementById('mainText').textContent;
  const issues = [];

  // 1) Espaços duplos
  if (/\s{2,}/.test(text)) {
    issues.push({
      type: 'Estilo',
      msg: 'Há espaços duplos no texto.',
      fix: 'Substituir por um espaço.',
    });
  }
  // 2) Espaço antes de pontuação
  if (/\s+([,.;:!?])/g.test(text)) {
    issues.push({
      type: 'Pontuação',
      msg: 'Há espaço indevido antes de pontuação.',
      fix: 'Remover espaço antes de ,.;:!?',
    });
  }
  // 3) Palavras repetidas em sequência (case-insensitive)
  const rep = text.match(/\b(\w+)\s+\1\b/gi);
  if (rep && rep.length) {
    issues.push({
      type: 'Ortografia',
      msg: `Palavras repetidas: ${[...new Set(rep)].join(', ')}`,
      fix: 'Remover duplicatas consecutivas.',
    });
  }
  // 4) Frases muito longas (heurística > 30 palavras)
  const sentences = text.split(/(?<=[.!?])\s+/);
  const longOnes = sentences.filter((s) => s.trim().split(/\s+/).length > 30);
  if (longOnes.length) {
    issues.push({
      type: 'Clareza',
      msg: `${longOnes.length} frase(s) muito longas. Avalie dividir.`,
      fix: 'Reestruturar frases extensas.',
    });
  }
  // 5) Início de frase sem maiúscula (heurística simples)
  const badCaps = sentences.filter(
    (s) => s.trim() && !/^[A-ZÁÉÍÓÚÂÊÔÃÕÇÀ]/.test(s.trim()),
  );
  if (badCaps.length) {
    issues.push({
      type: 'Capitalização',
      msg: `Frases iniciando sem maiúscula: ${badCaps.length}`,
      fix: 'Iniciar frases com letra maiúscula.',
    });
  }

  if (!issues.length) {
    out.innerHTML =
      '<div class="issue" style="border-left-color:#10b981">Nenhum problema encontrado. 🎉</div>';
  } else {
    out.innerHTML = issues
      .map(
        (i) => `
      <div class="issue">
        <strong>${i.type}</strong> — ${i.msg}<br/>
        <em>Sugestão:</em> ${i.fix}
      </div>
    `,
      )
      .join('');
  }
  panel.style.display = 'block';
}

function applyQuickFixes() {
  const editor = document.getElementById('mainText');
  let t = editor.textContent;
  // remover espaço antes de pontuação
  t = t.replace(/\s+([,.;:!?])/g, '$1');
  // reduzir múltiplos espaços
  t = t.replace(/\s{2,}/g, ' ');
  // remover duplicatas consecutivas "palavra palavra" (case-insensitive)
  t = t.replace(/\b(\w+)\s+\1\b/gi, '$1');

  editor.textContent = t;
  updateWordCount();
  saveProject();
  grammarReview(); // reexecuta para atualizar painel
}
function hydrateUIFromProject() {
  // inputs principais
  document.getElementById('projectNameInput').value = currentProjectName;
  document.getElementById('projectNameDisplay').textContent =
    currentProjectName;
  // carrega doc selecionado
  const doc = getCurrentDoc();
  if (doc) {
    document.getElementById('documentTitle').value = doc.title;
    document.getElementById('mainText').innerHTML = doc.content;
  } else {
    document.getElementById('documentTitle').value = '';
    document.getElementById('mainText').innerHTML = '';
  }
  updateWordCount();
  updateStatusBadge();
}

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', function () {
      document
        .querySelectorAll('.nav-item')
        .forEach((nav) => nav.classList.remove('active'));
      document
        .querySelectorAll('.content-panel')
        .forEach((panel) => panel.classList.remove('active'));
      this.classList.add('active');
      const route = this.dataset.route;
      const panel = document.getElementById(route);
      if (panel) panel.classList.add('active');
      const crumb = document.getElementById('crumb');
      if (crumb) crumb.textContent = this.textContent.trim();
    });
  });
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', function () {
      const container = this.closest('#world');
      if (!container) return;
      container
        .querySelectorAll('.tab')
        .forEach((t) => t.classList.remove('active'));
      container
        .querySelectorAll('.tab-content')
        .forEach((tc) => (tc.style.display = 'none'));
      this.classList.add('active');
      const tabId = this.dataset.tab;
      const content = document.getElementById(tabId);
      if (content) content.style.display = 'block';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // carrega projeto default (pode trocar depois pelo input)
  // (função de carregar projeto removida)
  setupNavigation();
  setupTabs();
});
