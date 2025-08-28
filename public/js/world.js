import { projectData, editingIds } from './state.js';
import { saveProject } from './editor.js';

export function renderLocationList() {
  const list = document.getElementById('locationList');
  if (!list) return;
  list.innerHTML = '';
  projectData.locations.forEach((l) => {
    const tags = (l.tags || [])
      .map((t) => `<div class="tag">${t}</div>`)
      .join('');
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div>
        <strong>${l.name}</strong>
        <div style="font-size: 0.9em; color: #64748b;">${[l.type, l.region].filter(Boolean).join(' • ')}</div>
        ${tags}
      </div>
      <div>
        <button class="btn" onclick="editLocation(${l.id}, this)">Editar</button>
        <button class="btn btn-danger" onclick="deleteLocation(${l.id})">Excluir</button>
      </div>
    `;
    list.appendChild(item);
  });
}

export function renderItemList() {
  const list = document.getElementById('itemList');
  if (!list) return;
  list.innerHTML = '';
  projectData.items.forEach((i) => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div>
        <strong>${i.name}</strong>
        <div style="font-size: 0.9em; color: #64748b;">${[i.type, i.rarity].filter(Boolean).join(' • ')}</div>
      </div>
      <div>
        <button class="btn" onclick="editItem(${i.id}, this)">Editar</button>
        <button class="btn btn-danger" onclick="deleteItem(${i.id})">Excluir</button>
      </div>
    `;
    list.appendChild(item);
  });
}

export function renderLanguageList() {
  const list = document.getElementById('languageList');
  if (!list) return;
  list.innerHTML = '';
  projectData.languages.forEach((l) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${l.name}</h3>
      <div style="font-size: 0.9em; color: #64748b;">${l.family || ''}</div>
      <div style="margin-top:8px;">
        <button class="btn" onclick="editLanguage(${l.id}, this)">Editar</button>
        <button class="btn btn-danger" onclick="deleteLanguage(${l.id})">Excluir</button>
      </div>
    `;
    list.appendChild(card);
  });
}

export function renderEventList() {
  const list = document.getElementById('eventList');
  if (!list) return;
  list.innerHTML = '';
  projectData.timeline.forEach((e) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '12px';
    card.style.position = 'relative';
    card.innerHTML = `
      <div style="position: absolute; left: -26px; top: 16px; width: 12px; height: 12px; background: #3b82f6; border-radius: 50%;"></div>
      <strong>${e.date}</strong> - ${e.name}
      <div style=\"font-size: 0.9em; color: #64748b; margin-top: 4px;\">${e.description || ''}</div>
      ${e.importance ? `<div class="tag">${e.importance}</div>` : ''}
      <div style="margin-top: 8px;">
        <button class="btn" onclick="editEvent(${e.id}, this)">Editar</button>
        <button class="btn btn-danger" onclick="deleteEvent(${e.id})">Excluir</button>
      </div>
    `;
    list.appendChild(card);
  });
}

export function renderNoteList() {
  const list = document.getElementById('noteList');
  if (!list) return;
  list.innerHTML = '';
  projectData.notes.forEach((n) => {
    const tags = (n.tags || [])
      .map((t) => `<div class="tag">${t}</div>`)
      .join('');
    const card = document.createElement('div');
    card.className = 'card';
    const date = n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '';
    card.innerHTML = `
      <div class="card-header">
        <strong>${n.title}</strong>
        <span style="font-size: 0.8em; color: #64748b;">${date}</span>
      </div>
      <p style="font-size: 0.9em; margin: 8px 0;">${n.content}</p>
      ${tags}
      <div style="margin-top: 12px;">
        <button class="btn" onclick="editNote(${n.id}, this)">Editar</button>
        <button class="btn btn-danger" onclick="deleteNote(${n.id})">Excluir</button>
      </div>
    `;
    list.appendChild(card);
  });
}

export function renderFactionList() {
  const list = document.getElementById('factionList');
  if (!list) return;
  list.innerHTML = '';
  projectData.factions.forEach((f) => {
    const tags = (f.tags || [])
      .map((t) => `<div class="tag">${t}</div>`)
      .join('');
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div>
        <strong>${f.name}</strong>
        <div style="font-size: 0.9em; color: #64748b;">${f.description.substring(0, 50)}...</div>
        ${tags}
      </div>
      <div>
        <button class="btn" onclick="editFaction(${f.id}, this)">Editar</button>
        <button class="btn btn-danger" onclick="deleteFaction(${f.id})">Excluir</button>
      </div>
    `;
    list.appendChild(item);
  });
}

