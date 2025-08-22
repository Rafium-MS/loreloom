const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

async function readData() {
  try {
    const data = JSON.parse(await fs.promises.readFile(DATA_FILE, 'utf8'));
    if (!data.uiLanguage) data.uiLanguage = 'pt';
    return data;
  } catch (err) {
    console.error('Failed to read data:', err);
    throw err;
  }
}

async function writeData(data) {
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write data:', err);
    throw err;
  }
}

module.exports = { readData, writeData, DATA_FILE };
