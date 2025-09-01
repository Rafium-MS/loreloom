// === worldgen/profiles.ts ===================================================
import { CivLevel, DensityPreset, WorldProfile } from './types'


const D: Record<CivLevel, DensityPreset> = {
Civilizado: { city: 12000, town: 4500, village: 1200, hamlet: 300, verticality: 1.6 },
SemiCivilizado: { city: 7000, town: 2800, village: 800, hamlet: 220, verticality: 1.3 },
Selvagem: { city: 3000, town: 1200, village: 400, hamlet: 120, verticality: 1.1 },
Monstruoso: { city: 1500, town: 600, village: 220, hamlet: 80, verticality: 1.0 },
}


export const WORLD_PROFILES: WorldProfile[] = [
{
id: 'imperio-continental',
label: 'Império Continental',
description: 'Grandes planícies, capitais interiores, exércitos pesados e malhas viárias extensas.',
civLevel: 'Civilizado',
commerceBias: -0.2,
warVolatility: 0.4,
resourceRichness: 0.6,
targetDensities: { Civilizado: D.Civilizado },
avgSettlementsPerRegion: 8,
},
{
id: 'arquipelago-mercantil',
label: 'Arquipélago Mercantil',
description: 'Múltiplas ilhas, portos ativos, rotas marítimas e entrepostos fluviais.',
civLevel: 'Civilizado',
commerceBias: 0.6,
warVolatility: 0.3,
resourceRichness: 0.5,
targetDensities: { Civilizado: { ...D.Civilizado, verticality: 1.7 } },
avgSettlementsPerRegion: 6,
},
{
id: 'cidades-estado-rivais',
label: 'Cidades‑Estado Rivais',
description: 'Polidades independentes, muralhas reforçadas, intensa competição comercial/cultural.',
civLevel: 'Civilizado',
commerceBias: 0.3,
warVolatility: 0.5,
resourceRichness: 0.5,
targetDensities: { Civilizado: D.Civilizado },
avgSettlementsPerRegion: 4,
},
{
id: 'fronteira-selvagem',
label: 'Fronteira Selvagem',
description: 'Baixa densidade, bolsões urbanos fortificados, longas distâncias entre povoados.',
civLevel: 'SemiCivilizado',
commerceBias: -0.1,
warVolatility: 0.6,
resourceRichness: 0.7,
targetDensities: { SemiCivilizado: D.SemiCivilizado },
avgSettlementsPerRegion: 3,
},
]