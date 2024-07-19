import { AudioConfig } from '@/Constant/AudioConfig'
import { AudioKey } from '@/Constant/AudioKey'
import Settings from '@/Constant/Settings'
import EventManager from '@/Event/EventManager'
import { EventType } from '@/Event/EventType'
import Vector from '@/Lib/Vector'
import PhaserSpritePool from '../PhaserSpritePool'

export interface KeyMap {
  [key: number]: Phaser.Input.Keyboard.Key | null
}

const KeyCode = Phaser.Input.Keyboard.KeyCodes

/**
 * Includes middle mouse button panning functionality.
 * Includes zoom functionality
 */
abstract class GenericScene extends Phaser.Scene {
  hasFocus: boolean = true
  spritePool!: PhaserSpritePool
  debugGraphics!: Phaser.GameObjects.Graphics
  middleButtonDragOrigin: { x: number; y: number } | null = null

  keyMap: KeyMap = {
    [KeyCode.CTRL]: null,
    [KeyCode.W]: null,
    [KeyCode.A]: null,
    [KeyCode.S]: null,
    [KeyCode.D]: null,
  }

  constructor(sceneKey: string) {
    super(sceneKey)
    EventManager.on(EventType.GuiFocus, this.onGuiFocus.bind(this))
    EventManager.on(EventType.GuiBlur, this.onGuiBlur.bind(this))
  }

  get ctrlKey() {
    return this.keyMap[KeyCode.CTRL]
  }

  get wKey() {
    return this.keyMap[KeyCode.W]
  }

  get aKey() {
    return this.keyMap[KeyCode.A]
  }

  get sKey() {
    return this.keyMap[KeyCode.S]
  }

  get dKey() {
    return this.keyMap[KeyCode.D]
  }

  panCamera(dx: number, dy: number, scrollSpeed: number = 1) {
    const adjustedDx = (dx / this.cameras.main.zoom) * scrollSpeed
    const adjustedDy = (dy / this.cameras.main.zoom) * scrollSpeed

    this.cameras.main.scrollX -= adjustedDx
    this.cameras.main.scrollY -= adjustedDy
  }

  // Extended Methods
  create() {
    console.debug(`Scene ${this.sceneKey} is starting.`)

    this.spritePool = new PhaserSpritePool(this)

    this.debugGraphics = this.add.graphics()
    this.debugGraphics.setDepth(2_000_000)

    this.events.on('wake', this.onWake, this)
    this.events.on('sleep', this.onSleep, this)
    this.events.on('shutdown', this.onShutdown, this)
    this.events.on('destroy', this.destroy, this)

    // Controls
    if (this.hasFocus) {
      this.enableKeys()
    } else {
      this.disableKeys()
    }

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.middleButtonDown()) {
        this.middleButtonDragOrigin = { x: pointer.x, y: pointer.y }
      }
    })

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.middleButtonDown() && this.middleButtonDragOrigin) {
        const dx = pointer.x - this.middleButtonDragOrigin.x
        const dy = pointer.y - this.middleButtonDragOrigin.y

        this.panCamera(dx, dy)

        // Update drag origin after calculating the new camera position
        this.middleButtonDragOrigin = { x: pointer.x, y: pointer.y }
      }
    })

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (pointer.middleButtonReleased()) {
        this.middleButtonDragOrigin = null
      }
    })

    this.input.on('wheel', (pointer: Phaser.Input.Pointer, _: any, __: number, deltaY: number) => {
      if (this.middleButtonDragOrigin) return // Currently dragging with middle mouse button

      if (!this.ctrlKey?.isDown) {
        // Apply zoom

        // Determine the direction of the scroll
        const zoomDirection = deltaY > 0 ? 1 : -1

        // Adjust the zoom step based on the current zoom level for smoother zooming
        // This could involve logarithmic scaling or other formulas
        const baseZoomStep = 0.1 // Base zoom step adjusted for smoother control
        const zoomFactor = Math.log10(this.cameras.main.zoom + 1) // Logarithmic adjustment
        const zoomStep = baseZoomStep * zoomFactor * Settings.ScrollSpeed * zoomDirection
        const newZoom = this.cameras.main.zoom + zoomStep

        // Apply the new zoom level, ensuring it's within the defined min and max bounds
        this.cameras.main.setZoom(
          Phaser.Math.Clamp(newZoom, Settings.MinimumZoom, Settings.MaximumZoom),
        )

        this.cameras.main.once('postrender', this.onZoomApplied)
      }
    })
  }

  update(_: number, delta: number) {
    if (this.hasFocus) {
      const scrollSpeed = Settings.WASDSpeed * delta
      if (this.sKey?.isDown) {
        this.panCamera(0, -1, scrollSpeed)
      } else if (this.wKey?.isDown) {
        this.panCamera(0, 1, scrollSpeed)
      }
      if (this.dKey?.isDown) {
        this.panCamera(-1, 0, scrollSpeed)
      } else if (this.aKey?.isDown) {
        this.panCamera(1, 0, scrollSpeed)
      }
    }
  }

  destroy() {
    this.events.off('wake', this.onWake, this)
    this.events.off('sleep', this.onSleep, this)
    this.events.off('shutdown', this.onShutdown, this)
    this.events.off('destroy', this.destroy, this)
  }

  // Hooks
  onZoomApplied() {}

  onWake() {
    console.debug(`Scene ${this.sceneKey} is waking up.`)
  }

  onSleep() {
    console.debug(`Scene ${this.sceneKey} is going to sleep.`)
  }

  onShutdown() {
    console.debug(`Scene ${this.sceneKey} is shutting down.`)
  }

  onGuiFocus() {
    this.hasFocus = false
    this.disableKeys()
  }

  onGuiBlur() {
    this.hasFocus = true
    this.enableKeys()
  }

  // Helpers

  playSound(key: AudioKey) {
    // @ts-ignore
    this.sound.play(String(key), AudioConfig[key] || {})
  }

  enableKeys() {
    for (const key in this.keyMap) {
      this.keyMap[key] = this.input.keyboard!.addKey(parseInt(key), false)
    }
  }

  disableKeys() {
    for (const key in this.keyMap) {
      this.keyMap[key]?.destroy()
      this.keyMap[key] = null
    }
  }

  get sceneKey() {
    return this.scene.key
  }
}

export default GenericScene
