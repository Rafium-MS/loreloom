const test = require('node:test');
const assert = require('node:assert/strict');
const { characterSchema, dataSchema } = require('../validation');

test('characterSchema validates and sanitizes correctly on success', () => {
  const input = { name: '  Alice  ', tags: [' hero ', '  avenger'] };
  const { error, value } = characterSchema.validate(input);

  assert.equal(error, null);
  assert.deepStrictEqual(value, {
    name: 'Alice',
    age: '',
    race: '',
    class: '',
    role: '',
    appearance: '',
    personality: '',
    background: '',
    skills: '',
    relationships: '',
    tags: ['hero', 'avenger']
  });
});

test('characterSchema returns detailed error on failure', () => {
  const input = { name: '  ', tags: 'not-an-array' };
  const { error, value } = characterSchema.validate(input);

  assert.equal(value, undefined);
  assert.deepStrictEqual(error, {
    message: 'Validation failed',
    details: [
      { path: ['name'], type: 'string.empty', message: 'Character name is required' },
      { path: ['tags'], type: 'array.base', message: 'Tags must be an array' }
    ]
  });
});

test('dataSchema validates and sanitizes correctly on success', () => {
  const input = {
    title: '  My World  ',
    content: ' Lore... ',
    locations: [' Asgard '],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: ['Gold'], resources: [], markets: [] },
    uiLanguage: 'en-US'
  };
  const { error, value } = dataSchema.validate(input);

  assert.equal(error, null);
  assert.deepStrictEqual(value, {
    title: 'My World',
    content: 'Lore...',
    locations: [' Asgard '], // Note: sanitization for array elements not specified, so it remains as is.
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: ['Gold'], resources: [], markets: [] },
    uiLanguage: 'en-US'
  });
});

test('dataSchema returns detailed error on failure', () => {
  const input = { title: 123, locations: 'not-an-array' };
  const { error, value } = dataSchema.validate(input);

  assert.equal(value, undefined);
  assert.ok(error.message.includes('Validation failed'));
  assert.ok(error.details.some(d => d.path.includes('title') && d.type === 'string.base'));
  assert.ok(error.details.some(d => d.path.includes('locations') && d.type === 'array.base'));
});
