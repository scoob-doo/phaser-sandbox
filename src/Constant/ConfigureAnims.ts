import GenericScene from '@/Phaser/Scene/GenericScene'
import { Texture } from './Texture'

export default {
  CookingPot(scene: GenericScene) {
    scene.anims.create({
      key: 'CookingPot',
      frames: scene.anims.generateFrameNames(Texture.Furniture, {
        prefix: 'CookingPot-',
        start: 1,
        end: 4,
      }),
      frameRate: 5,
      repeat: -1,
    })
  },
}
