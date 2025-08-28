function validateCharacter(data) {
  const details = [];
  const normalized = {
    name: String(data.name || '').trim(),
    age: String(data.age || '').trim(),
    race: String(data.race || '').trim(),
    class: String(data.class || '').trim(),
    role: String(data.role || '').trim(),
    appearance: String(data.appearance || '').trim(),
    personality: String(data.personality || '').trim(),
    background: String(data.background || '').trim(),
    skills: String(data.skills || '').trim(),
    relationships: String(data.relationships || '').trim(),
    tags: Array.isArray(data.tags) ? data.tags.map(t => String(t).trim()).filter(Boolean) : []
  };

  if (!normalized.name) {
    details.push({
      path: ['name'],
      type: 'string.empty',
      message: 'Character name is required'
    });
  }

  if (data.tags && !Array.isArray(data.tags)) {
    details.push({
      path: ['tags'],
      type: 'array.base',
      message: 'Tags must be an array'
    });
  }

  if (details.length) {
    return {
      error: { message: 'Validation failed', details },
      value: undefined
    };
  }

  return { error: null, value: normalized };
}

function validateData(data) {
  const details = [];
  const normalized = {
    title: String(data.title || '').trim(),
    content: String(data.content || '').trim(),
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

  if (typeof data.title !== 'string') {
    details.push({ path: ['title'], type: 'string.base', message: 'Title must be a string' });
  }
  if (typeof data.content !== 'string') {
    details.push({ path: ['content'], type: 'string.base', message: 'Content must be a string' });
  }
  if (!Array.isArray(data.locations)) {
    details.push({ path: ['locations'], type: 'array.base', message: 'Locations must be an array' });
  }
  if (!Array.isArray(data.items)) {
    details.push({ path: ['items'], type: 'array.base', message: 'Items must be an array' });
  }
  if (!Array.isArray(data.languages)) {
    details.push({ path: ['languages'], type: 'array.base', message: 'Languages must be an array' });
  }
  if (!Array.isArray(data.timeline)) {
    details.push({ path: ['timeline'], type: 'array.base', message: 'Timeline must be an array' });
  }
  if (!Array.isArray(data.notes)) {
    details.push({ path: ['notes'], type: 'array.base', message: 'Notes must be an array' });
  }
  if (!data.economy || typeof data.economy !== 'object') {
    details.push({ path: ['economy'], type: 'object.base', message: 'Economy must be an object' });
  } else {
    if (!Array.isArray(data.economy.currencies)) {
      details.push({ path: ['economy', 'currencies'], type: 'array.base', message: 'Currencies must be an array' });
    }
    if (!Array.isArray(data.economy.resources)) {
      details.push({ path: ['economy', 'resources'], type: 'array.base', message: 'Resources must be an array' });
    }
    if (!Array.isArray(data.economy.markets)) {
      details.push({ path: ['economy', 'markets'], type: 'array.base', message: 'Markets must be an array' });
    }
  }
  if (typeof data.uiLanguage !== 'string') {
    details.push({ path: ['uiLanguage'], type: 'string.base', message: 'UI Language must be a string' });
  }

  if (details.length) {
    return {
      error: { message: 'Validation failed', details },
      value: undefined
    };
  }

  return { error: null, value: normalized };
}


const characterSchema = { validate: validateCharacter };
const dataSchema = { validate: validateData };

module.exports = { characterSchema, dataSchema };