export function openLocationModal(trigger = document.activeElement) {
  editingIds.location = null;
  [
    'locName',
    'locType',
    'locRegion',
    'locPopulation',
    'locDescription',
    'locRuler',
    'locInterests',
    'locHistory',
    'locTags',
  ].forEach((id) => (document.getElementById(id).value = ''));
  openModal('locationModal', trigger);
}

export function openItemModal(trigger = document.activeElement) {
  editingIds.item = null;
  [
    'itemName',
    'itemType',
    'itemRarity',
    'itemDescription',
    'itemProperties',
    'itemValue',
    'itemWeight',
    'itemHistory',
    'itemLocation',
  ].forEach((id) => (document.getElementById(id).value = ''));
  openModal('itemModal', trigger);
}

export function openLanguageModal(trigger = document.activeElement) {
  editingIds.language = null;
  [
    'langName',
    'langFamily',
    'langScript',
    'langSpeakers',
    'langPhonetics',
    'langGrammar',
    'langExamples',
  ].forEach((id) => (document.getElementById(id).value = ''));
  openModal('languageModal', trigger);
}

export function openEventModal(trigger = document.activeElement) {
  editingIds.event = null;
  [
    'eventName',
    'eventDate',
    'eventType',
    'eventLocation',
    'eventDescription',
    'eventCharacters',
    'eventConsequences',
    'eventImportance',
  ].forEach((id) => (document.getElementById(id).value = ''));
  openModal('eventModal', trigger);
}

export function openNoteModal(trigger = document.activeElement) {
  editingIds.note = null;
  ['noteTitle', 'noteCategory', 'noteContent', 'noteTags'].forEach(
    (id) => (document.getElementById(id).value = ''),
  );
  openModal('noteModal', trigger);
}

export function openFactionModal(trigger = document.activeElement) {
  editingIds.faction = null;
  document.getElementById('factionModalTitle').textContent = 'Nova Facção';
  ['factionName', 'factionDescription', 'factionTags'].forEach(
    (id) => (document.getElementById(id).value = ''),
  );
  const triggerEl = trigger.hasOwnProperty('target') ? trigger.target : trigger;
  const factionId = triggerEl.dataset.factionId;
  if (factionId) {
    editFaction(parseInt(factionId, 10), trigger);
  } else {
    openModal('factionModal', trigger);
  }
}

export async function saveLocation() {
  const location = {
    id: editingIds.location || Date.now(),
    name: document.getElementById('locName').value,
    type: document.getElementById('locType').value,
    region: document.getElementById('locRegion').value,
    population: document.getElementById('locPopulation').value,
    description: document.getElementById('locDescription').value,
    ruler: document.getElementById('locRuler').value,
    interests: document.getElementById('locInterests').value,
    history: document.getElementById('locHistory').value,
    tags: document
      .getElementById('locTags')
      .value.split(',')
      .map((t) => t.trim()),
  };

  if (editingIds.location) {
    const idx = projectData.locations.findIndex(
      (l) => l.id === editingIds.location,
    );
    if (idx !== -1) projectData.locations[idx] = location;
  } else {
    projectData.locations.push(location);
  }

  await saveProject();
  renderLocationList();
  closeModal('locationModal');
  console.log('Local salvo:', location);
}

export async function saveItem() {
  const item = {
    id: editingIds.item || Date.now(),
    name: document.getElementById('itemName').value,
    type: document.getElementById('itemType').value,
    rarity: document.getElementById('itemRarity').value,
    description: document.getElementById('itemDescription').value,
    properties: document.getElementById('itemProperties').value,
    value: document.getElementById('itemValue').value,
    weight: document.getElementById('itemWeight').value,
    history: document.getElementById('itemHistory').value,
    location: document.getElementById('itemLocation').value,
  };

  if (editingIds.item) {
    const idx = projectData.items.findIndex((i) => i.id === editingIds.item);
    if (idx !== -1) projectData.items[idx] = item;
  } else {
    projectData.items.push(item);
  }

  await saveProject();
  renderItemList();
  closeModal('itemModal');
  console.log('Item salvo:', item);
}

