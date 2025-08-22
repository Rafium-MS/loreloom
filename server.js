const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
// Serve static assets from the repository root
app.use(express.static(__dirname));

function readData() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!data.uiLanguage) data.uiLanguage = 'pt';
    return data;
  } catch {
    return {
      title: 'Projeto LoreLoom',
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
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post('/save', (req, res) => {
  writeData(req.body);
  res.json({ status: 'ok' });
});

app.get('/load', (_req, res) => {
  res.json(readData());
});

app.get('/characters', (_req, res) => {
  const data = readData();
  res.json(data.characters || []);
});

app.post('/characters', (req, res) => {
  const data = readData();
  data.characters.push(req.body);
  writeData(data);
  res.json({ status: 'ok' });
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
  res.sendFile(path.join(__dirname, 'loreloom.html'));
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
