import { projectData } from './state.js';
import { debounce } from './utils.js';

const MAX_HISTORY_SIZE = 50;
let undoStack = [];
let redoStack = [];
let editorElement;

function pushState(innerHTML) {
    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === innerHTML) {
        return;
    }

    undoStack.push(innerHTML);
    if (undoStack.length > MAX_HISTORY_SIZE) {
        undoStack.shift();
    }
    redoStack = [];
}

export function undo() {
    if (undoStack.length <= 1) return;
    const currentState = undoStack.pop();
    redoStack.push(currentState);
    const prevState = undoStack[undoStack.length - 1];
    editorElement.innerHTML = prevState;
}

export function redo() {
    if (redoStack.length === 0) return;
    const nextState = redoStack.pop();
    undoStack.push(nextState);
    editorElement.innerHTML = nextState;
}

export function resetHistory() {
    undoStack = [editorElement.innerHTML];
    redoStack = [];
}

export function bindEditorHistory() {
    editorElement = document.getElementById('mainText');
    if (!editorElement) return;

    resetHistory();

    const debouncedPushState = debounce(() => {
        pushState(editorElement.innerHTML);
    }, 300);

    editorElement.addEventListener('input', debouncedPushState);

    document.addEventListener('keydown', e => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const undoKey = isMac ? e.metaKey && e.key === 'z' : e.ctrlKey && e.key === 'z';
        const redoKey = isMac ? e.metaKey && e.key === 'y' : e.ctrlKey && e.key === 'y';

        if (undoKey) {
            e.preventDefault();
            undo();
        } else if (redoKey) {
            e.preventDefault();
            redo();
        }
    });
}

export function formatText(command) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  let tagName;
  switch (command) {
    case 'bold':
      tagName = 'strong';
      break;
    case 'italic':
      tagName = 'em';
      break;
    case 'underline':
      tagName = 'u';
      break;
    case 'strikethrough':
      tagName = 's';
      break;
    default:
      return;
  }

  const wrapper = document.createElement(tagName);
  wrapper.appendChild(range.extractContents());
  range.insertNode(wrapper);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  updateWordCount();
}

export function insertReference() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const selectedText = range.toString();
  const text = selectedText ? `[${selectedText}]` : '[referência]';
  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  updateWordCount();
}

export function insertRef(type) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const node = document.createTextNode(`[${type}]`);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  updateWordCount();
}

export function insertCharacterRef() {
  insertRef('personagem');
}

export function insertLocationRef() {
  insertRef('local');
}

export function insertItemRef() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const node = document.createTextNode('[item]');
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  updateWordCount();
}

export function updateWordCount() {
  const editor = document.getElementById('mainText');
  const text = editor.textContent;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const refs = (text.match(/\[([^\]]+)\]/g) || []).length;

  document.getElementById('wordCount').textContent = words;
  document.getElementById('charCount').textContent = chars;
  document.getElementById('refCount').textContent = refs;
}

export async function saveProject() {
  projectData.content = document.getElementById('mainText').innerHTML;
  projectData.title = document.getElementById('documentTitle').value;
  await fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  setSaveStatus('Salvo ' + new Date().toLocaleTimeString());
  console.log('Projeto salvo:', projectData);
}

function extractBracketRefs(editorElement) {
  const refs = [];
  let line = 1;
  const regex = /\[([^\]]+)\]/g;

  function traverse(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let match;
      while ((match = regex.exec(node.textContent)) !== null) {
        refs.push({ ref: match[1], line });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const isBlock = window.getComputedStyle(node).display === 'block';
      if (isBlock && node.childNodes.length > 0) {
        line++;
      }
      node.childNodes.forEach(traverse);
    }
  }

  editorElement.childNodes.forEach(traverse);
  return refs;
}

function mapRefsToEntities(refsWithLines, projectData) {
  const characterNames = new Set(projectData.characters.map(c => c.name));
  const locationNames = new Set(projectData.locations.map(l => l.name));

  return refsWithLines.map(({ ref, line }) => {
    if (characterNames.has(ref)) {
      return { type: 'character', ref, exists: true, line };
    }
    if (locationNames.has(ref)) {
      return { type: 'place', ref, exists: true, line };
    }
    // Heurística
    const isCharacter = projectData.characters.some(c => ref.toLowerCase().includes(c.name.toLowerCase()));
    if (isCharacter) {
      return { type: 'character', ref, exists: false, line };
    }
    const isLocation = projectData.locations.some(l => ref.toLowerCase().includes(l.name.toLowerCase()));
    if (isLocation) {
      return { type: 'place', ref, exists: false, line };
    }
    return { type: 'unknown', ref, exists: false, line };
  });
}

export function checkConsistency() {
  const editor = document.getElementById('mainText');
  const refs = extractBracketRefs(editor);
  const results = mapRefsToEntities(refs, projectData);
  const inconsistencies = results.filter(r => !r.exists);

  const resultContainer = document.getElementById('consistencyResult');
  if (resultContainer) {
    if (inconsistencies.length === 0) {
      resultContainer.innerHTML = '<p>Nenhuma inconsistência encontrada.</p>';
    } else {
      resultContainer.innerHTML = inconsistencies
        .map(item => `
          <div class="inconsistency-item">
            Linha ${item.line}: Referência não encontrada: <strong>${item.ref}</strong> (tipo provável: ${item.type})
          </div>
        `)
        .join('');
    }
    window.openModal('consistencyModal');
  } else {
    console.warn('Painel de consistência não encontrado. Resultados:', inconsistencies);
  }
}

export function exportProject() {
  const dataStr = JSON.stringify(projectData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'projeto_loreloom.json';
  link.click();
}

export async function importProject(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    Object.assign(projectData, data);
    document.getElementById('mainText').innerHTML = projectData.content || '';
    document.getElementById('documentTitle').value = projectData.title || '';
    resetHistory();
    updateWordCount();
    window.renderCharacterList?.();
    window.renderLocationList?.();
    window.renderItemList?.();
    window.renderLanguageList?.();
    window.renderEventList?.();
    window.renderNoteList?.();
    await saveProject();
  } catch (err) {
    console.error('Erro ao importar projeto:', err);
    alert('Arquivo JSON inválido');
  }
  event.target.value = '';
}
