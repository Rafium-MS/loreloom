import { v4 as uuidv4 } from 'uuid';

export interface Domain {
  id: string;
  name: string;
}

export interface Practitioner {
  id: string;
  name: string;
  type: string;
}

export interface Device {
  id: string;
  name: string;
  trl: number;
  risks: string;
  requirements: string;
}

export interface TechSystem {
  paradigm: string;
  domains: Domain[];
  practitioners: Practitioner[];
  devices: Device[];
}

const STORAGE_KEY = 'loreloom_tech_system';

function loadSystem(): TechSystem {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (raw) {
    return JSON.parse(raw) as TechSystem;
  }
  const system: TechSystem = { paradigm: '', domains: [], practitioners: [], devices: [] };
  saveSystem(system);
  return system;
}

function saveSystem(system: TechSystem) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(system));
  }
}

function modifySystem(modifier: (system: TechSystem) => void): TechSystem {
  const system = loadSystem();
  modifier(system);
  saveSystem(system);
  return system;
}

export const techRepository = {
  getSystem: (): TechSystem => loadSystem(),
  saveSystem,

  updateParadigm: (paradigm: string): void => {
    modifySystem(system => {
      system.paradigm = paradigm;
    });
  },

  addDomain: (name: string): Domain => {
    const domain: Domain = { id: uuidv4(), name };
    modifySystem(system => {
      system.domains.push(domain);
    });
    return domain;
  },

  updateDomain: (domain: Domain): void => {
    modifySystem(system => {
      const idx = system.domains.findIndex(d => d.id === domain.id);
      if (idx !== -1) {
        system.domains[idx] = domain;
      }
    });
  },

  removeDomain: (id: string): void => {
    modifySystem(system => {
      system.domains = system.domains.filter(d => d.id !== id);
    });
  },

  addPractitioner: (name: string, type: string): Practitioner => {
    const practitioner: Practitioner = { id: uuidv4(), name, type };
    modifySystem(system => {
      system.practitioners.push(practitioner);
    });
    return practitioner;
  },

  updatePractitioner: (practitioner: Practitioner): void => {
    modifySystem(system => {
      const idx = system.practitioners.findIndex(p => p.id === practitioner.id);
      if (idx !== -1) {
        system.practitioners[idx] = practitioner;
      }
    });
  },

  removePractitioner: (id: string): void => {
    modifySystem(system => {
      system.practitioners = system.practitioners.filter(p => p.id !== id);
    });
  },

  addDevice: (data: Omit<Device, 'id'>): Device => {
    const device: Device = { id: uuidv4(), ...data };
    modifySystem(system => {
      system.devices.push(device);
    });
    return device;
  },

  updateDevice: (device: Device): void => {
    modifySystem(system => {
      const idx = system.devices.findIndex(d => d.id === device.id);
      if (idx !== -1) {
        system.devices[idx] = device;
      }
    });
  },

  removeDevice: (id: string): void => {
    modifySystem(system => {
      system.devices = system.devices.filter(d => d.id !== id);
    });
  },
};

export default techRepository;