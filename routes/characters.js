const express = require('express');
const { characterSchema } = require('../validation');
const { getAllCharacters, addCharacter } = require('../services/characters');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : undefined;
    const result = await getAllCharacters({ limit, cursor });
    res.json(result);
  } catch (err) {
    console.error('Error loading characters:', err);
    res.status(500).json({ error: 'Failed to load characters' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { error, value } = characterSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error);
    }

    const newCharacter = await addCharacter(value);
    res.status(201).json(newCharacter);
  } catch (err) {
    console.error('Error saving character:', err);
    res.status(500).json({ error: 'Failed to save character' });
  }
});

module.exports = router;
