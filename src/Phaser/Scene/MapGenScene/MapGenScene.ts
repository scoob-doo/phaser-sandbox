import EventManager from '@/Event/EventManager'
import { EventType } from '@/Event/EventType'
import SimplexNoise, { NoiseSettings } from '@/Lib/SimplexNoise'
import RenderTextureFactory from '@/Phaser/RenderTexture'
import MapGenState from '@/State/MapGenState'
import GenericScene from '../GenericScene'
import { SceneKey } from '../SceneKey'
import Generate from './Generate'

const TEXTURE_SIZE = 500
const SPACING = 0

enum Biome {
  DeepWater = 0x0952c3,
  ShallowWater = 0x096bc1,
  Coast = 0xac9969,
  Desert = 0xac9969,
  DeadLands = 0x576b45,
  Plains = 0x5a7f33,
  Forest = 0x39561a,
  DeepForest = 0x475e32,
  Foothills = 0x7a7a7a,
  Mountains = 0xa8a8a8,
  Peaks = 0xffffff,
}

class MapGenScene extends GenericScene {
  renderTextures: Phaser.GameObjects.RenderTexture[] = []
  graphics!: Phaser.GameObjects.Graphics

  constructor() {
    super(SceneKey.MapGenScene)
  }

  get mapGenState() {
    return MapGenState.GetInstance()
  }

  get cameraBounds() {
    return this.cameras.main.worldView
  }

  // PHASER METHODS

  preload() {
    // this.load.image('Pixel', 'assets/Pixel.png')
  }

  async create() {
    super.create()

    this.textures.generate('pixel', { data: ['2'], pixelWidth: 1 })

    const numTextures = Math.ceil(this.mapGenState.mapSize / TEXTURE_SIZE)

    for (let i = 0; i < numTextures * numTextures; i++) {
      const x = (i % numTextures) * TEXTURE_SIZE
      const y = Math.floor(i / numTextures) * TEXTURE_SIZE
      const renderTexture = RenderTextureFactory.Make(
        this,
        x - 0.5,
        y - 0.5,
        TEXTURE_SIZE,
        TEXTURE_SIZE,
      )
      renderTexture.setOrigin(0)
      renderTexture.x += (i % numTextures) * SPACING
      renderTexture.y += Math.floor(i / numTextures) * SPACING
      this.renderTextures.push(renderTexture)
    }

    this.graphics = this.add.graphics()

    const centerPos = new Phaser.Math.Vector2(
      this.mapGenState.mapSize / 2,
      this.mapGenState.mapSize / 2,
    )

    // Camera
    // const centerPos = Vector.CoordinatesToPosition(centerCoordinates)
    this.cameras.main.centerOn(centerPos.x, centerPos.y)
    this.cameras.main.setZoom(1)

    this.generate()

    this.input.keyboard?.on('keydown', ({ key }) => {
      if (key === '1') this.renderHeightMap('elevation')
      if (key === '2') this.renderHeightMap('erosion')
      if (key === '3') this.renderHeightMap('moisture')
      if (key === '0') this.render()
    })

    this.render()
    // this.renderHeightMap('erosion')

    setTimeout(() => {
      EventManager.emit(EventType.Exec, ['debug -o'])
    }, 50)
  }

  update(time: number, delta: number) {
    super.update(time, delta)
  }

  destroy() {}

  generate() {
    const start = performance.now()

    const mapSizeToNoiseSettingsMap = {
      1000: {
        elevation: {
          octaves: 9,
          scale: 500,
          lacunarity: 2.3,
        },
        erosion: {
          octaves: 1,
          scale: 2000,
          lacunarity: 2,
        },
        moisture: {
          octaves: 9,
          scale: 125,
          lacunarity: 2.5,
        },
      },
      2000: {
        elevation: {
          octaves: 9,
          scale: 500 * 2,
          lacunarity: 2.3,
        },
        erosion: {
          octaves: 9,
          scale: 500 * 2,
          lacunarity: 1.75,
        },
        moisture: {
          octaves: 9,
          scale: 125 * 2,
          lacunarity: 2.5,
        },
      },
      4000: {
        elevation: {
          octaves: 9,
          scale: 500 * 4,
          lacunarity: 2.3,
        },
        erosion: {
          octaves: 9,
          scale: 500 * 4,
          lacunarity: 1.75,
        },
        moisture: {
          octaves: 9,
          scale: 125 * 4,
          lacunarity: 2.5,
        },
      },
    }

    const defaultMapSizeSettings = mapSizeToNoiseSettingsMap['1000']
    for (const [key, settings] of Object.entries(defaultMapSizeSettings)) {
      settings.scale *= this.mapGenState.mapSize / 1000
      settings.octaves = Math.floor(Math.log2(this.mapGenState.mapSize))
    }

    const mapSizeSettings =
      mapSizeToNoiseSettingsMap[this.mapGenState.mapSize] ?? mapSizeToNoiseSettingsMap['1000']
    for (const [key, settings] of Object.entries(mapSizeSettings)) {
      this.mapGenState.heightMaps[key] = SimplexNoise.Generate(
        this.mapGenState.mapSize,
        this.mapGenState.seed + key,
        settings as Partial<NoiseSettings>,
      )
    }

    const end = performance.now()
    console.log(`Generation took ${end - start}ms`)
  }

  render() {
    for (const renderTexture of this.renderTextures) {
      renderTexture.clear()
      renderTexture.beginDraw()

      for (let x = 0; x < this.mapGenState.mapSize; x++) {
        for (let y = 0; y < this.mapGenState.mapSize; y++) {
          const textureIndex =
            Math.floor(y / TEXTURE_SIZE) * Math.ceil(this.mapGenState.mapSize / TEXTURE_SIZE) +
            Math.floor(x / TEXTURE_SIZE)

          if (this.renderTextures[textureIndex] !== renderTexture) continue

          const color = Generate.Color(x, y, this.mapGenState)

          const phaserColor = Phaser.Display.Color.IntegerToColor(color)
          phaserColor.lighten(Math.random() * 5)
          phaserColor.darken(Math.random() * 5)
          // phaserColor.saturate(Math.random() * 50)

          renderTexture.batchDrawFrame(
            'pixel',
            undefined,
            x % TEXTURE_SIZE,
            y % TEXTURE_SIZE,
            1,
            phaserColor.color,
          )
        }
      }

      renderTexture.endDraw()
    }
  }

  renderHeightMap(heightMap: string, lowerBound: number = 0, upperBound: number = 1) {
    for (const renderTexture of this.renderTextures) {
      renderTexture.clear()
      renderTexture.beginDraw()

      const heightMapArray = this.mapGenState.heightMaps[heightMap]

      for (let x = 0; x < this.mapGenState.mapSize; x++) {
        for (let y = 0; y < this.mapGenState.mapSize; y++) {
          const textureIndex =
            Math.floor(y / TEXTURE_SIZE) * Math.ceil(this.mapGenState.mapSize / TEXTURE_SIZE) +
            Math.floor(x / TEXTURE_SIZE)

          if (this.renderTextures[textureIndex] !== renderTexture) continue

          const height = heightMapArray[x][y]
          const grayscaleValue =
            height >= lowerBound && height <= upperBound ? Math.floor(height * 255) : 0
          const color = Phaser.Display.Color.GetColor(
            grayscaleValue,
            grayscaleValue,
            grayscaleValue,
          )

          renderTexture.batchDrawFrame(
            'pixel',
            undefined,
            x % TEXTURE_SIZE,
            y % TEXTURE_SIZE,
            1,
            color,
          )
        }
      }

      renderTexture.endDraw()
    }
  }
}

export default MapGenScene
