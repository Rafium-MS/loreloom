// === worldgen/noise.ts =====================================================
import { hash2D } from './rng'


function smoothstep(t: number) {
return t * t * (3 - 2 * t)
}


function lerp(a: number, b: number, t: number) {
return a + (b - a) * t
}


export function valueNoise2D(x: number, y: number, freq: number, seed: number) {
const xf = x * freq
const yf = y * freq
const x0 = Math.floor(xf)
const y0 = Math.floor(yf)
const tx = xf - x0
const ty = yf - y0
const v00 = (hash2D(x0, y0, seed) & 1023) / 1023
const v10 = (hash2D(x0 + 1, y0, seed) & 1023) / 1023
const v01 = (hash2D(x0, y0 + 1, seed) & 1023) / 1023
const v11 = (hash2D(x0 + 1, y0 + 1, seed) & 1023) / 1023
const sx = smoothstep(tx)
const sy = smoothstep(ty)
const ix0 = lerp(v00, v10, sx)
const ix1 = lerp(v01, v11, sx)
return lerp(ix0, ix1, sy)
}


export function fbm2D(
x: number,
y: number,
seed: number,
octaves = 5,
lacunarity = 2,
gain = 0.5,
baseFreq = 0.01,
) {
let amp = 1
let freq = baseFreq
let sum = 0
let norm = 0
for (let i = 0; i < octaves; i++) {
const n = valueNoise2D(x, y, freq, seed + i * 1013)
sum += n * amp
norm += amp
amp *= gain
freq *= lacunarity
}
return sum / norm
}