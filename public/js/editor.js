import { projectData } from './state.js';

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

export function insertCharacterRef() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const node = document.createTextNode('[personagem]');
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  updateWordCount();
}

export function insertLocationRef() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const node = document.createTextNode('[local]');
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  updateWordCount();
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
  document.getElementById('saveStatus').textContent = 'Salvo ' + new Date().toLocaleTimeString();
  console.log('Projeto salvo:', projectData);
}

export function checkConsistency() {
  alert('Função de verificação de consistência ainda não implementada.');
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
