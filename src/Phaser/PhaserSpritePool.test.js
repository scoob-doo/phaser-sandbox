import { jest } from '@jest/globals'
import _ from 'lodash'
import PhaserSpritePool from './PhaserSpritePool'

const mockSprite = {
  setData: jest.fn(),
  getData: jest.fn().mockReturnValue(1),
  visible: false,
  setVisible: jest.fn(),
  active: false,
  setActive: jest.fn(),
  data: {
    reset: jest.fn(),
  },
  x: 0,
  y: 0,
  body: null,
  destroy: jest.fn(),
}

describe('PhaserSpritePool', () => {
  let pool
  let scene

  beforeEach(() => {
    scene = {
      add: {
        sprite: jest.fn().mockReturnValue(_.cloneDeep(mockSprite)),
      },
      physics: {
        add: {
          sprite: jest.fn().mockReturnValue(_.cloneDeep({ ...mockSprite, body: {} })),
        },
      },
    }
    pool = new PhaserSpritePool(scene)
  })

  describe('checkoutSprite', () => {
    it('should create a new regular sprite if no available sprites', () => {
      const sprite = pool.checkoutSprite()
      expect(scene.add.sprite).toHaveBeenCalledWith(-1000, -1000, 'sprite')
      expect(sprite.setVisible).toHaveBeenCalledWith(true)
      expect(sprite.setActive).toHaveBeenCalledWith(true)
    })

    it('should create a new physics sprite if no available physics sprites', () => {
      const sprite = pool.checkoutSprite(true)
      expect(scene.physics.add.sprite).toHaveBeenCalledWith(-1000, -1000, 'sprite')
      expect(sprite.setVisible).toHaveBeenCalledWith(true)
      expect(sprite.setActive).toHaveBeenCalledWith(true)
    })

    it('should reuse an available regular sprite', () => {
      const sprite = pool.checkoutSprite()
      pool.returnSprite(sprite)
      const reusedSprite = pool.checkoutSprite()
      expect(reusedSprite).toBe(sprite)
    })

    it('should reuse an available physics sprite', () => {
      const sprite = pool.checkoutSprite(true)
      pool.returnSprite(sprite)
      const reusedSprite = pool.checkoutSprite(true)
      expect(reusedSprite).toBe(sprite)
    })
  })

  describe('returnSprite', () => {
    it('should deactivate and hide the regular sprite', () => {
      const sprite = pool.checkoutSprite()
      pool.returnSprite(sprite)
      expect(sprite.setVisible).toHaveBeenCalledWith(false)
      expect(sprite.setActive).toHaveBeenCalledWith(false)
      expect(sprite.x).toBe(-1000)
      expect(sprite.y).toBe(-1000)
      expect(sprite.data.reset).toHaveBeenCalled()
    })

    it('should deactivate and hide the physics sprite', () => {
      const sprite = pool.checkoutSprite(true)
      pool.returnSprite(sprite)
      expect(sprite.setVisible).toHaveBeenCalledWith(false)
      expect(sprite.setActive).toHaveBeenCalledWith(false)
      expect(sprite.x).toBe(-1000)
      expect(sprite.y).toBe(-1000)
      expect(sprite.data.reset).toHaveBeenCalled()
    })
  })

  describe('clear', () => {
    it('should destroy all regular sprites and clear the sprites map', () => {
      const sprite1 = pool.checkoutSprite()
      const sprite2 = pool.checkoutSprite()
      pool.clear()
      expect(sprite1.destroy).toHaveBeenCalled()
      expect(sprite2.destroy).toHaveBeenCalled()
      expect(pool['sprites'].size).toBe(0)
    })

    it('should destroy all physics sprites and clear the physicsSprites map', () => {
      const sprite1 = pool.checkoutSprite(true)
      const sprite2 = pool.checkoutSprite(true)
      pool.clear()
      expect(sprite1.destroy).toHaveBeenCalled()
      expect(sprite2.destroy).toHaveBeenCalled()
      expect(pool['physicsSprites'].size).toBe(0)
    })

    it('should clear the availableIds set', () => {
      const sprite = pool.checkoutSprite()
      pool.returnSprite(sprite)
      pool.clear()
      expect(pool['availableIds'].size).toBe(0)
    })

    it('should clear the availablePhysicsIds set', () => {
      const sprite = pool.checkoutSprite(true)
      pool.returnSprite(sprite)
      pool.clear()
      expect(pool['availablePhysicsIds'].size).toBe(0)
    })
  })
})
