import Settings from '@/Constant/Settings'
import SparseSet from '@/Lib/SparseSet'

describe('SparseSet', () => {
  let sparseSet

  beforeEach(() => {
    sparseSet = new SparseSet()
  })

  test('should start empty', () => {
    expect(sparseSet.length).toBe(0)
  })

  test('should add and retrieve elements', () => {
    sparseSet.add(1)
    sparseSet.add(2)
    expect(sparseSet.has(1)).toBe(true)
    expect(sparseSet.has(2)).toBe(true)
    expect(sparseSet.has(3)).toBe(false)
    expect(sparseSet.length).toBe(2)
  })

  test('should not add duplicate elements', () => {
    sparseSet.add(1)
    sparseSet.add(1)
    expect(sparseSet.length).toBe(1)
  })

  test('should remove elements', () => {
    sparseSet.add(1)
    sparseSet.add(2)
    sparseSet.remove(1)
    expect(sparseSet.has(1)).toBe(false)
    expect(sparseSet.has(2)).toBe(true)
    expect(sparseSet.length).toBe(1)
  })

  test('should clear all elements', () => {
    sparseSet.add(1)
    sparseSet.add(2)
    sparseSet.clear()
    expect(sparseSet.length).toBe(0)
  })

  test('should handle maximum capacity', () => {
    for (let i = 0; i < Settings.MaxEntityCount; i++) {
      sparseSet.add(i)
    }
    expect(() => sparseSet.add(Settings.MaxEntityCount)).toThrow('SparseSet is full!')
  })

  test('should correctly initialize from an existing buffer', () => {
    // Setup initial SparseSet and add some elements
    sparseSet.add(1)
    sparseSet.add(2)

    // Retrieve the buffer from the existing SparseSet
    const existingBuffer = sparseSet.buffer

    // Create a new SparseSet using the existing buffer
    const newSparseSet = new SparseSet(existingBuffer)

    // Check if the new SparseSet has the same elements
    expect(newSparseSet.has(1)).toBe(true)
    expect(newSparseSet.has(2)).toBe(true)
    expect(newSparseSet.length).toBe(2)

    // Verify that the configuration has been transferred correctly
    expect(newSparseSet.buffer).toEqual(existingBuffer)
  })

  test('modifications to one instance should be reflected in another when using a shared buffer', () => {
    // Setup initial SparseSet and add some elements
    sparseSet.add(1)
    sparseSet.add(2)

    // Retrieve the buffer from the existing SparseSet
    const sharedBuffer = sparseSet.buffer

    // Create a new SparseSet using the shared buffer
    const newSparseSet = new SparseSet(sharedBuffer)

    // Add a new element to the original SparseSet
    sparseSet.add(3)

    // Check if the new SparseSet reflects the changes
    expect(newSparseSet.has(1)).toBe(true)
    expect(newSparseSet.has(2)).toBe(true)
    expect(newSparseSet.has(3)).toBe(true) // This checks if the new element is visible in the new instance
    expect(newSparseSet.length).toBe(3)

    // Remove an element from the new SparseSet
    newSparseSet.remove(1)

    // Check if the original SparseSet reflects the changes
    expect(sparseSet.has(1)).toBe(false)
    expect(sparseSet.length).toBe(2)
  })
})

describe('SparseSet [internal]', () => {
  let sparseSet

  beforeEach(() => {
    sparseSet = new SparseSet()
  })

  test('should correctly manage internal buffers', () => {
    sparseSet.add(1)
    sparseSet.add(2)
    expect(sparseSet._dense[0]).toBe(1)
    expect(sparseSet._dense[1]).toBe(2)
    expect(sparseSet._sparse[1]).toBe(0)
    expect(sparseSet._sparse[2]).toBe(1)
  })

  test('should correctly update length on add and remove', () => {
    sparseSet.add(1)
    expect(sparseSet._length[0]).toBe(1)
    sparseSet.add(2)
    expect(sparseSet._length[0]).toBe(2)
    sparseSet.remove(1)
    expect(sparseSet._length[0]).toBe(1)
  })
})
