import initSqlJs from 'sql.js';
// Ensure Vite resolves the WebAssembly file correctly
// The `?url` makes Vite treat the wasm as an asset and returns its URL
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

const DB_NAME = 'loreloom_db';
const DB_STORE_NAME = 'loreloom_store';

let dbPromise: Promise<any> | null = null;

// Opens the IndexedDB and returns a promise that resolves with the IDBDatabase instance
function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('IndexedDB is not supported in this environment.'));
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(DB_STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Loads the database from IndexedDB
async function loadDB(SQL: any) {
  const idb = await openDB();
  return new Promise<any>((resolve, reject) => {
    const transaction = idb.transaction(DB_STORE_NAME, 'readonly');
    const store = transaction.objectStore(DB_STORE_NAME);
    const getRequest = store.get(DB_NAME);
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      const db = data ? new SQL.Database(data) : new SQL.Database();
      // Ensure all tables exist. The conflicted code was missing some.
      db.run('CREATE TABLE IF NOT EXISTS characters (id INTEGER PRIMARY KEY, name TEXT, description TEXT, role TEXT);');
      db.run('CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY, name TEXT, description TEXT, type TEXT);');
      db.run('CREATE TABLE IF NOT EXISTS economies (id INTEGER PRIMARY KEY, name TEXT, currency TEXT, markets TEXT, mainExports TEXT);');
      db.run('CREATE TABLE IF NOT EXISTS religions (id INTEGER PRIMARY KEY, name TEXT, doctrine TEXT, factions TEXT);');
      db.run('CREATE TABLE IF NOT EXISTS timelines (id INTEGER PRIMARY KEY, title TEXT, date TEXT, description TEXT, relations TEXT);');
      db.run('CREATE TABLE IF NOT EXISTS languages (id INTEGER PRIMARY KEY, name TEXT, vocabulary TEXT, grammar TEXT, syllables TEXT);');
      db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, passwordHash TEXT, role TEXT);');
      db.run('CREATE TABLE IF NOT EXISTS character_location (character_id INTEGER, location_id INTEGER);');
      db.run('CREATE TABLE IF NOT EXISTS character_religion (character_id INTEGER, religion_id INTEGER);');
      resolve(db);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

// Saves the database to IndexedDB
async function saveDB(db: any) {
  const idb = await openDB();
  const data = db.export();
  const transaction = idb.transaction(DB_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(DB_STORE_NAME);
  store.put(data, DB_NAME);
}

async function getDB() {
  if (!dbPromise) {
    dbPromise = initSqlJs({ locateFile: () => sqlWasmUrl }).then(loadDB);
  }
  return dbPromise;
}

export async function getCharacters() {
  const db = await getDB();
  const res: any[] = [];
  const stmt = db.prepare('SELECT * FROM characters');
  while (stmt.step()) {
    res.push(stmt.getAsObject());
  }
  stmt.free();
  return res;
}

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

export async function getUsers(): Promise<UserRecord[]> {
  const db = await getDB();
  const res: UserRecord[] = [];
  const stmt = db.prepare('SELECT id, name, email, passwordHash, role FROM users');
  while (stmt.step()) {
    const row = stmt.getAsObject();
    res.push({
      id: Number(row.id ?? 0),
      name: String(row.name ?? ''),
      email: String(row.email ?? ''),
      passwordHash: String(row.passwordHash ?? ''),
      role: String(row.role ?? ''),
    });
  }
  stmt.free();
  return res;
}

export async function saveUser(user: UserRecord) {
  const db = await getDB();
  db.run('INSERT OR REPLACE INTO users (id, name, email, passwordHash, role) VALUES (?, ?, ?, ?, ?)', [
    user.id,
    user.name,
    user.email,
    user.passwordHash,
    user.role,
  ]);
  await saveDB(db);
}

export async function removeUser(id: number) {
  const db = await getDB();
  db.run('DELETE FROM users WHERE id = ?', [id]);
  await saveDB(db);
}

export async function saveCharacter(char: {id: number; name: string; description: string; role: string;}) {
  const db = await getDB();
  db.run('INSERT OR REPLACE INTO characters (id, name, description, role) VALUES (?, ?, ?, ?)', [char.id, char.name, char.description, char.role]);
  await saveDB(db);
}

export async function removeCharacter(id: number) {
  const db = await getDB();
  db.run('DELETE FROM characters WHERE id = ?', [id]);
  // The conflicted code had a bug, it should clean up all related tables.
  db.run('DELETE FROM character_location WHERE character_id = ?', [id]);
  db.run('DELETE FROM character_religion WHERE character_id = ?', [id]);
  await saveDB(db);
}

export async function getCharacterLocations(characterId: number) {
  const db = await getDB();
  const res: number[] = [];
  const stmt = db.prepare('SELECT location_id FROM character_location WHERE character_id = ?');
  stmt.bind([characterId]);
  while (stmt.step()) {
    res.push(stmt.get()[0] as number);
  }
  stmt.free();
  return res;
}

export async function getLocationCharacters(locationId: number) {
  const db = await getDB();
  const res: number[] = [];
  const stmt = db.prepare('SELECT character_id FROM character_location WHERE location_id = ?');
  stmt.bind([locationId]);
  while (stmt.step()) {
    res.push(stmt.get()[0] as number);
  }
  stmt.free();
  return res;
}

export async function linkCharacterToLocation(characterId: number, locationId: number) {
  const db = await getDB();
  db.run('INSERT OR IGNORE INTO character_location (character_id, location_id) VALUES (?, ?)', [characterId, locationId]);
  await saveDB(db);
}

export async function unlinkCharacterFromLocation(characterId: number, locationId: number) {
  const db = await getDB();
  db.run('DELETE FROM character_location WHERE character_id = ? AND location_id = ?', [characterId, locationId]);
  await saveDB(db);
}

export async function getLocations() {
  const db = await getDB();
  const res: any[] = [];
  const stmt = db.prepare('SELECT * FROM locations');
  while (stmt.step()) {
    res.push(stmt.getAsObject());
  }
  stmt.free();
  return res;
}

export async function saveLocation(loc: {id: number; name: string; description: string; type: string;}) {
  const db = await getDB();
  db.run('INSERT OR REPLACE INTO locations (id, name, description, type) VALUES (?, ?, ?, ?)', [loc.id, loc.name, loc.description, loc.type]);
  await saveDB(db);
}

export async function removeLocation(id: number) {
  const db = await getDB();
  db.run('DELETE FROM locations WHERE id = ?', [id]);
  // Clean up related data
  db.run('DELETE FROM character_location WHERE location_id = ?', [id]);
  await saveDB(db);
}

export async function getEconomies() {
  const db = await getDB();
  const res: any[] = [];
  const stmt = db.prepare('SELECT * FROM economies');
  while (stmt.step()) {
    res.push(stmt.getAsObject());
  }
  stmt.free();
  return res;
}

export async function saveEconomy(econ: {id: number; name: string; currency: string; markets: string; mainExports: string;}) {
  const db = await getDB();
  db.run('INSERT OR REPLACE INTO economies (id, name, currency, markets, mainExports) VALUES (?, ?, ?, ?, ?)', [econ.id, econ.name, econ.currency, econ.markets, econ.mainExports]);
  await saveDB(db);
}

export async function removeEconomy(id: number) {
  const db = await getDB();
  db.run('DELETE FROM economies WHERE id = ?', [id]);
  await saveDB(db);
}

export async function getReligions() {
  const db = await getDB();
  const res: any[] = [];
  const stmt = db.prepare('SELECT * FROM religions');
  while (stmt.step()) {
    res.push(stmt.getAsObject());
  }
  stmt.free();
  return res;
}

export async function saveReligion(rel: {id: number; name: string; doctrine: string; factions: string;}) {
  const db = await getDB();
  db.run('INSERT OR REPLACE INTO religions (id, name, doctrine, factions) VALUES (?, ?, ?, ?)', [rel.id, rel.name, rel.doctrine, rel.factions]);
  await saveDB(db);
}

export async function removeReligion(id: number) {
  const db = await getDB();
  db.run('DELETE FROM religions WHERE id = ?', [id]);
  // Clean up related data
  db.run('DELETE FROM character_religion WHERE religion_id = ?', [id]);
  await saveDB(db);
}

export async function getCharacterReligions(characterId: number) {
  const db = await getDB();
  const res: number[] = [];
  const stmt = db.prepare('SELECT religion_id FROM character_religion WHERE character_id = ?');
  stmt.bind([characterId]);
  while (stmt.step()) {
    res.push(stmt.get()[0] as number);
  }
  stmt.free();
  return res;
}

export async function getReligionCharacters(religionId: number) {
  const db = await getDB();
  const res: number[] = [];
  const stmt = db.prepare('SELECT character_id FROM character_religion WHERE religion_id = ?');
  stmt.bind([religionId]);
  while (stmt.step()) {
    res.push(stmt.get()[0] as number);
  }
  stmt.free();
  return res;
}

export async function linkCharacterToReligion(characterId: number, religionId: number) {
  const db = await getDB();
  db.run('INSERT OR IGNORE INTO character_religion (character_id, religion_id) VALUES (?, ?)', [characterId, religionId]);
  await saveDB(db);
}

export async function unlinkCharacterFromReligion(characterId: number, religionId: number) {
  const db = await getDB();
  db.run('DELETE FROM character_religion WHERE character_id = ? AND religion_id = ?', [characterId, religionId]);
  await saveDB(db);
}

export async function getTimelines() {
  const db = await getDB();
  const res: any[] = [];
  const stmt = db.prepare('SELECT * FROM timelines');
  while (stmt.step()) {
    res.push(stmt.getAsObject());
  }
  stmt.free();
  return res;
}

export async function saveTimeline(tl: {id: number; title: string; date: string; description: string; relations: string;}) {
  const db = await getDB();
  db.run('INSERT OR REPLACE INTO timelines (id, title, date, description, relations) VALUES (?, ?, ?, ?, ?)', [tl.id, tl.title, tl.date, tl.description, tl.relations]);
  await saveDB(db);
}

export async function removeTimeline(id: number) {
  const db = await getDB();
  db.run('DELETE FROM timelines WHERE id = ?', [id]);
  await saveDB(db);
}

export async function getLanguages() {
  const db = await getDB();
  const res: any[] = [];
  const stmt = db.prepare('SELECT * FROM languages');
  while (stmt.step()) {
    res.push(stmt.getAsObject());
  }
  stmt.free();
  return res;
}

export async function saveLanguage(lang: {id: number; name: string; vocabulary: string; grammar: string; syllables: string;}) {
  const db = await getDB();
  db.run('INSERT OR REPLACE INTO languages (id, name, vocabulary, grammar, syllables) VALUES (?, ?, ?, ?, ?)', [lang.id, lang.name, lang.vocabulary, lang.grammar, lang.syllables]);
  await saveDB(db);
}

export async function removeLanguage(id: number) {
  const db = await getDB();
  db.run('DELETE FROM languages WHERE id = ?', [id]);
  await saveDB(db);
}
