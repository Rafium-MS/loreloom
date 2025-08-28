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

let cache = null;

function getDefaultData() {
  return {
    title: '',
    content: '',
    locations: [],
    items: [],
    languages: [],
    timeline: [],
    notes: [],
    economy: { currencies: [], resources: [], markets: [] },
    uiLanguage: 'pt',
  };
}

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
  if (cache) return cache;

  const row = await db('data').where({ id: 1 }).first();
  if (row && row.json) {
    try {
      const data = JSON.parse(row.json);
      if (!data.uiLanguage) data.uiLanguage = 'pt';
      cache = data;
      return data;
    } catch (err) {
      // fall through to defaults below
    }
  }

  cache = getDefaultData();
  return cache;
}

async function writeData(data) {
  const json = JSON.stringify(data);
  const exists = await db('data').where({ id: 1 }).first();
  if (exists) {
    await db('data').where({ id: 1 }).update({ json });
  } else {
    await db('data').insert({ id: 1, json });
  }
  cache = null;
}

async function destroy() {
  await db.destroy();
}

module.exports = { db, readData, writeData, init, destroy };
