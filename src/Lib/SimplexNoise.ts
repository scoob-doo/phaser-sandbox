import alea from 'alea'
import _ from 'lodash'
import { NoiseFunction2D, createNoise2D } from 'simplex-noise'

export interface NoiseSettings {
  scale: number
  octaves: number
  persistence: number
  lacunarity: number
}

interface TVector {
  x: number
  y: number
}

const defaultNoiseSettings: NoiseSettings = {
  scale: 25,
  octaves: 4,
  persistence: 0.5,
  lacunarity: 2,
}

class SimplexNoise {
  private static cache: Map<string, NoiseFunction2D[]> = new Map()

  private static EnsureNoiseGenerators(seed: string, octaves: number): NoiseFunction2D[] {
    if (!this.cache.has(seed)) {
      const generators: NoiseFunction2D[] = []
      for (let i = 0; i < octaves; i++) {
        const prng = alea(seed + String(i))
        generators.push(createNoise2D(prng))
      }
      this.cache.set(seed, generators)
    }
    return this.cache.get(seed)!
  }

  public static GetValue(
    { x, y }: TVector,
    seed: string,
    settings: Partial<NoiseSettings> = {},
  ): number {
    const { scale, octaves, persistence, lacunarity } = { ...defaultNoiseSettings, ...settings }
    const octaveNoiseGenerators = this.EnsureNoiseGenerators(seed, octaves)

    let amplitude = 1
    let frequency = 1
    let noiseHeight = 0

    for (let i = 0; i < octaves; i++) {
      const noiseGenerator = octaveNoiseGenerators[i]
      const sampleX = (x / scale) * frequency
      const sampleY = (y / scale) * frequency

      const simplexValue = noiseGenerator(sampleX, sampleY)
      noiseHeight += simplexValue * amplitude

      amplitude *= persistence
      frequency *= lacunarity
    }

    // return _.clamp(noiseHeight, -1, 1) // Ranges from -1 <--> 1
    return noiseHeight
  }

  public static Generate(
    size: number,
    seed: string,
    settings: Partial<NoiseSettings> = {},
  ): number[][] {
    const noiseMap: number[][] = []
    for (let x = 0; x < size; x++) {
      noiseMap[x] = []
      for (let y = 0; y < size; y++) {
        noiseMap[x][y] = this.GetValue({ x, y }, seed, settings)
      }
    }
    return SimplexNoise.NormalizeMap(noiseMap)
  }

  public static NormalizeMap(map: number[][]): number[][] {
    let min = Infinity
    let max = -Infinity

    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[x].length; y++) {
        const value = map[x][y]
        min = Math.min(min, value)
        max = Math.max(max, value)
      }
    }

    const absMax = Math.max(Math.abs(min), Math.abs(max))

    return map.map((row) => row.map((value) => (value + absMax) / (2 * absMax)))
  }
}

export default SimplexNoise
