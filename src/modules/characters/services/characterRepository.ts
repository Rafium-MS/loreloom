import { Character } from '../types';

const STORAGE_KEY = 'loreloom_characters';

export const getCharacters = (): Character[] => {
  if (typeof localStorage === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveCharacters = (characters: Character[]) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
};

export const addCharacter = (character: Character) => {
  const characters = getCharacters();
  characters.push(character);
  saveCharacters(characters);
};

export const updateCharacter = (character: Character) => {
  const characters = getCharacters().map(c => (c.id === character.id ? character : c));
  saveCharacters(characters);
};

export const deleteCharacter = (id: string) => {
  const characters = getCharacters().filter(c => c.id !== id);
  saveCharacters(characters);
};