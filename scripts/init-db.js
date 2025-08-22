const fs = require('fs');
const path = require('path');
const { init, writeData } = require('../services/db');

(async () => {
  try {
    await init();
    const dataFile = path.join(__dirname, '..', 'data.json');
    let initial = {
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
    if (fs.existsSync(dataFile)) {
      try {
        const raw = await fs.promises.readFile(dataFile, 'utf8');
        initial = JSON.parse(raw);
        console.log('Loaded data.json for initial import');
      } catch (err) {
        console.warn('Failed to load data.json, using empty dataset');
      }
    }
    await writeData(initial);
    console.log('Database initialized');
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
})();
