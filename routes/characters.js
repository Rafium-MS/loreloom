const express = require('express');
const { characterSchema } = require('../validation/character');
const { getAllCharacters, addCharacter } = require('../services/characters');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 20;
    const cursor = req.query.cursor
      ? parseInt(req.query.cursor, 10)
      : undefined;
    const result = await getAllCharacters({ limit, cursor });
    res.json(result);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { error, value } = characterSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error);
    }

    const newCharacter = await addCharacter(value);
    res.status(201).json(newCharacter);
  }),
);

module.exports = router;
