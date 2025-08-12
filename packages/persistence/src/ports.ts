// packages/persistence/src/ports.ts
export interface Repo<T> {
  list(): Promise<T[]>;
  get(id: string): Promise<T|undefined>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}
