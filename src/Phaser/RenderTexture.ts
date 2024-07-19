import { Depth } from '@/Constant/Depth'

export default class RenderTextureFactory {
  static Make(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    const renderTexture = scene.add.renderTexture(x, y, width, height)
    renderTexture.setOrigin(0)
    renderTexture.setDepth(y * Depth.Standard)
    renderTexture.beginDraw()
    renderTexture.clear()
    renderTexture.endDraw()
    return renderTexture
  }
}
