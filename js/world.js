// world.js — stub de dados + import/export
const World = (() => {
  const data = {
    characters: [], locations: [], items: [], languages: [], events: [], notes: []
  };

  function add(type, name) {
    if (!name) return;
    (data[type] ||= []).push({ id: crypto.randomUUID(), name, createdAt: Date.now() });
    alert(`${type.slice(0,1).toUpperCase()+type.slice(1)} "${name}" criado! (stub)`);
  }

  function getData() { return JSON.parse(JSON.stringify(data)); }

  function setData(incoming = {}) {
    for (const k of Object.keys(data)) {
      if (Array.isArray(incoming[k])) data[k] = incoming[k];
    }
  }

  return {
    addCharacter: () => add("characters", prompt("Nome do personagem:")),
    addLocation:  () => add("locations",  prompt("Nome do local:")),
    addMerchant:  () => add("characters", prompt("Nome do comerciante:")),
    addItem:      () => add("items",      prompt("Nome do item:")),
    addLanguage:  () => add("languages",  prompt("Nome da língua:")),
    addEvent:     () => add("events",     prompt("Nome do evento:")),
    addNote:      () => add("notes",      prompt("Título da anotação:")),
    getData, setData,
  };
})();

export default World;
