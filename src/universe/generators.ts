import { Character, Location } from './types';
import {
  professionsList,
  religionsList,
  foodsList,
  generatePopulation,
  generateEconomy,
} from './utils';

export const generateRandomCharacter = (count: number): Character => ({
  id: Date.now(),
  name: `Personagem ${count + 1}`,
  age: Math.floor(Math.random() * 50) + 18,
  appearance: 'Aparência gerada automaticamente',
  background: 'História gerada automaticamente',
  abilities: 'Habilidades variadas',
  motivations: 'Motivações complexas',
  relationships: 'Relacionamentos diversos',
  role: 'Papel importante na narrativa',
});

export const generateRandomLocation = (count: number): Location => {
  const types = ['cidade', 'vila', 'reino', 'fortaleza'];
  const climates = ['Temperado', 'Tropical', 'Árido', 'Frio', 'Montanhoso'];
  return {
    id: Date.now(),
    name: `Local ${count + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    climate: climates[Math.floor(Math.random() * climates.length)],
    population: generatePopulation(),
    culturalComposition: 'Diversa',
    mainProfessions: professionsList.slice(0, Math.floor(Math.random() * 5) + 3),
    economy: generateEconomy(),
    resources: 'Recursos variados disponíveis',
    army: {
      size: Math.floor(Math.random() * 5000) + 100,
      weapons: 'Espadas e arcos',
      training: 'Treinamento regular',
    },
    religions: religionsList.slice(0, Math.floor(Math.random() * 3) + 1),
    commonFoods: foodsList.slice(0, Math.floor(Math.random() * 4) + 2),
    establishments: 'Tavernas, mercados e oficinas',
    strategicPoints: 'Muralhas e torres de vigia',
    government: 'História de liderança estável',
    battles: 'Algumas escaramuças menores',
    events: 'Festivais anuais e celebrações',
  };
};

