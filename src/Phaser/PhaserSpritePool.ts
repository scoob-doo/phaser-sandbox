import _ from 'lodash'
import Phaser from 'phaser'

export default class PhaserSpritePool {
  static $SpriteID = 'SpriteID'

  private sprites: Map<number, Phaser.GameObjects.Sprite>
  private physicsSprites: Map<number, Phaser.GameObjects.Sprite>
  private availableIds: Set<number>
  private availablePhysicsIds: Set<number>
  private nextId: number

  constructor(protected scene: Phaser.Scene) {
    this.sprites = new Map()
    this.physicsSprites = new Map()
    this.availableIds = new Set()
    this.availablePhysicsIds = new Set()
    this.nextId = 1
  }

  checkoutSprite(withPhysicsBody = false): Phaser.GameObjects.Sprite {
    let sprite: Phaser.GameObjects.Sprite

    if (this.availableIds.size > 0) {
      const id = _.first([...this.availableIds])!
      sprite = this.sprites.get(id)!
      this.availableIds.delete(id)
    } else {
      // No available sprites; create a new one
      const id = this.nextId++
      sprite = withPhysicsBody
        ? this.scene.physics.add.sprite(-1000, -1000, 'sprite')
        : this.scene.add.sprite(-1000, -1000, 'sprite')
      sprite.setData(PhaserSpritePool.$SpriteID, id)

      if (withPhysicsBody) {
        this.physicsSprites.set(id, sprite)
      } else {
        this.sprites.set(id, sprite)
      }
    }

    sprite.setVisible(true) // Make sure the sprite is visible
    sprite.setActive(true) // Activate the sprite

    return sprite
  }

  returnSprite(sprite: Phaser.GameObjects.Sprite): void {
    const id = sprite.getData(PhaserSpritePool.$SpriteID)
    const spriteMap = sprite.body !== null ? this.physicsSprites : this.sprites

    if (spriteMap.has(id)) {
      if (sprite.body !== null) {
        this.availablePhysicsIds.add(id)
      } else {
        this.availableIds.add(id)
      }
      sprite.setVisible(false) // Hide the sprite
      sprite.setActive(false) // Deactivate the sprite
      sprite.x = -1000 // Move the sprite off-screen
      sprite.y = -1000
      sprite.resetPipeline()
      sprite.data.reset()
      sprite.setData(PhaserSpritePool.$SpriteID, id)
    }
  }

  clear() {
    for (const sprite of this.sprites.values()) sprite.destroy()
    for (const sprite of this.physicsSprites.values()) sprite.destroy()
    this.sprites.clear()
    this.physicsSprites.clear()
    this.availableIds.clear()
    this.availablePhysicsIds.clear()
  }
}
