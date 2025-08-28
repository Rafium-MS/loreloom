import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, '..', 'loreloom.db');

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

function importFresh(modulePath) {
  return import(`${modulePath}?${Date.now()}`);
}

test.beforeEach(() => {
  fs.rmSync(dbFile, { force: true });
});

test.afterEach(async () => {
  const { destroy } = await importFresh('../services/db.js');
  await destroy();
  fs.rmSync(dbFile, { force: true });
});

test('readData creates default structure when the database is empty', async () => {
  const { readData } = await importFresh('../services/db.js');
  const data = await readData();
  assert.deepStrictEqual(data, defaultData);
});


