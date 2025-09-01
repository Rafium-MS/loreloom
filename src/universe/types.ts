export interface Character {
  id: number;
  name: string;
  age?: string | number;
  appearance?: string;
  background?: string;
  abilities?: string;
  motivations?: string;
  relationships?: string;
  role?: string;
  locationIds?: number[];
  religionIds?: number[];
}

export interface Army {
  size: number;
  weapons?: string;
  training?: string;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  climate?: string;
  population?: number;
  culturalComposition?: string;
  mainProfessions?: string[];
  economy?: string;
  resources?: string;
  army?: Army;
  religions?: string[];
  commonFoods?: string[];
  establishments?: string;
  strategicPoints?: string;
  government?: string;
  battles?: string;
  events?: string;
  characterIds?: number[];
}

export interface Economy {
  id: number;
  name: string;
  currency?: string;
  markets?: string;
  mainExports?: string;
}

export interface Religion {
  id: number;
  name: string;
  doctrine?: string;
  factions?: string;
  characterIds?: number[];
}

export interface TimelineEvent {
  id: number;
  title: string;
  date?: string;
  description?: string;
  relations?: string;
}

export interface Language {
  id: number;
  name: string;
  grammar?: string;
  vocabulary?: string;
  syllables?: string;
}
