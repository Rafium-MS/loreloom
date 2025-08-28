class Cache {
  constructor(ttlMs) {
    this.ttl = ttlMs;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value, ttlMs = this.ttl) {
    this.store.set(key, { value, expiry: Date.now() + ttlMs });
  }

  del(key) {
    this.store.delete(key);
  }
}

const defaultTtl = parseInt(process.env.CACHE_TTL_MS || '60000', 10);
module.exports = new Cache(defaultTtl);
