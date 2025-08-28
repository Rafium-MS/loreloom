import knex from 'knex';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile =
  process.env.DATABASE_FILE || path.join(__dirname, '..', 'loreloom.db');

const config = process.env.DATABASE_URL
  ? { client: 'pg', connection: process.env.DATABASE_URL }
  : {
      client: 'sqlite3',
      connection: { filename: dbFile },
      useNullAsDefault: true,
    };

export default knex(config);
