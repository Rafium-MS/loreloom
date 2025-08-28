import db from '../services/knex.js';

export async function getAll() {
  return db('data_entries').select('key', 'json');
}

export async function upsert(key, value) {
  const json = JSON.stringify(value);
  await db('data_entries')
    .insert({ key, json })
    .onConflict('key')
    .merge({ json });
}
