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

const STRIP_FORMATTING_TAGS = ['STRONG', 'B', 'EM', 'I', 'U', 'S', 'MARK'];

/**
 * Recursively traverses a DOM node and removes inline formatting.
 * - Unwraps formatting tags (strong, em, etc.).
 * - Unwraps <span> tags that only have styling attributes.
 * - Removes style attributes from all other elements.
 * It preserves block-level elements and anchors (<a>).
 * @param {Node} node The root node to start cleaning from.
 */
function stripInlineFormatting(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
    }

    // Recurse on children first
    // Create a static copy of the children list, as it will be modified
    const children = Array.from(node.childNodes);
    children.forEach(stripInlineFormatting);

    // Now process the node itself
    const isFormattingTag = STRIP_FORMATTING_TAGS.includes(node.tagName);
    const isStyledSpan = node.tagName === 'SPAN' && node.hasAttribute('style');

    if (isFormattingTag || isStyledSpan) {
        // Unwrap the element: move its children to its parent and remove it.
        const parent = node.parentNode;
        if (parent) {
            while (node.firstChild) {
                // Insert child before the node itself
                parent.insertBefore(node.firstChild, node);
            }
            // Remove the now-empty node
            parent.removeChild(node);
        }
    } else if (node.hasAttribute('style')) {
        // For any other element (like <p style="...">), just remove the style.
        node.removeAttribute('style');
    }
}

export function clearFormatting() {
    if (!editorElement) return;

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    // Save selection for restoration
    const savedRanges = [];
    for (let i = 0; i < selection.rangeCount; i++) {
        savedRanges.push(selection.getRangeAt(i).cloneRange());
    }

    // Case 1: No text is selected (cursor is just blinking).
    // Apply to the entire editor content.
    if (selection.isCollapsed) {
        stripInlineFormatting(editorElement);
    } else {
        // Case 2: Text is selected.
        // Apply to each range in the selection (usually just one).
        savedRanges.forEach(range => {
            const fragment = range.extractContents();
            stripInlineFormatting(fragment);
            range.insertNode(fragment);
        });
    }

    // Clean up the DOM by merging adjacent text nodes.
    editorElement.normalize();

    // Restore the selection.
    selection.removeAllRanges();
    savedRanges.forEach(range => {
        selection.addRange(range);
    });

    // Push the new state to the history stack and update counts.
    pushState(editorElement.innerHTML);
    updateWordCount();
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
