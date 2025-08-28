const { db } = require('./db');

async function getAllCharacters() {
  const characters = await db('characters').select('*');
  // Deserializa as tags JSON para cada personagem
  return characters.map(c => ({
    ...c,
    tags: c.tags ? JSON.parse(c.tags) : []
  }));
}

async function addCharacter(character) {
  const newCharacter = {
    name: character.name,
    age: character.age,
    race: character.race,
    class: character.class,
    role: character.role,
    appearance: character.appearance,
    personality: character.personality,
    background: character.background,
    skills: character.skills,
    relationships: character.relationships,
    tags: JSON.stringify(character.tags || [])
  };

  const [inserted] = await db('characters').insert(newCharacter).returning('*');
  return inserted;
}

module.exports = {
  getAllCharacters,
  addCharacter,
};
