import { Era, TimelineEvent } from '../TimelineWorldHistoryManager';

const ERA_KEY = 'loreloom_timeline_eras';
const EVENT_KEY = 'loreloom_timeline_events';

// Generic helpers
const load = <T>(key: string): T[] => {
  if (typeof localStorage === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? (JSON.parse(data) as T[]) : [];
};

const save = <T>(key: string, value: T[]) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

// Eras
export const getEras = (): Era[] => load<Era>(ERA_KEY);

export const addEra = (era: Era) => {
  const eras = getEras();
  eras.push(era);
  save(ERA_KEY, eras);
};

export const updateEra = (era: Era) => {
  const eras = getEras().map(e => (e.id === era.id ? era : e));
  save(ERA_KEY, eras);
};

export const deleteEra = (id: string) => {
  const eras = getEras().filter(e => e.id !== id);
  save(ERA_KEY, eras);
};

// Events
export const getEvents = (): TimelineEvent[] => load<TimelineEvent>(EVENT_KEY);

export const addEvent = (event: TimelineEvent) => {
  const events = getEvents();
  events.push(event);
  save(EVENT_KEY, events);
};

export const updateEvent = (event: TimelineEvent) => {
  const events = getEvents().map(e => (e.id === event.id ? event : e));
  save(EVENT_KEY, events);
};

export const deleteEvent = (id: string) => {
  const events = getEvents().filter(e => e.id !== id);
  save(EVENT_KEY, events);
};

export default {
  getEras,
  addEra,
  updateEra,
  deleteEra,
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
};