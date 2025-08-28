const { asTrimmedString } = require('./utils');

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

const characterSchema = { validate: validateCharacter };

module.exports = { characterSchema, sanitizeCharacter };
