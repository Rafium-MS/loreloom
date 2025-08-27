const { db } = require('./db');
const { sanitizeCharacter } = require('../validation');

async function getAllCharacters() {
  const characters = await db('characters').select('*');
  // Deserializa as tags JSON para cada personagem
  return characters.map(c => ({
    ...c,
    tags: c.tags ? JSON.parse(c.tags) : []
  }));
}

async function addCharacter(character) {
  const sanitized = sanitizeCharacter(character);
  
  const newCharacter = {
    name: sanitized.name,
    age: sanitized.age,
    race: sanitized.race,
    class: sanitized.class,
    role: sanitized.role,
    appearance: sanitized.appearance,
    personality: sanitized.personality,
    background: sanitized.background,
    skills: sanitized.skills,
    relationships: sanitized.relationships,
    tags: JSON.stringify(sanitized.tags || [])
  };

  const [inserted] = await db('characters').insert(newCharacter).returning('*');
  return inserted;
}

module.exports = {
  getAllCharacters,
  addCharacter,
};
