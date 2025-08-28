import knex from 'knex';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DATABASE_URL, DATABASE_FILE } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = DATABASE_FILE || path.join(__dirname, '..', 'loreloom.db');

const config = DATABASE_URL
  ? { client: 'pg', connection: DATABASE_URL }
  : {
      client: 'sqlite3',
      connection: { filename: dbFile },
      useNullAsDefault: true,
    };

export default knex(config);
