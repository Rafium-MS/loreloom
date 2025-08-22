const express = require('express');
const { dataSchema, sanitizeData } = require('../validation');
const { readData, writeData } = require('../services/db');

const router = express.Router();

router.post('/save', async (req, res) => {
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

router.get('/load', async (_req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (err) {
    console.error('Error loading data:', err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

router.get('/data.json', async (_req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (err) {
    console.error('Error loading data:', err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

module.exports = router;