export async function saveLanguage() {
  const language = {
    id: editingIds.language || Date.now(),
    name: document.getElementById('langName').value,
    family: document.getElementById('langFamily').value,
    script: document.getElementById('langScript').value,
    speakers: document.getElementById('langSpeakers').value,
    phonetics: document.getElementById('langPhonetics').value,
    grammar: document.getElementById('langGrammar').value,
    examples: document.getElementById('langExamples').value,
  };

  if (editingIds.language) {
    const idx = projectData.languages.findIndex(
      (l) => l.id === editingIds.language,
    );
    if (idx !== -1) projectData.languages[idx] = language;
  } else {
    projectData.languages.push(language);
  }

  await saveProject();
  renderLanguageList();
  closeModal('languageModal');
  console.log('Língua salva:', language);
}

export async function saveEvent() {
  const event = {
    id: editingIds.event || Date.now(),
    name: document.getElementById('eventName').value,
    date: document.getElementById('eventDate').value,
    type: document.getElementById('eventType').value,
    location: document.getElementById('eventLocation').value,
    description: document.getElementById('eventDescription').value,
    characters: document
      .getElementById('eventCharacters')
      .value.split(',')
      .map((c) => c.trim()),
    consequences: document.getElementById('eventConsequences').value,
    importance: document.getElementById('eventImportance').value,
  };

  if (editingIds.event) {
    const idx = projectData.timeline.findIndex(
      (e) => e.id === editingIds.event,
    );
    if (idx !== -1) projectData.timeline[idx] = event;
  } else {
    projectData.timeline.push(event);
  }

  await saveProject();
  renderEventList();
  closeModal('eventModal');
  console.log('Evento salvo:', event);
}

export async function saveNote() {
  const note = {
    id: editingIds.note || Date.now(),
    title: document.getElementById('noteTitle').value,
    category: document.getElementById('noteCategory').value,
    content: document.getElementById('noteContent').value,
    tags: document
      .getElementById('noteTags')
      .value.split(',')
      .map((t) => t.trim()),
    createdAt: editingIds.note
      ? projectData.notes.find((n) => n.id === editingIds.note)?.createdAt ||
        new Date()
      : new Date(),
  };

  if (editingIds.note) {
    const idx = projectData.notes.findIndex((n) => n.id === editingIds.note);
    if (idx !== -1) projectData.notes[idx] = note;
  } else {
    projectData.notes.push(note);
  }

  await saveProject();
  renderNoteList();
  closeModal('noteModal');
  console.log('Nota salva:', note);
}

export async function saveFaction() {
  const nameInput = document.getElementById('factionName');
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.classList.add('is-invalid');
    return;
  }
  nameInput.classList.remove('is-invalid');

  const faction = {
    id: editingIds.faction || Date.now(),
    name: name,
    description: document.getElementById('factionDescription').value,
    tags: document
      .getElementById('factionTags')
      .value.split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  };

  if (editingIds.faction) {
    const idx = projectData.factions.findIndex(
      (f) => f.id === editingIds.faction,
    );
    if (idx !== -1) projectData.factions[idx] = faction;
  } else {
    projectData.factions.push(faction);
  }

  await saveProject();
  renderFactionList();
  closeModal('factionModal');
  editingIds.faction = null;
  console.log('Facção salva:', faction);
}

export function editLocation(id, trigger = document.activeElement) {
  const l = projectData.locations.find((loc) => loc.id === id);
  if (!l) return;
  editingIds.location = id;
  document.getElementById('locName').value = l.name || '';
  document.getElementById('locType').value = l.type || '';
  document.getElementById('locRegion').value = l.region || '';
  document.getElementById('locPopulation').value = l.population || '';
  document.getElementById('locDescription').value = l.description || '';
  document.getElementById('locRuler').value = l.ruler || '';
  document.getElementById('locInterests').value = l.interests || '';
  document.getElementById('locHistory').value = l.history || '';
  document.getElementById('locTags').value = (l.tags || []).join(', ');
  openModal('locationModal', trigger);
}

