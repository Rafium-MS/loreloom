import { v4 as uuidv4 } from 'uuid';

export interface Objective {
  id: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  objectives: Objective[];
  obstacles: string;
  twists: string;
  rewards: string;
  consequences: string;
  progress: number;
  status: string;
}

export interface Arc {
  id: string;
  title: string;
  description: string;
  act1: string;
  act2: string;
  act3: string;
  consequences: string;
  progress: number;
  status: string;
  quests: Quest[];
}

const STORAGE_KEY = 'loreloom_plot_arcs';

function loadArcs(): Arc[] {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (raw) {
    return JSON.parse(raw) as Arc[];
  }
  saveArcs([]);
  return [];
}

function saveArcs(arcs: Arc[]) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arcs));
  }
}

function modifyArcs(modifier: (arcs: Arc[]) => void): Arc[] {
  const arcs = loadArcs();
  modifier(arcs);
  saveArcs(arcs);
  return arcs;
}

export const plotRepository = {
  getArcs: (): Arc[] => loadArcs(),
  saveArcs,

  addArc: (data: Omit<Arc, 'id' | 'quests'>): Arc => {
    const arc: Arc = { id: uuidv4(), ...data, quests: [] };
    modifyArcs(arcs => {
      arcs.push(arc);
    });
    return arc;
  },

  updateArc: (arc: Arc): void => {
    modifyArcs(arcs => {
      const idx = arcs.findIndex(a => a.id === arc.id);
      if (idx !== -1) {
        arcs[idx] = arc;
      }
    });
  },

  removeArc: (id: string): void => {
    modifyArcs(arcs => {
      const idx = arcs.findIndex(a => a.id === id);
      if (idx !== -1) {
        arcs.splice(idx, 1);
      }
    });
  },

  addQuest: (arcId: string, data: Omit<Quest, 'id'>): Quest => {
    const quest: Quest = { id: uuidv4(), ...data };
    modifyArcs(arcs => {
      const arc = arcs.find(a => a.id === arcId);
      if (arc) {
        arc.quests.push(quest);
      }
    });
    return quest;
  },

  updateQuest: (arcId: string, quest: Quest): void => {
    modifyArcs(arcs => {
      const arc = arcs.find(a => a.id === arcId);
      if (arc) {
        const idx = arc.quests.findIndex(q => q.id === quest.id);
        if (idx !== -1) {
          arc.quests[idx] = quest;
        }
      }
    });
  },

  removeQuest: (arcId: string, questId: string): void => {
    modifyArcs(arcs => {
      const arc = arcs.find(a => a.id === arcId);
      if (arc) {
        arc.quests = arc.quests.filter(q => q.id !== questId);
      }
    });
  },
};

export default plotRepository;