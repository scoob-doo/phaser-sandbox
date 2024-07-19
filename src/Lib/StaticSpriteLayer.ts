import { Depth } from '@/Constant/Depth'
import Settings from '@/Constant/Settings'
import { Tilemaps } from 'phaser'

/**
 * Note:
 * When rerendering the entire texture every time a sprite changes becomes too much, adjust so that there is a
 * separate texture at each y. Then when a sprite needs to be adjusted, only that y needs to be rerendered and all of
 * the depth values will work out from that.
 */
export default class StaticSpriteLayer {
  static topPadding = Settings.TileSize * 4
  private renderTextures: Phaser.GameObjects.RenderTexture[]
  private batchInProgress: boolean[] = Array.from({ length: Settings.MapSize }, () => false)

  constructor(scene: Phaser.Scene) {
    this.renderTextures = Array.from({ length: Settings.MapSize }, (_, y) => {
      const renderTexture = scene.add.renderTexture(
        0,
        y * Settings.TileSize - StaticSpriteLayer.topPadding,
        Settings.MapSize * Settings.TileSize,
        Settings.TileSize + StaticSpriteLayer.topPadding,
      )
      renderTexture.setOrigin(0)
      renderTexture.setDepth(y * Depth.Standard)
      renderTexture.beginDraw()
      renderTexture.clear()
      renderTexture.endDraw()
      return renderTexture
    })
  }

  getDepth(y: number) {
    return this.renderTextures[y].depth
  }

  draw(entries: any, y: number) {
    if (this.batchInProgress[y]) {
      this.renderTextures[y].batchDraw(entries)
    } else {
      this.renderTextures[y].draw(entries)
    }
  }

  beginDraw(y: number) {
    if (this.batchInProgress[y]) {
      throw new Error('Cannot begin draw if batch is already in progress!')
    }
    this.batchInProgress[y] = true
    this.renderTextures[y].beginDraw()
  }

  endDraw(y: number) {
    if (!this.batchInProgress[y]) {
      throw new Error('Cannot end draw if batch was never started!')
    }
    this.batchInProgress[y] = false
    this.renderTextures[y].endDraw()
  }

  erase(entries: any, y: number) {
    this.renderTextures[y].erase(entries)
  }

  clear(y?: number) {
    if (y === undefined) {
      let y = 0
      for (const texture of this.renderTextures) {
        texture.clear()
        y++
      }
    } else {
      this.renderTextures[y].clear()
    }
  }

  destroy() {
    for (const texture of this.renderTextures) {
      texture.destroy(true)
    }
  }
}
