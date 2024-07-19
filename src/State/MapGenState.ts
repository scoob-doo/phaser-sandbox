import { generate } from 'random-words'

const initArray = (size: number) =>
  Array.from({ length: size }, () => Array.from({ length: size }, () => 0))

export default class MapGenState {
  private static _instance: MapGenState | null = null

  // seed: string = generate() as string
  seed: string = 'light'
  mapSize: number = 1000 // Must be perfectly divisible by 500
  heightMaps = {
    elevation: initArray(this.mapSize),
    erosion: initArray(this.mapSize),
    moisture: initArray(this.mapSize),
    rivers: initArray(this.mapSize),
    mountains: initArray(this.mapSize),
  }

  constructor() {}

  public static GetInstance() {
    if (this._instance === null) {
      this._instance = new MapGenState()
    }
    return this._instance
  }

  public static SetState(state: MapGenState) {
    this._instance = state
  }
}
