const express = require('express');
const { characterSchema } = require('../validation');
const { getAllCharacters, addCharacter } = require('../services/characters');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const characters = await getAllCharacters();
    res.json(characters);
  } catch (err) {
    console.error('Error loading characters:', err);
    res.status(500).json({ error: 'Failed to load characters' });
  }
});

router.post('/', async (req, res) => {
  try {
    // A validação agora só precisa se preocupar com a estrutura do personagem
    const { error, value } = characterSchema.validate(req.body, { abortEarly: false });
    if (error) {
      // É uma boa prática retornar os detalhes do erro de validação
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error
      });
    }

    const newCharacter = await addCharacter(value);
    res.status(201).json(newCharacter); // Retorna 201 Created com o novo recurso
  } catch (err) {
    console.error('Error saving character:', err);
    res.status(500).json({ error: 'Failed to save character' });
  }
});

module.exports = router;
