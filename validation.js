function validateCharacter(value) {
  const errors = [];
  if (!Number.isInteger(value.id)) errors.push('id');
  if (typeof value.name !== 'string' || !value.name.trim()) errors.push('name');
  if (value.tags && !Array.isArray(value.tags)) errors.push('tags');
  return errors.length ? { error: errors } : { value };
}

function validateData(value) {
  const errors = [];
  if (typeof value.title !== 'string') errors.push('title');
  if (typeof value.content !== 'string') errors.push('content');
  if (!Array.isArray(value.characters)) errors.push('characters');
  if (!Array.isArray(value.locations)) errors.push('locations');
  if (!Array.isArray(value.items)) errors.push('items');
  if (!Array.isArray(value.languages)) errors.push('languages');
  if (!Array.isArray(value.timeline)) errors.push('timeline');
  if (!Array.isArray(value.notes)) errors.push('notes');
  if (!value.economy || typeof value.economy !== 'object') {
    errors.push('economy');
  } else {
    if (!Array.isArray(value.economy.currencies)) errors.push('currencies');
    if (!Array.isArray(value.economy.resources)) errors.push('resources');
    if (!Array.isArray(value.economy.markets)) errors.push('markets');
  }
  if (typeof value.uiLanguage !== 'string') errors.push('uiLanguage');
  return errors.length ? { error: errors } : { value };
}

const characterSchema = { validate: validateCharacter };
const dataSchema = { validate: validateData };

function sanitizeCharacter(ch) {
  return {
    id: ch.id,
    name: (ch.name || '').trim(),
    age: (ch.age || '').trim(),
    race: (ch.race || '').trim(),
    class: (ch.class || '').trim(),
    role: (ch.role || '').trim(),
    appearance: (ch.appearance || '').trim(),
    personality: (ch.personality || '').trim(),
    background: (ch.background || '').trim(),
    skills: (ch.skills || '').trim(),
    relationships: (ch.relationships || '').trim(),
    tags: Array.isArray(ch.tags) ? ch.tags.map(t => t.trim()).filter(Boolean) : []
  };
}

function sanitizeData(data) {
  return {
    title: (data.title || '').trim(),
    content: (data.content || '').trim(),
    characters: Array.isArray(data.characters) ? data.characters.map(sanitizeCharacter) : [],
    locations: Array.isArray(data.locations) ? data.locations : [],
    items: Array.isArray(data.items) ? data.items : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    timeline: Array.isArray(data.timeline) ? data.timeline : [],
    notes: Array.isArray(data.notes) ? data.notes : [],
    economy: {
      currencies: Array.isArray(data.economy?.currencies) ? data.economy.currencies : [],
      resources: Array.isArray(data.economy?.resources) ? data.economy.resources : [],
      markets: Array.isArray(data.economy?.markets) ? data.economy.markets : []
    },
    uiLanguage: (data.uiLanguage || 'pt').trim()
  };
}

module.exports = { characterSchema, dataSchema, sanitizeCharacter, sanitizeData };
