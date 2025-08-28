const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { db, init, destroy } = require('../services/db');
const { createCharactersTable } = require('../services/schema');

const charactersRouter = require('../routes/characters');

test('characters routes', async t => {
  let server;
  let base;

  // Roda uma vez depois de todos os testes neste arquivo
  t.after(async () => {
    await destroy();
  });

  t.beforeEach(async () => {
    // Limpa e reinicializa o banco de dados para cada teste
    await db('characters').truncate();
    const app = express();
    app.use(express.json());
    app.use('/characters', charactersRouter);
    server = app.listen(0);
    base = `http://localhost:${server.address().port}`;
  });

  t.afterEach(() => {
    server.close();
  });

  // Inicializa o banco de dados uma vez antes de todos os testes
  await init();
  await createCharactersTable();

  await t.test('GET returns empty array initially', async () => {
    const res = await fetch(`${base}/characters`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.deepStrictEqual(json, []);
  });

  await t.test('POST rejects character with invalid name', async () => {
    const res = await fetch(`${base}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '  ' })
    });
    assert.equal(res.status, 400);
  });

  await t.test('POST creates a valid character', async () => {
    const characterData = { name: 'Gandalf', class: 'Wizard', tags: ['Istari'] };
    const res = await fetch(`${base}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(characterData)
    });

    assert.equal(res.status, 201);
    const newCharacter = await res.json();
    assert.equal(newCharacter.name, 'Gandalf');
    assert.ok(newCharacter.id);

    const getRes = await fetch(`${base}/characters`);
    const list = await getRes.json();
    assert.equal(list.length, 1);
    assert.equal(list[0].name, 'Gandalf');
    assert.deepStrictEqual(list[0].tags, ['Istari']);
  });
});
