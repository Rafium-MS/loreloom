const fs = require('fs');
const path = require('path');
const { db, readData, writeData, init: initDbService, destroy } = require('../services/db');

async function createCharactersTable() {
  const exists = await db.schema.hasTable('characters');
  if (!exists) {
    console.log('Creating "characters" table...');
    await db.schema.createTable('characters', table => {
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
    console.log('"characters" table created.');
  } else {
    console.log('"characters" table already exists.');
  }
}

async function migrateCharacters() {
  console.log('Starting character migration...');
  const data = await readData();

  if (!data.characters || data.characters.length === 0) {
    console.log('No characters in JSON blob to migrate.');
    return;
  }

  let migratedCount = 0;
  for (const character of data.characters) {
    // Use a more robust check, for example, based on name, assuming names are unique for now.
    const exists = await db('characters').where({ name: character.name }).first();
    if (!exists) {
      await db('characters').insert({
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
        tags: JSON.stringify(character.tags || [])
      });
      migratedCount++;
    }
  }

  if (migratedCount > 0) {
    console.log(`Successfully migrated ${migratedCount} characters.`);
  } else {
    console.log('All characters seem to be already migrated.');
  }
}

(async () => {
  try {
    // 1. Garante que a tabela `data` original exista
    await initDbService();

    // 2. Lida com a importação inicial do `data.json` se o banco de dados for novo
    const dataFile = path.join(__dirname, '..', 'data.json');
    const hasDataRow = await db('data').where({ id: 1 }).first();

    if (!hasDataRow && fs.existsSync(dataFile)) {
      console.log('Database is empty. Importing from data.json...');
      try {
        const raw = await fs.promises.readFile(dataFile, 'utf8');
        const initialData = JSON.parse(raw);
        await writeData(initialData);
        console.log('Loaded data.json for initial import.');
      } catch (err) {
        console.warn('Failed to load or parse data.json, using empty dataset.', err);
      }
    }

    // 3. Cria a nova tabela `characters`
    await createCharactersTable();

    // 4. Migra os dados da tabela antiga para a nova
    await migrateCharacters();

    console.log('Database initialization and migration complete.');
  } catch (err) {
    console.error('Failed to initialize or migrate database:', err);
    process.exit(1);
  } finally {
    // Usa a função destroy importada para fechar a conexão compartilhada
    await destroy();
    console.log('Database connection closed.');
  }
})();
