const test = require('node:test');
const assert = require('node:assert/strict');
const {
  characterSchema,
  dataSchema,
  sanitizeCharacter,
  sanitizeData,
} = require('../validation');

test('sanitizeCharacter trims fields and tags', () => {
  const input = {
    id: 1,
    name: '  Alice  ',
    age: ' 20 ',
    race: ' human ',
    class: ' warrior ',
    role: ' hero ',
    appearance: ' tall ',
    personality: ' brave ',
    background: ' unknown ',
    skills: ' swordsmanship ',
    relationships: ' none ',
    tags: [' friend ', ' hero ']
  };
  const expected = {
    id: 1,
    name: 'Alice',
    age: '20',
    race: 'human',
    class: 'warrior',
    role: 'hero',
    appearance: 'tall',
    personality: 'brave',
    background: 'unknown',
    skills: 'swordsmanship',
    relationships: 'none',
    tags: ['friend', 'hero']
  };
  const result = sanitizeCharacter(input);
  assert.deepStrictEqual(result, expected);
});

test('characterSchema requires name', () => {
  const { error } = characterSchema.validate({ id: 1 });
  assert.ok(error);
});

test('sanitizeData trims fields and structures arrays/objects', () => {
  const input = {
    title: '  My World  ',
    content: '  Lore  ',
    characters: [
      { id: 1, name: '  Alice  ', tags: [' friend ', ' hero '] },
    ],
    locations: ['Town'],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: ['coin'], resources: [], markets: [] },
    uiLanguage: ' pt ',
  };

  const expected = {
    title: 'My World',
    content: 'Lore',
    characters: [
      {
        id: 1,
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
        tags: ['friend', 'hero'],
      },
    ],
    locations: ['Town'],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: ['coin'], resources: [], markets: [] },
    uiLanguage: 'pt',
  };

  const result = sanitizeData(input);
  assert.deepStrictEqual(result, expected);
});

test('sanitizeData defaults non-array fields to empty arrays', () => {
  const input = {
    title: 'Title',
    content: '',
    characters: 'not array',
    locations: 'not array',
    items: 'not array',
    languages: 'not array',
    timeline: 'not array',
    notes: 'not array',
    economy: { currencies: 'not array', resources: 'not array', markets: 'not array' },
    uiLanguage: 'en',
  };

  const expected = {
    title: 'Title',
    content: '',
    characters: [],
    locations: [],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: [], resources: [], markets: [] },
    uiLanguage: 'en',
  };

  const result = sanitizeData(input);
  assert.deepStrictEqual(result, expected);
});

test('dataSchema.validate passes with complete data', () => {
  const valid = {
    title: 'World',
    content: 'Lore',
    characters: [],
    locations: [],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: [], resources: [], markets: [] },
    uiLanguage: 'en',
  };

  const { error } = dataSchema.validate(valid);
  assert.equal(error, undefined);
});

test('dataSchema.validate detects missing required fields', () => {
  const { error } = dataSchema.validate({});
  assert.deepStrictEqual(error, [
    'title',
    'content',
    'characters',
    'locations',
    'items',
    'languages',
    'timeline',
    'notes',
    'economy',
    'uiLanguage',
  ]);
});
