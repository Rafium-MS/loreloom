// Dados do projeto carregados do servidor
    let projectData = {
      title: "Projeto LoreLoom",
      content: "",
      characters: [],
      locations: [],
      items: [],
      languages: [],
      timeline: [],
      notes: [],
      economy: {
        currencies: [],
        resources: [],
        markets: []
      }
    };

    // IDs dos itens em edição para cada entidade
    const editingIds = {
      character: null,
      location: null,
      item: null,
      language: null,
      event: null,
      note: null
    };

    // Renderização das listas na interface
    function renderCharacterList() {
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

    function renderLocationList() {
      const list = document.getElementById('locationList');
      if (!list) return;
      list.innerHTML = '';
      projectData.locations.forEach(l => {
        const tags = (l.tags || []).map(t => `<div class="tag">${t}</div>`).join('');
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
          <div>
            <strong>${l.name}</strong>
            <div style="font-size: 0.9em; color: #64748b;">${[l.type, l.region].filter(Boolean).join(' • ')}</div>
            ${tags}
          </div>
          <div>
            <button class="btn" onclick="editLocation(${l.id})">Editar</button>
            <button class="btn btn-danger" onclick="deleteLocation(${l.id})">Excluir</button>
          </div>
        `;
        list.appendChild(item);
      });
    }

    function renderItemList() {
      const list = document.getElementById('itemList');
      if (!list) return;
      list.innerHTML = '';
      projectData.items.forEach(i => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
          <div>
            <strong>${i.name}</strong>
            <div style="font-size: 0.9em; color: #64748b;">${[i.type, i.rarity].filter(Boolean).join(' • ')}</div>
          </div>
          <div>
            <button class="btn" onclick="editItem(${i.id})">Editar</button>
            <button class="btn btn-danger" onclick="deleteItem(${i.id})">Excluir</button>
          </div>
        `;
        list.appendChild(item);
      });
    }

    function renderLanguageList() {
      const list = document.getElementById('languageList');
      if (!list) return;
      list.innerHTML = '';
      projectData.languages.forEach(l => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${l.name}</h3>
          <div style="font-size: 0.9em; color: #64748b;">${l.family || ''}</div>
          <div style="margin-top:8px;">
            <button class="btn" onclick="editLanguage(${l.id})">Editar</button>
            <button class="btn btn-danger" onclick="deleteLanguage(${l.id})">Excluir</button>
          </div>
        `;
        list.appendChild(card);
      });
    }

    function renderEventList() {
      const list = document.getElementById('eventList');
      if (!list) return;
      list.innerHTML = '';
      projectData.timeline.forEach(e => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.marginBottom = '12px';
        card.style.position = 'relative';
        card.innerHTML = `
          <div style="position: absolute; left: -26px; top: 16px; width: 12px; height: 12px; background: #3b82f6; border-radius: 50%;"></div>
          <strong>${e.date}</strong> - ${e.name}
          <div style="font-size: 0.9em; color: #64748b; margin-top: 4px;">${e.description || ''}</div>
          ${(e.importance ? `<div class="tag">${e.importance}</div>` : '')}
          <div style="margin-top: 8px;">
            <button class="btn" onclick="editEvent(${e.id})">Editar</button>
            <button class="btn btn-danger" onclick="deleteEvent(${e.id})">Excluir</button>
          </div>
        `;
        list.appendChild(card);
      });
    }

    function renderNoteList() {
      const list = document.getElementById('noteList');
      if (!list) return;
      list.innerHTML = '';
      projectData.notes.forEach(n => {
        const tags = (n.tags || []).map(t => `<div class="tag">${t}</div>`).join('');
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
            <button class="btn" onclick="editNote(${n.id})">Editar</button>
            <button class="btn btn-danger" onclick="deleteNote(${n.id})">Excluir</button>
          </div>
        `;
        list.appendChild(card);
      });
    }

    async function loadProject() {
      const res = await fetch('/load');
      projectData = await res.json();
      document.getElementById('mainText').value = projectData.content || '';
      document.getElementById('documentTitle').value = projectData.title || '';
      updateWordCount();
      renderCharacterList();
      renderLocationList();
      renderItemList();
      renderLanguageList();
      renderEventList();
      renderNoteList();
    }

    // Navegação entre painéis
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function() {
        // Remove active de todos os itens
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelectorAll('.content-panel').forEach(panel => panel.classList.remove('active'));
        
        // Adiciona active ao item clicado
        this.classList.add('active');
        const route = this.dataset.route;
        document.getElementById(route).classList.add('active');
        document.getElementById('crumb').textContent = this.textContent.trim();
      });
    });

    // Navegação por abas no painel Mundo
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', function() {
        if (this.closest('#world')) {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
          
          this.classList.add('active');
          const tabId = this.dataset.tab;
          document.getElementById(tabId).style.display = 'block';
        }
      });
    });

    // Funções para abrir modais
    function openCharacterModal() {
      editingIds.character = null;
      ['charName','charAge','charRace','charClass','charRole','charAppearance','charPersonality','charBackground','charSkills','charRelationships','charTags'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('characterModal').classList.add('active');
    }

    function openLocationModal() {
      editingIds.location = null;
      ['locName','locType','locRegion','locPopulation','locDescription','locRuler','locInterests','locHistory','locTags'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('locationModal').classList.add('active');
    }

    function openItemModal() {
      editingIds.item = null;
      ['itemName','itemType','itemRarity','itemDescription','itemProperties','itemValue','itemWeight','itemHistory','itemLocation'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('itemModal').classList.add('active');
    }

    function openLanguageModal() {
      editingIds.language = null;
      ['langName','langFamily','langScript','langSpeakers','langPhonetics','langGrammar','langExamples'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('languageModal').classList.add('active');
    }

    function openEventModal() {
      editingIds.event = null;
      ['eventName','eventDate','eventType','eventLocation','eventDescription','eventCharacters','eventConsequences','eventImportance'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('eventModal').classList.add('active');
    }

    function openNoteModal() {
      editingIds.note = null;
      ['noteTitle','noteCategory','noteContent','noteTags'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('noteModal').classList.add('active');
    }

    function closeModal(modalId) {
      document.getElementById(modalId).classList.remove('active');
    }

    // Fechar modal clicando fora
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          this.classList.remove('active');
        }
      });
    });

    // Funções de formatação de texto
    function formatText(command) {
      document.execCommand(command, false, null);
    }

    function insertReference() {
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

    function insertCharacterRef() {
      const textarea = document.getElementById('mainText');
      const start = textarea.selectionStart;
      textarea.value = textarea.value.substring(0, start) + 
                      '[personagem]' + 
                      textarea.value.substring(start);
      updateWordCount();
    }

    function insertLocationRef() {
      const textarea = document.getElementById('mainText');
      const start = textarea.selectionStart;
      textarea.value = textarea.value.substring(0, start) + 
                      '[local]' + 
                      textarea.value.substring(start);
      updateWordCount();
    }

    // Atualizar contador de palavras
    function updateWordCount() {
      const text = document.getElementById('mainText').value;
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const chars = text.length;
      const refs = (text.match(/\[([^\]]+)\]/g) || []).length;
      
      document.getElementById('wordCount').textContent = words;
      document.getElementById('charCount').textContent = chars;
      document.getElementById('refCount').textContent = refs;
    }

    // Event listener para o editor
    document.getElementById('mainText').addEventListener('input', updateWordCount);

    // Funções de salvamento (placeholder)
    async function saveProject() {
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

    async function saveCharacter() {
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

    async function saveLocation() {
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
        tags: document.getElementById('locTags').value.split(',').map(t => t.trim())
      };

      if (editingIds.location) {
        const idx = projectData.locations.findIndex(l => l.id === editingIds.location);
        if (idx !== -1) projectData.locations[idx] = location;
      } else {
        projectData.locations.push(location);
      }

      await saveProject();
      renderLocationList();
      closeModal('locationModal');
      console.log('Local salvo:', location);
    }

    async function saveItem() {
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
        location: document.getElementById('itemLocation').value
      };

      if (editingIds.item) {
        const idx = projectData.items.findIndex(i => i.id === editingIds.item);
        if (idx !== -1) projectData.items[idx] = item;
      } else {
        projectData.items.push(item);
      }

      await saveProject();
      renderItemList();
      closeModal('itemModal');
      console.log('Item salvo:', item);
    }

    async function saveLanguage() {
      const language = {
        id: editingIds.language || Date.now(),
        name: document.getElementById('langName').value,
        family: document.getElementById('langFamily').value,
        script: document.getElementById('langScript').value,
        speakers: document.getElementById('langSpeakers').value,
        phonetics: document.getElementById('langPhonetics').value,
        grammar: document.getElementById('langGrammar').value,
        examples: document.getElementById('langExamples').value
      };

      if (editingIds.language) {
        const idx = projectData.languages.findIndex(l => l.id === editingIds.language);
        if (idx !== -1) projectData.languages[idx] = language;
      } else {
        projectData.languages.push(language);
      }

      await saveProject();
      renderLanguageList();
      closeModal('languageModal');
      console.log('Língua salva:', language);
    }

    async function saveEvent() {
      const event = {
        id: editingIds.event || Date.now(),
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        type: document.getElementById('eventType').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        characters: document.getElementById('eventCharacters').value.split(',').map(c => c.trim()),
        consequences: document.getElementById('eventConsequences').value,
        importance: document.getElementById('eventImportance').value
      };

      if (editingIds.event) {
        const idx = projectData.timeline.findIndex(e => e.id === editingIds.event);
        if (idx !== -1) projectData.timeline[idx] = event;
      } else {
        projectData.timeline.push(event);
      }

      await saveProject();
      renderEventList();
      closeModal('eventModal');
      console.log('Evento salvo:', event);
    }

    async function saveNote() {
      const note = {
        id: editingIds.note || Date.now(),
        title: document.getElementById('noteTitle').value,
        category: document.getElementById('noteCategory').value,
        content: document.getElementById('noteContent').value,
        tags: document.getElementById('noteTags').value.split(',').map(t => t.trim()),
        createdAt: editingIds.note ? projectData.notes.find(n => n.id === editingIds.note)?.createdAt || new Date() : new Date()
      };

      if (editingIds.note) {
        const idx = projectData.notes.findIndex(n => n.id === editingIds.note);
        if (idx !== -1) projectData.notes[idx] = note;
      } else {
        projectData.notes.push(note);
      }

      await saveProject();
      renderNoteList();
      closeModal('noteModal');
      console.log('Nota salva:', note);
    }

    // Funções de edição e exclusão
    function editCharacter(id) {
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

    async function deleteCharacter(id) {
      projectData.characters = projectData.characters.filter(c => c.id !== id);
      await saveProject();
      renderCharacterList();
    }

    function editLocation(id) {
      const l = projectData.locations.find(loc => loc.id === id);
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
      document.getElementById('locationModal').classList.add('active');
    }

    async function deleteLocation(id) {
      projectData.locations = projectData.locations.filter(l => l.id !== id);
      await saveProject();
      renderLocationList();
    }

    function editItem(id) {
      const i = projectData.items.find(it => it.id === id);
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
      document.getElementById('itemModal').classList.add('active');
    }

    async function deleteItem(id) {
      projectData.items = projectData.items.filter(i => i.id !== id);
      await saveProject();
      renderItemList();
    }

    function editLanguage(id) {
      const l = projectData.languages.find(lang => lang.id === id);
      if (!l) return;
      editingIds.language = id;
      document.getElementById('langName').value = l.name || '';
      document.getElementById('langFamily').value = l.family || '';
      document.getElementById('langScript').value = l.script || '';
      document.getElementById('langSpeakers').value = l.speakers || '';
      document.getElementById('langPhonetics').value = l.phonetics || '';
      document.getElementById('langGrammar').value = l.grammar || '';
      document.getElementById('langExamples').value = l.examples || '';
      document.getElementById('languageModal').classList.add('active');
    }

    async function deleteLanguage(id) {
      projectData.languages = projectData.languages.filter(l => l.id !== id);
      await saveProject();
      renderLanguageList();
    }

    function editEvent(id) {
      const e = projectData.timeline.find(ev => ev.id === id);
      if (!e) return;
      editingIds.event = id;
      document.getElementById('eventName').value = e.name || '';
      document.getElementById('eventDate').value = e.date || '';
      document.getElementById('eventType').value = e.type || '';
      document.getElementById('eventLocation').value = e.location || '';
      document.getElementById('eventDescription').value = e.description || '';
      document.getElementById('eventCharacters').value = (e.characters || []).join(', ');
      document.getElementById('eventConsequences').value = e.consequences || '';
      document.getElementById('eventImportance').value = e.importance || '';
      document.getElementById('eventModal').classList.add('active');
    }

    async function deleteEvent(id) {
      projectData.timeline = projectData.timeline.filter(e => e.id !== id);
      await saveProject();
      renderEventList();
    }

    function editNote(id) {
      const n = projectData.notes.find(nt => nt.id === id);
      if (!n) return;
      editingIds.note = id;
      document.getElementById('noteTitle').value = n.title || '';
      document.getElementById('noteCategory').value = n.category || '';
      document.getElementById('noteContent').value = n.content || '';
      document.getElementById('noteTags').value = (n.tags || []).join(', ');
      document.getElementById('noteModal').classList.add('active');
    }

    async function deleteNote(id) {
      projectData.notes = projectData.notes.filter(n => n.id !== id);
      await saveProject();
      renderNoteList();
    }

    function checkConsistency() {
      alert('Função de verificação de consistência ainda não implementada.');
    }

    function exportProject() {
      const dataStr = JSON.stringify(projectData, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'projeto_loreloom.json';
      link.click();
    }

    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveProject();
      }
    });

    // Inicialização
    loadProject();
