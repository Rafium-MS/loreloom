const db = require('../services/knex');

async function getAll() {
  return db('data_entries').select('key', 'json');
}

async function upsert(key, value) {
  const json = JSON.stringify(value);
  await db('data_entries')
    .insert({ key, json })
    .onConflict('key')
    .merge({ json });
}

module.exports = { getAll, upsert };
