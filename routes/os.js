const express = require('express');
const os = require('os');

const router = express.Router();

router.get('/', (_req, res) => {
  const nets = os.networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.push({ name, address: net.address });
      }
    }
  }

  res.json(results);
});

module.exports = router;
