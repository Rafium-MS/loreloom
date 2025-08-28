function asTrimmedString(value) {
  return String(value ?? '').trim();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sanitizeCharacter(data = {}) {
  const fields = [
    'name',
    'age',
    'race',
    'class',
    'role',
    'appearance',
    'personality',
    'background',
    'skills',
    'relationships'
  ];

  const normalized = {};
  fields.forEach(f => {
    normalized[f] = asTrimmedString(data[f]);
  });

  normalized.tags = Array.isArray(data?.tags)
    ? data.tags.map(t => asTrimmedString(t)).filter(Boolean)
    : [];

  return normalized;
}

function validateCharacter(data = {}) {
  const details = [];
  const normalized = sanitizeCharacter(data);

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

function sanitizeData(data = {}) {
  const arrayFields = ['locations', 'items', 'languages', 'timeline', 'notes'];
  const normalized = {
    title: asTrimmedString(data.title),
    content: asTrimmedString(data.content),
    uiLanguage: asTrimmedString(data.uiLanguage || 'pt'),
    economy: {
      currencies: Array.isArray(data.economy?.currencies)
        ? data.economy.currencies
        : [],
      resources: Array.isArray(data.economy?.resources)
        ? data.economy.resources
        : [],
      markets: Array.isArray(data.economy?.markets)
        ? data.economy.markets
        : []
    }
  };

  arrayFields.forEach(f => {
    normalized[f] = Array.isArray(data[f]) ? data[f] : [];
  });

  return normalized;
}

function validateData(data = {}) {
  const details = [];
  const normalized = sanitizeData(data);

  ['title', 'content'].forEach(field => {
    if (typeof data[field] !== 'string') {
      details.push({
        path: [field],
        type: 'string.base',
        message: `${capitalize(field)} must be a string`
      });
    }
  });

  const arrayFields = ['locations', 'items', 'languages', 'timeline', 'notes'];
  arrayFields.forEach(field => {
    if (!Array.isArray(data[field])) {
      details.push({
        path: [field],
        type: 'array.base',
        message: `${capitalize(field)} must be an array`
      });
    }
  });

  if (!data.economy || typeof data.economy !== 'object') {
    details.push({
      path: ['economy'],
      type: 'object.base',
      message: 'Economy must be an object'
    });
  } else {
    ['currencies', 'resources', 'markets'].forEach(field => {
      if (!Array.isArray(data.economy[field])) {
        details.push({
          path: ['economy', field],
          type: 'array.base',
          message: `${capitalize(field)} must be an array`
        });
      }
    });
  }

  if (typeof data.uiLanguage !== 'string') {
    details.push({
      path: ['uiLanguage'],
      type: 'string.base',
      message: 'UI Language must be a string'
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

const characterSchema = { validate: validateCharacter };
const dataSchema = { validate: validateData };

module.exports = { characterSchema, dataSchema, sanitizeCharacter };

