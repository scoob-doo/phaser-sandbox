import BinaryUtil from './BinaryUtil'

describe('BinaryUtil', () => {
  describe('EvalBitmask', () => {
    it('should return true if flag matches mask and not negationMask', () => {
      expect(BinaryUtil.EvalBitmask(0b1010, { mask: 0b1000, negationMask: 0b0101 })).toBe(true)
    })

    it('should return false if flag does not match mask', () => {
      expect(BinaryUtil.EvalBitmask(0b0010, { mask: 0b1000 })).toBe(false)
    })

    it('should return false if flag matches negationMask', () => {
      expect(BinaryUtil.EvalBitmask(0b1011, { mask: 0b1000, negationMask: 0b0010 })).toBe(false)
    })
  })

  describe('ToSharedArrayBuffer', () => {
    it('converts ArrayBuffer to SharedArrayBuffer with the same content', () => {
      const buffer = new ArrayBuffer(8 * Uint16Array.BYTES_PER_ELEMENT)
      const view = new Uint16Array(buffer)
      view.set([1, 2, 65535, 4, 5, 6, 7, 8])
      const sharedBuffer = BinaryUtil.ToSharedArrayBuffer(buffer)
      expect(sharedBuffer instanceof SharedArrayBuffer).toBe(true)
      expect(new Uint16Array(sharedBuffer)).toEqual(view)
    })

    it('should parse through a nested object structure', () => {
      const buffer = new ArrayBuffer(8 * Uint16Array.BYTES_PER_ELEMENT)
      const view = new Uint16Array(buffer)
      view.set([1, 2, 65535, 4, 5, 6, 7, 8])
      const object = {
        a: 1,
        b: 2,
        c: {
          d: view.buffer,
          e: 4,
        },
      }
      const converted = BinaryUtil.ToSharedArrayBuffer(object)
      expect(converted.a).toBe(1)
      expect(converted.b).toBe(2)
      expect(converted.c.d instanceof SharedArrayBuffer).toBe(true)
      expect(new Uint16Array(converted.c.d)).toEqual(view)
      expect(converted.c.e).toBe(4)
    })
  })

  describe('ToArrayBuffer', () => {
    it('converts SharedArrayBuffer to ArrayBuffer with the same content', () => {
      const buffer = new SharedArrayBuffer(8 * Uint16Array.BYTES_PER_ELEMENT)
      const view = new Uint16Array(buffer)
      view.set([1, 2, 65535, 4, 5, 6, 7, 8])
      const arrayBuffer = BinaryUtil.ToArrayBuffer(buffer)
      expect(arrayBuffer instanceof ArrayBuffer).toBe(true)
      expect(new Uint16Array(arrayBuffer)).toEqual(view)
    })

    it('should parse through a nested object structure', () => {
      const buffer = new SharedArrayBuffer(8 * Uint16Array.BYTES_PER_ELEMENT)
      const view = new Uint16Array(buffer)
      view.set([1, 2, 65535, 4, 5, 6, 7, 8])
      const object = {
        a: 1,
        b: 2,
        c: {
          d: view.buffer,
          e: 4,
        },
      }
      const converted = BinaryUtil.ToArrayBuffer(object)
      expect(converted.a).toBe(1)
      expect(converted.b).toBe(2)
      expect(converted.c.d instanceof ArrayBuffer).toBe(true)
      expect(new Uint16Array(converted.c.d)).toEqual(view)
      expect(converted.c.e).toBe(4)
    })
  })
})
