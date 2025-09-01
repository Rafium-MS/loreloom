// === worldgen/rng.ts =======================================================
export function hashStringToInt(seed: string): number {
let h = 2166136261 >>> 0
for (let i = 0; i < seed.length; i++) {
h ^= seed.charCodeAt(i)
h = Math.imul(h, 16777619)
}
return h >>> 0
}


export function mulberry32(a: number) {
return function () {
let t = (a += 0x6d2b79f5)
t = Math.imul(t ^ (t >>> 15), t | 1)
t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
}


export function randRange(rng: () => number, min = 0, max = 1) {
return min + (max - min) * rng()
}


export function choice<T>(rng: () => number, arr: T[]): T {
return arr[Math.floor(rng() * arr.length)]
}


export function hash2D(x: number, y: number, base: number) {
let h = base + x * 374761393 + y * 668265263
h = (h ^ (h >>> 13)) >>> 0
h = Math.imul(h, 1274126177) >>> 0
return h >>> 0
}


export function rand2D01(x: number, y: number, base: number) {
return hash2D(x, y, base) / 4294967295
}