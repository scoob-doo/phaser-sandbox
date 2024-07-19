export default class PhaserUtil {
  GetSpriteBody = (sprite?: Phaser.GameObjects.Sprite) =>
    (sprite?.body ?? null) as Phaser.Physics.Arcade.Body | null
}
