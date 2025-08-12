// packages/core/src/types/index.ts
export type UUID = string;

export interface Scene { id: UUID; chapterId: UUID; title: string; content: string; words: number; tags: string[]; }
export interface Chapter { id: UUID; bookId: UUID; title: string; order: number; sceneIds: UUID[]; }
export interface Book { id: UUID; title: string; synopsis?: string; chapterIds: UUID[]; }

export interface Character { id: UUID; name: string; role?: string; bio?: string; relationships: Record<UUID, 'family'|'romance'|'friend'|'enemy'|'ally'|'mentor'|'rival'>; }
export interface Location { id: UUID; name: string; type: 'cidade'|'vila'|'reino'|'fortaleza'; population?: number; economy?: string; ... }

export interface PlotArc { id: UUID; title: string; status: 'planning'|'active'|'completed'|'abandoned'; acts: { act1: string; act2: string; act3: string; }; questIds: UUID[]; }
export interface Quest { id: UUID; arcId?: UUID; type: 'main'|'side'; objectives: { id: UUID; description: string; completed: boolean; }[]; status: 'available'|'in-progress'|'completed'|'failed'; }

export interface MagicSystem { id: UUID; name: string; description?: string; limitations?: string; cost?: string; schools: string[]; ... }
export interface TechSystem { id: UUID; name: string; principles: string[]; constraints: string[]; ... }
