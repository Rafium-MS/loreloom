import express from 'express';
import path from 'node:path';
import os from 'node:os';
import morgan from 'morgan';
import { fileURLToPath } from 'node:url';

import charactersRouter from './routes/characters.js';
import dataRouter from './routes/data.js';
import osRouter from './routes/os.js';
import rootRouter from './routes/root.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from the dedicated public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/characters', charactersRouter);
app.use('/os', osRouter);
app.use('/', dataRouter);
app.use('/', rootRouter);

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
  console.log('LoreLoom server running at:');
  console.log(`  Local:   http://localhost:${port}`);
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`  Network (${name}): http://${net.address}:${port}`);
      }
    }
  }
});