export async function deleteLocation(id) {
  projectData.locations = projectData.locations.filter((l) => l.id !== id);
  await saveProject();
  renderLocationList();
}

export function editItem(id, trigger = document.activeElement) {
  const i = projectData.items.find((it) => it.id === id);
  if (!i) return;
  editingIds.item = id;
  document.getElementById('itemName').value = i.name || '';
  document.getElementById('itemType').value = i.type || '';
  document.getElementById('itemRarity').value = i.rarity || '';
  document.getElementById('itemDescription').value = i.description || '';
  document.getElementById('itemProperties').value = i.properties || '';
  document.getElementById('itemValue').value = i.value || '';
  document.getElementById('itemWeight').value = i.weight || '';
  document.getElementById('itemHistory').value = i.history || '';
  document.getElementById('itemLocation').value = i.location || '';
  openModal('itemModal', trigger);
}

export async function deleteItem(id) {
  projectData.items = projectData.items.filter((i) => i.id !== id);
  await saveProject();
  renderItemList();
}

export function editLanguage(id, trigger = document.activeElement) {
  const l = projectData.languages.find((lang) => lang.id === id);
  if (!l) return;
  editingIds.language = id;
  document.getElementById('langName').value = l.name || '';
  document.getElementById('langFamily').value = l.family || '';
  document.getElementById('langScript').value = l.script || '';
  document.getElementById('langSpeakers').value = l.speakers || '';
  document.getElementById('langPhonetics').value = l.phonetics || '';
  document.getElementById('langGrammar').value = l.grammar || '';
  document.getElementById('langExamples').value = l.examples || '';
  openModal('languageModal', trigger);
}

export async function deleteLanguage(id) {
  projectData.languages = projectData.languages.filter((l) => l.id !== id);
  await saveProject();
  renderLanguageList();
}

export function editEvent(id, trigger = document.activeElement) {
  const e = projectData.timeline.find((ev) => ev.id === id);
  if (!e) return;
  editingIds.event = id;
  document.getElementById('eventName').value = e.name || '';
  document.getElementById('eventDate').value = e.date || '';
  document.getElementById('eventType').value = e.type || '';
  document.getElementById('eventLocation').value = e.location || '';
  document.getElementById('eventDescription').value = e.description || '';
  document.getElementById('eventCharacters').value = (e.characters || []).join(
    ', ',
  );
  document.getElementById('eventConsequences').value = e.consequences || '';
  document.getElementById('eventImportance').value = e.importance || '';
  openModal('eventModal', trigger);
}

export async function deleteEvent(id) {
  projectData.timeline = projectData.timeline.filter((e) => e.id !== id);
  await saveProject();
  renderEventList();
}

export function editNote(id, trigger = document.activeElement) {
  const n = projectData.notes.find((nt) => nt.id === id);
  if (!n) return;
  editingIds.note = id;
  document.getElementById('noteTitle').value = n.title || '';
  document.getElementById('noteCategory').value = n.category || '';
  document.getElementById('noteContent').value = n.content || '';
  document.getElementById('noteTags').value = (n.tags || []).join(', ');
  openModal('noteModal', trigger);
}

export async function deleteNote(id) {
  projectData.notes = projectData.notes.filter((n) => n.id !== id);
  await saveProject();
  renderNoteList();
}

export function editFaction(id, trigger = document.activeElement) {
  const faction = projectData.factions.find((f) => f.id === id);
  if (!faction) return;

  editingIds.faction = id;
  document.getElementById('factionModalTitle').textContent = 'Editar Facção';
  document.getElementById('factionName').value = faction.name || '';
  document.getElementById('factionDescription').value =
    faction.description || '';
  document.getElementById('factionTags').value = (faction.tags || []).join(
    ', ',
  );
  openModal('factionModal', trigger);
}

export async function deleteFaction(id) {
  projectData.factions = projectData.factions.filter((f) => f.id !== id);
  await saveProject();
  renderFactionList();
}
