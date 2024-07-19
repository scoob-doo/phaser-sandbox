import Settings from '@/Constant/Settings'
import TVector from '@/Types/TVector'

export interface Float32CoordinatesMapBuffer {
  map: SharedArrayBuffer
}

export default class Float32CoordinatesMap {
  map: Float32Array

  constructor(buffer: Float32CoordinatesMapBuffer | null = null) {
    if (!buffer) {
      buffer = {
        map: new SharedArrayBuffer(Math.pow(Settings.MapSize, 2) * Float32Array.BYTES_PER_ELEMENT),
      }
    }
    this.map = new Float32Array(buffer.map)
  }

  get buffer(): Float32CoordinatesMapBuffer {
    return {
      map: this.map.buffer as SharedArrayBuffer,
    }
  }

  getIndex({ x, y }: TVector): number {
    return y * Settings.MapSize + x
  }

  getCoordinatesFromIndex(index: number): TVector {
    return {
      x: index % Settings.MapSize,
      y: Math.floor(index / Settings.MapSize),
    }
  }

  set({ x, y }: TVector, value: number) {
    this.map[this.getIndex({ x, y })] = value
  }

  get({ x, y }: TVector): number {
    return this.map[this.getIndex({ x, y })]
  }

  delete({ x, y }: TVector) {
    this.map[this.getIndex({ x, y })] = 0
  }

  has({ x, y }: TVector): boolean {
    return this.map[this.getIndex({ x, y })] !== 0
  }
}
