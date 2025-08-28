const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dbFile = path.join(__dirname, '..', 'loreloom.db');
const dbModulePath = '../services/db';

// Estrutura de dados padrão sem 'characters'
const defaultData = {
  title: '',
  content: '',
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
  const { init, readData } = require(dbModulePath);
  await init(); // Inicializa o schema
  const data = await readData();
  assert.deepStrictEqual(data, defaultData);
});

test('writeData persists and readData retrieves the data', async () => {
  const { init, readData, writeData } = require(dbModulePath);
  await init(); // Inicializa o schema
  const payload = {
    title: 'Title',
    content: 'Content',
    // 'characters' foi removido deste payload
    locations: [{ id: 1, name: 'Location A' }],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: [], resources: [], markets: [] },
    uiLanguage: 'en'
  };

  await writeData(payload);
  const result = await readData();
  // Ajusta o resultado esperado para corresponder ao comportamento de readData
  const expectedResult = { ...payload, uiLanguage: 'en' };
  assert.deepStrictEqual(result, expectedResult);
});
