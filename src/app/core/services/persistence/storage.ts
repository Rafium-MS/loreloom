export interface PersistenceAdapter {
  /**
   * Retrieve a value by key. Returns null if not found.
   */
  get<T>(key: string): Promise<T | null>;
  /**
   * Persist a value. Passing `null` removes the key.
   */
  set<T>(key: string, value: T | null): Promise<void>;
  /**
   * List all keys that start with the provided prefix.
   */
  list(prefix: string): Promise<string[]>;
  /**
   * Export all persisted data as a key/value map.
   */
  export(): Promise<Record<string, unknown>>;
  /**
   * Import a full key/value map, overwriting existing data.
   */
  import(data: Record<string, unknown>): Promise<void>;
}

export interface Repository<T extends { id: string }> {
  /** Retrieve a single entity by id. */
  get(id: string): Promise<T | null>;
  /** Save or update an entity. */
  set(item: T): Promise<void>;
  /** List all entities within the repository. */
  list(): Promise<T[]>;
  /** Remove an entity by id. */
  remove(id: string): Promise<void>;
  /** Export repository data keyed by id. */
  export(): Promise<Record<string, T>>;
  /** Import repository data keyed by id. */
  import(data: Record<string, T>): Promise<void>;
}

export type Domain =
  | 'book'
  | 'characters'
  | 'world'
  | 'plot'
  | 'magic'
  | 'tech'
  | 'timeline';