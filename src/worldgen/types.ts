// === worldgen/types.ts =====================================================
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