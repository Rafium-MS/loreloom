const fs = require('fs');
const path = require('path');
const {
  db,
  writeData,
  init: initDbService,
  destroy,
} = require('../services/db');
const { createCharactersTable } = require('../services/schema');

(async () => {
  try {
    await initDbService();

    const dataFile = path.join(__dirname, '..', 'data.json');
    const hasDataRow = await db('data_entries').first();

    if (!hasDataRow && fs.existsSync(dataFile)) {
      console.log('Database is empty. Importing from data.json...');
      try {
        const raw = await fs.promises.readFile(dataFile, 'utf8');
        const initialData = JSON.parse(raw);
        if (initialData.characters) {
          console.log(
            'Ignoring "characters" array from data.json during import.',
          );
          delete initialData.characters;
        }
        await writeData(initialData);
        console.log('Loaded data.json for initial import.');
      } catch (err) {
        console.warn(
          'Failed to load or parse data.json, using empty dataset.',
          err,
        );
      }
    }

    await createCharactersTable();

    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Failed to initialize or migrate database:', err);
    process.exit(1);
  } finally {
    await destroy();
    console.log('Database connection closed.');
  }
})();
