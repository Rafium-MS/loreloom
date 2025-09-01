export function getTotalPopulation(locations: { population?: number }[]) {
  return locations.reduce((total, loc) => total + (loc.population || 0), 0);
}

export function getTotalArmySize(locations: { army?: { size?: number } }[]) {
  return locations.reduce((total, loc) => total + (loc.army?.size || 0), 0);
}
