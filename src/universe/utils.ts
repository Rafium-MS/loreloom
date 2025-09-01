export const professionsList = [
  'Mercador',
  'Ferreiro',
  'Agricultor',
  'Soldado',
  'Pescador',
  'Carpinteiro',
  'Alquimista',
  'Escriba',
  'Tavarneiro',
  'Guarda',
  'Artesão',
  'Curandeiro',
];

export const religionsList = [
  'Culto do Sol',
  'Adoradores da Lua',
  'Seguidores da Terra',
  'Místicos do Vento',
  'Devotos da Água',
  'Guardiões da Floresta',
];

export const foodsList = [
  'Pão de centeio',
  'Ensopado de carne',
  'Peixe grelhado',
  'Frutas silvestres',
  'Queijo de cabra',
  'Cerveja de cevada',
  'Vinho tinto',
  'Mel silvestre',
];

export const generatePopulation = (): number =>
  Math.floor(Math.random() * 50000) + 1000;

export const generateEconomy = (): string => {
  const resources = ['Agricultura', 'Mineração', 'Comércio', 'Pesca', 'Artesanato'];
  return resources[Math.floor(Math.random() * resources.length)];
};

export const generateNameFromSyllables = (syllablesString: string): string => {
  const syllables = syllablesString
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (syllables.length === 0) return '';
  const count = Math.floor(Math.random() * 2) + 2;
  let name = '';
  for (let i = 0; i < count; i++) {
    name += syllables[Math.floor(Math.random() * syllables.length)];
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
};
