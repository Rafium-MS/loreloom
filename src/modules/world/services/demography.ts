export type DensidadePopulacional =
  | 'desolado'
  | 'baixo'
  | 'novo assentamento'
  | 'medio'
  | 'alto'
  | 'maximo';

export interface Assentamento {
  nome: string;
  populacao: number;
  tamanho: string;
  comercioProfissionais: string[];
  recursos: string[];
  nobres: string[];
  sistemaPolitico: string;
  leis: string[];
  exercito: number;
  religioes: string[];
  seitas: string[];
  guildas: string[];
  guardas: number;
}

export interface Castelo {
  nome: string;
  dono: string;
  funcional: boolean;
}

export interface Reino {
  nome: string;
  areaFisica: number; // em metros quadrados
  tipoArea: string; // deserto, montanhoso, arquipelago, etc
  populacao: number;
  densidade: DensidadePopulacional;
  assentamentos: Assentamento[];
  castelos: Castelo[];
  cidades: number;
  nobres: string[];
  sistemaPolitico: string;
  leis: string[];
  exercito: number;
  religioes: string[];
  seitas: string[];
  guildas: string[];
  guardas: number;
}

export const calcularDensidade = (
  areaFisica: number,
  populacao: number,
): DensidadePopulacional => {
  if (areaFisica <= 0 || populacao === 0) return 'desolado';
  const densidade = populacao / (areaFisica / 1000); // pessoas por 1000 m2
  if (densidade < 5) return 'baixo';
  if (densidade < 10) return 'novo assentamento';
  if (densidade < 15) return 'medio';
  if (densidade < 20) return 'alto';
  return 'maximo';
};

export const gerarAssentamento = (
  overrides: Partial<Assentamento> = {},
): Assentamento => {
  const populacao = overrides.populacao ?? Math.floor(Math.random() * 5000);
  return {
    nome: overrides.nome ?? `Assentamento ${Math.floor(Math.random() * 1000)}`,
    populacao,
    tamanho:
      overrides.tamanho ??
      (populacao < 1000 ? 'pequeno' : populacao < 3000 ? 'medio' : 'grande'),
    comercioProfissionais: overrides.comercioProfissionais ?? [],
    recursos: overrides.recursos ?? [],
    nobres: overrides.nobres ?? [],
    sistemaPolitico: overrides.sistemaPolitico ?? 'feudal',
    leis: overrides.leis ?? [],
    exercito: overrides.exercito ?? 0,
    religioes: overrides.religioes ?? [],
    seitas: overrides.seitas ?? [],
    guildas: overrides.guildas ?? [],
    guardas: overrides.guardas ?? 0,
  };
};

export const gerarReino = (
  overrides: Partial<Reino> = {},
): Reino => {
  const areaFisica = overrides.areaFisica ?? (Math.floor(Math.random() * 5_000_000) + 1_000);
  const populacao = overrides.populacao ?? Math.floor(Math.random() * 200_000);
  return {
    nome: overrides.nome ?? `Reino ${Math.floor(Math.random() * 1000)}`,
    areaFisica,
    tipoArea: overrides.tipoArea ?? 'planicie',
    populacao,
    densidade: calcularDensidade(areaFisica, populacao),
    assentamentos: overrides.assentamentos ?? [],
    castelos: overrides.castelos ?? [],
    cidades: overrides.cidades ?? 0,
    nobres: overrides.nobres ?? [],
    sistemaPolitico: overrides.sistemaPolitico ?? 'monarquia',
    leis: overrides.leis ?? [],
    exercito: overrides.exercito ?? 0,
    religioes: overrides.religioes ?? [],
    seitas: overrides.seitas ?? [],
    guildas: overrides.guildas ?? [],
    guardas: overrides.guardas ?? 0,
  };
};

const STORAGE_KEY = 'loreloom_demography_reinos';

export const getReinos = (): Reino[] => {
  if (typeof localStorage === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as Reino[]) : [];
};

const saveReinos = (reinos: Reino[]) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reinos));
};

export const addReino = (reino: Reino) => {
  const reinos = getReinos();
  reinos.push(reino);
  saveReinos(reinos);
};

export const updateReino = (reino: Reino) => {
  const reinos = getReinos().map(r => (r.nome === reino.nome ? reino : r));
  saveReinos(reinos);
};

export const deleteReino = (nome: string) => {
  const reinos = getReinos().filter(r => r.nome !== nome);
  saveReinos(reinos);
};

export default {
  gerarAssentamento,
  gerarReino,
  calcularDensidade,
  getReinos,
  addReino,
  updateReino,
  deleteReino,
};
