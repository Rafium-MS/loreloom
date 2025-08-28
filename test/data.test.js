import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

async function buildApp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'loreloom-'));
  const dbFile = path.join(dir, 'loreloom.db');
  fs.rmSync(dbFile, { force: true });
  process.env.DATABASE_FILE = dbFile;

  const app = express();
  app.use(express.json());
  const dataRouter = (await import(`../routes/data.js?${Date.now()}`)).default;
  app.use('/', dataRouter);
  const { destroy } = await import(`../services/db.js?${Date.now()}`);

  return { app, dir, destroy };
}

test('POST /save with invalid payload returns 400', async () => {
  const { app, dir, destroy } = await buildApp();
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;

  const res = await fetch(`${base}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 400);

  server.close();
  await destroy();
  fs.rmSync(dir, { recursive: true, force: true });
});


