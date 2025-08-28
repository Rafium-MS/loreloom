const characterRepository = require('../repositories/characterRepository');

async function getAllCharacters({ limit = 20, cursor } = {}) {
  const rows = await characterRepository.fetch({ limit: limit + 1, cursor });
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  return { items, nextCursor };
}

async function addCharacter(character) {
  return characterRepository.create(character);
}

module.exports = {
  getAllCharacters,
  addCharacter,
};
