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

    async function loadProject() {
      const res = await fetch('/load');
      projectData = await res.json();
      document.getElementById('mainText').value = projectData.content || '';
      document.getElementById('documentTitle').value = projectData.title || '';
      updateWordCount();
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
      document.getElementById('characterModal').classList.add('active');
    }

    function openLocationModal() {
      document.getElementById('locationModal').classList.add('active');
    }

    function openItemModal() {
      document.getElementById('itemModal').classList.add('active');
    }

    function openLanguageModal() {
      document.getElementById('languageModal').classList.add('active');
    }

    function openEventModal() {
      document.getElementById('eventModal').classList.add('active');
    }

    function openNoteModal() {
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
        id: Date.now(),
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
      
      projectData.characters.push(character);
      await fetch('/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character)
      });
      closeModal('characterModal');
      console.log('Personagem salvo:', character);
    }

    function saveLocation() {
      const location = {
        id: Date.now(),
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
      
      projectData.locations.push(location);
      closeModal('locationModal');
      console.log('Local salvo:', location);
    }

    function saveItem() {
      const item = {
        id: Date.now(),
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
      
      projectData.items.push(item);
      closeModal('itemModal');
      console.log('Item salvo:', item);
    }

    function saveLanguage() {
      const language = {
        id: Date.now(),
        name: document.getElementById('langName').value,
        family: document.getElementById('langFamily').value,
        script: document.getElementById('langScript').value,
        speakers: document.getElementById('langSpeakers').value,
        phonetics: document.getElementById('langPhonetics').value,
        grammar: document.getElementById('langGrammar').value,
        examples: document.getElementById('langExamples').value
      };
      
      projectData.languages.push(language);
      closeModal('languageModal');
      console.log('Língua salva:', language);
    }

    function saveEvent() {
      const event = {
        id: Date.now(),
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        type: document.getElementById('eventType').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        characters: document.getElementById('eventCharacters').value.split(',').map(c => c.trim()),
        consequences: document.getElementById('eventConsequences').value,
        importance: document.getElementById('eventImportance').value
      };
      
      projectData.timeline.push(event);
      closeModal('eventModal');
      console.log('Evento salvo:', event);
    }

    function saveNote() {
      const note = {
        id: Date.now(),
        title: document.getElementById('noteTitle').value,
        category: document.getElementById('noteCategory').value,
        content: document.getElementById('noteContent').value,
        tags: document.getElementById('noteTags').value.split(',').map(t => t.trim()),
        createdAt: new Date()
      };
      
      projectData.notes.push(note);
      closeModal('noteModal');
      console.log('Nota salva:', note);
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
