const fs = require('fs');
const path = require('path');
const { db, readData, writeData, init: initDbService, destroy } = require('../services/db');
const { createCharactersTable } = require('../services/schema');

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

        // Garante que nenhum personagem seja importado para o blob JSON antigo
        if (initialData.characters) {
          console.log('Ignoring "characters" array from data.json during import.');
          delete initialData.characters;
        }

        await writeData(initialData);
        console.log('Loaded data.json for initial import.');
      } catch (err) {
        console.warn('Failed to load or parse data.json, using empty dataset.', err);
      }
    }

    // 3. Cria a nova tabela `characters`
    await createCharactersTable();

    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Failed to initialize or migrate database:', err);
    process.exit(1);
  } finally {
    // Usa a função destroy importada para fechar a conexão compartilhada
    await destroy();
    console.log('Database connection closed.');
  }
})();
