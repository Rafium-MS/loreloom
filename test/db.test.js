const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dbFile = path.join(__dirname, '..', 'loreloom.db');
const dbModulePath = '../services/db';
const knexModulePath = '../services/knex';
const dataRepoPath = '../repositories/dataRepository';

const defaultData = {
  title: '',
  content: '',
  locations: [],
  items: [],
  languages: [],
  timeline: [],
  notes: [],
  economy: { currencies: [], resources: [], markets: [] },
  uiLanguage: 'pt',
};

function clearCaches() {
  delete require.cache[require.resolve(dbModulePath)];
  delete require.cache[require.resolve(knexModulePath)];
  delete require.cache[require.resolve(dataRepoPath)];
}

test.beforeEach(() => {
  fs.rmSync(dbFile, { force: true });
  clearCaches();
});

test.afterEach(async () => {
  const { destroy } = require(dbModulePath);
  await destroy();
  fs.rmSync(dbFile, { force: true });
  clearCaches();
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
    locations: [{ id: 1, name: 'Location A' }],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: [], resources: [], markets: [] },
    uiLanguage: 'en',
  };

  await writeData(payload);
  const result = await readData();
  const expectedResult = { ...payload, uiLanguage: 'en' };
  assert.deepStrictEqual(result, expectedResult);
});
