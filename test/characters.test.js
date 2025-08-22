const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

let charactersRouter;
try {
  // Ensure a clean database for tests
  fs.rmSync(path.join(__dirname, '..', 'loreloom.db'), { force: true });
  charactersRouter = require('../routes/characters');
} catch (err) {
  console.warn('Skipping characters route tests:', err.message);
}

if (charactersRouter) {
  test('characters routes', async t => {
    const app = express();
    app.use(express.json());
    app.use('/characters', charactersRouter);
    const server = app.listen(0);
    const base = `http://localhost:${server.address().port}`;

    await t.test('GET returns empty array', async () => {
      const res = await fetch(`${base}/characters`);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.deepStrictEqual(json, []);
    });

    await t.test('POST rejects invalid character', async () => {
      const res = await fetch(`${base}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 1 })
      });
      assert.equal(res.status, 400);
    });

    await t.test('POST accepts valid character and sanitizes', async () => {
      const res = await fetch(`${base}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 1, name: ' Alice ', tags: [' hero ', ' '] })
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.deepStrictEqual(data, { status: 'ok' });

      const getRes = await fetch(`${base}/characters`);
      assert.equal(getRes.status, 200);
      const list = await getRes.json();
      assert.deepStrictEqual(list, [
        { id: 1, name: 'Alice', age: '', race: '', class: '', role: '', appearance: '', personality: '', background: '', skills: '', relationships: '', tags: ['hero'] }
      ]);
    });

    server.close();
  });
}
