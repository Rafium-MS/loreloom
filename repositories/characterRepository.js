import db from '../services/knex.js';

function mapRow(row) {
  return { ...row, tags: row.tags ? JSON.parse(row.tags) : [] };
}

function toDb(character) {
  return {
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
    tags: JSON.stringify(character.tags || []),
  };
}

export async function fetch({ limit, cursor }) {
  const query = db('characters').select('*').orderBy('id', 'asc');
  if (cursor) query.where('id', '>', cursor);
  if (limit) query.limit(limit);
  const rows = await query;
  return rows.map(mapRow);
}

export async function create(character) {
  const [row] = await db('characters').insert(toDb(character)).returning('*');
  return mapRow(row);
}
