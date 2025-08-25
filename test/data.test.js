const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

function buildApp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'loreloom-'));
  const dbFile = path.join(dir, 'loreloom.db');
  fs.rmSync(dbFile, { force: true }); // ensure fresh DB per test

  delete require.cache[require.resolve('../routes/data')];
  delete require.cache[require.resolve('../services/db')];

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

  const dbModule = {
    async readData() {
      try {
        const content = await fs.promises.readFile(dbFile, 'utf8');
        const data = JSON.parse(content);
        if (!data.uiLanguage) data.uiLanguage = 'pt';
        return data;
      } catch {
        return defaultData;
      }
    },
    async writeData(data) {
      await fs.promises.writeFile(dbFile, JSON.stringify(data, null, 2));
    },
    init: async () => {}
  };

  require.cache[require.resolve('../services/db')] = { exports: dbModule };

  const app = express();
  app.use(express.json());
  const router = require('../routes/data');
  app.use('/', router);
  return app;
}

test('POST /save with invalid payload returns 400', async () => {
  const app = buildApp();
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;

  const res = await fetch(`${base}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.equal(res.status, 400);

  server.close();
});

test('POST /save persists sanitized data and GET endpoints return it', async () => {
  const app = buildApp();
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;

  const payload = {
    title: '  T1  ',
    content: '  story  ',
    characters: [],
    locations: [],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: [], resources: [], markets: [] },
    uiLanguage: ' en '
  };

  const postRes = await fetch(`${base}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  assert.equal(postRes.status, 200);
  assert.deepStrictEqual(await postRes.json(), { status: 'ok' });

  const expected = {
    title: 'T1',
    content: 'story',
    characters: [],
    locations: [],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: [], resources: [], markets: [] },
    uiLanguage: 'en'
  };

  const loadRes = await fetch(`${base}/load`);
  assert.equal(loadRes.status, 200);
  const loadJson = await loadRes.json();
  assert.deepStrictEqual(loadJson, expected);

  const jsonRes = await fetch(`${base}/data.json`);
  assert.equal(jsonRes.status, 200);
  const json = await jsonRes.json();
  assert.deepStrictEqual(json, expected);

  server.close();
});
