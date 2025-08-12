import { v4 as uuidv4 } from 'uuid';

export interface School {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
}

export interface MagicSystem {
  rules: string;
  schools: School[];
  users: User[];
  artifacts: Artifact[];
}

const STORAGE_KEY = 'loreloom_magic_system';

function loadSystem(): MagicSystem {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (raw) {
    return JSON.parse(raw) as MagicSystem;
  }
  const system: MagicSystem = { rules: '', schools: [], users: [], artifacts: [] };
  saveSystem(system);
  return system;
}

function saveSystem(system: MagicSystem) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(system));
  }
}

function modifySystem(modifier: (system: MagicSystem) => void): MagicSystem {
  const system = loadSystem();
  modifier(system);
  saveSystem(system);
  return system;
}

export const magicRepository = {
  getSystem: (): MagicSystem => loadSystem(),
  saveSystem,

  updateRules: (rules: string): void => {
    modifySystem(system => {
      system.rules = rules;
    });
  },

  addSchool: (name: string): School => {
    const school: School = { id: uuidv4(), name };
    modifySystem(system => {
      system.schools.push(school);
    });
    return school;
  },

  updateSchool: (school: School): void => {
    modifySystem(system => {
      const idx = system.schools.findIndex(s => s.id === school.id);
      if (idx !== -1) {
        system.schools[idx] = school;
      }
    });
  },

  removeSchool: (id: string): void => {
    modifySystem(system => {
      system.schools = system.schools.filter(s => s.id !== id);
    });
  },

  addUser: (name: string, role: string): User => {
    const user: User = { id: uuidv4(), name, role };
    modifySystem(system => {
      system.users.push(user);
    });
    return user;
  },

  updateUser: (user: User): void => {
    modifySystem(system => {
      const idx = system.users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        system.users[idx] = user;
      }
    });
  },

  removeUser: (id: string): void => {
    modifySystem(system => {
      system.users = system.users.filter(u => u.id !== id);
    });
  },

  addArtifact: (data: Omit<Artifact, 'id'>): Artifact => {
    const artifact: Artifact = { id: uuidv4(), ...data };
    modifySystem(system => {
      system.artifacts.push(artifact);
    });
    return artifact;
  },

  updateArtifact: (artifact: Artifact): void => {
    modifySystem(system => {
      const idx = system.artifacts.findIndex(a => a.id === artifact.id);
      if (idx !== -1) {
        system.artifacts[idx] = artifact;
      }
    });
  },

  removeArtifact: (id: string): void => {
    modifySystem(system => {
      system.artifacts = system.artifacts.filter(a => a.id !== id);
    });
  },
};

export default magicRepository;