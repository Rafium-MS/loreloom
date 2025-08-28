const { db } = require('./db');

async function createCharactersTable() {
  const exists = await db.schema.hasTable('characters');
  if (!exists) {
    await db.schema.createTable('characters', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('age');
      table.string('race');
      table.string('class');
      table.string('role');
      table.text('appearance');
      table.text('personality');
      table.text('background');
      table.text('skills');
      table.text('relationships');
      table.json('tags');
      table.timestamps(true, true);
    });
  }
}

module.exports = { createCharactersTable };
