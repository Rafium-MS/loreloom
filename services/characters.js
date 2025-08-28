import * as characterRepository from '../repositories/characterRepository.js';

export async function getAllCharacters({ limit = 20, cursor } = {}) {
  const rows = await characterRepository.fetch({ limit: limit + 1, cursor });
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  return { items, nextCursor };
}

export async function addCharacter(character) {
  return characterRepository.create(character);
}
