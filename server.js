const express = require('express');
const path = require('path');
const os = require('os');

const charactersRouter = require('./routes/characters');
const dataRouter = require('./routes/data');
const osRouter = require('./routes/os');
const rootRouter = require('./routes/root');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// Serve static assets from the dedicated public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/characters', charactersRouter);
app.use('/os', osRouter);
app.use('/', dataRouter);
app.use('/', rootRouter);

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
