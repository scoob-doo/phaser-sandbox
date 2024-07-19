const registerEventListeners = (scene) => {
  scene.events.on('start', () => {
    console.log(`Scene ${scene.scene.key} is starting`)
  })

  scene.events.on('shutdown', () => {
    console.log(`Scene ${scene.scene.key} is shutting down`)
  })

  scene.events.on('wake', () => {
    console.log(`Scene ${scene.scene.key} is waking up`)
  })

  scene.events.on('sleep', () => {
    console.log(`Scene ${scene.scene.key} is sleeping`)
  })
}

class Scene extends Phaser.Scene {
  constructor() {
    super('Scene')
  }

  preload() {
    this.load.spritesheet('knight', 'assets/Knight.png', { frameWidth: 32, frameHeight: 32 })
  }

  create() {
    this.cameras.main.setZoom(3)
    registerEventListeners(this)

    const knight = this.add.sprite(400, 300, 'knight', 0)
    this.physics.add.existing(knight)
    knight.body.setCircle(4, 12, 12)
    knight.body.setOffset(12, 12)
    knight.body.setVelocity(100, 0)

    this.physics.world.pause()

    this.input.keyboard.on('keydown-ENTER', () => {
      this.physics.world.step(0.1)
    })
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  scene: [Scene],
}
var game = new Phaser.Game(config)
