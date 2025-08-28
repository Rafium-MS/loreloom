const express = require('express');
const os = require('os');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
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
  })
);

module.exports = router;
