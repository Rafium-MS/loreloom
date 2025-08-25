const knex = require('knex');
const path = require('path');

const config = process.env.DATABASE_URL
  ? { client: 'pg', connection: process.env.DATABASE_URL }
  : {
      client: 'sqlite3',
      connection: { filename: path.join(__dirname, '..', 'loreloom.db') },
      useNullAsDefault: true,
    };

const db = knex(config);

async function init() {
  const exists = await db.schema.hasTable('data');
  if (!exists) {
    await db.schema.createTable('data', table => {
      table.integer('id').primary();
      table.text('json');
    });
  }
}

async function readData() {
  await init();
  const row = await db('data').where({ id: 1 }).first();
  if (row && row.json) {
    const data = JSON.parse(row.json);
    if (!data.uiLanguage) data.uiLanguage = 'pt';
    return data;
  }
  return {
    title: '',
    content: '',
    characters: [],
    locations: [],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: [], resources: [], markets: [] },
    uiLanguage: 'pt'
  };
}

async function writeData(data) {
  await init();
  const json = JSON.stringify(data, null, 2);
  const exists = await db('data').where({ id: 1 }).first();
  if (exists) {
    await db('data').where({ id: 1 }).update({ json });
  } else {
    await db('data').insert({ id: 1, json });
  }
}

async function destroy() {
  await db.destroy();
}

module.exports = { readData, writeData, init, destroy };
