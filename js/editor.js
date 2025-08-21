import { projectData } from './state.js';

export function formatText(command) {
  document.execCommand(command, false, null);
}

export function insertReference() {
  const textarea = document.getElementById('mainText');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);

  if (selectedText) {
    textarea.value = textarea.value.substring(0, start) +
                    '[' + selectedText + ']' +
                    textarea.value.substring(end);
  } else {
    textarea.value = textarea.value.substring(0, start) +
                    '[referência]' +
                    textarea.value.substring(end);
  }

  updateWordCount();
}

export function insertCharacterRef() {
  const textarea = document.getElementById('mainText');
  const start = textarea.selectionStart;
  textarea.value = textarea.value.substring(0, start) +
                  '[personagem]' +
                  textarea.value.substring(start);
  updateWordCount();
}

export function insertLocationRef() {
  const textarea = document.getElementById('mainText');
  const start = textarea.selectionStart;
  textarea.value = textarea.value.substring(0, start) +
                  '[local]' +
                  textarea.value.substring(start);
  updateWordCount();
}

export function updateWordCount() {
  const text = document.getElementById('mainText').value;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const refs = (text.match(/\[([^\]]+)\]/g) || []).length;

  document.getElementById('wordCount').textContent = words;
  document.getElementById('charCount').textContent = chars;
  document.getElementById('refCount').textContent = refs;
}

export async function saveProject() {
  projectData.content = document.getElementById('mainText').value;
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
    document.getElementById('mainText').value = projectData.content || '';
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
