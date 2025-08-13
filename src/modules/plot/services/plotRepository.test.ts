import { describe, it, expect, beforeEach } from 'vitest';
import { plotRepository } from './plotRepository';

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
  // @ts-expect-error - minimal localStorage for Node env
  global.localStorage = createStorage();
});

describe('plotRepository', () => {
  it('handles arcs and quests', () => {
    const arc = plotRepository.addArc({
      title: 'Arc',
      description: '',
      act1: '',
      act2: '',
      act3: '',
      consequences: '',
      progress: 0,
      status: '',
    });
    const quest = plotRepository.addQuest(arc.id, {
      title: 'Quest',
      description: '',
      type: '',
      objectives: [],
      obstacles: '',
      twists: '',
      rewards: '',
      consequences: '',
      progress: 0,
      status: '',
    });

    let arcs = plotRepository.getArcs();
    expect(arcs[0].quests[0].title).toBe('Quest');

    plotRepository.removeQuest(arc.id, quest.id);
    arcs = plotRepository.getArcs();
    expect(arcs[0].quests).toHaveLength(0);

    plotRepository.removeArc(arc.id);
    expect(plotRepository.getArcs()).toHaveLength(0);
  });
});
