import { Location } from '../components/LocationForm';

const STORAGE_KEY = 'loreloom_world_locations';

export const getLocations = (): Location[] => {
  if (typeof localStorage === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as Location[]) : [];
};

const saveLocations = (locations: Location[]) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
};

export const addLocation = (location: Location) => {
  const locations = getLocations();
  locations.push(location);
  saveLocations(locations);
};

export const updateLocation = (location: Location) => {
  const locations = getLocations().map(l => (l.id === location.id ? location : l));
  saveLocations(locations);
};

export const deleteLocation = (id: number) => {
  const locations = getLocations().filter(l => l.id !== id);
  saveLocations(locations);
};

export default {
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
};