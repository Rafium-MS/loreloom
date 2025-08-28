const knex = require('knex');
const path = require('path');

const dbFile = process.env.DATABASE_FILE || path.join(__dirname, '..', 'loreloom.db');

const config = process.env.DATABASE_URL
  ? { client: 'pg', connection: process.env.DATABASE_URL }
  : {
      client: 'sqlite3',
      connection: { filename: dbFile },
      useNullAsDefault: true,
    };

module.exports = knex(config);
