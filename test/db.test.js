const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dbFile = path.join(__dirname, '..', 'loreloom.db');
const dbModulePath = '../services/db';

const defaultData = {
  title: '',
  content: '',
  characters: [],
  locations: [],
  items: [],
  languages: [],
  timeline: [],
  notes: [],
  economy: { currencies: [], resources: [], markets: [] },
  uiLanguage: 'pt'
};

test.beforeEach(() => {
  fs.rmSync(dbFile, { force: true });
  delete require.cache[require.resolve(dbModulePath)];
});

test.afterEach(async () => {
  const { destroy } = require(dbModulePath);
  await destroy();
  fs.rmSync(dbFile, { force: true });
  delete require.cache[require.resolve(dbModulePath)];
});

test('readData creates default structure when the database is empty', async () => {
  const { readData } = require(dbModulePath);
  const data = await readData();
  assert.deepStrictEqual(data, defaultData);
});

test('writeData persists and readData retrieves the data', async () => {
  const { readData, writeData } = require(dbModulePath);
  const payload = {
    title: 'Title',
    content: 'Content',
    characters: [{ id: 1, name: 'Alice' }],
    locations: [],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: [], resources: [], markets: [] },
    uiLanguage: 'pt'
  };

  await writeData(payload);
  const result = await readData();
  assert.deepStrictEqual(result, payload);
});
