const express = require('express');
const { characterSchema, sanitizeCharacter } = require('../validation');
const { readData, writeData } = require('../services/data');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const data = await readData();
    res.json(data.characters || []);
  } catch (err) {
    console.error('Error loading characters:', err);
    res.status(500).json({ error: 'Failed to load characters' });
  }
});

router.post('/', async (req, res) => {
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

module.exports = router;
