import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import rootRouter from '../routes/root.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
