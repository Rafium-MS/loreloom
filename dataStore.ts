import initSqlJs from 'sql.js';

// Initialize database and persist to localStorage
let dbPromise: Promise<any> | null = null;

async function getDB() {
  if (!dbPromise) {
    dbPromise = initSqlJs().then(SQL => {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('loreloom_db') : null;
      const db = stored ? new SQL.Database(Uint8Array.from(atob(stored), c => c.charCodeAt(0))) : new SQL.Database();
      db.run('CREATE TABLE IF NOT EXISTS characters (id INTEGER PRIMARY KEY, name TEXT, description TEXT, role TEXT);');
      db.run('CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY, name TEXT, description TEXT, type TEXT);');
      return db;
    });
  }
  return dbPromise;
}

async function persist() {
  const db = await getDB();
  const data = db.export();
  const b64 = btoa(String.fromCharCode.apply(null, data));
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('loreloom_db', b64);
  }
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

export async function saveCharacter(char: {id: number; name: string; description: string; role: string;}) {
  const db = await getDB();
  db.run('INSERT OR REPLACE INTO characters (id, name, description, role) VALUES (?, ?, ?, ?)', [char.id, char.name, char.description, char.role]);
  await persist();
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
  await persist();
}
