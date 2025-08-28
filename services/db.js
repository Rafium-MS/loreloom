const db = require('./knex');
const cache = require('./cache');
const dataRepository = require('../repositories/dataRepository');

const CACHE_KEY = 'data';
let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

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
  const exists = await db.schema.hasTable('data_entries');
  if (!exists) {
    await db.schema.createTable('data_entries', table => {
      table.string('key').primary();
      table.text('json');
    });
  }
  initialized = true;
}

async function readData() {
  await ensureInit();
  const cached = cache.get(CACHE_KEY);
  if (cached) return cached;

  const rows = await dataRepository.getAll();
  if (!rows.length) {
    const defaults = getDefaultData();
    cache.set(CACHE_KEY, defaults);
    return defaults;
  }
  const data = {};
  for (const { key, json } of rows) {
    try {
      data[key] = JSON.parse(json);
    } catch {
      data[key] = null;
    }
  }
  if (!data.uiLanguage) data.uiLanguage = 'pt';
  cache.set(CACHE_KEY, data);
  return data;
}

async function writeData(data) {
  await ensureInit();
  const entries = Object.entries(data);
  for (const [key, value] of entries) {
    await dataRepository.upsert(key, value);
  }
  cache.del(CACHE_KEY);
}

async function destroy() {
  await db.destroy();
}

module.exports = { db, readData, writeData, init, destroy };
