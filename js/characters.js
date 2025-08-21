import { projectData, editingIds } from './state.js';
import { saveProject } from './editor.js';

export function renderCharacterList() {
  const list = document.getElementById('characterList');
  if (!list) return;
  list.innerHTML = '';
  projectData.characters.forEach(c => {
    const tags = (c.tags || []).map(t => `<div class="tag">${t}</div>`).join('');
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div>
        <strong>${c.name}</strong>
        <div style="font-size: 0.9em; color: #64748b;">${[c.role, c.race].filter(Boolean).join(', ')}</div>
        ${tags}
      </div>
      <div>
        <button class="btn" onclick="editCharacter(${c.id})">Editar</button>
        <button class="btn btn-danger" onclick="deleteCharacter(${c.id})">Excluir</button>
      </div>
    `;
    list.appendChild(item);
  });
}

export function openCharacterModal() {
  editingIds.character = null;
  ['charName','charAge','charRace','charClass','charRole','charAppearance','charPersonality','charBackground','charSkills','charRelationships','charTags'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('characterModal').classList.add('active');
}

export async function saveCharacter() {
  const character = {
    id: editingIds.character || Date.now(),
    name: document.getElementById('charName').value,
    age: document.getElementById('charAge').value,
    race: document.getElementById('charRace').value,
    class: document.getElementById('charClass').value,
    role: document.getElementById('charRole').value,
    appearance: document.getElementById('charAppearance').value,
    personality: document.getElementById('charPersonality').value,
    background: document.getElementById('charBackground').value,
    skills: document.getElementById('charSkills').value,
    relationships: document.getElementById('charRelationships').value,
    tags: document.getElementById('charTags').value.split(',').map(t => t.trim())
  };

  if (editingIds.character) {
    const idx = projectData.characters.findIndex(c => c.id === editingIds.character);
    if (idx !== -1) projectData.characters[idx] = character;
  } else {
    projectData.characters.push(character);
  }

  await saveProject();
  renderCharacterList();
  closeModal('characterModal');
  console.log('Personagem salvo:', character);
}

export function editCharacter(id) {
  const c = projectData.characters.find(ch => ch.id === id);
  if (!c) return;
  editingIds.character = id;
  document.getElementById('charName').value = c.name || '';
  document.getElementById('charAge').value = c.age || '';
  document.getElementById('charRace').value = c.race || '';
  document.getElementById('charClass').value = c.class || '';
  document.getElementById('charRole').value = c.role || '';
  document.getElementById('charAppearance').value = c.appearance || '';
  document.getElementById('charPersonality').value = c.personality || '';
  document.getElementById('charBackground').value = c.background || '';
  document.getElementById('charSkills').value = c.skills || '';
  document.getElementById('charRelationships').value = c.relationships || '';
  document.getElementById('charTags').value = (c.tags || []).join(', ');
  document.getElementById('characterModal').classList.add('active');
}

export async function deleteCharacter(id) {
  projectData.characters = projectData.characters.filter(c => c.id !== id);
  await saveProject();
  renderCharacterList();
}
