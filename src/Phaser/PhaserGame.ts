import Phaser from 'phaser'
import GameConfig from './GameConfig'

export default class GameInstance {
  private static instance: Phaser.Game

  public static getInstance(): Phaser.Game {
    if (!GameInstance.instance) {
      // @ts-ignore
      GameInstance.instance = new Phaser.Game(GameConfig)
    }

    return GameInstance.instance
  }
}
