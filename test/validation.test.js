const test = require('node:test');
const assert = require('node:assert/strict');
const { characterSchema, sanitizeCharacter } = require('../validation');

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
