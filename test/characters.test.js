import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// Setup temporary database
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'loreloom-char-'));
process.env.DATABASE_FILE = path.join(dir, 'test.db');

const { db, init, destroy } = await import('../services/db.js');
const { createCharactersTable } = await import('../services/schema.js');
const charactersRouter = (await import('../routes/characters.js')).default;

await init();
await createCharactersTable();

test('characters routes', async (t) => {
  let server;
  let base;

  t.after(async () => {
    await destroy();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  t.beforeEach(() => {
    return db('characters')
      .truncate()
      .then(() => {
        const app = express();
        app.use(express.json());
        app.use('/characters', charactersRouter);
        server = app.listen(0);
        base = `http://localhost:${server.address().port}`;
      });
  });

  t.afterEach(() => new Promise((resolve) => server.close(resolve)));

  await t.test('GET returns empty result initially', async () => {
    const res = await fetch(`${base}/characters`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.deepStrictEqual(json, { items: [], nextCursor: null });
  });

  await t.test('POST rejects character with invalid name', async () => {
    const res = await fetch(`${base}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '  ' }),
    });
    assert.equal(res.status, 400);
  });

  await t.test('POST creates a valid character', async () => {
    const characterData = {
      name: 'Gandalf',
      class: 'Wizard',
      tags: ['Istari'],
    };
    const res = await fetch(`${base}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(characterData),
    });

    assert.equal(res.status, 201);
    const newCharacter = await res.json();
    assert.equal(newCharacter.name, 'Gandalf');
    assert.ok(newCharacter.id);

    const getRes = await fetch(`${base}/characters`);
    const list = await getRes.json();
    assert.equal(list.items.length, 1);
    assert.equal(list.items[0].name, 'Gandalf');
    assert.deepStrictEqual(list.items[0].tags, ['Istari']);
  });
});
