// === worldgen/types.ts =====================================================

// === worldgen/types.ts (PEQUENAS EXTENSÕES) ================================
// Acrescente ao arquivo original, próximo às declarações de tipos:
// export type RouteKind = 'estrada' | 'trilha' | 'fluvial' | 'maritima' (já existe)
// Novo catálogo opcional de recursos para futuras visualizações
export interface ResourceCatalogEntry { id: string; kind: string; pos: {x:number;y:number}; richness: number }
river: number // quantidade de fluxo acumulado
regionId?: string
}


export interface Point { x: number; y: number }


export interface Region {
id: string
kind: 'Regiao' | 'Reino' | 'Imperio'
name: string
color: string
tiles: number // contagem (para métricas rápidas)
centroid: Point
civLevel: CivLevel
parentId?: string
}


export interface Settlement {
id: string
name: string
kind: 'CidadeEstado' | 'Cidade' | 'Vila' | 'Aldeia' | 'Vilarejo'
pos: Point
regionId?: string
civLevel: CivLevel
population: number
density: number // pop/km²
buildableKm2: number
fortification: 0 | 1 | 2 | 3
tags: string[]
resources: string[]
isCapital?: boolean
parentId?: string // reino/império
}


export interface Route {
id: string
kind: RouteKind
fromId: string
toId: string
path: Point[]
cost: number
}


export interface MapLayers {
tiles: Tile[]
regions: Region[]
settlements: Settlement[]
routes: Route[]
}


export interface WorldOutput {
config: WorldConfig
layers: MapLayers
catalog: {
regions: Region[]
settlements: Settlement[]
routes: Route[]
}
}