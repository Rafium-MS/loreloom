import { describe, it, expect, beforeEach } from 'vitest';
import {
  getEras,
  addEra,
  updateEra,
  deleteEra,
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from './timelineRepository';

const createStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  } as Storage;
};

beforeEach(() => {
  // @ts-ignore - minimal localStorage for Node env
  global.localStorage = createStorage();
});

describe('timelineRepository', () => {
  it('manages eras', () => {
    const era = { id: 'e1', name: 'Ancient', start: 0, end: 100 };
    addEra(era);
    expect(getEras()).toHaveLength(1);
    updateEra({ ...era, name: 'Medieval' });
    expect(getEras()[0].name).toBe('Medieval');
    deleteEra(era.id);
    expect(getEras()).toHaveLength(0);
  });

  it('manages events', () => {
    const event = { id: 'ev1', name: 'Battle', date: 50 };
    addEvent(event);
    expect(getEvents()).toHaveLength(1);
    updateEvent({ ...event, name: 'Battle of Foo' });
    expect(getEvents()[0].name).toBe('Battle of Foo');
    deleteEvent(event.id);
    expect(getEvents()).toHaveLength(0);
  });
});
