const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { characterSchema, dataSchema, sanitizeCharacter, sanitizeData } = require('./validation');

const app = express();
const port = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
// Serve static assets from the dedicated public directory
app.use(express.static(path.join(__dirname, 'public')));

async function readData() {
  try {
    const data = JSON.parse(await fs.promises.readFile(DATA_FILE, 'utf8'));
    if (!data.uiLanguage) data.uiLanguage = 'pt';
    return data;
  } catch (err) {
    console.error('Failed to read data:', err);
    throw err;
  }
}

async function writeData(data) {
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write data:', err);
    throw err;
  }
}

app.post('/save', async (req, res) => {
  try {
    const { error, value } = dataSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: 'dados inválidos' });
    }
    const sanitized = sanitizeData(value);
    await writeData(sanitized);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.get('/load', async (_req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (err) {
    console.error('Error loading data:', err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.get('/data.json', (_req, res) => {
  res.sendFile(DATA_FILE);
});

app.get('/characters', async (_req, res) => {
  try {
    const data = await readData();
    res.json(data.characters || []);
  } catch (err) {
    console.error('Error loading characters:', err);
    res.status(500).json({ error: 'Failed to load characters' });
  }
});

app.post('/characters', async (req, res) => {
  try {
    const { error, value } = characterSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: 'dados inválidos' });
    }
    const data = await readData();
    data.characters.push(sanitizeCharacter(value));
    await writeData(data);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error saving character:', err);
    res.status(500).json({ error: 'Failed to save character' });
  }
});

app.get('/os', (_req, res) => {
  res.json({
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalmem: os.totalmem(),
    freemem: os.freemem(),
  });
});

// Fallback to the main HTML file
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loreloom.html'));
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
