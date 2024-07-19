import Phaser from 'phaser'
import MapGenScene from './Scene/MapGenScene/MapGenScene'

const GameConfig = {
  parent: 'phaser-game',
  type: Phaser.WEBGL,
  backgroundColor: '#000000',
  pixelArt: true,
  disableContextMenu: true,

  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 },
      fps: 500,
      timescale: 1,
    },
  },

  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  scene: [MapGenScene],
}

export default GameConfig
