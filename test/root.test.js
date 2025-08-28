const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

const rootRouter = require('../routes/root');

test('GET / returns loreloom.html', async () => {
  const app = express();
  app.use('/', rootRouter);
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;

  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  const text = await res.text();
  const expected = fs.readFileSync(
    path.join(__dirname, '..', 'public', 'loreloom.html'),
    'utf8',
  );
  assert.equal(text, expected);

  server.close();
});
